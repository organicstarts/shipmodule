import React from "react";
import { Segment, Button, Form, Header } from "semantic-ui-react";
import { connect } from "react-redux";
import { getBatch, setShipmentItems } from "../../actions/order";
import { withRouter } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { ClipLoader } from "react-spinners";
import people from "../../config/people";

class BatchOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      batchNumber: "",
      picker: "",
      shipper: "",
      totalCount: 0,
      loading: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  handleSelectChange = (e, data) => this.setState({ [data.name]: data.value });

  /* 
  async get request shipstation api get matching data based on batch number.
  setState for  batchDatas with shipshipstation response
  async get request Bigcommerce for coupon info and customer order count. append result to batchdatas
  */
  handleSubmit() {
    const { batchNumber, picker, shipper } = this.state;
    this.setState({ loading: true });
    let currentTime = moment().format("dddd, MMMM DD YYYY hh:mma");
    axios
      .post("fb/writetofile", {
        action: "Generate Batch",
        batchNumber,
        user: this.props.displayName,
        picker,
        shipper,
        currentTime
      })
      .then(response => {
        if (response.data.msg === "success") {
          console.log("logged");
        } else if (response.data.msg === "fail") {
          console.log("failed to log.");
        }
      });
    axios
      .post("/batchcheckemail", {
        batchNumber
      })
      .then(response => {
        if (response.data.msg === "success") {
          console.log("emailed");
        } else if (response.data.msg === "fail") {
          console.log("not emailed");
        } else if (response.data.msg === "none") {
          console.log("No unprinted batches");
        }
      });
    this.props.getBatch({ batchNumber, picker, shipper }, this.props.history);
  }

  renderButton() {
    if (this.state.loading) {
      return (
        <ClipLoader
          sizeUnit={"px"}
          size={34}
          color={"#36D7B7"}
          loading={this.state.loading}
        />
      );
    }
    return (
      <Button
        disabled={this.state.picker && this.state.shipper ? false : true}
        size="large"
        color="olive"
        type="submit"
      >
        Generate Batch
      </Button>
    );
  }
  render() {
    return (
      <Segment color="olive" padded="very">
        <Header size="large" textAlign="center">
          Create Pick list + Packing slip
        </Header>
        <Form size="large" onSubmit={this.handleSubmit}>
          <Form.Field>
            <Form.Input
              fluid
              label="Batch Number"
              placeholder="123456"
              name="batchNumber"
              value={this.state.batchNumber}
              onChange={this.handleChange}
              required
            />
          </Form.Field>
          <Form.Group widths="equal">
            <Form.Select
              label="Picker"
              placeholder="Select One"
              name="picker"
              options={people}
              onChange={this.handleSelectChange}
              required
            />
            <Form.Select
              label="Shipper"
              placeholder="Select One"
              name="shipper"
              options={people}
              onChange={this.handleSelectChange}
              required
            />
          </Form.Group>
          <div style={{ textAlign: "center" }}> {this.renderButton()}</div>
        </Form>
      </Segment>
    );
  }
}

const mapStateToProps = ({ authState }) => {
  return {
    displayName: authState.displayName
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { getBatch, setShipmentItems }
  )(BatchOrders)
);
