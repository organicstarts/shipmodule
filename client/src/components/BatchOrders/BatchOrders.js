import React from "react";
import { Segment, Button, Form } from "semantic-ui-react";
import axios from "axios";
import people from "../../config/people";
import * as config from "../../config/auth";

class BatchOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = { batchNumber: "", picker: "", shipper: "", batchDatas:[] };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  handleSelectChange = (e, data) => this.setState({ [data.name]: data.value });

  handleSubmit() {
    const encodedString = new Buffer(
      `${config.shipstation.user}:${config.shipstation.key}`
    ).toString("base64");

    const requestOptions = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Basic ${encodedString}`
      }
    };

    return axios
      .get("https://ssapi.shipstation.com/shipments", requestOptions)
      .then(response => {
        const batchArray = response.data.shipments.filter( data =>{
            return data.batchNumber == this.state.batchNumber;
        })
        console.log(batchArray)
      })
      .catch(error => {
        console.log("Looks like there was a problem: \n", error);
      });
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

export default BatchOrders;
