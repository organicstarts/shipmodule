import React, { Component } from "react";
import InventoryTableDetail from "./InventoryTableDetail";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import firebase from "../../../config/firebaseconf";
import axios from "axios";
import { Segment, Table, Button } from "semantic-ui-react";

class OpenBrokenTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: {},
      eastDatas: {},
      westDatas: {},
      bgDatas: {},
      loading: true,
      buttonLoading: false,
      editable: false
    };
    this.handleOutOfStockSingle = this.handleOutOfStockSingle.bind(this);
    this.toggleInput = this.toggleInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.totalChange = this.totalChange.bind(this);
    this.calculateAllTotal = this.calculateAllTotal.bind(this);
  }

  toggleInput(index) {
    const newToggleStatus = [...this.state.toggle];
    newToggleStatus[index] = !this.state.toggle[index];
    this.setState({ toggle: newToggleStatus });
  }

  componentDidMount() {
    const bgData = {};
    this.firebaseRef = firebase.database().ref(`/inventory`);
    this.firebaseRef.on("value", async snapshot => {
      const payload = snapshot.val();
      if (payload.eastcoastOB) {
        this.setState({
          eastDatas: payload.eastcoastOB,
          westDatas: payload.westcoastOB,
          toggle: Object.keys(payload.eastcoastOB).map(element => false)
        });

        await axios.get("os/getcategories").then(async datas => {
          Object.keys(payload.eastcoastOB).forEach(key => {
            datas.data.forEach(data => {
              data.forEach(dataInfo => {
                if (dataInfo.sku === key) {
                  bgData[key] = {
                    id: dataInfo.id,
                    total: dataInfo.inventory_level,
                    tracking: dataInfo.inventory_tracking,
                    custom_url: dataInfo.custom_url,
                    // availability: dataInfo.availability
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
        db = "eastcoastOB";
      } else {
        dataName = "westDatas";
        db = "westcoastOB";
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

  handleOutOfStockSingle(key) {
    const { bgDatas, eastDatas, westDatas } = this.state;
    const tempBGData = { ...bgDatas };
    const total = this.calculateTotal(
      eastDatas[key].total,
      westDatas[key].total
    );
    if (bgDatas[key].total !== 0) {
      axios
        .put("os/disableproduct", {
          productID: tempBGData[key].id,
          tracking: "simple",
          inventory_level: 0
        })
        .then(async () => {
          tempBGData[key].tracking = "simple";
          tempBGData[key].total = 0;
          this.setState({ bgDatas: tempBGData });
        });
    } else {
      axios
        .put("os/disableproduct", {
          productID: tempBGData[key].id,
          tracking: "simple",
          inventory_level: total
        })
        .then(async () => {
          tempBGData[key].tracking = "simple";
          tempBGData[key].total = total;
          this.setState({ bgDatas: tempBGData });
        });
    }
  }

  calculateTotal(east, west) {
    return east + west;
  }

  calculateAllTotal() {
    const { bgDatas, eastDatas, westDatas } = this.state;
    this.setState({ buttonLoading: true });
    const tempBGData = { ...bgDatas };
    Promise.all(
      Object.keys(bgDatas).map(async key => {
        let total = this.calculateTotal(
          eastDatas[key].total,
          westDatas[key].total
        );
        if (total > 0) {
          await axios
            .put("os/disableproduct", {
              tracking: "simple",
              inventory_level: total,
              productID: bgDatas[key].id
            })
            .then(async () => {
              tempBGData[key].tracking = "simple";
              tempBGData[key].total = total;
            });
        } else {
          await axios
            .put("os/disableproduct", {
              tracking: "simple",
              inventory_level: total,
              productID: bgDatas[key].id
            })
            .then(async () => {
              tempBGData[key].tracking = "simple";
              tempBGData[key].total = total;
            });
        }
      })
    ).then(() => this.setState({ bgDatas: tempBGData, buttonLoading: false }));
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
          // availability={bgDatas[key] ? bgDatas[key].availability : ""}
          disable={true}
          handleInfinite={""}
          showInfinite={false}
          bundleTracking={""}
          handleOutOfStockSingle={this.handleOutOfStockSingle}
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
        </Link>
        {this.state.buttonLoading ? (
          <ClipLoader
            sizeUnit={"px"}
            size={54}
            color={"#36D7B7"}
            loading={this.state.buttonLoading}
          />
        ) : (
          <Button
            style={{ margin: "10px 50px" }}
            className="noprint"
            color="green"
            onClick={this.calculateAllTotal}
          >
            Calculate Total
          </Button>
        )}
        <div> {this.renderLogList()}</div>
      </Segment>
    );
  }
}

export default OpenBrokenTable;
