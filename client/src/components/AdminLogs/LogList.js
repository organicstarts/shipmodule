import React, { Component } from "react";
import LogDetail from "./LogDetail";
import { Link } from "react-router-dom";
import { Segment, Table, FormSelect, FormGroup, Form } from "semantic-ui-react";

class LogList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.location.state.detail.logDatas,
      filter1: { name: "", log: [] },
      filter2: { name: "", log: [] },
      filter3: { name: "", log: [] },
      filter: [
        {
          key: "0",
          text: "No Filter",
          value: "none"
        },
        {
          key: "1",
          text: "Print",
          value: "Print"
        },
        {
          key: "2",
          text: "Generate Batch",
          value: "Generate Batch"
        },
        {
          key: "3",
          text: "Fetch Order",
          value: "Fetch Order"
        },
        {
          key: "4",
          text: "Fraud Search",
          value: "Fraud Search"
        },
        {
          key: "5",
          text: "Fraud Check",
          value: "Fraud Check"
        },
        {
          key: "6",
          text: "Fraud Uncheck",
          value: "Fraud UnCheck"
        }
      ]
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.compare = this.compare.bind(this);
  }

  handleSelectChange = (e, data) => {
    this.setState(
      {
        [data.name]: {
          name: data.value,
          log: this.filterLog(data.value)
        }
      },
      () => {
        const { filter1, filter2, filter3 } = this.state;
        let combine = [];

        if (filter1.name === "none") {
          this.setState({
            data: this.filterLog("nofilter"),
            filter2: { name: "" },
            filter3: { name: "" }
          });
        } else if (filter1) {
          this.setState({ data: filter1.log });
          if (filter1.name && filter2.name) {
            combine = filter1.log.concat(filter2.log);
            this.setState({ data: combine.sort(this.compare) });
          }
          if (filter1.name && filter2.name && filter3.name) {
            combine = filter1.log.concat(filter2.log).concat(filter3.log);
            this.setState({ data: combine.sort(this.compare) });
          }
        }
      }
    );
  };

  filterLog(action) {
    const { logDatas } = this.props.location.state.detail;
    if (action === "none") {
      return [];
    }
    if (action === "nofilter") {
      const result = Object.keys(logDatas).map(key => logDatas[key]);
      return result;
    }
    const result = Object.keys(logDatas)
      .map(key => logDatas[key])
      .filter(data => data.action === action);
    return result;
  }

  renderLogList(logDatas) {
    return Object.keys(logDatas)
      .map(key => {
        return (
          <LogDetail
            key={key}
            action={logDatas[key].action}
            batchorOrder={
              logDatas[key].batch !== "N/A"
                ? logDatas[key].batch
                : logDatas[key].order
            }
            user={logDatas[key].user}
            date={logDatas[key].date}
            picker={logDatas[key].picker}
            shipper={logDatas[key].shipper}
          />
        );
      })
      .reverse();
  }
  compare(a, b) {
    a = a.date.split(", ")[1];
    b = b.date.split(", ")[1];
    return a > b ? 1 : a < b ? -1 : 0;
  }
  render() {
    return (
      <Segment style={{ marginTop: "50px" }}>
        <Link to="/" className="noprint">
          Go Back
        </Link>
        <Form>
          <FormGroup widths="equal" inline>
            <label>Filter: </label>
            <FormSelect
              options={this.state.filter}
              name="filter1"
              onChange={this.handleSelectChange}
            />
            <FormSelect
              options={this.state.filter}
              name="filter2"
              onChange={this.handleSelectChange}
              disabled={
                this.state.filter1.name !== "" &&
                this.state.filter1.name !== "none"
                  ? false
                  : true
              }
            />
            <FormSelect
              options={this.state.filter}
              name="filter3"
              onChange={this.handleSelectChange}
              disabled={
                this.state.filter2.name !== "" &&
                this.state.filter2.name !== "none"
                  ? false
                  : true
              }
            />
          </FormGroup>
        </Form>
        <Table celled textAlign="center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <strong>Action</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Date</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>User</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Batch/Order</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Picker</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Shipper</strong>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {this.renderLogList(this.state.data)}
        </Table>
      </Segment>
    );
  }
}

export default LogList;
