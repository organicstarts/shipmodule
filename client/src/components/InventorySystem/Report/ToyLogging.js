import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Button, Label, Grid } from "semantic-ui-react";
import moment from "moment";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import toyInfo from "../../../config/toy.json";
import "../inventory.css";

class ToyLogging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTyped: false,
      loading: false,
      key: Object.keys(toyInfo).map(key => key),
      quantity: "",
      index: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateInventory = this.updateInventory.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.setState({ loading: true });
      this.updateInventory();
    }
  };

  clear = e => {
    this.setState({ quantity: "", isTyped: false });
  };

  subtract = e => {
    this.setState(prevState => {
      return { index: prevState.index - 1 };
    });
  };

  /*
  Upload photo into firebase storage '/image/ with tracking number as filename
  Send POST request to save state datas to database
  reset all states
  */
  updateInventory() {
    const { key, quantity, index } = this.state;
    const { displayName, warehouseLocation } = this.props;
    const warehouse = warehouseLocation.toLowerCase().replace(/\s/g, "");
    axios
      .put("fb/updateinventory", {
        dbname: `${warehouse}Report`,
        brand: toyInfo[key[index]],
        sku: key[index],
        total: quantity ? parseInt(quantity) : 0,
        user: displayName,
        date: moment().format("dddd, MMMM DD YYYY hh:mma")
      })
      .then(response => {
        if (response.data.msg === "success") {
          console.log("logged");
        } else if (response.data.msg === "fail") {
          console.log("failed to log.");
        }
        this.setState({
          quantity: ""
        });
        if (index >= key.length - 1) {
          window.history.go(-1);
          return false;
        }
        this.setState(prevState => {
          return { index: prevState.index + 1, loading: false };
        });
      });
  }
  /*
cycle input values per scan/user input
tracking number > upc number > # of boxes > # of broken > photo of invoice > confirmation
*/
  renderInput() {
    const { index, key, loading } = this.state;
    if (loading) {
      return (
        <ClipLoader
          sizeUnit={"px"}
          size={34}
          color={"#36D7B7"}
          loading={true}
        />
      );
    }
    return (
      <Form.Field>
        <Label
          size="massive"
          basic
          style={{ border: 0, padding: 0, margin: 0 }}
        >
          {key[index]}
        </Label>
        <Form.Input
          fluid
          size="massive"
          placeholder="0"
          name="quantity"
          value={this.state.quantity}
          onKeyPress={this.handleKeyPress}
          onChange={this.handleChange}
          autoFocus
        />
        <Grid padded="horizontally">
          <Grid.Row columns={3}>
            <Grid.Column >
              <Button
                style={{ marginTop: "25px" }}
                onClick={this.subtract}
                compact
                size="big"
                color="grey"
              >
                Back
              </Button>
            </Grid.Column>
            <Grid.Column >
              <Button
                style={{ marginTop: "25px" }}
                onClick={this.clear}
                compact
                size="big"
                color="blue"
              >
                Clear
              </Button>
            </Grid.Column>
            <Grid.Column >
              <Button
                style={{ marginTop: "25px" }}
                onClick={() => {
                  window.history.go(-1);
                  return false;
                }}
                compact
                size="big"
                color="red"
              >
                Cancel
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form.Field>
    );
  }
  render() {
    return (
      <div style={{ marginTop: "50px" }}>
        {this.renderInput()}
      </div>
    );
  }
}

function mapStateToProps({ authState }) {
  return {
    displayName: authState.displayName,
    warehouseLocation: authState.warehouseLocation
  };
}

export default connect(
  mapStateToProps,
  null
)(ToyLogging);
