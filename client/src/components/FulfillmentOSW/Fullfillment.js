import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Segment,
  Icon,
  Grid,
  Transition,
  Label
} from "semantic-ui-react";
import { oswGetAllOrders } from "../../actions/order";
import moment from "moment";

class Fulfillment extends Component {
  constructor() {
    super();
    this.state = {
      percent: 0
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ loading: true });
    const endTime = moment()
      .subtract(3, "days")
      .format("YYYY-MM-DDThh:mm:ssZ");
    // const startTime = moment()
    //   .subtract(13, "days")
    //   .format("YYYY-MM-DDThh:mm:ssZ");
    console.log(endTime)
    this.props.oswGetAllOrders(endTime);
  }

  showFulfilledOrders() {
    const { oswOrders } = this.props;
    if (oswOrders)
      oswOrders.map(data => {
        console.log("fk", data)
        return <li>{data.orderNum}</li>;
      });
  }

  render() {
    return (
      <Segment raised>
        <Label as="a" color="orange" ribbon>
          Fulfill Shopify Wholesale Orders
        </Label>
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
            onClick={this.handleClick}
          >
            Scan Organic Start Wholesale Shipments
          </Button>
          <Transition.Group className="noprint" animation="fade" duration={500}>
            {this.props.show && (
              <Segment style={{ marginTop: "50px" }}>
                Orders Fulfilled
                <ul> {this.showFulfilledOrders()}</ul>
              </Segment>
            )}
          </Transition.Group>
        </Segment>
      </Segment>
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
  { oswGetAllOrders }
)(Fulfillment);
