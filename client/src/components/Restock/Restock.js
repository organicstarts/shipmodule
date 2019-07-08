import React from "react";
import { connect } from "react-redux";
import { getRestockDetail } from "../../actions/order";
import { ClipLoader } from "react-spinners";
import { withRouter } from "react-router-dom";
import { Segment, Button, Form, Header, Icon } from "semantic-ui-react";
import axios from "axios";
import moment from "moment";

class Restock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderNumber: "",
      store: [
        { key: 0, text: "Retail", value: 135943 },
        { key: 1, text: "Wholesale", value: 195529 },
        // { key: 2, text: "Little World Organics", value: 201185 },
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
    const { orderNumber, storeId } = this.state;
    this.setState({ loading: true });
    let currentTime = moment().format("dddd, MMMM DD YYYY hh:mma");
    axios
      .post("fb/writetofile", {
        action: "Restock Inventory",
        orderNumber,
        user: this.props.displayName,
        currentTime
      })
      .then(response => {
        if (response.data.msg === "success") {
          console.log("logged");
        } else if (response.data.msg === "fail") {
          console.log("failed to log.");
        }
      });

    this.props.getRestockDetail({ orderNumber, storeId }, this.props.history);
  }

  showFulfilledOrders() {
    const { restockDatas } = this.props;

    if (restockDatas)
      return restockDatas.map(data => {
        return (
          <li key={data.sku}>
            SKU: {data.sku} total: {data.quantity}
          </li>
        );
      });
  }

  renderButton() {
    if (this.props.loading) {
      return (
        <ClipLoader
          sizeUnit={"px"}
          size={34}
          color={"#36D7B7"}
          loading={this.props.loading}
        />
      );
    }
    return (
      <Button
        disabled={this.state.orderNumber && this.state.storeId ? false : true}
        size="large"
        color="green"
        type="submit"
      >
        Re-Stock Order
      </Button>
    );
  }
  render() {
    return (
      <div>
        <Header as="h1">
          <Icon name="plus square" />
          <Header.Content>Re-Stock Inventory</Header.Content>
        </Header>
        <Segment padded="very" stacked>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Form.Group widths="equal">
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

              <Form.Select
                label="Store"
                placeholder="Select One"
                name="storeId"
                options={this.state.store}
                onChange={this.handleSelectChange}
                required
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
    { getRestockDetail }
  )(Restock)
);
