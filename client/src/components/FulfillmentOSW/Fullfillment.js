import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Segment,
  Icon,
  Grid,
  Transition,
  Header,
  Input,
  Select,
  Label
} from "semantic-ui-react";
import { oswGetAllOrders, oswGetOrder } from "../../actions/order";
import moment from "moment";

class Fulfillment extends Component {
  constructor() {
    super();
    this.state = {
      orderNumber: "",
      days: [
        { key: 0, text: 0, value: 0 },
        { key: 1, text: 1, value: 1 },
        { key: 2, text: 2, value: 2 },
        { key: 3, text: 3, value: 3 },
        { key: 4, text: 4, value: 4 },
        { key: 5, text: 5, value: 5 },
        { key: 6, text: 6, value: 6 },
        { key: 7, text: 7, value: 7 }
      ],
      day: 0
    };
    this.handleWholeClick = this.handleWholeClick.bind(this);
    this.handleSingleClick = this.handleSingleClick.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });
  handleSelectChange = (e, data) => this.setState({ [data.name]: data.value });
  handleWholeClick() {
    this.setState({ loading: true });
    const endTime = moment()
      .subtract(this.state.day, "days")
      .format("YYYY-MM-DDThh:mm:ssZ");
    // const startTime = moment()
    //   .subtract(13, "days")
    //   .format("YYYY-MM-DDThh:mm:ssZ");
    console.log(endTime);
    this.props.oswGetAllOrders(endTime);
  }

  handleSingleClick() {
    this.setState({ loading: true });

    this.props.oswGetOrder(this.state.orderNumber);
  }

  showFulfilledOrders() {
    const { oswOrders } = this.props;
    if (oswOrders)
      return oswOrders.map(data => {
        return <li key={data.orderNum}>{data.orderNum}</li>;
      });
  }

  render() {
    return (
      <div>
        <Header as="h1">
          <Icon name="warehouse" />
          <Header.Content>Fulfill Shopify Wholesale Orders</Header.Content>
        </Header>
        <Segment color="orange" padded="very" textAlign="center">
          <Grid columns={3} stackable>
            <Grid.Column>
              <Icon
                size="massive"
                style={{ margin: "25px auto" }}
                name={"boxes"}
                color="brown"
                circular
              />
            </Grid.Column>
            <Grid.Column>
              <Icon
                size="massive"
                style={{ margin: "25px auto" }}
                name={"shipping fast"}
                color="orange"
                circular
              />
            </Grid.Column>
            <Grid.Column>
              <Icon
                size="massive"
                style={{ margin: "25px auto" }}
                name={"home"}
                color="teal"
                circular
              />
            </Grid.Column>
          </Grid>

          <Select
            fluid
            placeholder="Select Offset Date By Day"
            name="day"
            options={this.state.days}
            onChange={this.handleSelectChange}
            required
          />

          <Button
            fluid
            size="large"
            loading={this.props.loading}
            color="orange"
            onClick={this.handleWholeClick}
          >
            Scan Organic Start Wholesale Shipments
          </Button>
          <p style={{ margin: "20px" }}>or</p>
          <Input
            fluid
            label="Order Number"
            placeholder="#12345"
            name="orderNumber"
            value={this.state.orderNumber}
            onChange={this.handleChange}
            required
          />
          <Button
            fluid
            size="large"
            loading={this.props.loading}
            color="teal"
            onClick={this.handleSingleClick}
          >
            Fulfill Wholesale Order
          </Button>
        </Segment>

        <Transition.Group className="noprint" animation="fade" duration={500}>
          {this.props.show && (
            <Segment style={{ marginTop: "50px" }}>
              Orders Fulfilled:
              <ul> {this.showFulfilledOrders()}</ul>
            </Segment>
          )}
        </Transition.Group>
      </div>
    );
  }
}

function mapStateToProps({ authState, batchState }) {
  return {
    email: authState.email,
    displayName: authState.displayName,
    profileImg: authState.profileImg,
    show: batchState.showOsw,
    oswOrders: batchState.oswOrders,
    loading: batchState.oswLoading
  };
}

export default connect(
  mapStateToProps,
  { oswGetAllOrders, oswGetOrder }
)(Fulfillment);
