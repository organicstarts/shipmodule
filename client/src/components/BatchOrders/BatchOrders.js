import React from "react";
import { Segment, Button, Form } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import people from "../../config/people";
import { getBatch } from "../../helpers/ShipStation/Shipments";
import products from "../../config/products.json";

class BatchOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      batchNumber: "",
      picker: "",
      shipper: "",
      batchDatas: [],
      shipItems: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.calculatePackage = this.calculatePackage.bind(this);
    this.compare = this.compare.bind(this);
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  handleSelectChange = (e, data) => this.setState({ [data.name]: data.value });

  handleSubmit() {
    getBatch(this.state.batchNumber).then(data => {
      this.setState({
        batchDatas: data,
        shipItems: this.sortShipments(data)
      });
      this.calculatePackage();
      this.props.history.push({
        pathname: "/batch",
        state: { detail: this.state }
      });
    });
  }

  calculatePackage() {
    const { shipItems } = this.state;
    let count = 0;
    let currentWarehouse = shipItems[0].warehouseLocation;
    for (let item in shipItems) {
      let i = 0;
      // while (shipItems[item+=i].warehouseLocation === currentWarehouse) {
      //   count++;
      //   i++
      // }
      console.log(shipItems[item]);
      currentWarehouse = shipItems[item].warehouseLocation;
    }
  }

  sortShipments(data) {
    const shipmentArray = data.map(shipItems => shipItems.shipmentItems);
    let items = [];
    for (let i = 0; i < shipmentArray.length; i++) {
      items = items.concat(shipmentArray[i]);
    }
    const group = _.groupBy(items, item => item.sku);
    let sortable = [];
    let name = "";
    for (let key in group) {
      if (group[key].length > 1 && key !== "") {
        const totalCount = group[key]
          .map(x => x.quantity)
          .reduce((accumulator, amount) => amount + accumulator, 0);
        group[key].splice(1);
        group[key][0].quantity = totalCount;
      }
      name = products[0][key];

      if (name) group[key][0].name = name;

      if (group[key].length > 1 && key === "") {
        sortable.push(group[key]);
      } else {
        sortable.push(group[key][0]);
      }
    }

    sortable.sort(this.compare);
    return sortable;
  }

  //helper func to compare warehouse locations
  compare(a, b) {
    return a.warehouseLocation - b.warehouseLocation;
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
            />
          </Form.Field>
          <Form.Group widths="equal">
            <Form.Select
              label="Picker"
              placeholder="Select One"
              name="picker"
              options={people}
              onChange={this.handleSelectChange}
            />
            <Form.Select
              label="Shipper"
              placeholder="Select One"
              name="shipper"
              options={people}
              onChange={this.handleSelectChange}
            />
          </Form.Group>
          <Button size="large" color="olive" type="submit">
            Generate Batch
          </Button>
        </Form>
      </Segment>
    );
  }
}

export default withRouter(BatchOrders);
