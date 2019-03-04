import React, { Component } from "react";
import { connect } from "react-redux";
import { login, logout, checkLoginState } from "./actions/auth";
import { getShipmentMetrics, getOrderMetrics } from "./actions/metrics";
import { ClipLoader } from "react-spinners";
import { withRouter } from "react-router-dom";
import MediaQuery from "react-responsive";
import PieChart from "react-minimal-pie-chart";
import Chart from "react-google-charts";
import { BatchOrders, Log, Inventory } from "./components";
import "tachyons";
import Scanning from "./components/InventorySystem/Scanning";
import { Grid, Segment, Header } from "semantic-ui-react";
import moment from "moment";

class Main extends Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.renderHome = this.renderHome.bind(this);
  }

  componentDidMount() {
    let endTime = moment().format("M/D/YYYY");
    let startTime = moment()
      .subtract(1, "months")
      .format("M/D/YYYY");
    if (this.props.token) {
      this.props.getShipmentMetrics(this.props.token, startTime, endTime);
      this.props.getOrderMetrics(this.props.token, startTime, endTime);
    }
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
        <Grid columns={3} stackable>
          <MediaQuery minDeviceWidth={374}>
            <Grid.Row columns={1}>
              <Grid.Column>
                <Segment>
                  <Chart
                    height={"400px"}
                    chartType="ColumnChart"
                    loader={<div>Loading Chart</div>}
                    data={this.props.metricsByInterval}
                    options={{
                      chartArea: {
                        width: "100%"
                      },
                      legend: {
                        position: "top"
                      },
                      title: "Company Performance",
                      subtitle: "Orders Shipped, New Orders",
                      animation: {
                        duration: 1200,
                        easing: "linear",
                        startup: true
                      }
                    }}
                  />
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={6}>
                <BatchOrders />
              </Grid.Column>
              <Grid.Column width={6}>
                {this.props.shippedLoading ? (
                  <ClipLoader
                    sizeUnit={"px"}
                    size={54}
                    color={"#36D7B7"}
                    loading={this.props.shippedLoading}
                  />
                ) : (
                  <Segment>
                    <Chart
                      height={"350px"}
                      chartType="BarChart"
                      loader={<div>Loading Chart</div>}
                      data={this.props.metricsByFilltime}
                      options={{
                        chartArea: {
                          width: "100%"
                        },
                        title: "Fulfillment Speed",
                        legend: {
                          position: "top"
                        },
                        bars: "horizontal",
                        animation: {
                          duration: 1200,
                          easing: "linear",
                          startup: true
                        },
                        axes: {
                          y: {
                            0: { side: "right" }
                          }
                        }
                      }}
                    />
                  </Segment>
                )}
              </Grid.Column>
              <Grid.Column width={4}>
                {this.props.shippedLoading ? (
                  <ClipLoader
                    sizeUnit={"px"}
                    size={54}
                    color={"#36D7B7"}
                    loading={this.props.shippedLoading}
                  />
                ) : (
                  <Segment>
                    <Chart
                      width={"100%"}
                      height={"500px"}
                      chartType="PieChart"
                      loader={<div>Loading Chart</div>}
                      data={this.props.metricsByUser}
                      options={{
                        chartArea: {
                          width: "100%",
                          height: "80%"
                        },
                        legend: "top",
                        title: "East Coast v. West Coast Shipments",
                        pieStartAngle: 45
                      }}
                    />
                  </Segment>
                )}
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

function mapStateToProps({ authState, metricState }) {
  return {
    displayName: authState.displayName,
    email: authState.email,
    loading: authState.loading,
    token: authState.token,
    metricsByUser: metricState.shipmentMetrics.byUser,
    metricsByFilltime: metricState.shipmentMetrics.byFillTime,
    shippedLoading: metricState.shippedLoading,
    metricsByInterval: metricState.orderMetrics.byInterval
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { login, logout, checkLoginState, getShipmentMetrics, getOrderMetrics }
  )(Main)
);
