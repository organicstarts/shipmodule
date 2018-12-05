import React from "react";
import { getShipOrder } from "../../helpers/ShipStation/Shipments";
import {
  getOrderCount,
  getOrder,
  getCoupon
} from "../../helpers/BigCommerce/Orders";
import { ClipLoader } from "react-spinners";
import { withRouter } from "react-router-dom";
import people from "../../config/people";
import { Segment, Button, Form } from "semantic-ui-react";
import axios from "axios";
import moment from "moment";

class FetchOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderNumber: "",
      fetchData: [],
      picker: "",
      shipper: "",
      user: this.props.displayName
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });
  handleSelectChange = (e, data) => this.setState({ [data.name]: data.value });

  handleSubmit() {
    const { orderNumber, picker, shipper } = this.state;
    this.setState({ loading: true });
    let currentTime = moment().format("dddd, MMMM DD YYYY hh:mma");
    axios
      .post("/writetofile", {
        action: "Fetch Order",
        orderNumber,
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

    getShipOrder(orderNumber)
      .then(async data => {
        this.setState({
          fetchData: data
        });

        await getOrder(data.orderNumber).then(async x => {
          if (x) {
            data.bigCommerce = x;
            await getOrderCount(x.customer_id).then(y => (data.orderCount = y));
          } else {
            data.bigCommerce = null;
            data.orderCount = null;
          }
        });
        await getCoupon(data.orderNumber).then(
          coupon => (data.couponInfo = coupon)
        );
      })
      .then(x => {
        this.props.history.push({
          pathname: "/fetch",
          state: { detail: this.state }
        });
      });
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
        Fetch Order
      </Button>
    );
  }
  render() {
    return (
      <Segment color="yellow" padded="very">
        <Form size="large" onSubmit={this.handleSubmit}>
          <Form.Field>
            <Form.Input
              fluid
              label="Order Number"
              placeholder="123456"
              name="orderNumber"
              value={this.state.orderNumber}
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

export default withRouter(FetchOrder);
