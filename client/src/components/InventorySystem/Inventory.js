import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Segment } from "semantic-ui-react";
import { withRouter } from "react-router-dom";

class Inventory extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(id) {
    let path = "";
    let warehouse = "";
    switch (id) {
      case 1:
        path = "/inventoryReport";
        warehouse = "eastcoastReport";
        break;
      case 2:
        path = "/inventoryReport";
        warehouse = "westcoastReport";
        break;
      case 3:
        path = "/inventoryTable";
        break;
      case 4:
        path = "/inboundLogTable";
        break;
      default:
        path = "/";
        break;
    }

    this.props.history.push({
      pathname: path,
      state: {  warehouse: warehouse ? warehouse : "" }
    });
  }

  render() {
    let buttons = [
      {
        id: 1,
        name: "East Coast Reporting Table",
        color: "twitter",
        show: true
      },
      { id: 2, name: "West Coast Reporting Table", color: "vk", show: true },
      { id: 3, name: "View Inventory", color: "orange", show: true },
      {
        id: 4,
        name: "View Inbound Inventory Log",
        color: "teal",
        show: this.props.compareEmail(this.props.email) ? true : false
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

function mapStateToProps({ authState }) {
  return {
    email: authState.email
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(Inventory)
);
