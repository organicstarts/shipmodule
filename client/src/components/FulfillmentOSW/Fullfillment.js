import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Segment,
  Icon,
  Grid,
  Transition,
  Progress,
  Label
} from "semantic-ui-react";

class Fulfillment extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      show: false,
      percent: 0
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ loading: true, show: true }, () => {
      setTimeout(() => {
        this.setState({
          percent: 100
        });
      }, 3000);
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
            loading={this.state.loading}
            color="orange"
            onClick={this.handleClick}
          >
            Scan Organic Start Wholesale Shipments
          </Button>
          <Transition.Group className="noprint" animation="fade" duration={500}>
            {this.state.show && (
              <Segment style={{ marginTop: "50px" }}>
                <Progress
                  style={{ margin: "auto 10px" }}
                  percent={this.state.percent}
                  indicating
                  size="big"
                />
              </Segment>
            )}
          </Transition.Group>
        </Segment>
      </Segment>
    );
  }
}

function mapStateToProps({ authState }) {
  return {
    email: authState.email,
    displayName: authState.displayName,
    profileImg: authState.profileImg
  };
}

export default connect(
  mapStateToProps,
  null
)(Fulfillment);
