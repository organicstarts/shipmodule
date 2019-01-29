import React from "react";
import { Segment, Button, Form } from "semantic-ui-react";
import { connect } from "react-redux";
import { getBatch, setShipmentItems } from "../../actions/batch";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import axios from "axios";
import moment from "moment";
import { ClipLoader } from "react-spinners";
import people from "../../config/people";
// import { getBatch } from "../../helpers/ShipStation/Shipments";
import {
  getOrder,
  getOrderCount,
  getCoupon
} from "../../helpers/BigCommerce/Orders";
import products from "../../config/products.json";
import productInfo from "../../config/productinfo.json";

class BatchOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      batchNumber: "",
      picker: "",
      shipper: "",
      user: this.props.displayName,
      email: this.props.email,
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
    // let currentTime = moment().format("dddd, MMMM DD YYYY hh:mma");
    // axios
    //   .post("fb/writetofile", {
    //     action: "Generate Batch",
    //     batchNumber,
    //     user: this.props.displayName,
    //     picker,
    //     shipper,
    //     currentTime
    //   })
    //   .then(response => {
    //     if (response.data.msg === "success") {
    //       console.log("logged");
    //     } else if (response.data.msg === "fail") {
    //       console.log("failed to log.");
    //     }
    //   });
    // axios
    //   .post("/batchcheckemail", {
    //     batchNumber
    //   })
    //   .then(response => {
    //     if (response.data.msg === "success") {
    //       console.log("emailed");
    //     } else if (response.data.msg === "fail") {
    //       console.log("not emailed");
    //     } else if (response.data.msg === "none") {
    //       console.log("No unprinted batches");
    //     }
    //   });

    this.props
      .getBatch(this.state.batchNumber)
      .then(async data => {
        let shipItems = this.sortShipments(this.props.batchDatas);
        console.log(shipItems);
        this.props.setShipmentItems(shipItems);
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
    let sortable = [];
    let name = "";

    for (let i = 0; i < shipmentArray.length; i++) {
      items = items.concat(shipmentArray[i]);
    }

    const group = _.groupBy(items, item => {
      if (
        item.sku &&
        !isNaN(item.sku.charAt(0)) &&
        item.sku.includes("-") &&
        !item.sku.includes("PRMX") &&
        item.sku.match(/\d-\d/) === null
      ) {
        let x = parseInt(item.sku.split(/-(.*)/)[0]);
        item.sku = item.sku.split(/-(.*)/)[1];
        item.combineTotal = x * item.quantity;

        // if (item.sku.charAt(0) === "H" && item.sku.includes("-DE-H")) {
        //   let x = item.sku.split(/-DE(.*)/)[0];
        //   let y = item.sku.split(/-DE(.*)/)[1];
        //   item.sku = x + y;
        // }
      } else if (item.sku.includes("TK")) {
        let x = parseInt(item.sku.split(/-/)[1]);
        let tempSku = item.sku.split(/TK-.\d-/)[1];
        let split = tempSku.split(/-/);
        let skusplit1 = "";
        let skusplit2 = "";

        if (
          tempSku.charAt(0) === "H" &&
          (tempSku.includes(`HP-DE`) || tempSku.includes(`HP-UK`))
        ) {
          skusplit1 = split[0] + "-" + split[1] + "-" + split[2];
          skusplit2 = split[3] + "-" + split[4] + "-" + split[5];
        } else {
          skusplit1 = split[0] + "-" + split[1];
          skusplit2 = split[2] + "-" + split[3];
        }

        let sku1 = {
          sku: skusplit1,
          aliasName: products[0][skusplit1],
          orderItemId: item.orderItemId,
          warehouseLocation: item.warehouseLocation,
          imageUrl: item.imageUrl,
          check: false,
          isTk: true,
          quantity: x / 2
        };
        let sku2 = {
          sku: skusplit2,
          aliasName: products[0][skusplit2],
          orderItemId: item.orderItemId + 1,
          warehouseLocation: item.warehouseLocation,
          imageUrl: item.imageUrl,
          check: false,
          isTk: true,
          quantity: x / 2
        };
        tkSku.push(sku1);
        tkSku.push(sku2);
      }

      return item.sku;
    });

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
        if (sku.sku.includes(key)) {
          sku.isTk = false;
          if (group[key][0].combineTotal) {
            group[key][0].combineTotal += sku.quantity;
          } else {
            group[key][0].combineTotal = group[key][0].quantity + sku.quantity;
          }
        }
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

    if (tkSku) {
      for (let i in tkSku) {
        for (let j in sortable) {
          if (sortable[j].sku === tkSku[i].sku) {
            tkSku[i].check = true;
            if (tkSku[i].isTk) {
              sortable[j].quantity += tkSku[i].quantity;
            }
          }
        }
        if (!tkSku[i].check) {
          sortable.push(tkSku[i]);
        }
      }
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
      if (
        productInfo[shipItems[item].sku] &&
        !shipItems[item].sku.includes("OB-")
      ) {
        const packagePer = productInfo[shipItems[item].sku].package;
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
    let x = a.warehouseLocation;
    let y = b.warehouseLocation;
    if (!x) {
      x = 0;
    }
    if (!y) {
      y = 0;
    }
    if (isNaN(x) && isNaN(y)) {
      return x.localeCompare(y);
    }
    return x - y;
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
      <Button
        disabled={this.state.picker && this.state.shipper ? false : true}
        size="large"
        color="olive"
        type="submit"
      >
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

function mapStateToProps({ batchState }) {
  return {
    batchDatas: batchState.batchDatas
  };
}

export default connect(
  mapStateToProps,
  { getBatch, setShipmentItems }
)(withRouter(BatchOrders));
