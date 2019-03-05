import React, { Component } from "react";
import { connect } from "react-redux";
import { login, logout, checkLoginState } from "./actions/auth";
import {
  getShipmentMetrics,
  getOrderMetrics,
  getCustomerMetrics
} from "./actions/metrics";
import { ClipLoader } from "react-spinners";
import { withRouter } from "react-router-dom";
import MediaQuery from "react-responsive";
import Chart from "react-google-charts";
import "tachyons";
import Scanning from "./components/InventorySystem/Scanning";
import { Grid, Segment, Container } from "semantic-ui-react";
import moment from "moment";
import USmap from "./components/DataMap/USmap";

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
      this.props.getCustomerMetrics(this.props.token, startTime, endTime);
    }
  }
  logout() {
    this.props.logout();
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
              <Grid.Column width={8}>
                {this.props.customerLoading ? (
                  <ClipLoader
                    sizeUnit={"px"}
                    size={54}
                    color={"#36D7B7"}
                    loading={this.props.customerLoading}
                  />
                ) : (
                  <Segment>
                    <USmap
                      data={this.props.metricsByState}
                      eastLabel={[
                        <div key={1} className="box red" />,
                        `East Total: ${this.props.metricsByStateEast}`
                      ]}
                      westLabel={[
                        <div key={2} className="box blue" />,
                        `West Total: ${this.props.metricsByStateWest}`
                      ]}
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
                    <Segment>
                      <Chart
                        height={"350px"}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={this.props.metricsByFilltime}
                        options={{
                          chartArea: {
                            width: "100%"
                          },
                          pieHole: 0.5,
                          title: "Fulfillment Speed",
                          legend: {
                            position: "top"
                          },
                          pieSliceText: "value",
                          animation: {
                            duration: 1200,
                            easing: "linear",
                            startup: true
                          }
                        }}
                      />
                    </Segment>
                    <Grid columns={2}>
                      <Grid.Row>
                        <Grid.Column>
                          <Segment>Returns: {this.props.returns}</Segment>
                        </Grid.Column>
                        <Grid.Column>
                          <Segment>Shipments: {this.props.shipments}</Segment>
                        </Grid.Column>
                        <Grid.Column>
                          <Segment>
                            {this.props.metricsByCarrier[0].name}:{" "}
                            {this.props.metricsByCarrier[0].count}
                          </Segment>
                        </Grid.Column>
                        <Grid.Column>
                          <Segment>
                            {this.props.metricsByCarrier[1].name}:{" "}
                            {this.props.metricsByCarrier[1].count}
                          </Segment>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
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
                  <Container>
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
                  </Container>
                )}
              </Grid.Column>
            </Grid.Row>
          </MediaQuery>

          <Grid.Row>
            <MediaQuery maxDeviceWidth={374}>
              <Grid.Column>
                <Scanning />
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
    metricsByInterval: metricState.orderMetrics.byInterval,
    metricsByState: metricState.customerMetrics.byState,
    metricsByStateEast: metricState.customerMetrics.eastTotal,
    metricsByStateWest: metricState.customerMetrics.westTotal,
    customerLoading: metricState.customerLoading,
    returns: metricState.shipmentMetrics.returns,
    shipments: metricState.shipmentMetrics.shipments,
    metricsByCarrier: metricState.shipmentMetrics.byCarrier
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    {
      login,
      logout,
      checkLoginState,
      getShipmentMetrics,
      getOrderMetrics,
      getCustomerMetrics
    }
  )(Main)
);
