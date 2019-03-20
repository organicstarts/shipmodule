import React from "react";
import { Segment, Button, Form, Header, Icon, Table } from "semantic-ui-react";
import _ from "lodash";
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
      loading: false,
      buttonLoad: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handlePreviousSubmit = this.handlePreviousSubmit.bind(this);
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

  handlePreviousSubmit(batchNumber, picker, shipper) {
    this.setState({ buttonLoad: true });
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
  renderPrevious() {
    return (
      <Table celled compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell />
            <Table.HeaderCell>Batch #</Table.HeaderCell>
            <Table.HeaderCell>Shipper</Table.HeaderCell>
            <Table.HeaderCell>Picker</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(
            this.props.previousBatch,
            ({ shipper, picker, batchNumber }, index) => (
              <Table.Row textAlign="center" key={batchNumber}>
                <Table.Cell collapsing>
                  {this.props.previousBatch.length - index}
                </Table.Cell>
                <Table.Cell collapsing>
                  <Button
                    fluid
                    size="large"
                    color="olive"
                    loading={this.state.buttonLoad}
                    onClick={() =>
                      this.handlePreviousSubmit(batchNumber, picker, shipper)
                    }
                  >
                    Re-Generate Batch
                  </Button>
                </Table.Cell>
                <Table.Cell>{batchNumber}</Table.Cell>
                <Table.Cell>{shipper}</Table.Cell>
                <Table.Cell>{picker}</Table.Cell>
              </Table.Row>
            )
          ).reverse()}
        </Table.Body>
      </Table>
    );
  }
  render() {
    return (
      <div>
        <Header as="h1">
          <Icon name="list" />
          <Header.Content>Create Pick list + Packing slip</Header.Content>
        </Header>
        <Segment padded="very">
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
        <Header as="h2" style={{paddingTop: "25px"}}>
          <Icon name="redo" />
          Previous Searches
        </Header>
        <Segment padded="very" textAlign="center">
          {this.renderPrevious()}
        </Segment>
      </div>
    );
  }
}

const mapStateToProps = ({ authState, batchState }) => {
  return {
    displayName: authState.displayName,
    previousBatch: batchState.prevBatch
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { getBatch, setShipmentItems }
  )(BatchOrders)
);
