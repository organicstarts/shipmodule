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

    switch (id) {
      case 1:
        path = "/inventoryLogging";
        break;
      case 2:
        path = "/inventoryReport";
        break;
      case 3:
        path = "/inventoryTable";
        break;
      default:
        path = "/";
        break;
    }

    this.props.history.push({
      pathname: path,
      state: { detail: this.state }
    });
  }

  render() {
    let buttons = [
      { id: 1, name: "Scan Inventory", color: "blue", show: true },
      { id: 2, name: "Inventory Reporting Table", color: "violet", show: true },
      {
        id: 3,
        name: "View Inventory List",
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
