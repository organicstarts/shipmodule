import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Segment,
  Icon,
  Grid,
  Transition,
  Header,
  Input
} from "semantic-ui-react";
import { oswGetAllOrders, oswGetOrder } from "../../actions/order";
import moment from "moment";

class Fulfillment extends Component {
  constructor() {
    super();
    this.state = {
      orderNumber: ""
    };
    this.handleWholeClick = this.handleWholeClick.bind(this);
    this.handleSingleClick = this.handleSingleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  handleWholeClick() {
    this.setState({ loading: true });
    const endTime = moment()
      .subtract(1, "days")
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
