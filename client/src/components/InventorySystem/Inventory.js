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

  handleClick() {
    this.setState({ loading: true });
    this.props.history.push({
      pathname: "/inventorylogging",
      state: { detail: this.state }
    });
  }

  render() {
    return (
      <Segment color="blue" padded="very">
        <Button
          fluid
          style={{ marginBottom: "15px" }}
          size="large"
          color="blue"
          onClick={this.handleClick}
        >
          Scan Inventory
        </Button>
        {this.props.compareEmail(this.state.email) ? (
          <Button
            fluid
            size="large"
            color="teal"
            onClick={() => {
              this.props.history.push({
                pathname: "/inventoryTable"
              });
            }}
          >
            View Inventory List
          </Button>
        ) : (
          ""
        )}
      </Segment>
    );
  }
}

export default withRouter(Inventory);
