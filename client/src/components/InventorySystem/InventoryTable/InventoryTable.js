import React, { Component } from "react";
import InventoryTableDetail from "./InventoryTableDetail";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import firebase from "../../../config/firebaseconf";
import axios from "axios";
import { Segment, Table } from "semantic-ui-react";

class InventoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: {},
      eastDatas: {},
      westDatas: {},
      bgDatas: {},
      loading: true,
      editable: false
    };
    this.handleOutOfStockSingle = this.handleOutOfStockSingle.bind(this);
    this.handleOutOfStockBundle = this.handleOutOfStockBundle.bind(this);
    this.toggleInput = this.toggleInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.totalChange = this.totalChange.bind(this);
  }

  toggleInput(index) {
    const newToggleStatus = [...this.state.toggle];
    newToggleStatus[index] = !this.state.toggle[index];
    this.setState({ toggle: newToggleStatus });
  }

  getBundles(datas, key) {
    let bundle = [];
    let bundleObj = {};
    datas.forEach(dataInfo => {
      if (
        dataInfo.sku.includes(key) &&
        dataInfo.sku.length > key.length &&
        !dataInfo.sku.includes("OB-")
      ) {
        bundleObj = {
          id: dataInfo.id,
          total: dataInfo.inventory_level,
          tracking: dataInfo.inventory_tracking,
          custom_url: dataInfo.custom_url,
          availability: dataInfo.availability
        };
        bundle.push(bundleObj);
      }
    });
    return bundle;
  }

  componentDidMount() {
    const bgData = {};
    this.firebaseRef = firebase.database().ref(`/inventory`);
    this.firebaseRef.on("value", async snapshot => {
      const payload = snapshot.val();
      if (payload.eastcoast) {
        this.setState({
          eastDatas: payload.eastcoast,
          westDatas: payload.westcoast,
          toggle: Object.keys(payload.eastcoast).map(element => false)
        });

        await axios.get("os/getcategories").then(async datas => {
          Object.keys(payload.eastcoast).forEach(key => {
            datas.data.forEach(data => {
              data.forEach(dataInfo => {
                if (dataInfo.sku === key) {
                  bgData[key] = {
                    id: dataInfo.id,
                    total: dataInfo.inventory_level,
                    tracking: dataInfo.inventory_tracking,
                    custom_url: dataInfo.custom_url,
                    availability: dataInfo.availability,
                    bundles: this.getBundles(data, key)
                  };
                }
              });
            });
          });
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

  handleChange = e => {
    let data;
    let dataName;
    switch (e.target.name) {
      case "eastcoast":
        data = this.state.eastDatas;
        dataName = "eastDatas";
        break;
      case "westcoast":
        data = this.state.westDatas;
        dataName = "westDatas";
        break;
      default:
        data = "";
        break;
    }
    let value = e.target.value;
    if (e.target.value.charAt(0) === 0) {
      value = e.target.value.substring(1);
    }
    if (e.target.value.length < 1) {
      value = 0;
    }
    data[e.target.placeholder].total = parseInt(value);
    let bgTotal = this.state.bgDatas;
    bgTotal[e.target.placeholder].total = this.calculateTotal(
      this.state.eastDatas[e.target.placeholder].total,
      this.state.westDatas[e.target.placeholder].total
    );
    this.setState({
      [dataName]: data,
      bgDatas: bgTotal
    });
  };
  totalChange(key, db) {
    let dataName;
    if (db === "eastcoast" || db === "westcoast") {
      if (db === "eastcoast") {
        dataName = "eastDatas";
        db = "eastcoast";
      } else {
        dataName = "westDatas";
        db = "westcoast";
      }
      axios
        .put("fb/updateinventory", {
          noEquation: true,
          dbname: db,
          sku: key,
          total: this.state[dataName][key].total
        })
        .then(response => {
          if (response.data.msg === "success") {
            console.log("logged");
          } else if (response.data.msg === "fail") {
            console.log("failed to log.");
          }
        });

      axios
        .put("os/updateinventory", {
          noEquation: true,
          inventory_level: this.state.bgDatas[key].total,
          productID: this.state.bgDatas[key].id
        })
        .then(response => {
          if (response.data.msg === "success") {
            console.log("logged");
          } else if (response.data.msg === "fail") {
            console.log("failed to log.");
          }
        });
    } else {
      console.log("database not found!");
    }
  }

  disableBundle(datas) {
    return datas.forEach(data => {
      axios.put("os/disableproduct", {
        productID: data.id,
        availability: "disabled"
      });
      data.availability = "disabled";
    });
  }

  enableBundle(datas) {
    return datas.forEach(data => {
      axios.put("os/disableproduct", {
        productID: data.id,
        availability: "available"
      });
      data.availability = "available";
    });
  }

  handleOutOfStockSingle(key) {
    const { bgDatas, eastDatas, westDatas } = this.state;
    const tempBGData = { ...bgDatas };
    if (bgDatas[key].availability === "available") {
      axios
        .put("os/disableproduct", {
          productID: tempBGData[key].id,
          availability: "disabled",
          inventory_level: 0
        })
        .then(async () => {
          await this.disableBundle(tempBGData[key].bundles);
          tempBGData[key].availability = "disabled";
          tempBGData[key].total = 0;
          this.setState({ bgDatas: tempBGData });
        });
    } else {
      axios
        .put("os/disableproduct", {
          productID: tempBGData[key].id,
          availability: "available",
          inventory_level: this.calculateTotal(
            eastDatas[key].total,
            westDatas[key].total
          )
        })
        .then(async () => {
          await this.enableBundle(tempBGData[key].bundles);
          tempBGData[key].availability = "available";
          tempBGData[key].total = this.calculateTotal(
            eastDatas[key].total,
            westDatas[key].total
          );
          this.setState({ bgDatas: tempBGData });
        });
    }
  }

  handleOutOfStockBundle(key) {
    const { bgDatas } = this.state;
    const tempBGData = { ...bgDatas };
    tempBGData[key].bundles.forEach(data => {
      if (data.availability === "available") {
        axios.put("os/disableproduct", {
          productID: data.id,
          availability: "disabled"
        });
        data.availability = "disabled";
      } else {
        axios.put("os/disableproduct", {
          productID: data.id,
          availability: "available"
        });
        data.availability = "available";
      }
    });
    this.setState({
      bgDatas: tempBGData
    });
  }
  calculateTotal(east, west) {
    return east + west;
  }
  mapTableList() {
    const { eastDatas, westDatas, bgDatas, toggle } = this.state;

    return Object.keys(eastDatas).map((key, index) => {
      return (
        <InventoryTableDetail
          index={index}
          key={key}
          sku={key}
          brand={eastDatas[key].brand}
          stage={eastDatas[key].stage}
          eastTotal={eastDatas[key].total}
          westTotal={westDatas[key].total}
          bgTotal={bgDatas[key] ? bgDatas[key].total : "N/A"}
          bgTracking={bgDatas[key] ? bgDatas[key].tracking : ""}
          scanner={eastDatas[key].scanner}
          timeStamp={eastDatas[key].timeStamp}
          inputRef={input => (this.textInput = input)}
          link={bgDatas[key] ? bgDatas[key].custom_url : ""}
          availability={bgDatas[key] ? bgDatas[key].availability : ""}
          disable={
            bgDatas[key]
              ? bgDatas[key].bundles.length < 1
                ? true
                : false
              : true
          }
          bundleAvailability={
            bgDatas[key]
              ? bgDatas[key].bundles[0]
                ? bgDatas[key].bundles[0].availability
                : "disabled"
              : "disabled"
          }
          handleOutOfStockSingle={this.handleOutOfStockSingle}
          handleOutOfStockBundle={this.handleOutOfStockBundle}
          toggleInput={this.toggleInput}
          showInput={toggle[index]}
          handleChange={this.handleChange}
          handleSubmitButton={this.totalChange}
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
            <Table.HeaderCell>
              <strong>Actions</strong>
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
