import React, { Component } from "react";
import { Button, Segment, Grid, Label } from "semantic-ui-react";
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
        path = "/inventoryReport";
        warehouse = "eastcoastReport";
        break;
      case 3:
        path = "/inventoryReport";
        warehouse = "westcoastReport";
        break;
      case 4:
        path = "/inventoryTable";
        break;
      case 5:
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
      {
        id: 2,
        name: "East Coast Reporting Table",
        color: "violet",
        show: true
      },
      {
        id: 3,
        name: "West Coast Reporting Table",
        color: "violet",
        show: true
      },
      { id: 4, name: "View Inventory", color: "brown", show: true },
      {
        id: 5,
        name: "View Inbound Inventory Log",
        color: "teal",
        show: this.props.compareEmail(this.state.email) ? true : false
      }
    ];
    return (
      <Segment color="blue" padded={window.innerWidth > 1224 ? "very" : ""}>
        <MediaQuery maxWidth={1224}>
          <Label attached="top left" tag>Scanning</Label>
          <Grid columns={2}>
            <Grid.Column>
              <Button
                key={0}
                fluid
                circular
                style={{ margin: "15px auto", width: "100px", height: "100px" }}
                color="teal"
                onClick={() => this.handleClick(0)}
              >
                Report
              </Button>
            </Grid.Column>
            <Grid.Column verticalAlign="middle">
              <Button
                key={1}
                fluid
                circular
                style={{ margin: "15px auto", width: "100px", height: "100px" }}
                color="blue"
                onClick={() => this.handleClick(1)}
              >
                Inbound
              </Button>
            </Grid.Column>
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
