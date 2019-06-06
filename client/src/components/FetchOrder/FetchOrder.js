import React from "react";
import { connect } from "react-redux";
import { getOrderDetail } from "../../actions/order";
import { ClipLoader } from "react-spinners";
import { withRouter } from "react-router-dom";
import people from "../../config/people";
import { Segment, Button, Form, Header, Icon } from "semantic-ui-react";
import axios from "axios";
import moment from "moment";

class FetchOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderNumber: "",
      picker: "",
      shipper: "",
      note: false,
      noteToBuyer: [
        {
          key: 0,
          text: "Yes",
          value: true
        },
        { key: 1, text: "No", value: false }
      ],
      store: [
        { key: 0, text: "Retail", value: 135943 },
        { key: 1, text: "Wholesale", value: 195529 },
        { key: 2, text: "Little World Organics", value: 201185 },
        { key: 3, text: "Manual Orders", value: 135942 },
        { key: 4, text: "Formula Club", value: 190134 }
      ],
      storeId: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });
  handleSelectChange = (e, data) => this.setState({ [data.name]: data.value });

  handleSubmit() {
    const { orderNumber, picker, shipper, storeId, note } = this.state;
    this.setState({ loading: true });
    let currentTime = moment().format("dddd, MMMM DD YYYY hh:mma");
    axios
      .post("fb/writetofile", {
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

    this.props.getOrderDetail(
      { orderNumber, picker, shipper, storeId, note },
      this.props.history
    );
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
        color="orange"
        type="submit"
      >
        Fetch Order
      </Button>
    );
  }
  render() {
    return (
      <div>
        <Header as="h1">
          <Icon name="newspaper" />
          <Header.Content>Create Packing slip</Header.Content>
        </Header>
        <Segment padded="very" stacked>
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
              <Form.Select
                label="Store"
                placeholder="Select One"
                name="storeId"
                options={this.state.store}
                onChange={this.handleSelectChange}
                required
              />
              <Form.Select
                label="Note To Buyer?"
                placeholder="Select One"
                name="note"
                options={this.state.noteToBuyer}
                onChange={this.handleSelectChange}
              />
            </Form.Group>
            <div style={{ textAlign: "center" }}>{this.renderButton()}</div>
          </Form>
        </Segment>
      </div>
    );
  }
}

const mapStateToProps = ({ authState }) => {
  return {
    displayName: authState.displayName
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { getOrderDetail }
  )(FetchOrder)
);
