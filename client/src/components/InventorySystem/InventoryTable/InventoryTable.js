import React, { Component } from "react";
import InventoryTableDetail from "./InventoryTableDetail";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import firebase from "../../../config/firebaseconf";
import axios from "axios";
import { Segment, Table } from "semantic-ui-react";
import skuInfo from "../../../config/productinfo.json";

class InventoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eastDatas: {},
      westDatas: {},
      bgDatas: {},
      loading: true
    };
  }

  componentDidMount() {
    const bgData = {};
    this.firebaseRef = firebase.database().ref(`/inventory`);
    this.firebaseRef.once("value", async snapshot => {
      const payload = snapshot.val();
      if (payload.eastcoast) {
        this.setState({
          eastDatas: payload.eastcoast,
          westDatas: payload.westcoast
        });
        await Promise.all(
          Object.keys(payload.eastcoast).map(async key => {
            await axios
              .get(
                `os/getinventorylevel?productid=${
                  skuInfo[key] ? skuInfo[key].productID : 0
                }`
              )
              .then(data => {
                bgData[key] = {
                  total: data.data.inventory_level,
                  tracking: data.data.inventory_tracking
                };
              });
          })
        ).then(e => {
          this.setState({
            bgDatas: bgData,
            loading: false
          });
        });
      }
    });
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  mapTableList() {
    const { eastDatas, westDatas, bgDatas } = this.state;
    return Object.keys(eastDatas).map(key => {
      return (
        <InventoryTableDetail
          key={key}
          sku={key}
          brand={eastDatas[key].brand}
          stage={eastDatas[key].stage}
          eastTotal={eastDatas[key].total}
          westTotal={westDatas[key].total}
          bgTotal={bgDatas[key].total}
          bgTracking={bgDatas[key].tracking}
          scanner={eastDatas[key].scanner}
          timeStamp={eastDatas[key].timeStamp}
          inputRef={input => (this.textInput = input)}
        />
      );
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
              <strong>East Coast</strong>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <strong>West Coast</strong>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <strong>Big Commerce</strong>
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

export default InventoryTable;
