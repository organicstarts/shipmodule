import React, { Component } from "react";
import { connect } from "react-redux";
import { setShipmentItems } from "../../actions/order";
import firebase from "../../config/firebaseconf";
import moment from "moment";
import { Link } from "react-router-dom";
import BatchDetail from "./BatchDetail";
import SlipDetail from "./SlipDetail";
import boxes from "../../config/boxes";
import packages from "../../config/packages";
import skuInfo from "../../config/productinfo.json";
import { iconQuotes } from "../../config/peopleicon";
import { Segment } from "semantic-ui-react";
import { ClipLoader } from "react-spinners";
import axios from "axios";

class BatchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disable: false
    };
    this.logprint = this.logprint.bind(this);
    // this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    window.addEventListener("afterprint", this.logprint);
    this.props.setShipmentItems(this.props.warehouseLocation);
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
        if (data.batch === this.props.batchNumber) {
          batchInLog = true;
          return "";
        }
        return "";
      });

      if (!batchInLog) {
        // let items = [];
        await Promise.all(
          this.props.shipmentItems.map(async data => {
            if (skuInfo[data.sku] && !data.sku.includes("PURE")) {
              if (data.sku.includes("OB-")) {
                await axios
                  .put("fb/updateinventory", {
                    dbname: `${warehouse}OB`,
                    sku: data.sku,
                    quantity: data.combineTotal
                      ? 0 - data.combineTotal
                      : 0 - data.quantity
                  })
                  .then(response => {
                    if (response.data.msg === "success") {
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
                        ? 0 - parseInt(data.combineTotal / 6)
                        : 0 - data.combineTotal
                      : 0 - data.quantity
                  })
                  .then(response => {
                    if (response.data.msg === "success") {
                      console.log("inventory subtracted");
                    } else if (response.data.msg === "fail") {
                      console.log("failed to log.");
                    }
                  });
              }
              // if (data.sku === "HP-UK-2") {
              //   items.push(data);
              // }
            }
          })
        );

        let babyProducts = [];
        this.props.shipmentItems.map(data => {
          if (
            data.warehouseLocation &&
            data.warehouseLocation.match(/^[A-Za-z]{1}/g)
          ) {
            babyProducts.push(data);
          }
        });

        axios
          .post("fb/batchinfo", {
            batch: this.props.batchNumber,
            products: babyProducts
          })
          .then(response => {
            if (response.data.msg === "success") {
              console.log("inventory logged");
            } else if (response.data.msg === "fail") {
              console.log("failed to log.");
            }
          });

        // console.log(items);
        // axios
        //   .post("/sendbatchitemsemail", {
        //     batch: this.props.batchNumber,
        //     data: items,
        //     warehouse: warehouse
        //   })
        //   .then(response => {
        //     if (response.data.msg === "success") {
        //       console.log("emailed");
        //     } else if (response.data.msg === "fail") {
        //       console.log("not emailed");
        //     } else if (response.data.msg === "none") {
        //       console.log("No unprinted batches");
        //     }
        //   });
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener("afterprint", this.logprint);
    this.dataRef.off();
  }

  // reduceInventory() {}
  // handleClick() {
  //   this.setState({ disable: true });
  //   const warehouse = this.props.warehouseLocation
  //     .toLowerCase()
  //     .replace(/\s/g, "");

  //   this.props.shipmentItems.map(async data => {
  //     if (skuInfo[data.sku]) {
  //       await axios
  //         .put("fb/updateinventory", {
  //           dbname: warehouse,
  //           sku: data.sku,
  //           quantity: -data.combineTotal || -data.quantity
  //         })
  //         .then(response => {
  //           if (response.data.msg === "success") {
  //             console.log("logged");
  //           } else if (response.data.msg === "fail") {
  //             console.log("failed to log.");
  //           }
  //         });
  //     }
  //     return "";
  //   });
  // }

  logprint() {
    let currentTime = moment().format("dddd, MMMM DD YYYY hh:mma");
    axios
      .post("fb/writetofile", {
        action: "Print",
        batchNumber: this.props.batchNumber,
        user: this.props.displayName,
        picker: this.props.picker,
        shipper: this.props.shipper,
        currentTime
      })
      .then(response => {
        if (response.data.msg === "success") {
          console.log("logged");
        } else if (response.data.msg === "fail") {
          console.log("failed to log.");
        }
      });
  }

  renderBatchList = () => {
    const { shipmentItems, loading } = this.props;

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

    return shipmentItems.map(data => {
      if (data.length > 1) {
        return data.map(data => {
          return (
            <BatchDetail
              key={data.orderItemId}
              sku={data.sku}
              text={data.name}
              image={data.imageUrl}
              quantity={data.combineTotal ? data.combineTotal : data.quantity}
              warehouse={data.warehouseLocation}
              options={data.options ? data.options[0].value : ""}
            />
          );
        });
      }
      return (
        <BatchDetail
          key={data.orderItemId}
          sku={data.sku}
          text={data.aliasName}
          image={data.imageUrl}
          quantity={data.combineTotal ? data.combineTotal : data.quantity}
          warehouse={data.warehouseLocation}
          fullBox={data.fullBox ? data.fullBox : null}
          loose={data.loose ? data.loose : null}
          options={data.options ? data.options[0].value : ""}
        />
      );
    });
  };

  renderSlipList = () => {
    const { batchDatas, picker, shipper, loading } = this.props;

    if (loading) {
      return (
        <div style={{ margin: "0 auto", textAlign: "center" }}>
          <ClipLoader
            sizeUnit={"px"}
            size={500}
            color={"#36D7B7"}
            loading={loading}
          />
        </div>
      );
    }
    return batchDatas.map(data => {
      return (
        <SlipDetail
          key={data.orderId}
          logo={
            data.advancedOptions.storeId === 201185
              ? "lwo"
              : data.advancedOptions.storeId === (135943 || 135942)
              ? "bg"
              : "osw"
          }
          customerId={data.bigCommerce ? data.bigCommerce.customer_id : null}
          message={data.bigCommerce ? data.bigCommerce.customer_message : ""}
          carrier={data.carrierCode}
          orderTotal={data.orderCount}
          carrierCode={getCarrier(data.carrierCode, data.packageCode)}
          box={calculateBox(data.dimensions)}
          batchNumber={data.batchNumber}
          shipmentInfo={data.shipmentItems}
          picker={iconQuotes[picker]}
          shipper={iconQuotes[shipper]}
          name={data.shipTo.name}
          email={data.customerEmail}
          company={data.shipTo.company}
          street1={data.shipTo.street1}
          street2={data.shipTo.street2}
          city={data.shipTo.city}
          state={data.shipTo.state}
          zip={data.shipTo.postalCode}
          total={getTotal(data.shipmentItems)}
          credit={data.bigCommerce ? data.bigCommerce.store_credit_amount : 0}
          orderID={data.orderNumber}
          created={
            data.bigCommerce
              ? formatDate(data.bigCommerce.date_created)
              : formatDate(data.createDate, data.advancedOptions.storeId)
          }
          shipDate={
            data.bigCommerce
              ? formatDate(data.bigCommerce.date_shipped)
              : formatDate(data.shipDate, data.advancedOptions.storeId)
          }
          coupon={data.couponInfo ? data.couponInfo : []}
          shipmentCost={
            data.bigCommerce
              ? data.bigCommerce.shipping_cost_inc_tax
              : data.shippingAmount
              ? data.shippingAmount
              : 0
          }
          shipDuration={
            data.bigCommerce
              ? calculateTime(
                  data.bigCommerce.date_created,
                  data.bigCommerce.date_shipped
                )
              : null
          }
        />
      );
    });
  };

  render() {
    if (this.props.batchDatas.length < 1) {
      return (
        <Segment style={{ marginTop: "50px" }}>
          <Link to="/">Go Back</Link>
          <h1>Batch number not found!</h1>
        </Segment>
      );
    }

    return (
      <div>
        <div style={styles.pickList}>
          <Link to="/batch" className="noprint">
            Go Back
          </Link>
          {/* <Button
            style={{ margin: "10px 50px" }}
            className="noprint"
            color="green"
            onClick={this.handleClick}
            disabled={this.state.disable}
          >
            Subtract from Database
          </Button> */}
          <div className="row">
            <h1 className="col-6" style={styles.margin}>
              Product Pick List
            </h1>
            <p
              className="col-6"
              style={{
                fontSize: "large",
                textAlign: "right",
                margin: "0",
                padding: "17px"
              }}
            >
              <strong>
                Batch #{this.props.batchNumber} <br />
                {formatDateTime(this.props.batchDatas[0].create_date)}
              </strong>
            </p>
          </div>
          <div className="row align-items-center" style={{ padding: "0 15px" }}>
            <div className="col-1" style={{ textAlign: "center" }}>
              &#10004;Picker/Checker
            </div>
            <div className="col-1" />
            <div className="col-2" style={{ textAlign: "center" }}>
              <strong>Code</strong>
            </div>
            <div className="col-6">
              <strong>Product Name</strong>
            </div>
            <div className="col-1" />
            <div className="col-1" style={{ textAlign: "center" }}>
              <strong>#</strong>
            </div>
          </div>
          <div>{this.renderBatchList()}</div>
          <div className="row" style={{ textAlign: "right" }}>
            <div className="col-12">
              <strong>Total Items Required: {this.props.totalCount}</strong>
            </div>
          </div>
        </div>

        <div style={styles.pickList}>
          <br />
          <p style={{ paddingTop: "20px" }}>
            Batch#:<b>{this.props.batchNumber}</b>{" "}
            <span style={{ paddingLeft: "10px" }}>
              Picker:_____________________ Checker:_____________________ # of
              Items Missed: _____________________
            </span>
          </p>
          <br />
          <p>
            Time Printed:_______________ Time Started:_______________ Time
            Finished:_______________ Time Checked:_______________
          </p>
          <br />
          <p style={{ width: "100%", display: "table" }}>
            <span style={{ display: "table-cell", width: "70px" }}>
              Pick Notes:
            </span>
            <span
              style={{
                display: "table-cell",
                borderBottom: "1px solid black"
              }}
            />
          </p>
          <p style={{ width: "100%", display: "table" }}>
            <span
              style={{
                paddingTop: "25px",
                display: "table-cell",
                borderBottom: "1px solid black"
              }}
            />
          </p>
          <p style={{ width: "100%", display: "table" }}>
            <span
              style={{
                paddingTop: "25px",
                display: "table-cell",
                borderBottom: "1px solid black"
              }}
            />
          </p>
          <p>
            Prepared By: <b>{this.props.picker}</b> &emsp;&emsp; Shipped By:{" "}
            <b>{this.props.shipper}</b>
          </p>
          <br />
          <br />
          <p style={{ width: "100%", display: "table" }}>
            <span style={{ display: "table-cell", width: "75px" }}>
              Set Started:
            </span>
            <span
              style={{
                display: "table-cell",
                borderBottom: "1px solid black",
                width: "100px"
              }}
            />
            <span style={{ display: "table-cell", width: "80px" }}>
              Set Finished:
            </span>
            <span
              style={{
                display: "table-cell",
                borderBottom: "1px solid black",
                width: "100px"
              }}
            />
            <span style={{ display: "table-cell", width: "80px" }}>
              Ship Started:
            </span>
            <span
              style={{
                display: "table-cell",
                borderBottom: "1px solid black",
                width: "100px"
              }}
            />
            <span style={{ display: "table-cell", width: "85px" }}>
              Ship Finished:
            </span>
            <span
              style={{
                display: "table-cell",
                borderBottom: "1px solid black",
                width: "100px"
              }}
            />
          </p>
          <p># of mistakes:_______________ </p> <br /> <br />
          <p style={{ width: "100%", display: "table" }}>
            <span style={{ display: "table-cell", width: "80px" }}>
              Table Notes:
            </span>{" "}
            <span
              style={{
                display: "table-cell",
                borderBottom: "1px solid black"
              }}
            />
          </p>
          <p style={{ width: "100%", display: "table" }}>
            <span
              style={{
                paddingTop: "25px",
                display: "table-cell",
                borderBottom: "1px solid black"
              }}
            />
          </p>
          <p style={{ width: "100%", display: "table" }}>
            <span
              style={{
                paddingTop: "25px",
                display: "table-cell",
                borderBottom: "1px solid black"
              }}
            />
          </p>
          <p style={{ width: "100%", display: "table" }}>
            <span style={{ display: "table-cell", width: "110px" }}>
              Supervisor Notes:
            </span>{" "}
            <span
              style={{
                display: "table-cell",
                borderBottom: "1px solid black"
              }}
            />
          </p>
          <p style={{ width: "100%", display: "table" }}>
            <span
              style={{
                paddingTop: "25px",
                display: "table-cell",
                borderBottom: "1px solid black"
              }}
            />
          </p>
          <p style={{ width: "100%", display: "table" }}>
            <span
              style={{
                paddingTop: "25px",
                display: "table-cell",
                borderBottom: "1px solid black"
              }}
            />
          </p>
          <p style={{ textAlign: "right", paddingTop: "15px" }}>
            Supervisor Name:______________________________________
          </p>
        </div>

        <div style={{ margin: "0 auto" }}>
          {this.renderSlipList(this.props)}
        </div>
      </div>
    );
  }
}

const getCarrier = (carrier, boxPackage) => {
  if (packages[carrier][boxPackage]) {
    return packages[carrier][boxPackage].NAME;
  }
  return "";
};

const calculateTime = (startDate, endDate) => {
  let date1 = moment(startDate);
  let date2 = moment(endDate);
  let hours = date2.diff(date1, "Hours");
  let mins = moment
    .utc(moment(date2, "Minutes").diff(moment(date1, "HH:mm:ss")))
    .format("mm");

  return `about ${hours} hours and ${mins} minutes after you ordered. Yeah that was
  fast ;)`;
};

const calculateBox = dimension => {
  if (dimension) {
    const boxSize = dimension.height * dimension.width * dimension.length;
    if (boxes[boxSize]) return boxes[boxSize].name;
  }
  return "";
};
const getTotal = items => {
  let x = 0;
  items.map(item => (x = x + item.quantity));
  return x;
};

const formatDate = (string, storeId) => {
  const date = moment.utc(string);
  return storeId === 201185
    ? date.format("MM/DD/YYYY")
    : date.format("MMMM DD YYYY");
};

const formatDateTime = string => {
  const date = moment.utc(string);
  return date.format("MMMM DD YYYY");
};

const styles = {
  margin: {
    margin: "0",
    padding: "17px"
  },
  pickList: {
    fontSize: "110% !important",
    background: "#fff",
    zIndex: 5,
    maxWidth: "7.5in",
    margin: "0 auto 5.25in auto",
    marginBottom: "4in",
    pageBreakBefore: "always",
    pageBreakAfter: "always"
  }
};

function mapStateToProps({ authState, batchState }) {
  return {
    displayName: authState.displayName,
    warehouseLocation: authState.warehouseLocation,
    email: authState.email,
    picker: batchState.picker,
    shipper: batchState.shipper,
    totalCount: batchState.totalCount,
    batchDatas: batchState.batchDatas,
    batchNumber: batchState.batchNumber,
    shipmentItems: batchState.shipmentItems,
    loading: batchState.loading
  };
}

export default connect(
  mapStateToProps,
  { setShipmentItems }
)(BatchList);
