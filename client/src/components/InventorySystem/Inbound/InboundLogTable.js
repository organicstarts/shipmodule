import React, { Component } from "react";
import _ from "lodash";
import InboundLogDetail from "./InboundLogDetail";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import firebase from "../../../config/firebaseconf";
// import skuInfo from "../../../config/productinfo.json";
import {
  Segment,
  Table,
  Input,
  Select,
  Icon,
  Button,
  Grid
} from "semantic-ui-react";
import axios from "axios";

class InboundLogTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      column: null,
      direction: null,
      dbDatas: {},
      datas: {},
      loading: true,
      filter: { value: "", log: [] },
      image: "",
      reverse: "",
      deleteLoading: false,
      toggle: {}
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.checkDuplicates = this.checkDuplicates.bind(this);
    // this.handleClick = this.handleClick.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.toggleInput = this.toggleInput.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.firebaseRef = firebase.database().ref(`/inventory/log`);
    this.firebaseRef.once("value", async snapshot => {
      const payload = snapshot.val();
      if (payload) {
        this.setState(
          {
            dbDatas: payload,
            loading: false
          },
          () => {
            this.setState({
              datas: this.filterLog(this.state.filter.value),
              toggle: Object.keys(payload).map(element => false)
            });
          }
        );
      }
    });
  }

  toggleInput(index) {
    const newToggleStatus = [...this.state.toggle];
    newToggleStatus[index] = !this.state.toggle[index];
    this.setState({ toggle: newToggleStatus });
  }

  handleChange = e => {
    let data;
    data = { ...this.state.datas };
    let value = e.target.value;
    data[e.target.placeholder][e.target.name] = value;
    data[e.target.placeholder].total =
      parseInt(data[e.target.placeholder].quantity) +
      parseInt(
        data[e.target.placeholder].broken
          ? data[e.target.placeholder].broken
          : 0
      );
    this.setState({
      datas: data
    });
  };
  updateChange = (key, index) => {
    let data = { ...this.state.datas };
    let update = firebase.database().ref("/inventory/log");
    update
      .child(key)
      .update({
        carrier: data[index].carrier,
        trackingNumber: data[index].trackingNumber,
        invoiceNum: data[index].invoiceNum,
        brand: data[index].brand,
        stage: data[index].stage,
        quantity: parseInt(data[index].quantity ? data[index].quantity : 0),
        broken: parseInt(data[index].broken ? data[index].broken : 0),
        total: parseInt(data[index].total)
      })
      .then(() => this.toggleInput(index));
  };

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
  checkDuplicates() {
    const { datas } = this.state;
    const tempData = [...datas];

    this.setState({ deleteLoading: true });
    datas.map((dataX, index) => {
      datas.map((dataY, indexY) => {
        if (dataX.trackingNumber === dataY.trackingNumber && index !== indexY) {
          tempData[index].trackingDuplicate = true;
        }
      });
    });
    this.setState({ deleteLoading: false, datas: tempData });
  }
  async handleDelete() {
    const { datas, dbDatas } = this.state;
    const tempDBData = { ...dbDatas };
    const tempData = { ...datas };
    this.setState({ deleteLoading: true });
    await Promise.all(
      datas.map(async (data, index) => {
        await this.archiveInventory(data.key, index).then(() => {
          delete tempDBData[data.key];
          tempData[index] = "";
        });
      })
    );
    this.setState({
      dbDatas: tempDBData,
      datas: tempData,
      deleteLoading: false
    });
  }

  async archiveInventory(key, index) {
    const { dbDatas, datas } = this.state;
    const tempDBData = { ...dbDatas };
    const tempData = { ...datas };
    // if (window.confirm("are you sure you want to delete?")) {
    // this.setState({ loading: true });

    if (dbDatas[key]) {
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
        .then(async response => {
          if (response.data.msg === "success") {
            console.log("Archived Item");
            await axios
              .delete("fb/deleteinventory", {
                data: {
                  db: "log",
                  id: key
                }
              })
              .then(response => {
                if (response.data.msg === "success") {
                  delete tempDBData[key];
                  tempData[index] = "";
                  this.setState({
                    dbDatas: tempDBData,
                    datas: tempData
                  });
                  console.log("Deleted Item");
                } else {
                  console.log("Item not deleted");
                }
              })
              .catch(error => console.log(error.message));
          } else {
            console.log("Item not deleted");
          }
        })
        .catch(error => console.log(error.message));
    } else {
      return false;
    }
  }

  totalChange(key, index) {
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
    axios.put("os/updateinventory", {
      inventory_level: total,
      productID: dbDatas[key].productID
    });
    axios
      .put("fb/updateinventory", {
        dbname: warehouse,
        sku: dbDatas[key].sku,
        obsku: null,
        quantity: total,
        broken: broken
      })
      .then(response => {
        if (response.data.msg === "success") {
          let update = firebase.database().ref("/inventory/log");
          update.child(key).update({ isChecked: !bool });
          let someProperty = { ...this.state.datas };
          someProperty[index].isChecked = !bool;
          this.setState({
            datas: someProperty
          });
        }
      });
  }

  filterLog(action = "none", label, db = "") {
    const { dbDatas } = this.state;
    if (action === "" || action === "none") {
      const result = Object.keys(dbDatas).map(key => {
        dbDatas[key].key = key;
        return dbDatas[key];
      });
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
        if (data[label]) {
          if (db !== "") {
            if (data.invoiceNum.includes(db) && data[label].includes(action)) {
              return data;
            }
          } else if (!db && data[label].includes(action)) {
            return data;
          }
        }
        return null;
      });
    return result;
  }
  handleSelectChange = (e, data) =>
    this.setState(
      {
        filter: {
          value: this.state.filter.value,
          log: this.filterLog(data.value, data.name, this.state.filter.value)
        }
      },
      () => {
        const { filter } = this.state;
        this.setState({ datas: filter.log });
      }
    );
  handleInputChange = (e, data) => {
    this.setState(
      {
        filter: {
          value: data.value,
          log: this.filterLog(data.value, data.name)
        }
      },
      () => {
        const { filter } = this.state;
        this.setState({ datas: filter.log });
      }
    );
  };

  mapTableList() {
    const { datas, image, toggle } = this.state;

    return Object.keys(datas).map((key, index) => {
      return (
        <InboundLogDetail
          key={key}
          index={index}
          id={datas[key].key ? datas[key].key : key}
          sku={datas[key].sku}
          productID={datas[key].productID}
          carrier={datas[key].carrier}
          trackingNumber={datas[key].trackingNumber}
          oldTracking={datas[key].oldTracking ? datas[key].oldTracking : ""}
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
          toggleInput={this.toggleInput}
          showInput={toggle[index]}
          handleChange={this.handleChange}
          handleSubmitButton={this.updateChange.bind(this)}
          duplicate={datas[key].trackingDuplicate}
        />
      );
    });
  }

  // handleClick(e) {
  //   const filter = e.currentTarget.getAttribute("name");
  //   const { datas, reverse } = this.state;
  //   if (reverse === filter) {
  //     this.setState({
  //       datas: Object.keys(datas)
  //         .map(key => datas[key])
  //         .reverse()
  //     });
  //   } else {
  //     this.setState({
  //       datas: Object.keys(datas)
  //         .map(key => datas[key])
  //         .sort(propComparator(filter)),
  //       reverse: filter
  //     });
  //   }
  // }

  handleSort = clickedColumn => () => {
    const { column, datas, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        datas: _.sortBy(datas, [clickedColumn]),
        direction: "ascending"
      });

      return;
    }

    this.setState({
      datas: Object.keys(datas)
        .map(key => datas[key])
        .reverse(),
      direction: direction === "ascending" ? "descending" : "ascending"
    });
  };

  renderLogList() {
    const { column, direction } = this.state;
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
        <Grid columns={3} padded stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Input
                name="invoiceNum"
                label="Invoice # Filter"
                value={this.state.filter.value}
                onChange={this.handleInputChange}
              />
            </Grid.Column>
            <Grid.Column width={3}>
              <Select
                label="Carrier"
                placeholder="Select One"
                name="carrier"
                options={[
                  { text: "None", value: "" },
                  { text: "Bpost", value: "Bpost" },
                  { text: "DHL Economy", value: "DHL Economy" },
                  { text: "DHL Express", value: "DHL Express" },
                  { text: "Lux", value: "Lux" },
                  { text: "Post NL", value: "Post NL" },
                  { text: "Other", value: "Other" }
                ]}
                onChange={this.handleSelectChange}
              />
            </Grid.Column>
            <Grid.Column width={2}>
              <Button
                color="red"
                onClick={this.handleDelete}
                loading={this.state.deleteLoading}
              >
                <Icon name="trash" />
                Delete All
              </Button>
            </Grid.Column>
            <Grid.Column width={4}>
              <Button
                color="green"
                onClick={this.checkDuplicates}
                loading={this.state.deleteLoading}
              >
                <Icon name="list" />
                Check Tracking Duplicates
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Table sortable celled collapsing textAlign="center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                sorted={column === "carrier" ? direction : null}
                onClick={this.handleSort("carrier")}
              >
                <strong>Carrier</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                sorted={column === "trackingNumber" ? direction : null}
                onClick={this.handleSort("trackingNumber")}
              >
                <strong>Tracking #</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                sorted={column === "invoiceNum" ? direction : null}
                onClick={this.handleSort("invoiceNum")}
              >
                <strong>Invoice #</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                sorted={column === "brand" ? direction : null}
                onClick={this.handleSort("brand")}
              >
                <strong>Brand</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                sorted={column === "stage" ? direction : null}
                onClick={this.handleSort("stage")}
              >
                <strong>Stage</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                sorted={column === "quantity" ? direction : null}
                onClick={this.handleSort("quantity")}
              >
                <strong>Quantity</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                sorted={column === "broken" ? direction : null}
                onClick={this.handleSort("broken")}
              >
                <strong>Broken</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                sorted={column === "total" ? direction : null}
                onClick={this.handleSort("total")}
              >
                <strong>Total</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                sorted={column === "scanner" ? direction : null}
                onClick={this.handleSort("scanner")}
              >
                <strong>Scanner</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                sorted={column === "warehouseLocation" ? direction : null}
                onClick={this.handleSort("warehouseLocation")}
              >
                <strong>Warehouse</strong>
              </Table.HeaderCell>
              <Table.HeaderCell style={{ cursor: "pointer" }}>
                <strong>Invoice</strong>
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: "pointer" }}
                sorted={column === "timeStamp" ? direction : null}
                onClick={this.handleSort("timeStamp")}
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
        <Link to="/inventory" className="noprint">
          Go Back
        </Link>{" "}
        <br />
        {this.renderLogList()}
      </Segment>
    );
  }
}

// const propComparator = propName => {
//   return (a, b) => {
//     let x = a[propName];
//     let y = b[propName];
//     if (!x) {
//       x = 0;
//     }
//     if (!y) {
//       y = 0;
//     }
//     if (isNaN(x) && isNaN(y)) {
//       return x.localeCompare(y);
//     }
//     return x - y;
//   };
// };

export default InboundLogTable;
