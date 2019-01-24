import React, { Component } from "react";
import InventoryReportDetail from "./InventoryReportDetail";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import firebase from "../../../config/firebaseconf";
import { Segment, Table } from "semantic-ui-react";
import axios from "axios";
import moment from "moment";

class InventoryLogTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: {},
      loading: true,
      user: this.props.location.state.detail.user
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.firebaseRef = firebase.database().ref(`/inventory`);
    this.firebaseRef
      .on("value", async snapshot => {
        const payload = snapshot.val();
        if (payload[this.props.location.state.warehouse]) {
          this.setState({
            datas: payload[this.props.location.state.warehouse],
            loading: false
          });
        }
      })
      .bind(this);
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }
  handleChange = e => {
    let data = this.state.datas;
    let value = e.target.value;
    if (e.target.value.charAt(0) === 0) {
      value = e.target.value.substring(1);
    }
    if (e.target.value.length < 1) {
      value = 0;
    }
    data[e.target.name].total = parseInt(value);
    this.setState({
      datas: data
    });
  };

  changeTotal(key) {
    const { user, datas } = this.state;
    let currentTime = moment().format("dddd, MMMM DD YYYY hh:mma");
    axios
      .put("fb/updateinventory", {
        dbname: this.props.location.state.warehouse,
        sku: key,
        total: datas[key].total,
        date: currentTime,
        user
      })
      .then(response => {
        if (response.data.msg === "success") {
          console.log("logged");
        } else if (response.data.msg === "fail") {
          console.log("failed to log.");
        }
      });
  }

  mapTableList(x) {
    const { datas } = this.state;
    let condition;

    return Object.keys(datas)
      .sort(this.compare)
      .map(key => {
        switch (x) {
          case 1:
            condition =
              key.length > 3 && !key.includes("OB-") && !key.includes(" ");
            break;
          case 2:
            condition = key.includes("OB-");
            break;
          case 3:
            condition = key.length < 4 && isNaN(key.charAt(0));
            break;
          case 4:
            condition = key.length > 4 && key.includes(" ");
            break;
          default:
            break;
        }
        if (condition)
          return (
            <InventoryReportDetail
              key={key}
              sku={key}
              brand={datas[key].brand}
              stage={datas[key].stage}
              total={datas[key].total}
              scanner={datas[key].user}
              timeStamp={datas[key].date}
              inputRef={input => (this.textInput = input)}
              handleChange={this.handleChange}
              handleSubmitButton={this.changeTotal.bind(this)}
            />
          );
        return null;
      });
  }

 
  renderLogList() {
    if (this.state.loading) {
      return (
        <ClipLoader
          sizeUnit={"px"}
          size={54}
          color={"#36D7B7"}
          loading={this.state.loading}
        />
      );
    }

    return (
      <Table celled collapsing textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <strong>SKU #</strong>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <strong>Brand</strong>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <strong>Stage</strong>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <strong>Quantity</strong>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <strong>Scanner</strong>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <strong>Date</strong>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {this.mapTableList(1)}
        {this.mapTableList(2)}
        {this.mapTableList(3)}
        {this.mapTableList(4)}
      </Table>
    );
  }

  render() {
    return (
      <Segment compact style={{ margin: "50px auto" }}>
        <Link to="/" className="noprint">
          Go Back
        </Link>{" "}
        <br />
        {this.renderLogList()}
      </Segment>
    );
  }
}

export default InventoryLogTable;
