import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Button, Label, Grid } from "semantic-ui-react";
import { ClipLoader } from "react-spinners";
import moment from "moment";
import axios from "axios";
import upc from "../../../config/upc.json";
import skuInfo from "../../../config/productinfo.json";
// import firebase from "../../../config/firebaseconf";
import "../inventory.css";

class ReportLogging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTyped: false,
      upcNum: "",
      quantity: "",
      count: 0
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
    const { upcNum, quantity } = this.state;
    const { displayName, warehouseLocation } = this.props;
    let sku = upc[upcNum];
    const warehouse = warehouseLocation.toLowerCase().replace(/\s/g, "");

    axios
      .put("fb/updateinventory", {
        dbname: `${warehouse}Report`,
        sku: skuInfo[sku].sku,
        brand: skuInfo[sku].brand,
        stage: skuInfo[sku].stage,
        total: skuInfo[sku].package * quantity,
        user: displayName,
        date: moment().format("dddd, MMMM DD YYYY hh:mma")
      })
      .then(async response => {
        if (response.data.msg === "success") {
          // await this.checkEastWestTotal(sku);
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
  // disableBundle(datas, index = 0) {
  //   return datas.forEach(data => {
  //     if (data.amount >= index) {
  //       axios.put("os/disableproduct", {
  //         productID: data.productID,
  //         availability: "disabled"
  //       });
  //     }
  //   });
  // }

  // enableBundle(datas, index = 100) {
  //   return datas.forEach(data => {
  //     if (data.amount <= index) {
  //       axios.put("os/disableproduct", {
  //         productID: data.productID,
  //         availability: "available"
  //       });
  //     }
  //   });
  // }

  // async checkEastWestTotal(key) {
  //   let total = 0;
  //   const reportRef = firebase.database().ref("/inventory");
  //   reportRef.on("value", async snapshot => {
  //     const payload = snapshot.val();
  //     if (payload) {
  //       total =
  //         payload.eastcoastReport[key].total +
  //         payload.westcoastReport[key].total;

  //       if (total > 300 && total < 400) {
  //         await this.disableBundle(skuInfo[key].bundleID, 24);
  //         await this.enableBundle(skuInfo[key].bundleID, 12);
  //         await axios.put("os/disableproduct", {
  //           productID: skuInfo[key].productID,
  //           availability: "available"
  //         });
  //       } else if (total >= 200 && total <= 300) {
  //         await this.disableBundle(skuInfo[key].bundleID, 12);
  //         await this.enableBundle(skuInfo[key].bundleID, 8);
  //         await axios.put("os/disableproduct", {
  //           productID: skuInfo[key].productID,
  //           availability: "available"
  //         });
  //       } else if (total > 150 && total <= 200) {
  //         await this.disableBundle(skuInfo[key].bundleID, 3);
  //         await axios.put("os/disableproduct", {
  //           productID: skuInfo[key].productID,
  //           availability: "available"
  //         });
  //       } else if (total > 50 && total <= 150) {
  //         await this.disableBundle(skuInfo[key].bundleID);
  //         await axios.put("os/disableproduct", {
  //           productID: skuInfo[key].productID,
  //           availability: "available"
  //         });
  //       } else if (total <= 50) {
  //         await axios.put("os/disableproduct", {
  //           productID: skuInfo[key].productID,
  //           availability: "disabled"
  //         });
  //         await this.disableBundle(skuInfo[key].bundleID);
  //       } else {
  //         await axios.put("os/disableproduct", {
  //           productID: skuInfo[key].productID,
  //           availability: "available"
  //         });
  //         await this.enableBundle(skuInfo[key].bundleID);
  //       }
  //     }
  //   });
  // }
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
            label: "# of Cases",
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
    return <div style={{ marginTop: "50px" }}>{this.renderInput()}</div>;
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
)(ReportLogging);
