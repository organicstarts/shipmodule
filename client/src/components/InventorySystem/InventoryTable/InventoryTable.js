import React, { Component } from "react";
import { connect } from "react-redux";
import InventoryTableDetail from "./InventoryTableDetail";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import firebase from "../../../config/firebaseconf";
import axios from "axios";
import { Segment, Table, Button } from "semantic-ui-react";

const compare = (a, b) => {
  const skuA = Object.keys(a);
  const skuB = Object.keys(b);
  return a[skuA].orderOfImportance - b[skuB].orderOfImportance;
};

class InventoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: {},
      eastDatas: {},
      productArray: [],
      westDatas: {},
      bgDatas: {},
      loading: true,
      editable: false
    };
    this.handleOutOfStockSingle = this.handleOutOfStockSingle.bind(this);
    this.handleOutOfStockBundle = this.handleOutOfStockBundle.bind(this);
    this.handleInfinite = this.handleInfinite.bind(this);
    this.toggleInput = this.toggleInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.totalChange = this.totalChange.bind(this);
    // this.pushTotalToBigCommerce = this.pushTotalToBigCommerce.bind(this);
    this.calculateAllTotal = this.calculateAllTotal.bind(this);
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
      let skusplit = [];
      if (
        dataInfo.sku.includes(key) &&
        dataInfo.sku.length > key.length &&
        !dataInfo.sku.includes("OB-") &&
        !dataInfo.sku.includes("TP-")
      ) {
        if (dataInfo.sku.includes("TK")) {
          let tempSku = dataInfo.sku.split(/TK-.\d*-/)[1];
          let split = tempSku.split(/-/);

          if (
            tempSku.charAt(0) === "H" &&
            (tempSku.includes(`HP-DE`) ||
              tempSku.includes(`HP-UK`) ||
              tempSku.includes(`HP-NL`))
          ) {
            skusplit[0] = split[0] + "-" + split[1] + "-" + split[2];
            skusplit[1] = split[3] + "-" + split[4] + "-" + split[5];
          } else {
            skusplit[0] = split[0] + "-" + split[1];
            skusplit[1] = split[2] + "-" + split[3];
          }
        }
        bundleObj = {
          id: dataInfo.id,
          total: dataInfo.inventory_level,
          tracking: dataInfo.inventory_tracking,
          custom_url: dataInfo.custom_url,
          // availability: dataInfo.availability,
          tk: skusplit.length > 0 ? skusplit : ""
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
          productArray: Object.keys(payload.eastcoast)
            .map(key => {
              return { [key]: payload.eastcoast[key] };
            })
            .sort(compare),
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
                    // availability: dataInfo.availability,
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

  compareEmail(email) {
    switch (email) {
      case "yvan@organicstart.com":
      case "peter@organicstart.com":
      case "isaiah@organicstart.com":
        return true;
      default:
        return false;
    }
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
    this.setState({
      [dataName]: data
    });
  };

  // async pushTotalToBigCommerce(key) {
  //   const { eastDatas, westDatas, bgDatas } = this.state;
  //   const tempBGData = { ...bgDatas };
  //   const total = this.calculateTotal(
  //     eastDatas[key].total,
  //     westDatas[key].total
  //   );
  //   axios
  //     .put("os/updateinventory", {
  //       noEquation: true,
  //       inventory_level: total,
  //       productID: bgDatas[key].id
  //     })
  //     .then(response => {
  //       if (response.data.msg === "success") {
  //         console.log("logged");
  //       } else if (response.data.msg === "fail") {
  //         console.log("failed to log.");
  //       }
  //     });
  //   if (total > 100) {
  //     await this.enableBundle(tempBGData[key].bundles, total / 2);
  //   } else {
  //     await this.disableBundle(tempBGData[key].bundles);
  //   }
  //   tempBGData[key].total = total;
  //   this.setState({ bgDatas: tempBGData });
  // }

  async totalChange(key, db) {
    const { eastDatas, westDatas } = this.state;

    axios
      .put("fb/updateinventory", {
        noEquation: true,
        dbname: "eastcoast",
        sku: key,
        total: eastDatas[key].total
      })
      .then(response => {
        if (response.data.msg === "success") {
          console.log("logged");
        } else if (response.data.msg === "fail") {
          console.log("failed to log.");
        }
      });
    axios
      .put("fb/updateinventory", {
        noEquation: true,
        dbname: "westcoast",
        sku: key,
        total: westDatas[key].total
      })
      .then(response => {
        if (response.data.msg === "success") {
          console.log("logged");
        } else if (response.data.msg === "fail") {
          console.log("failed to log.");
        }
      });
  }

  disableBundle(datas) {
    return datas.forEach(data => {
      axios.put("os/disableproduct", {
        productID: data.id,
        tracking: "simple",
        inventory_level: 0
      });
      data.total = 0;
    });
  }

  enableBundle(datas, total = 0) {
    const { bgDatas } = this.state;
    return datas.forEach(data => {
      if (
        data.tk.length > 0 &&
        (bgDatas[data.tk[0]].total < 100 || bgDatas[data.tk[1]].total < 100)
      ) {
        axios.put("os/disableproduct", {
          productID: data.id,
          tracking: "simple",
          inventory_level: 0
        });
        data.total = 0;
      } else {
        axios.put("os/disableproduct", {
          productID: data.id,
          tracking: "simple",
          inventory_level: Math.floor(total)
        });
        data.total = Math.floor(total);
      }
    });
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
          await this.disableBundle(tempBGData[key].bundles);
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
          // await this.enableBundle(
          //   tempBGData[key].bundles,
          //   tempBGData[key].total
          // );
          this.setState({ bgDatas: tempBGData });
        });
    }
  }
  handleInfinite(key) {
    const { eastDatas, westDatas, bgDatas } = this.state;
    const tempBGData = { ...bgDatas };
    const total = this.calculateTotal(
      eastDatas[key].total,
      westDatas[key].total
    );
    if (bgDatas[key].tracking === "none") {
      axios
        .put("os/disableproduct", {
          productID: tempBGData[key].id,
          tracking: "simple",
          inventory_level: total
        })
        .then(async () => {
          tempBGData[key].tracking = "simple";
          tempBGData[key].total = total;
          await this.disableBundle(tempBGData[key].bundles);
          this.setState({ bgDatas: tempBGData });
        });
    } else {
      axios
        .put("os/disableproduct", {
          productID: tempBGData[key].id,
          tracking: "none"
        })
        .then(async () => {
          tempBGData[key].tracking = "none";
          //await this.enableBundle(tempBGData[key].bundles);
          this.setState({ bgDatas: tempBGData });
        });
    }
  }
  async handleOutOfStockBundle(key) {
    const { bgDatas, eastDatas, westDatas } = this.state;
    const tempBGData = { ...bgDatas };
    const total = this.calculateTotal(
      eastDatas[key].total,
      westDatas[key].total
    );

    await Promise.all(
      tempBGData[key].bundles.map(async data => {
        console.log(data);
        if (
          data.tk.length > 0 &&
          (bgDatas[data.tk[0]].total < 100 || bgDatas[data.tk[1]].total < 100)
        ) {
          await axios.put("os/disableproduct", {
            productID: data.id,
            tracking: "simple",
            inventory_level: 0
          });
        } else if (data.total !== 0) {
          await axios.put("os/disableproduct", {
            productID: data.id,
            tracking: "simple",
            inventory_level: 0
          });
          data.tracking = "simple";
          data.total = 0;
        } else {
          await axios.put("os/disableproduct", {
            productID: data.id,
            tracking: "simple",
            inventory_level: Math.floor(total / 2)
          });
          data.tracking = "simple";
          data.total = Math.floor(total / 2);
        }
      })
    );
    this.setState({
      bgDatas: tempBGData
    });
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
              if (total > 100) {
                await this.enableBundle(tempBGData[key].bundles, total / 2);
              }
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
              if (total < 100) {
                await this.disableBundle(tempBGData[key].bundles);
              }
            });
        }
      })
    ).then(() => this.setState({ bgDatas: tempBGData, buttonLoading: false }));
  }

  mapTableList() {
    const { eastDatas, westDatas, productArray, bgDatas, toggle } = this.state;

    return productArray.map((data, index) => {
      const key = Object.keys(data)[0];
      return (
        <InventoryTableDetail
          index={index}
          email={this.compareEmail(this.props.email) ? true : false}
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
          disable={
            bgDatas[key]
              ? bgDatas[key].bundles.length < 1
                ? true
                : false
              : true
          }
          bundleTracking={
            bgDatas[key]
              ? bgDatas[key].bundles[0]
                ? bgDatas[key].bundles[0].tracking
                : "simple"
              : "simple"
          }
          bundleTotal={
            bgDatas[key]
              ? bgDatas[key].bundles[0]
                ? bgDatas[key].bundles[0].total
                : 0
              : 0
          }
          // handlePushTotalToBigCommerce={this.pushTotalToBigCommerce}
          handleInfinite={this.handleInfinite}
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
        <Link to="/inventory" className="noprint">
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
            disabled={true}
          >
            Calculate Total
          </Button>
        )}
        <p>
          {`Quantity Levels Legend: `}
          <span
            className="red"
            style={{
              height: "10px",
              width: "10px",
              borderRadius: "15%",
              display: "inline-block"
            }}
          />
          {` = 100 < | `}
          <span
            className="orange"
            style={{
              height: "10px",
              width: "10px",
              borderRadius: "15%",
              display: "inline-block"
            }}
          />
          {` = 200 < | `}
          <span
            className="yellow"
            style={{
              height: "10px",
              width: "10px",
              borderRadius: "15%",
              display: "inline-block"
            }}
          />
          {` = 300 < `}
        </p>
        <div>{this.renderLogList()}</div>
      </Segment>
    );
  }
}

const mapStateToProps = ({ authState }) => {
  return {
    email: authState.email
  };
};

export default connect(
  mapStateToProps,
  null
)(InventoryTable);
