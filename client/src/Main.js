import React, { Component } from "react";
import { connect } from "react-redux";
import { login, logout, checkLoginState } from "./actions/auth";
import {
  getShipmentMetrics,
  getOrderMetrics,
  getCustomerMetrics,
  getProductMetrics
} from "./actions/metrics";
import { ClipLoader } from "react-spinners";
import { withRouter } from "react-router-dom";
import MediaQuery from "react-responsive";
import Chart from "react-google-charts";
import "tachyons";
import Scanning from "./components/InventorySystem/Scanning";
import {
  Grid,
  Segment,
  Container,
  Table,
  Image,
  Icon,
  Button
} from "semantic-ui-react";
import moment from "moment";
import USmap from "./components/DataMap/USmap";

class Main extends Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.renderHome = this.renderHome.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  /*
  Get insight data from shipstation. default: 1 month
  */
  componentDidMount() {
    let endTime = moment().format("M/D/YYYY");
    let startTime = moment()
      .subtract(1, "months")
      .format("M/D/YYYY");
    if (this.props.token) {
      this.props.getShipmentMetrics(this.props.token, startTime, endTime);
      this.props.getOrderMetrics(this.props.token, startTime, endTime);
      this.props.getCustomerMetrics(this.props.token, startTime, endTime);
      this.props.getProductMetrics(this.props.token, startTime, endTime);
    }
  }

  logout() {
    this.props.logout();
  }
  /*
  Get insight data from shipstation based on day, week, month
  */
  handleClick(e) {
    let startTime = "";
    let endTime = "";
    switch (e.target.name) {
      case "day": {
        endTime = moment().format("M/D/YYYY");
        startTime = moment().format("M/D/YYYY");
        break;
      }
      case "week": {
        endTime = moment().format("M/D/YYYY");
        startTime = moment()
          .subtract(1, "weeks")
          .format("M/D/YYYY");
        break;
      }
      case "month": {
        endTime = moment().format("M/D/YYYY");
        startTime = moment()
          .subtract(1, "months")
          .format("M/D/YYYY");
        break;
      }
      default:
        return false;
    }
    if (this.props.token) {
      this.props.getShipmentMetrics(this.props.token, startTime, endTime);
      this.props.getOrderMetrics(this.props.token, startTime, endTime);
      this.props.getCustomerMetrics(this.props.token, startTime, endTime);
      this.props.getProductMetrics(this.props.token, startTime, endTime);
    }
  }
  /*
  Loop through insight data from getProductMetrics(), then display on table row
  */
  getProducts() {
    if (this.props.top5) {
      return this.props.top5.map((data, i) => {
        return (
          <Table.Row key={data.name}>
            <Table.Cell textAlign="center">{++i}</Table.Cell>
            <Table.Cell>
              <Image
                src={data.image}
                style={{ maxHeight: "25px", width: "20px" }}
                size="mini"
                inline
                spaced="right"
              />
              {data.name}
            </Table.Cell>
            <Table.Cell>{data.count}</Table.Cell>
          </Table.Row>
        );
      });
    }
    return false;
  }
  /*
  Load charts
  [Company Performance shipped/orders]
  [Shipping map] [[ordersTotal][shipTotal], [usps] [fedex], [fulfillment spd]] [Pie Chart shipments]
  [top 5 product] [Customer datas new/returning]
  */
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
            <div>
              <Button color="olive" onClick={this.handleClick} name="day">
                Day
              </Button>
              <Button color="olive" onClick={this.handleClick} name="week">
                Week
              </Button>
              <Button color="olive" onClick={this.handleClick} name="month">
                Month
              </Button>
            </div>
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
                        width: "95%"
                      },
                      colors: ["#94C120", "#FBBD09"],
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
                  <Container>
                    <Grid columns="equal">
                      <Grid.Row style={{ margin: "auto" }}>
                        <Grid.Column>
                          <Segment color="orange">
                            <Icon name="archive" />
                            Orders: {this.props.orders}
                          </Segment>
                        </Grid.Column>
                        <Grid.Column>
                          <Segment color="olive">
                            <Icon name="truck" />
                            Shipments: {this.props.shipments}
                          </Segment>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row style={{ margin: "auto" }}>
                        <Grid.Column>
                          <Segment color="blue">
                            <i className="fab fa-usps" />
                            {this.props.metricsByCarrier[0].name}:{" "}
                            {this.props.metricsByCarrier[0].count}
                          </Segment>
                        </Grid.Column>
                        <Grid.Column>
                          <Segment color="purple">
                            <i className="fab fa-fedex" />
                            {this.props.metricsByCarrier[1].name}:{" "}
                            {this.props.metricsByCarrier[1].count}
                          </Segment>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
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
                  </Container>
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
                        height={"600px"}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={this.props.metricsByUser}
                        options={{
                          chartArea: {
                            width: "100%",
                            height: "80%"
                          },
                          pieSliceText: "value",
                          colors: ["#306596", "#cc4731"],
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
            <Grid.Row columns={2}>
              <Grid.Column width={4}>
                {this.props.productLoading ? (
                  <ClipLoader
                    sizeUnit={"px"}
                    size={54}
                    color={"#36D7B7"}
                    loading={this.props.customerLoading}
                  />
                ) : (
                  <Segment stacked>
                    <Table celled stackable collapsing size="small">
                      <Table.Header>
                        <Table.Row>
                          <Table.Cell>Rank</Table.Cell>
                          <Table.Cell>Product</Table.Cell>
                          <Table.Cell>Count</Table.Cell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>{this.getProducts()}</Table.Body>
                    </Table>
                  </Segment>
                )}
              </Grid.Column>

              <Grid.Column width={12}>
                <Segment>
                  <Chart
                    height={"400px"}
                    chartType="LineChart"
                    loader={<div>Loading Chart</div>}
                    data={this.props.metricsByCustomers}
                    options={{
                      colors: ["#FBBD09", "#94C120"],
                      chartArea: {
                        width: "90%"
                      },
                      legend: {
                        position: "top"
                      },
                      hAxis: {
                        title: "Days"
                      },
                      vAxis: {
                        title: "Customers"
                      },
                      title: "Customer Datas",
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
    metricsByCustomers: metricState.customerMetrics.byInterval,
    customerLoading: metricState.customerLoading,
    shipments: metricState.orderMetrics.shipments,
    orders: metricState.orderMetrics.orders,
    metricsByCarrier: metricState.shipmentMetrics.byCarrier,
    top5: metricState.productMetrics.top5
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
      getCustomerMetrics,
      getProductMetrics
    }
  )(Main)
);
