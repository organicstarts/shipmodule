import React, { Component } from "react";
import LogDetail from "./LogDetail";
import { Segment, Table, FormSelect, FormGroup, Form } from "semantic-ui-react";
import { ClipLoader } from "react-spinners";
import firebase from "../../config/firebaseconf";

class LogList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      logDatas: {},
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
    this.firebaseRef = firebase.database().ref(`/action`);
    this.firebaseRef
      .on("value", snapshot => {
        const payload = snapshot.val();
        if (payload) {
          this.setState({
            logDatas: payload.log,
            loading: false,
            data: payload.log
          });
        }
      })
      .bind(this);
  }

  componentWillUnmount() {
    this.firebaseRef.off();
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
    const { logDatas } = this.state;
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

  renderLogList() {
    const { data } = this.state;
    return Object.keys(data)
      .map(key => {
        return (
          <LogDetail
            key={key}
            action={data[key].action}
            batchorOrder={
              data[key].batch !== "N/A"
                ? data[key].batch
                : data[key].order
            }
            user={data[key].user}
            date={data[key].date}
            picker={data[key].picker}
            shipper={data[key].shipper}
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
      <Segment compact style={{ margin: "50px auto" }}>
        {this.state.loading ? (
          <ClipLoader
            sizeUnit={"px"}
            size={54}
            color={"#36D7B7"}
            loading={this.state.loading}
          />
        ) : (
          <div>
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
            <Table celled collapsing textAlign="center">
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

              {this.renderLogList()}
            </Table>
          </div>
        )}
      </Segment>
    );
  }
}

export default LogList;
