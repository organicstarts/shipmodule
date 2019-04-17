import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Button, Label, Grid } from "semantic-ui-react";
import { ClipLoader } from "react-spinners";
import firebase from "../../../config/firebaseconf";
import upc from "../../../config/upc.json";
import "../inventory.css";

class BatchProductCheck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTyped: false,
      loading: false,
      batchNum: "",
      upcNum: "",
      count: 0,
      batchInfo: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateInventory = this.updateInventory.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    this.dataRef = firebase.database().ref("/batchinfo");
    this.dataRef.once("value", async snapshot => {
      const payload = snapshot.val();
      const result = Object.keys(payload)
        .map(key => payload[key])
        .reverse();
      this.setState({ batchInfo: result });
    });
  }

  componentWillUnmount() {
    this.dataRef.off();
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
    this.setState({ quantity: "", isTyped: false });
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
    const { batchInfo, batchNum, upcNum } = this.state;
    let message = "";
    let product = upc[upcNum];

    if (!product) {
      alert("Contact Yvan regarding this product");
      this.setState({
        count: 1,
        upcNum: ""
      });
      return null;
    }
    batchInfo.map(data => {
      if (data.batch === batchNum) {
        data.products.map(item => {
          if (item.warehouseLocation === product) {
            message = `${item.aliasName} is in this batch`;
          }
        });
      }
    });
    if (message) {
      alert(message);
    } else {
      alert("This product is NOT in this Batch!!!");
    }

    this.setState({
      count: 1,
      upcNum: ""
    });
  }
  /*
cycle input values per scan/user input
tracking number > upc number > # of boxes > # of broken > photo of invoice > confirmation
*/
  renderInput() {
    let inputInfo = {};
    if (this.state.count > 1 && this.state.upcNum.length < 9) {
      alert("The UPC number is not valid");
      return this.setState({ count: 1, upcNum: "" });
    } else {
      switch (this.state.count) {
        case 0:
          inputInfo = {
            label: "Batch Number:",
            placeholder: "#batch number",
            name: "batchNum",
            value: this.state.batchNum
          };
          break;
        case 1:
          inputInfo = {
            label: "Scan Product UPC Number:",
            placeholder: "#upc number",
            name: "upcNum",
            value: this.state.upcNum
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
)(BatchProductCheck);
