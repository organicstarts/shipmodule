import React, { Component } from "react";
import InboundLogDetail from "./InboundLogDetail";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import firebase from "../../../config/firebaseconf";
import skuInfo from "../../../config/productinfo.json";
import { Segment, Table, Form, FormGroup } from "semantic-ui-react";
import axios from "axios";

class InboundLogTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dbDatas: {},
      datas: {},
      loading: true,
      filter: { value: "", log: [] }
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.firebaseRef = firebase.database().ref(`/inventory`);
    this.firebaseRef
      .on("value", async snapshot => {
        const payload = snapshot.val();
        if (payload.log) {
          this.setState({
            datas: this.state.filter.value !== "" ? this.filterLog(this.state.filter.value): payload.log,
            dbDatas: payload.log
          });
          let storageRef = firebase.storage().ref();

          Object.keys(payload.log).forEach(key => {
            storageRef
              .child(`images/${payload.log[key].trackingNumber}`)
              .getDownloadURL()
              .then(url => {
                payload.log[key].image = url;
                this.setState({ loading: false });
              })
              .catch(err => {
                console.log("file not found!");
              });
          });
        }
      })
      .bind(this);
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  totalChange(key) {
    const { dbDatas } = this.state;
    const bool = dbDatas[key].isChecked;
    const warehouse = dbDatas[key].warehouseLocation
      .toLowerCase()
      .replace(/\s/g, "");
    let total = "";
    let broken = "";
    if (bool) {
      total = 0 - dbDatas[key].quantity;
      broken = 0 - dbDatas[key].broken;
    } else {
      total = dbDatas[key].quantity;
      broken = dbDatas[key].broken;
    }
    if (dbDatas[key].broken !== 0) {
      axios.put("os/updateinventory", {
        inventory_level: broken,
        productID: dbDatas[`OB-${key}`].productID
      });
    }
    axios.put("os/updateinventory", {
      inventory_level: total,
      productID: dbDatas[key].productID
    });
    axios
      .put("/updateinventory", {
        dbname: warehouse,
        sku: dbDatas[key].sku,
        obsku:
          dbDatas[key].broken !== 0
            ? `OB-${skuInfo[dbDatas[key].sku].sku}`
            : null,
        quantity: total,
        broken: broken
      })
      .then(response => {
        if (response.data.msg === "success") {
          let update = firebase.database().ref("/inventory/log");
          update.child(key).update({ isChecked: !bool });
        }
      });
  }

  getCarrier(tracking) {
    if (tracking.includes("CD")) {
      return "Post NL";
    } else if (tracking.includes("CO")) {
      return "DHL Economy";
    } else if (tracking.includes("30100981")) {
      return "Bpost";
    } else if (tracking.includes("CP")) {
      return "Lux";
    } else if (tracking.length === 10) {
      return "DHL Express";
    } else {
      return "N/A";
    }
  }

  filterLog(action = "none") {
    const { dbDatas } = this.state;
    if (action === "" || action === "none") {
      const result = Object.keys(dbDatas).map(key => dbDatas[key]);
      return result;
    }
    const result = Object.keys(dbDatas)
      .map(key => {
        dbDatas[key].key = key;
        return dbDatas[key];
      })
      .filter(data => {
        if (data.invoiceNum) {
          if (data.invoiceNum.includes(action)) {
            return data;
          }
        }
        return null;
      });
    console.log(result);
    return result;
  }

  handleInputChange = (e, data) => {
    this.setState(
      {
        [data.name]: {
          value: data.value,
          log: this.filterLog(data.value)
        }
      },
      () => {
        const { filter } = this.state;
        this.setState({ datas: filter.log });
      }
    );
  };

  mapTableList() {
    const { datas } = this.state;
    return Object.keys(datas)
      .map(key => {
        return (
          <InboundLogDetail
            key={key}
            id={datas[key].key ? datas[key].key : key}
            carrier={this.getCarrier(datas[key].trackingNumber)}
            trackingNumber={datas[key].trackingNumber}
            brand={datas[key].brand}
            stage={datas[key].stage}
            invoiceNum={datas[key].invoiceNum}
            quantity={datas[key].quantity}
            broken={datas[key].broken}
            total={datas[key].total}
            scanner={datas[key].scanner}
            timeStamp={datas[key].timeStamp}
            warehouseLocation={datas[key].warehouseLocation}
            image={datas[key].image ? datas[key].image : ""}
            handleTotal={this.totalChange.bind(this)}
            show={datas[key].isChecked}
          />
        );
      })
      .sort(this.compare);
  }

  compare(a, b) {
    return a.props.invoiceNum - b.props.invoiceNum;
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
      <Segment>
        <Form>
          <FormGroup widths="equal" inline>
            <label>Filter: </label>
            <Form.Input
              name="filter"
              value={this.state.filter.value}
              onChange={this.handleInputChange}
            />
          </FormGroup>
        </Form>
        <Table celled collapsing textAlign="center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <strong>Carrier</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Tracking #</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Invoice #</strong>
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
                <strong>Broken</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Total</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Scanner</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Warehouse</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Invoice</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Date</strong>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {this.mapTableList()}
        </Table>
      </Segment>
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

export default InboundLogTable;
