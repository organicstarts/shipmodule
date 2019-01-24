import React, { Component } from "react";
import { Form, Button, Label, Container, Grid } from "semantic-ui-react";
import { ClipLoader } from "react-spinners";
import moment from "moment";
import axios from "axios";
import people from "../../../config/people.json";
import upc from "../../../config/upc.json";
import skuInfo from "../../../config/productinfo.json";
import "../inventory.css";

class ReturnLogging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTyped: false,
      upcNum: "",
      quantity: "",
      count: 0,
      scanner: this.props.location.state.detail.user,
      warehouseLocation: Object.keys(people)
        .map(key => people[key])
        .filter(data =>
          data.email.includes(
            this.props.location.state.detail.email.split("@")[0]
          )
        )
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateInventory = this.updateInventory.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange = e => {
    if (!this.state.isTyped) {
      this.setState({ [e.target.name]: e.target.value });
      this.setState(prevState => {
        return { count: prevState.count + 1 };
      });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  handleKeyPress = e => {
    if (e.key) {
      this.setState({ isTyped: true });
    }
    if (e.key === "Enter") {
      this.setState({ isTyped: false });
      this.setState(prevState => {
        return { count: prevState.count + 1 };
      });
    }
  };

  clear = e => {
    const { count } = this.state;
    switch (count) {
      case 0:
        this.setState({ upcNum: "", isTyped: false });
        break;
      case 1:
        this.setState({ quantity: "", isTyped: false });
        break;
      default:
        break;
    }
  };
  subtract = e => {
    this.setState(prevState => {
      return { count: prevState.count - 1 };
    });
  };

  /*
  Upload photo into firebase storage '/image/ with tracking number as filename
  Send POST request to save state datas to database
  reset all states
  */
  updateInventory() {
    const { upcNum, quantity, scanner, warehouseLocation } = this.state;
    let sku = upc[upcNum];
    const warehouse = warehouseLocation[0].warehouse
      .toLowerCase()
      .replace(/\s/g, "");

    axios
      .put("fb/updateinventory", {
        dbname: warehouse,
        noEquation: false,
        sku: skuInfo[sku].sku,
        quantity: parseInt(quantity),
        user: scanner,
        date: moment().format("dddd, MMMM DD YYYY hh:mma")
      })
      .then(response => {
        if (response.data.msg === "success") {
          console.log("logged");
        } else if (response.data.msg === "fail") {
          console.log("failed to log.");
        }
        this.setState({
          count: 0,
          upcNum: "",
          quantity: ""
        });
      });
  }
  /*
cycle input values per scan/user input
tracking number > upc number > # of boxes > # of broken > photo of invoice > confirmation
*/
  renderInput() {
    let inputInfo = {};
    if (this.state.count > 0 && this.state.upcNum.length !== 13) {
      alert("The UPC number is not valid");
      return this.setState({ count: 0, upcNum: "" });
    } else {
      switch (this.state.count) {
        case 0:
          inputInfo = {
            label: "Brand Name:",
            placeholder: "#upc number",
            name: "upcNum",
            value: this.state.upcNum
          };
          break;
        case 1:
          inputInfo = {
            label: "# of Individual boxes",
            placeholder: "0",
            name: "quantity",
            value: this.state.quantity
          };
          break;
        default:
          this.updateInventory();

          return (
            <ClipLoader
              sizeUnit={"px"}
              size={34}
              color={"#36D7B7"}
              loading={true}
            />
          );
      }
    }
    return (
      <Form.Field>
        <Label
          size="massive"
          basic
          style={{ border: 0, padding: 0, margin: 0 }}
        >
          {inputInfo.label}
        </Label>
        <Form.Input
          fluid
          size="massive"
          placeholder={inputInfo.placeholder}
          name={inputInfo.name}
          value={inputInfo.value}
          onKeyPress={this.handleKeyPress}
          onChange={this.handleChange}
          autoFocus
        />
        {this.state.count > 0 ? (
          <Grid padded="horizontally">
            <Grid.Row columns={3}>
              <Grid.Column textAlign="center">
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
              <Grid.Column textAlign="center">
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
              <Grid.Column textAlign="center">
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
        ) : (
          <Grid padded="horizontally">
            <Grid.Row columns={2}>
              <Grid.Column textAlign="center">
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
              <Grid.Column textAlign="center">
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
        )}
      </Form.Field>
    );
  }

  render() {
    return (
      <Container fluid style={{ marginTop: "50px" }}>
        {this.renderInput()}
      </Container>
    );
  }
}

export default ReturnLogging;
