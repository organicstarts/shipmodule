import React, { Component } from "react";
import { connect } from "react-redux";
import { login, logout, checkLoginState } from "./actions/auth";
import { ClipLoader } from "react-spinners";
import { withRouter } from "react-router-dom";
import MediaQuery from "react-responsive";
import PieChart from "react-minimal-pie-chart";
import Chart from "react-google-charts";
import {
  BatchOrders,
  FetchOrder,
  FraudOrders,
  Log,
  Inventory
} from "./components";
import "tachyons";
import graph from "./images/staticgraph.PNG";
import Scanning from "./components/InventorySystem/Scanning";
import { Grid, Image, Segment, Header } from "semantic-ui-react";

class Main extends Component {
  constructor() {
    super();

    this.logout = this.logout.bind(this);
    this.renderHome = this.renderHome.bind(this);
  }

  logout() {
    this.props.logout();
  }

  compareEmail(email) {
    switch (email) {
      case "yvan@organicstart.com":
      case "peter@organicstart.com":
      case "isaiah@organicstart.com":
        return true;
      default:
        return false;
    }
  }
  renderHome() {
    if (this.props.loading) {
      return (
        <ClipLoader
          sizeUnit={"px"}
          size={54}
          color={"#36D7B7"}
          loading={this.props.loading}
        />
      );
    }
    return (
      <div>
        <h3 style={{ color: "red" }}>***ignore graphs. WIP***</h3>
        <Grid columns={3} stackable>
          <MediaQuery minDeviceWidth={374}>
            <Grid.Row columns={1}>
              <Grid.Column>
                <Image size="massive" src={graph} style={{ width: "100%" }} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={6}>
                <BatchOrders />
              </Grid.Column>
              <Grid.Column width={6}>
                <Segment>
                  <Chart
                    width={"auto"}
                    height={"350px"}
                    chartType="Bar"
                    loader={<div>Loading Chart</div>}
                    data={[
                      ["Age", "Open Orders"],
                      ["1", 8488],
                      ["2", 7111],
                      ["3", 953],
                      ["4", 42],
                      ["5+", 88]
                    ]}
                    options={{
                      // Material design options
                      chart: {
                        title: "Fulfillment Speed",
                        subtitle: "Open order aging"
                      },
                      bars: "horizontal",
                      axes: {
                        y: {
                          0: { side: "right" }
                        }
                      }
                    }}
                  />
                </Segment>
              </Grid.Column>
              <Grid.Column width={4}>
                <Segment>
                  <Header size="large" textAlign="center">
                    East Coast v. West Coast Shipments
                  </Header>
                  <PieChart
                    data={[
                      {
                        title: "osEast",
                        value: 15691,
                        color: "#E38627"
                      },
                      {
                        title: "osWest",
                        value: 15691,
                        color: "#C13C37"
                      }
                    ]}
                    label
                    labelStyle={{
                      fontSize: "5px",
                      fontFamily: "sans-serif",
                      fill: "#121212"
                    }}
                    radius={42}
                    labelPosition={112}
                    style={{ height: "250px" }}
                    startAngle={90}
                    lengthAngle={360}
                    animate
                  />
                  OS East: 999 <br />
                  OS West: 999 <br />
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column>
                <Inventory compareEmail={this.compareEmail} />
              </Grid.Column>
            </Grid.Row>
          </MediaQuery>
          <Grid.Row>
            <Grid.Column>
              <Scanning />
            </Grid.Column>

            <MediaQuery minDeviceWidth={374}>
              <Grid.Column>
                {this.compareEmail(this.props.email) ? <Log /> : ""}
              </Grid.Column>
            </MediaQuery>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
  render() {
    return <div>{this.renderHome()}</div>;
  }
}

function mapStateToProps({ authState }) {
  return {
    displayName: authState.displayName,
    email: authState.email,
    loading: authState.loading
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { login, logout, checkLoginState }
  )(Main)
);
