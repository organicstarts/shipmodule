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
      filter: { value: "", log: [] },
      image: "",
      reverse: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  getData() {
    this.firebaseRef = firebase.database().ref(`/inventory/log`);
    this.firebaseRef.on("value", async snapshot => {
      const payload = snapshot.val();
      if (payload) {
        this.setState({
          datas:
            this.state.filter.value !== ""
              ? this.filterLog(this.state.filter.value)
              : payload,
          dbDatas: payload,
          loading: false
        });
      }
    });
  }
  componentDidMount() {
    this.getData();
  }
  // let storageRef = firebase.storage().ref();

  // Object.keys(payload.log).forEach(key => {
  //   storageRef
  //     .child(`images/${payload.log[key].trackingNumber}`)
  //     .getDownloadURL()
  //     .then(url => {
  //       payload.log[key].image = url;
  //       this.setState({ loading: false });
  //     })
  //     .catch(err => {
  //       console.log("file not found!");
  //     });
  // });

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  loadImage(trackingNumber) {
    let storageRef = firebase.storage().ref();

    storageRef
      .child(`images/${trackingNumber}`)
      .getDownloadURL()
      .then(url => {
        this.setState({ loading: false, image: url });
      })
      .catch(err => {
        console.log("file not found!");
      });
  }

  async archiveInventory(key) {
    const { dbDatas } = this.state;
    if (window.confirm("are you sure you want to delete?")) {
      this.setState({ loading: true });

      await axios
        .post("fb/archiveInventory", {
          trackingNumber: dbDatas[key].trackingNumber,
          carrier: dbDatas[key].carrier,
          productID: dbDatas[key].productID,
          isChecked: dbDatas[key].isChecked ? dbDatas[key].isChecked : false,
          sku: dbDatas[key].sku,
          brand: dbDatas[key].brand,
          stage: dbDatas[key].stage,
          quantity: dbDatas[key].quantity,
          broken: dbDatas[key].broken,
          total: dbDatas[key].total,
          invoiceNum: dbDatas[key].invoiceNum,
          scanner: dbDatas[key].scanner,
          timeStamp: dbDatas[key].timeStamp,
          warehouseLocation: dbDatas[key].warehouseLocation
        })
        .then(response => {
          if (response.data.msg === "success") {
            console.log("Archived Item");
          } else {
            console.log("Item not deleted");
          }
        })
        .catch(error => console.log(error.message));

      await axios
        .delete("fb/deleteinventory", {
          data: {
            db: "log",
            id: key
          }
        })
        .then(async response => {
          if (response.data.msg === "success") {
            console.log("Deleted Item");
            await this.getData();
          } else {
            console.log("Item not deleted");
          }
        })
        .catch(error => console.log(error.message));
    } else {
      return false;
    }
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
    // if (dbDatas[key].broken !== 0) {
    //   axios.put("os/updateinventory", {
    //     inventory_level: broken,
    //     productID: dbDatas[`OB-${key}`].productID
    //   });
    // }
    // axios.put("os/updateinventory", {
    //   inventory_level: total,
    //   productID: dbDatas[key].productID
    // });
    axios
      .put("fb/updateinventory", {
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

  filterLog(action = "none") {
    const { dbDatas } = this.state;
    if (action === "" || action === "none") {
      const result = Object.keys(dbDatas).map(key => dbDatas[key]);
      return result;
    }
    if (action === "n/a") {
      const result = Object.keys(dbDatas)
        .map(key => {
          dbDatas[key].key = key;
          return dbDatas[key];
        })
        .filter(data => !data.invoiceNum);
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
    const { datas, image } = this.state;
    return Object.keys(datas).map(key => {
      return (
        <InboundLogDetail
          key={key}
          id={datas[key].key ? datas[key].key : key}
          sku={datas[key].sku}
          productID={datas[key].productID}
          carrier={datas[key].carrier}
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
          image={image}
          loadImage={this.loadImage.bind(this)}
          handleTotal={this.totalChange.bind(this)}
          show={datas[key].isChecked}
          archiveInventory={this.archiveInventory.bind(this)}
        />
      );
    });
  }

  handleClick(e) {
    const filter = e.currentTarget.getAttribute("name");
    const { datas, reverse } = this.state;
    if (reverse === filter) {
      this.setState({
        datas: Object.keys(datas)
          .map(key => datas[key])
          .reverse()
      });
    } else {
      this.setState({
        datas: Object.keys(datas)
          .map(key => datas[key])
          .sort(propComparator(filter)),
        reverse: filter
      });
    }
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
          <FormGroup widths="fifteen" inline>
            <label>Invoice # Filter: </label>
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
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                name="carrier"
                onClick={this.handleClick}
              >
                <strong>Carrier</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                name="trackingNumber"
                onClick={this.handleClick}
              >
                <strong>Tracking #</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                name="invoiceNum"
                onClick={this.handleClick}
              >
                <strong>Invoice #</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                name="brand"
                onClick={this.handleClick}
              >
                <strong>Brand</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                name="stage"
                onClick={this.handleClick}
              >
                <strong>Stage</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                name="quantity"
                onClick={this.handleClick}
              >
                <strong>Quantity</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                name="broken"
                onClick={this.handleClick}
              >
                <strong>Broken</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                name="total"
                onClick={this.handleClick}
              >
                <strong>Total</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                name="scanner"
                onClick={this.handleClick}
              >
                <strong>Scanner</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                name="warehouseLocation"
                onClick={this.handleClick}
              >
                <strong>Warehouse</strong>
              </Table.HeaderCell>
              <Table.HeaderCell style={{ cursor: "pointer" }}>
                <strong>Invoice</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                name="timeStamp"
                onClick={this.handleClick}
              >
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

const propComparator = propName => {
  return (a, b) => {
    let x = a[propName];
    let y = b[propName];
    if (!x) {
      x = 0;
    }
    if (!y) {
      y = 0;
    }
    if (isNaN(x) && isNaN(y)) {
      return x.localeCompare(y);
    }
    return x - y;
  };
};

export default InboundLogTable;
