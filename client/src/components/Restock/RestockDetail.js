import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { Segment, Table } from "semantic-ui-react";
import axios from "axios";
import firebase from "../../config/firebaseconf";
import skuInfo from "../../config/productinfo.json";

class RestockDetail extends Component {
  constructor() {
    super();
    this.logprint = this.logprint.bind(this);
    this.state = {
      deductedItems: []
    };
  }
  componentDidMount() {
    window.addEventListener("afterprint", this.logprint);
    const warehouse = this.props.warehouseLocation
      .toLowerCase()
      .replace(/\s/g, "");
    this.dataRef = firebase.database().ref("/action/log");
    this.dataRef.once("value", async snapshot => {
      const payload = snapshot.val();
      const result = Object.keys(payload)
        .map(key => payload[key])
        .reverse();
      let batchInLog = false;

      result.slice(1, 20).map(data => {
        if (data.order === this.props.orderNumber) {
          batchInLog = true;
          return "";
        }
        return "";
      });

      if (!batchInLog) {
        // let items = [];
        await Promise.all(
          this.props.restockDatas.map(async data => {
            if (skuInfo[data.sku] && !data.sku.includes("PURE")) {
              let deductedItems = [];
              if (data.sku.includes("OB-")) {
                await axios
                  .put("fb/updateinventory", {
                    dbname: `${warehouse}OB`,
                    sku: data.sku,
                    quantity: data.combineTotal
                      ? 0 + data.combineTotal
                      : 0 + data.quantity
                  })
                  .then(response => {
                    if (response.data.msg === "success") {
                      deductedItems.push({
                        sku: data.sku,
                        quantity: data.combineTotal
                          ? data.combineTotal
                          : data.quantity
                      });
                      console.log("OB inventory logged");
                    } else if (response.data.msg === "fail") {
                      console.log("failed to log.");
                    }
                  });
              } else {
                await axios
                  .put("fb/updateinventory", {
                    dbname: warehouse,
                    sku: data.sku,
                    quantity: data.combineTotal
                      ? data.sku.includes("PRMX")
                        ? 0 + parseInt(data.combineTotal / 6)
                        : 0 + data.combineTotal
                      : 0 + data.quantity
                  })
                  .then(response => {
                    if (response.data.msg === "success") {
                      deductedItems.push({
                        sku: data.sku,
                        quantity: data.combineTotal
                          ? data.combineTotal
                          : data.quantity
                      });
                      console.log("inventory added");
                    } else if (response.data.msg === "fail") {
                      console.log("failed to log.");
                    }
                  });
              }

              this.setState({ deductedItems: deductedItems });
            }
          })
        );
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener("afterprint", this.logprint);
    this.dataRef.off();
  }
  renderItems() {
    return this.state.deductedItems.map(data => {
      return (
        <Table.Row key={data.sku}>
          <Table.Cell>{data.sku}</Table.Cell>
          <Table.Cell>{data.quantity}</Table.Cell>
        </Table.Row>
      );
    });
  }
  logprint() {
    let currentTime = moment().format("dddd, MMMM DD YYYY hh:mma");
    axios
      .post("fb/writetofile", {
        action: "Print",
        orderNumber: this.props.orderNumber,
        user: this.props.displayName,
        picker: this.props.picker,
        shipper: this.props.shipper,
        currentTime
      })
      .then(response => {
        if (response.data.msg === "success") {
          this.setState({ deductedItems: [] });
          console.log("logged");
        } else if (response.data.msg === "fail") {
          console.log("failed to log.");
        }
      });
  }
  render() {
    const { loading, restockDatas } = this.props;
    const { deductedItems } = this.state;
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
    if (restockDatas.length < 1) {
      return (
        <Segment style={{ marginTop: "50px" }}>
          <Link to="/restock">Go Back</Link>
          <h1>Order number not found!</h1>
        </Segment>
      );
    }

    if (deductedItems.length)
      return (
        <div>
          <Link to="/restock">Go Back</Link>
          <Table className="noprint">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>SKU</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{this.renderItems()}</Table.Body>
          </Table>
        </div>
      );
    return (
      <ClipLoader
        sizeUnit={"px"}
        size={34}
        color={"#36D7B7"}
        loading={loading}
      />
    );
  }
}

function mapStateToProps({ authState, batchState }) {
  return {
    displayName: authState.displayName,
    warehouseLocation: authState.warehouseLocation,
    restockDatas: batchState.restockDatas,
    shipmentItems: batchState.shipmentItems,
    loading: batchState.loading
  };
}

export default connect(
  mapStateToProps,
  null
)(RestockDetail);
