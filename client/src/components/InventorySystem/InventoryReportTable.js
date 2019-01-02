import React, { Component } from "react";
import InventoryReportDetail from "./InventoryReportDetail";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import firebase from "../../config/firebaseconf";
import { Segment, Table } from "semantic-ui-react";

class InventoryLogTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: {},
      loading: true
    };
  }

  componentDidMount() {
    this.firebaseRef = firebase.database().ref(`/inventory`);
    this.firebaseRef
      .on("value", async snapshot => {
        const payload = snapshot.val();
        if (payload.eastcoastReport) {
          this.setState({
            datas: payload.eastcoastReport,
            loading: false
          });
        }
      })
      .bind(this);
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  changeTotal(key) {
    let data = {...this.state.datas}
    data[key].total = 1
    this.setState({datas: data})
    console.log(data);
  }

  mapTableList() {
    const { datas } = this.state;
    return Object.keys(datas)
      .map(key => {
        return (
          <InventoryReportDetail
            key={key}
            sku={key}
            brand={datas[key].brand}
            stage={datas[key].stage}
            total={datas[key].total}
            scanner={datas[key].scanner}
            timeStamp={datas[key].timeStamp}
            inputRef={input => (this.textInput = input)}
            handleSubmitButton={this.changeTotal.bind(this)}
          />
        );
      })
      .reverse();
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

        {this.mapTableList()}
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
