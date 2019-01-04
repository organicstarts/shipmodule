import React, { Component } from "react";
import { Button, Segment } from "semantic-ui-react";
import { withRouter } from "react-router-dom";

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
      { id: 1, name: "Scan Inventory", color: "blue", show: true },
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
      <Segment color="blue" padded="very">
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
      </Segment>
    );
  }
}

export default withRouter(Inventory);
