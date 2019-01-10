import React, { Component } from "react";
import { Button, Segment, Grid, Header } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import MediaQuery from "react-responsive";

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: this.props.displayName,
      email: this.props.email
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(id) {
    this.setState({ loading: true });
    let path = "";
    let warehouse = "";
    switch (id) {
      case 0: {
        path = "reportLogging";
        break;
      }
      case 1:
        path = "/inboundLogging";
        break;
      case 2:
        path = "/obReportLogging";
        break;
      case 3:
        path = "/babycareLogging";
        warehouse = "eastcoastReport";
        break;
      case 4:
        path = "/inventoryReport";
        warehouse = "eastcoastReport";
        break;
      case 5:
        path = "/inventoryReport";
        warehouse = "westcoastReport";
        break;
      case 6:
        path = "/inventoryTable";
        break;
      case 7:
        path = "/inboundLogTable";
        break;
      default:
        path = "/";
        break;
    }

    this.props.history.push({
      pathname: path,
      state: { detail: this.state, warehouse: warehouse ? warehouse : "" }
    });
  }

  render() {
    let buttons = [
      { id: 0, name: "Report Scan", color: "teal", show: true },
      { id: 1, name: "Inbound Scan", color: "blue", show: true },
      { id: 2, name: "Open Broken Scan", color: "orange", show: true },
      { id: 3, name: "Baby Care Scan", color: "yellow", show: true }
    ];

    if (window.innerWidth > 1224) {
      buttons.push({
        id: 4,
        name: "East Coast Reporting Table",
        color: "violet",
        show: true
      });
      buttons.push({
        id: 5,
        name: "West Coast Reporting Table",
        color: "violet",
        show: true
      });
      buttons.push({
        id: 6,
        name: "View Inventory",
        color: "brown",
        show: true
      });
      buttons.push({
        id: 7,
        name: "View Inbound Inventory Log",
        color: "teal",
        show: this.props.compareEmail(this.state.email) ? true : false
      });
    }
    return (
      <Segment color="blue" padded={window.innerWidth > 1224 ? "very" : null}>
        <MediaQuery maxWidth={1224}>
          <Header color="olive" block>
            Inventory Scanning
          </Header>
          <Grid columns={2}>
            {buttons.map(button => {
              if (button.show) {
                return (
                  <Grid.Column key={button.name}>
                    <Button
                      key={button.name}
                      circular
                      style={{
                        padding: 0,
                        margin: "15px auto",
                        width: "100px",
                        height: "100px"
                      }}
                      color={button.color}
                      onClick={() => this.handleClick(button.id)}
                    >
                      {button.name}
                    </Button>
                  </Grid.Column>
                );
              } else {
                return "";
              }
            })}
          </Grid>
        </MediaQuery>
        <MediaQuery minWidth={1224}>
          {buttons.map(button => {
            if (button.show) {
              return (
                <Button
                  key={button.id}
                  fluid
                  style={{ marginBottom: "15px" }}
                  size="large"
                  color={button.color}
                  onClick={() => this.handleClick(button.id)}
                >
                  {button.name}
                </Button>
              );
            } else {
              return "";
            }
          })}
        </MediaQuery>
      </Segment>
    );
  }
}

export default withRouter(Inventory);
