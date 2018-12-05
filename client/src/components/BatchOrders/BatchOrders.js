import React from "react";
import { Segment, Button, Form } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import axios from "axios";
import moment from "moment";
import { ClipLoader } from "react-spinners";
import people from "../../config/people";
import { getBatch } from "../../helpers/ShipStation/Shipments";
import {
  getOrder,
  getOrderCount,
  getCoupon
} from "../../helpers/BigCommerce/Orders";
import products from "../../config/products.json";
import productPerPackage from "../../config/productPerPackage.json";

class BatchOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      batchNumber: "",
      picker: "",
      shipper: "",
      user: this.props.displayName,
      batchDatas: [],
      shipItems: [],
      totalCount: 0,
      loading: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.calculatePackage = this.calculatePackage.bind(this);
    this.compare = this.compare.bind(this);
    this.compareBatch = this.compareBatch.bind(this);
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  handleSelectChange = (e, data) => this.setState({ [data.name]: data.value });

  /* 
  async get request shipstation api get matching data based on batch number.
  setState for  batchDatas with shipshipstation response
  async get request Bigcommerce for coupon info and customer order count. append result to batchdatas
  */
  handleSubmit() {
    const { batchNumber, picker, shipper } = this.state;
    this.setState({ loading: true });
    let currentTime = moment().format("dddd, MMMM DD YYYY hh:mma");
    axios
      .post("/writetofile", {
        action: "Generate Batch",
        batchNumber,
        user: this.props.displayName,
        picker,
        shipper,
        currentTime
      })
      .then(response => {
        if (response.data.msg === "success") {
          console.log("logged");
        } else if (response.data.msg === "fail") {
          console.log("failed to log.");
        }
      });
    getBatch(this.state.batchNumber)
      .then(async data => {
        this.setState({
          batchDatas: data.sort(this.compareBatch),
          shipItems: this.sortShipments(data)
        });
        await Promise.all(
          data.map(async data => {
            if (data.orderNumber)
              await getOrder(data.orderNumber).then(async x => {
                if (x) {
                  data.bigCommerce = x;
                  await getOrderCount(x.customer_id).then(
                    y => (data.orderCount = y)
                  );
                } else {
                  data.bigCommerce = null;
                  data.orderCount = null;
                }
              });
            await getCoupon(data.orderNumber).then(
              coupon => (data.couponInfo = coupon)
            );
          })
        );
      })
      .then(x => {
        this.calculatePackage();
        this.props.history.push({
          pathname: "/batch",
          state: { detail: this.state }
        });
      });
  }
  /*
map through batchdatas, place in 1D array and create a key/value pair
map through Keys(sku) -> add quantities of each object in key to totalCount
Special case sku.includes("TK || first char is an integer") => parse data first to combine with existing matching skus 
*/
  sortShipments(data) {
    const shipmentArray = data.map(shipItems => shipItems.shipmentItems);
    let items = [];
    let count = 0;
    let tkSku = [];
    for (let i = 0; i < shipmentArray.length; i++) {
      items = items.concat(shipmentArray[i]);
    }

    const group = _.groupBy(items, item => {
      if (item.sku && !isNaN(item.sku.charAt(0)) && item.sku.includes("-")) {
        let x = parseInt(item.sku.split(/-(.*)/)[0]);
        item.sku = item.sku.split(/-(.*)/)[1];
        item.combineTotal = x * item.quantity;

        if (item.sku.charAt(0) === "H" && item.sku.includes("-DE-H")) {
          let x = item.sku.split(/-DE(.*)/)[0];
          let y = item.sku.split(/-DE(.*)/)[1];
          item.sku = x + y;
        }
      } else if (item.sku.includes("TK")) {
        let x = parseInt(item.sku.split(/-/)[1]);
        let sku1 = {
          sku: item.sku.split(/-(?=\D)/)[1],
          quantity: x / 2
        };
        let sku2 = {
          sku: item.sku.split(/-(?=\D)/)[2],
          quantity: x / 2
        };
        tkSku.push(sku1);
        tkSku.push(sku2);
      }

      return item.sku;
    });
    let sortable = [];
    let name = "";

    for (let key in group) {
      if (group[key].length > 1 && key !== "") {
        const totalCount = group[key]
          .map(x => {
            return x.combineTotal ? x.combineTotal : x.quantity;
          })
          .reduce((accumulator, amount) => {
            return accumulator + amount;
          }, 0);
        group[key].splice(1);
        group[key][0].combineTotal = totalCount;
      }
      for (let sku of tkSku) {
        if (sku.sku.includes(key)) group[key][0].combineTotal += sku.quantity;
      }

      name = products[0][group[key][0].sku];
      if (name) {
        group[key][0].aliasName = name;
      } else {
        group[key][0].aliasName = group[key][0].name;
      }

      if (group[key].length > 1 && key === "") {
        sortable.push(group[key]);
      } else if (key.includes("TK")) {
        continue;
      } else {
        sortable.push(group[key][0]);
      }
      /*
      add total of key(sku) to the total item count if it exist
      */
      count += group[key][0].combineTotal
        ? group[key][0].combineTotal
        : group[key][0].quantity;
    }

    sortable.sort(this.compare);
    this.setState({ totalCount: count });
    return sortable;
  }
  /*
  calculate item distrubution per package based on the amount of items come in box per sku
  */
  calculatePackage() {
    const { shipItems } = this.state;

    for (let item in shipItems) {
      if (productPerPackage[shipItems[item].sku]) {
        const packagePer = productPerPackage[shipItems[item].sku];
        let fullBox = 0;
        let loose = 0;
        if (
          (shipItems[item].combineTotal
            ? shipItems[item].combineTotal
            : shipItems[item].quantity) /
            packagePer >=
          1
        ) {
          fullBox = Math.floor(
            (shipItems[item].combineTotal
              ? shipItems[item].combineTotal
              : shipItems[item].quantity) / packagePer
          );
          shipItems[item].fullBox = fullBox;

          if (
            (shipItems[item].combineTotal
              ? shipItems[item].combineTotal
              : shipItems[item].quantity) /
              packagePer !==
            fullBox
          ) {
            loose =
              (shipItems[item].combineTotal
                ? shipItems[item].combineTotal
                : shipItems[item].quantity) -
              fullBox * packagePer;
            shipItems[item].loose = loose;
          }
        }
      }
    }
  }
  //helper func to compare warehouse locations
  compare(a, b) {
    return a.warehouseLocation - b.warehouseLocation;
  }
  compareBatch(a, b) {
    return b.orderNumber - a.orderNumber;
  }

  renderButton() {
    if (this.state.loading) {
      return (
        <ClipLoader
          sizeUnit={"px"}
          size={34}
          color={"#36D7B7"}
          loading={this.state.loading}
        />
      );
    }
    return (
      <Button size="large" color="olive" type="submit">
        Generate Batch
      </Button>
    );
  }
  render() {
    return (
      <Segment color="olive" padded="very">
        <Form size="large" onSubmit={this.handleSubmit}>
          <Form.Field>
            <Form.Input
              fluid
              label="Batch Number"
              placeholder="123456"
              name="batchNumber"
              value={this.state.batchNumber}
              onChange={this.handleChange}
              required
            />
          </Form.Field>
          <Form.Group widths="equal">
            <Form.Select
              label="Picker"
              placeholder="Select One"
              name="picker"
              options={people}
              onChange={this.handleSelectChange}
              required
            />
            <Form.Select
              label="Shipper"
              placeholder="Select One"
              name="shipper"
              options={people}
              onChange={this.handleSelectChange}
              required
            />
          </Form.Group>
          {this.renderButton()}
        </Form>
      </Segment>
    );
  }
}

export default withRouter(BatchOrders);
