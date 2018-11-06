import React from "react";
import { Segment, Button, Form } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import people from "../../config/people";
import { getBatch } from "../../helpers/ShipStation/Shipments";

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
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  handleSelectChange = (e, data) => this.setState({ [data.name]: data.value });

  handleSubmit() {
    getBatch(this.state.batchNumber).then(data => {
      this.setState({
        batchDatas: data,
        shipItems: this.sortShipments(data)
      });

      this.props.history.push({
        pathname: "/batch",
        state: { detail: this.state }
      });
    });
  }

  sortShipments(data) {
    const shipmentArray = data.map(shipItems => shipItems.shipmentItems);
    let items = [];
    for (let i = 0; i < shipmentArray.length; i++) {
      items = items.concat(shipmentArray[i]);
    }
    return _.groupBy(items, item => item.sku);
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
