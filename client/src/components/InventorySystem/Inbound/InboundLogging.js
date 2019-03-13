import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Form, Button, List, Label, Grid } from "semantic-ui-react";
import { ClipLoader } from "react-spinners";
import moment from "moment";
import firebase from "../../../config/firebaseconf";
import axios from "axios";
import upc from "../../../config/upc.json";
import skuInfo from "../../../config/productinfo.json";
import "../inventory.css";

class InboundLogging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isTyped: false,
      trackingNumber: "",
      invoiceNum: "",
      newUpc: "",
      newCaseUpc: "",
      newFile: [],
      newPackage: "",
      upcNum: "",
      file: [],
      brand: "",
      quantity: "",
      broken: "",
      count: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleNewSubmit = this.handleNewSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.subtract = this.subtract.bind(this);
    this.return = this.return.bind(this);
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

  fileHandler = e => {
    this.setState({ file: e.target.files[0] });
    this.setState(prevState => {
      return { count: prevState.count + 1 };
    });
  };

  newFileHandler = e => {
    this.setState({ newFile: e.target.files[0] });
    this.setState(prevState => {
      return { count: prevState.count + 1 };
    });
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

  return = e => {
    window.history.go(-1);
  };

  clear = e => {
    const { count } = this.state;
    switch (count) {
      case 0:
        this.setState({ trackingNumber: "", isTyped: false });
        break;
      case 1:
        this.setState({ upcNum: "", isTyped: false });
        break;
      case 2:
        this.setState({ quantity: "", isTyped: false });
        break;
      case 3:
        this.setState({ broken: "", isTyped: false });
        break;
      case 4:
        this.setState({ broken: "", isTyped: false });
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

  handleNewSubmit() {
    const { newUpc, newCaseUpc, newPackage, invoiceNum } = this.state;
    let storageRef = firebase.storage().ref();
    storageRef
      .child(`images/${newUpc}`)
      .getDownloadURL()
      .then(url => {
        let image = url;

        axios
          .post("/writeupc", {
            individualUpc: newUpc,
            caseUpc: newCaseUpc
          })
          .then(response => {
            if (response.data.msg === "success") {
              axios
                .post("/writeupcinfo", {
                  individualUpc: newUpc,
                  caseUpc: newCaseUpc,
                  case: newPackage,
                  invoiceNum: invoiceNum,
                  newFile: image
                })
                .then(response => {
                  if (response.data.msg === "success") {
                    this.setState({ upcNum: newUpc, count: 2 });
                  } else if (response.data.msg === "fail") {
                    console.log("failed to log.");
                  }
                });
            } else if (response.data.msg === "fail") {
              console.log("failed to log.");
            }
          });
      })
      .catch(err => {
        console.log("file not found!");
      });
  }
  /*
  Upload photo into firebase storage '/image/ with tracking number as filename
  Send POST request to save state datas to database
  reset all states
  */
  handleSubmit() {
    const {
      trackingNumber,
      upcNum,
      file,
      quantity,
      broken,
      invoiceNum
    } = this.state;
    const { displayName, warehouseLocation } = this.props;
    let sku = upc[upcNum];
    let storageRef = firebase.storage().ref("images");
    this.setState({ loading: true });
    storageRef
      .child(trackingNumber)
      .put(file)
      .then(async () => {
        await axios
          .post("fb/writeinventorytofile", {
            trackingNumber,
            carrier: this.getCarrier(trackingNumber),
            productID: skuInfo[sku].productID,
            sku: skuInfo[sku].sku,
            brand: skuInfo[sku].brand,
            stage: skuInfo[sku].stage,
            quantity: parseInt(quantity * skuInfo[sku].package - broken),
            broken: broken ? parseInt(broken) : 0,
            total: skuInfo[sku].package * quantity,
            invoiceNum: invoiceNum,
            scanner: displayName,
            timeStamp: moment().format("dddd, MMMM DD YYYY hh:mma"),
            warehouseLocation: warehouseLocation
          })
          .then(response => {
            if (response.data.msg === "success") {
              console.log("logged");
            } else if (response.data.msg === "fail") {
              console.log("failed to log.");
            }
          });
      })
      .then(() => {
        this.setState({
          loading: false,
          count: 0,
          trackingNumber: "",
          upcNum: "",
          brand: "",
          quantity: "",
          broken: "",
          invoiceNum: ""
        });
      })
      .catch(error => alert(error.message + " Contact Yvan"));
  }

  checkError() {
    if (this.state.count === 1 && this.state.trackingNumber.length < 5) {
      alert("The Tracking number is not valid");
      this.setState({ count: 0, trackingNumber: "" });
    } else if (this.state.count === 2 && this.state.upcNum.length < 13) {
      alert("The UPC number is not valid");
      this.setState({ count: 1, upcNum: "" });
    } else if (this.state.count === 3 && this.state.quantity.length <= 0) {
      alert("Did not input quantity");
      this.setState({ count: 2, quantity: "" });
    }
  }

  getCarrier(tracking) {
    if (tracking.includes("CD")) {
      return "Post NL";
    } else if (tracking.includes("CO")) {
      return "DHL Economy";
    } else if (tracking.includes("30100981") || tracking.includes("EA")) {
      return "Bpost";
    } else if (tracking.includes("CP")) {
      return "Lux";
    } else if (tracking.length === 10 || tracking.includes("JJD")) {
      return "DHL Express";
    } else {
      return "Other";
    }
  }
  /*
cycle input values per scan/user input
tracking number > upc number > # of boxes > # of broken > photo of invoice > confirmation
*/
  renderInput() {
    let inputInfo = {};
    let warning = "";
    let sku = upc[this.state.upcNum];
    this.checkError();
    if (this.state.count > 1 && !sku) {
      warning = "FOLLOW INSTRUCTIONS CAREFULLY! YOU ARE ADDING A NEW PRODUCT!";
      switch (this.state.count) {
        case 2:
          return (
            <Segment>
              <h1>
                The UPC you scanned is not in the system. <br />
                Add it?
              </h1>
              <Button
                onClick={() =>
                  this.setState(prevState => {
                    return { count: prevState.count + 1 };
                  })
                }
                size="medium"
                color="olive"
                type="submit"
                fluid
              >
                PROCEED
              </Button>
            </Segment>
          );
        case 3:
          inputInfo = {
            label: "Scan individual box barcode:",
            placeholder: "#barcode number",
            name: "newUpc",
            value: this.state.newUpc
          };
          break;
        case 4:
          return (
            <Segment>
              <Button onClick={this.subtract} compact size="big" color="grey">
                Back
              </Button>
              <Button
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
              <h2>Picture of the box:</h2>
              <Button
                fluid
                color="google plus"
                size="massive"
                onClick={() => {
                  document.getElementById("getFile").click();
                }}
                icon="camera"
              />

              <input
                id="getFile"
                style={{ display: "none" }}
                type="file"
                accept="image/*"
                capture="camera"
                onChange={this.newFileHandler}
              />
            </Segment>
          );
        case 5:
          let storageRef = firebase.storage().ref("images");
          storageRef.child(this.state.newUpc).put(this.state.newFile);
          inputInfo = {
            label: "Scan case barcode",
            placeholder: "case barcode #",
            name: "newCaseUpc",
            value: this.state.newCaseUpc
          };
          break;
        case 6:
          inputInfo = {
            label: "Quantity per case:",
            placeholder: "0",
            name: "newPackage",
            value: this.state.newPackage
          };
          break;
        case 7:
          warning = "";
          return (
            <Segment>
              <Label color="green" size="huge" style={{ margin: "10px 0" }}>
                YOU WILL BE BROUGHT BACK TO START SCREEN. RE-SCAN THE PRODUCT AS
                YOU NORMALLY WOULD!
              </Label>
              <Button
                onClick={this.handleNewSubmit}
                size="medium"
                color="olive"
                type="submit"
                fluid
              >
                PROCCEED
              </Button>
            </Segment>
          );
        default:
          this.setState({ count: 0 });
          break;
      }
    } else {
      switch (this.state.count) {
        case 0:
          inputInfo = {
            label: "Tracking Number:",
            placeholder: "#tracking number",
            name: "trackingNumber",
            value: this.state.trackingNumber
          };
          break;
        case 1:
          inputInfo = {
            label: "Brand Name:",
            placeholder: "#upc number",
            name: "upcNum",
            value: this.state.upcNum
          };
          break;
        case 2:
          inputInfo = {
            label: "# of Cases",
            placeholder: "0",
            name: "quantity",
            value: this.state.quantity
          };
          break;
        case 3:
          inputInfo = {
            label: "Broken:",
            placeholder: "0",
            name: "broken",
            value: this.state.broken
          };
          break;
        case 4:
          inputInfo = {
            label: "Invoice Number",
            placeholder: "0",
            name: "invoiceNum",
            value: this.state.invoiceNum
          };
          break;
        case 5:
          return (
            <Segment>
              <Button onClick={this.subtract} compact size="big" color="grey">
                Back
              </Button>
              <Button
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
              <h2>Upload Invoice slip:</h2>
              <Button
                fluid
                color="google plus"
                size="massive"
                onClick={() => {
                  document.getElementById("getFile").click();
                }}
                icon="camera"
              />

              <input
                id="getFile"
                style={{ display: "none" }}
                type="file"
                accept="image/*"
                capture="camera"
                onChange={this.fileHandler}
              />
            </Segment>
          );

        default:
          return this.renderConfirmation();
      }
    }
    return (
      <Form.Field>
        {warning ? (
          <Label color="red" size="huge" style={{ margin: "10px 0" }}>
            {warning}
          </Label>
        ) : (
          ""
        )}
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
                  onClick={this.return}
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
                  onClick={this.return}
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
  renderButton() {
    if (this.state.loading) {
      return (
        <ClipLoader
          sizeUnit={"px"}
          size={34}
          color={"#36D7B7"}
          loading={this.state.loading}
          style={{ marginRight: "25px" }}
        />
      );
    }
    return (
      <Button
        onClick={this.handleSubmit}
        size="massive"
        color="olive"
        type="submit"
      >
        Yes
      </Button>
    );
  }
  renderConfirmation() {
    const { trackingNumber, quantity, upcNum, broken, invoiceNum } = this.state;
    let sku = upc[upcNum];

    return (
      <div className="tc">
        <h2>Is this information correct?</h2>
        <List>
          <List.Item>Tracking #: {trackingNumber}</List.Item>
          <List.Item>Brand: {skuInfo[sku].brand}</List.Item>
          <List.Item>Stage #: {skuInfo[sku].stage}</List.Item>
          <List.Item>
            # of {skuInfo[sku].package > 1 ? `Cases` : `Items`}: {quantity}{" "}
            {skuInfo[sku].package > 1
              ? `(
            ${skuInfo[sku].package * this.state.quantity} items)`
              : ""}
          </List.Item>
          <List.Item>Broken #: {broken ? broken : 0}</List.Item>
          <List.Item>Invoice #: {invoiceNum ? invoiceNum : 0}</List.Item>
        </List>

        {this.renderButton()}

        <Button onClick={this.subtract} size="massive" color="red">
          No
        </Button>
      </div>
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
)(InboundLogging);
