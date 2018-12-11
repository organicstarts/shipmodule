import React, { Component } from "react";
import { Segment, Form, Button, List, Grid, Divider } from "semantic-ui-react";
import { ClipLoader } from "react-spinners";
import moment from "moment";
import firebase from "../../config/firebaseconf";
import axios from "axios";
import people from "../../config/people.json";

class LogList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      trackingNumber: "",
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
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  fileHandler = e => {
    console.log(e.target.files);
    this.setState({ file: e.target.files[0] });
    this.setState(prevState => {
      return { count: prevState.count + 1 };
    });
  };
  _handleKeyPress = e => {
    if (e.key === "Enter") {
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

  getBrand(brandnum) {
    switch (parseInt(brandnum)) {
      case 1:
        return "Hipp";
      case 2:
        return "Holle";
      case 3:
        return "Lebenswert";
      case 4:
        return "Topfer";
      case 5:
        return "Nanny care";
      default:
        return "unknown brand";
    }
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
    storageRef.child(trackingNumber).put(file).then(snapshot => {
      console.log("sup")
    })
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
          placeholder: "1",
          name: "brand",
          value: this.state.brand
        };
        break;
      case 2:
        inputInfo = {
          label: "Stage:",
          placeholder: "0",
          name: "stage",
          value: this.state.stage
        };
        break;
      case 3:
        inputInfo = {
          label: "Quantity:",
          placeholder: "0",
          name: "quantity",
          value: this.state.quantity
        };
        break;
      case 4:
        inputInfo = {
          label: "Broken:",
          placeholder: "0",
          name: "broken",
          value: this.state.broken
        };
        break;
      case 5:
        return (
          <Segment>
            <h2>Upload invoice slip</h2>
            <Form.Input
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
          onChange={this.handleChange}
          onKeyPress={this._handleKeyPress}
          autoFocus
        />
        {this.state.count === 1 ? (
          <Segment>
            <List>
              <Grid columns={2} relaxed="very">
                <Grid.Column>
                  <List.Item>1: Hipp</List.Item>
                  <List.Item>2: Holle</List.Item>
                  <List.Item>3: Lebenswert</List.Item>
                </Grid.Column>
                <Grid.Column>
                  <List.Item>4: Topfer</List.Item>
                  <List.Item>5: Nanny care</List.Item>
                </Grid.Column>
              </Grid>
              <Divider vertical />
            </List>
          </Segment>
        ) : (
          ""
        )}
      </Form.Field>
    );
  }

  renderConfirmation() {
    const {
      trackingNumber,
      brand,
      stage,
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
          <List.Item>Brand: {this.getBrand(brand)}</List.Item>
          <List.Item>Stage #: {stage}</List.Item>
          <List.Item>Quantity #: {quantity}</List.Item>
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
      <Segment
        compact
        color="olive"
        padded="very"
        style={{ margin: "50px auto" }}
      >
        {this.renderInput()}
      </Segment>
    );
  }
}

export default LogList;
