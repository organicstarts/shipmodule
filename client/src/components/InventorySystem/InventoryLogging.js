import React, { Component } from "react";
import {
  Segment,
  Form,
  Button,
  List,
  Label,
  Icon
} from "semantic-ui-react";
import { ClipLoader } from "react-spinners";
import moment from "moment";
import firebase from "../../config/firebaseconf";
import axios from "axios";
import people from "../../config/people.json";
import upc from "../../config/upc.json";
import "./inventory.css";

class LogList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isTyped: false,
      trackingNumber: "",
      upc: "",
      file: [],
      brand: "",
      stage: "",
      quantity: "",
      broken: "",
      scanner: this.props.location.state.detail.user,
      warehouseLocation: Object.keys(people)
        .map(key => people[key])
        .filter(data =>
          data.email.includes(
            this.props.location.state.detail.email.split("@")[0]
          )
        ),
      count: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.subtract = this.subtract.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this.getBrand = this.getBrand.bind(this);
    this.getStage = this.getStage.bind(this);
    this.getQuantity = this.getQuantity.bind(this);
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
  _handleKeyPress = e => {
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

  subtract = e => {
    this.setState(prevState => {
      return { count: prevState.count - 1 };
    });
  };

  getBrand() {
    //this.setState({brand: upc[this.state.upc].name})
    return upc[this.state.upc].brand;
  }

  getStage() {
    //this.setState({stage: upc[this.state.upc].stage})
    return upc[this.state.upc].stage;
  }

  getQuantity() {
   // this.setState({quantity: upc[this.state.upc].quantity * this.state.quantity})
    return parseInt(upc[this.state.upc].quantity) * this.state.quantity;
  }

  handleSubmit() {
    const {
      trackingNumber,
      brand,
      file,
      stage,
      quantity,
      broken,
      scanner,
      warehouseLocation
    } = this.state;
    let brandName = this.getBrand(brand);

    let storageRef = firebase.storage().ref("images");
    storageRef.child(trackingNumber).put(file);
    axios
      .post("/writeinventorytofile", {
        trackingNumber,
        brand: brandName,
        stage,
        quantity,
        broken,
        total: parseInt(quantity - broken),
        scanner,
        timeStamp: moment().format("dddd, MMMM DD YYYY hh:mma"),
        warehouseLocation: warehouseLocation[0].warehouse
      })
      .then(response => {
        if (response.data.msg === "success") {
          console.log("logged");
        } else if (response.data.msg === "fail") {
          console.log("failed to log.");
        }
      });

    this.setState({
      count: 0,
      trackingNumber: "",
      brand: "",
      stage: "",
      quantity: "",
      broken: ""
    });
  }

  renderInput() {
    let inputInfo = {};
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
          name: "upc",
          value: this.state.upc
        };
        break;
      case 2:
        inputInfo = {
          label: "Number of Boxes:",
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
        return (
          <Segment>
            <Button onClick={this.subtract} compact size="small" color="grey">
              Back
            </Button>
            <Button
              onClick={() => {
                window.history.go(-1);
                return false;
              }}
              compact
              size="small"
              color="red"
            >
              Cancel
            </Button>
            <h2>Upload Invoice slip:</h2>
            <Label
              style={{
                textAlign: "center",
                paddingBottom: "50px",
                display: "inherit"
              }}
              color="orange"
              className="fileContainer"
            >
              <Form.Input
                fluid
                type="file"
                accept="image/*"
                capture="camera"
                onChange={this.fileHandler}
              />
              <Icon name="camera" />
              Add Invoice
            </Label>
          </Segment>
        );

      default:
        return this.renderConfirmation();
    }

    return (
      <Form.Field>
        {this.state.count > 0 ? (
          <Button
            style={{ marginBottom: "25px" }}
            onClick={this.subtract}
            compact
            size="small"
            color="grey"
          >
            Back
          </Button>
        ) : (
          ""
        )}
        <Button
          style={{ marginBottom: "25px" }}
          onClick={() => {
            window.history.go(-1);
            return false;
          }}
          compact
          size="small"
          color="red"
        >
          Cancel
        </Button>
        <Form.Input
          fluid
          label={inputInfo.label}
          placeholder={inputInfo.placeholder}
          name={inputInfo.name}
          value={inputInfo.value}
          onKeyPress={this._handleKeyPress}
          onChange={this.handleChange}
          autoFocus
        />
      </Form.Field>
    );
  }

  renderConfirmation() {
    const {
      trackingNumber,
      quantity,
      broken,
      loading
    } = this.state;
    if (loading) {
      return (
        <ClipLoader
          sizeUnit={"px"}
          size={34}
          color={"#36D7B7"}
          loading={loading}
        />
      );
    }
    return (
      <div className="tc">
        <h2>Is this information correct?</h2>
        <List>
          <List.Item>Tracking #: {trackingNumber}</List.Item>
          <List.Item>Brand: {this.getBrand}</List.Item>
          <List.Item>Stage #: {this.getStage}</List.Item>
          <List.Item>Boxes #: {quantity} ({this.getQuantity} items)</List.Item>
          <List.Item>Broken #: {broken}</List.Item>
        </List>

        <Button
          onClick={this.handleSubmit}
          size="medium"
          color="olive"
          type="submit"
        >
          Yes
        </Button>

        <Button onClick={this.subtract} size="medium" color="red">
          No
        </Button>
      </div>
    );
  }

  render() {
    return (
      <Segment piled color="olive" style={{ margin: "25px" }}>
        {this.renderInput()}
      </Segment>
    );
  }
}

export default LogList;
