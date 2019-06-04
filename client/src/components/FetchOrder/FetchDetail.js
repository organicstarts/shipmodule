import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../../images/logo.jpg";
import oswlogo from "../../images/oswlogo.png";
import lwologo from "../../images/lwo-logo.png";
import "./fetchdetail.css";
import boxes from "../../config/boxes";
import packages from "../../config/packages";
import { iconQuotes } from "../../config/peopleicon";
import { ClipLoader } from "react-spinners";
import { Segment } from "semantic-ui-react";
import axios from "axios";
import firebase from "../../config/firebaseconf";
import skuInfo from "../../config/productinfo.json";

class FetchDetail extends Component {
  constructor() {
    super();
    this.logprint = this.logprint.bind(this);
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
          this.props.fetchDatas.shipmentItems.map(async data => {
            if (skuInfo[data.sku] && !data.sku.includes("PURE")) {
              console.log(data);
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
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener("afterprint", this.logprint);
    this.dataRef.off();
  }

  logprint() {
    let currentTime = moment().format("dddd, MMMM DD YYYY hh:mma");
    axios
      .post("fb/writetofile", {
        action: "Print",
        orderNumber: this.props.orderNumber,
        user: this.props.user,
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
  render() {
    const { fetchDatas, picker, shipper, loading, note } = this.props;
    const bg = fetchDatas.bigCommerce;
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
    if (fetchDatas.length < 1) {
      return (
        <Segment style={{ marginTop: "50px" }}>
          <Link to="/fetch">Go Back</Link>
          <h1>Order number not found!</h1>
        </Segment>
      );
    }
    if (fetchDatas.advancedOptions.storeId === 201185) {
      return (
        <div className="light-print">
          <div className="packing-slip">
            <Link to="/" className="noprint">
              Go Back
            </Link>

            <div className="row text-center">
              <img
                src={lwologo}
                style={{ maxHeight: "150px", margin: "0 auto" }}
                alt="logo"
              />
            </div>

            <div className="ui shipping-info" />
            <div className="row details">
              <div className="col-7">
                <h1 className="shipping-name">
                  {fetchDatas.shipTo.name.toUpperCase()}
                </h1>
                {fetchDatas.customerEmail}
                <br />
                {fetchDatas.shipTo.company
                  ? [
                      fetchDatas.shipTo.company,
                      <br key={fetchDatas.orderNumber} />
                    ]
                  : ""}
                {fetchDatas.shipTo.street1}
                <br />
                {fetchDatas.shipTo.street2
                  ? [
                      fetchDatas.shipTo.street2,
                      <br key={fetchDatas.orderNumber} />
                    ]
                  : ""}
                {fetchDatas.shipTo.city}, {fetchDatas.shipTo.state}{" "}
                {fetchDatas.shipTo.postalCode}
                <br />
              </div>
              <div className="col-5">
                <strong>{getTotal(fetchDatas.shipmentItems)}</strong> Items
                <br />
                Order <strong>#{fetchDatas.orderNumber}</strong>
                <br />
                Ordered
                <strong>
                  {" "}
                  {formatDate(
                    fetchDatas.createDate,
                    fetchDatas.advancedOptions.storeId
                  )}
                </strong>
                <br />
                Shipped{" "}
                <strong>
                  {" "}
                  {formatDate(
                    fetchDatas.shipDate,
                    fetchDatas.advancedOptions.storeId
                  )}
                </strong>
                <br />
                <small>
                  {bg ? calculateTime(bg.date_created, bg.date_shipped) : ""}
                </small>
              </div>
            </div>
            <div
              className="ui divider"
              style={{
                margin: "0.15in auto",
                borderColor: "#999",
                borderTop: "1px solid transparent"
              }}
            />
            <table
              className="ui very basic table"
              style={{
                borderColor: "#999",
                borderLeft: "none",
                borderRight: "none"
              }}
            >
              <thead>
                <tr>
                  <th className="border-top">
                    <strong>Product</strong>
                  </th>
                  <th className="text-center border-top">
                    <strong>Price</strong>
                  </th>
                  <th className="text-center border-top">
                    <strong>#</strong>
                  </th>
                  <th className="border-top">
                    <strong>Total</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                {renderOrder(fetchDatas.shipmentItems)}
                {fetchDatas.couponInfo
                  ? renderCoupon(fetchDatas.couponInfo)
                  : renderCoupon([])}
              </tbody>
              <tfoot>
                <tr>
                  <th
                    className="text-right"
                    colSpan="3"
                    style={{
                      textAlign: "right",
                      padding: ".78571429em .78571429em 0 0"
                    }}
                  >
                    <strong>Subtotal</strong>
                  </th>
                  <th
                    style={{ padding: ".78571429em .78571429em 0 .78571429em" }}
                  >
                    ${calculateTotal(fetchDatas.shipmentItems)}
                  </th>
                </tr>
                <tr>
                  <th
                    className="text-right"
                    colSpan="3"
                    style={{
                      textAlign: "right",
                      padding: "0 .78571429em",
                      borderTop: "none"
                    }}
                  >
                    <strong>Shipping</strong>
                  </th>
                  <th style={{ padding: "0 .78571429em", borderTop: "none" }}>
                    $
                    {fetchDatas.shippingAmount
                      ? parseFloat(fetchDatas.shippingAmount).toFixed(2)
                      : 0.0}
                  </th>
                </tr>
                <tr>
                  <th
                    className="text-right"
                    colSpan="3"
                    style={{ textAlign: "right", borderTop: "none" }}
                  >
                    <strong>Total</strong>
                  </th>
                  <th style={{ borderTop: "none" }}>
                    $
                    {calculateTotal(
                      fetchDatas.shipmentItems,
                      fetch.shippingAmount
                        ? parseFloat(fetchDatas.shippingAmount).toFixed(2)
                        : 0,
                      0.0,
                      fetchDatas.couponInfo ? fetchDatas.couponInfo : 0
                    )}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="packing-slip">
          <Link to="/" className="noprint">
            Go Back
          </Link>
          <div className="row header pad-top">
            <div className="col-4 text-center">
              <img
                src={
                  fetchDatas.advancedOptions.storeId === (135943 || 135942)
                    ? logo
                    : oswlogo
                }
                className="img-fluid"
                alt="logo"
              />
              <br />
              <i>"Healthy Starts from Day One."</i>
            </div>
            <div
              className="col-2 offset-6"
              style={{
                textAlign: "center",
                zIndex: "999",
                color: "#000!important",
                fontSize: "1.75em"
              }}
            >
              <br />
              <strong>
                {fetchDatas.orderCount > 3 ? (
                  <p>&#8212;</p>
                ) : (
                  fetchDatas.orderCount
                )}
              </strong>
              <br />
              {fetchDatas.carrierCode === "fedex"
                ? ["FDX", <br key={fetchDatas.orderNumber} />]
                : ""}
              {getCarrier(fetchDatas.carrierCode, fetchDatas.packageCode)}
              {calculateBox(fetchDatas.dimensions)}
            </div>
          </div>
          <div className="ui divider shipping-info" />
          <div className="row details">
            <div className="col-7">
              <h1 className="shipping-name">
                {fetchDatas.shipTo.name.toUpperCase()}
              </h1>
              Customer <strong>{bg ? bg.customer_id : ""}</strong>
              <br />
              {fetchDatas.customerEmail}
              <br />
              {fetchDatas.shipTo.company
                ? [
                    fetchDatas.shipTo.company,
                    <br key={fetchDatas.orderNumber} />
                  ]
                : ""}
              {fetchDatas.shipTo.street1}
              <br />
              {fetchDatas.shipTo.street2
                ? [
                    fetchDatas.shipTo.street2,
                    <br key={fetchDatas.orderNumber} />
                  ]
                : ""}
              {fetchDatas.shipTo.city}, {fetchDatas.shipTo.state}{" "}
              {fetchDatas.shipTo.postalCode}
              <br />
            </div>
            <div className="col-5">
              <strong>{getTotal(fetchDatas.shipmentItems)}</strong> Total Items
              <br />
              Order <strong>#{fetchDatas.orderNumber}</strong>
              <br />
              Batch <strong>#{fetchDatas.batchNumber}</strong>
              <br />
              Order placed on the{" "}
              <strong>
                {bg
                  ? formatDate(bg.date_created)
                  : formatDate(fetchDatas.createDate)}
              </strong>
              <br />
              Shipped on the{" "}
              <strong>
                {bg
                  ? formatDate(bg.date_shipped)
                  : formatDate(fetchDatas.shipDate)}
              </strong>
              <br />
              <small>
                {bg ? calculateTime(bg.date_created, bg.date_shipped) : ""}
              </small>
            </div>
          </div>
          <div
            className="ui divider"
            style={{
              margin: "0.15in auto",
              borderColor: "#999",
              borderTop: "1px solid transparent"
            }}
          />
          <table
            className="ui very basic table"
            style={{
              borderColor: "#999",
              borderLeft: "none",
              borderRight: "none"
            }}
          >
            <thead>
              <tr>
                <th className="border-top">
                  <strong>Product</strong>
                </th>
                <th className="text-center border-top">
                  <strong>Price</strong>
                </th>
                <th className="text-center border-top">
                  <strong>#</strong>
                </th>
                <th className="border-top">
                  <strong>Total</strong>
                </th>
              </tr>
            </thead>
            <tbody>
              {renderOrder(fetchDatas.shipmentItems)}
              {fetchDatas.couponInfo
                ? renderCoupon(fetchDatas.couponInfo)
                : renderCoupon([])}
            </tbody>
            <tfoot>
              <tr>
                <th
                  className="text-right"
                  colSpan="3"
                  style={{
                    textAlign: "right",
                    padding: ".78571429em .78571429em 0 0"
                  }}
                >
                  <strong>Subtotal</strong>
                </th>
                <th
                  style={{ padding: ".78571429em .78571429em 0 .78571429em" }}
                >
                  ${calculateTotal(fetchDatas.shipmentItems)}
                </th>
              </tr>
              {fetchDatas.bigCommerce.customer_message ? (
                <tr>
                  <th
                    colSpan="3"
                    style={{ padding: "0 .78571429em", borderTop: "none" }}
                  >
                    <strong>Customer Message:</strong>
                    <br />
                    {fetchDatas.bigCommerce.customer_message}
                  </th>
                </tr>
              ) : null}
              {note ? (
                <tr>
                  <th
                    colSpan="2"
                    style={{ padding: "0 5.78571429em 0 .78571429em", borderTop: "none" }}
                  >
                    <strong>Note To Buyer:</strong>
                    <br />
                    Due to warehouse inventory differences, this order is being
                    split. The remainder of your order will arrive in a separate
                    package from USPS. We apologize for any inconveniences.
                  </th>
                </tr>
              ) : null}
              <tr>
                <th
                  className="text-right"
                  colSpan="3"
                  style={{
                    textAlign: "right",
                    padding: "0 .78571429em",
                    borderTop: "none"
                  }}
                >
                  <strong>Shipping</strong>
                </th>
                <th style={{ padding: "0 .78571429em", borderTop: "none" }}>
                  $
                  {bg
                    ? parseFloat(bg.shipping_cost_inc_tax).toFixed(2)
                    : fetchDatas.shippingAmount
                    ? parseFloat(fetchDatas.shippingAmount).toFixed(2)
                    : 0.0}
                </th>
              </tr>
              <tr>
                <th
                  className="text-right"
                  colSpan="3"
                  style={{
                    textAlign: "right",
                    padding: "0 .78571429em",
                    borderTop: "none"
                  }}
                >
                  <strong>Credit / Certificate</strong>
                </th>
                <th style={{ padding: "0 .78571429em", borderTop: "none" }}>
                  $-
                  {bg ? parseFloat(bg.store_credit_amount).toFixed(2) : 0.0}
                </th>
              </tr>
              <tr>
                <th
                  className="text-right"
                  colSpan="3"
                  style={{ textAlign: "right", borderTop: "none" }}
                >
                  <strong>Total</strong>
                </th>
                <th style={{ borderTop: "none" }}>
                  $
                  {calculateTotal(
                    fetchDatas.shipmentItems,
                    bg
                      ? parseFloat(bg.shipping_cost_inc_tax)
                      : fetchDatas.shippingAmount
                      ? parseFloat(fetchDatas.shippingAmount).toFixed(2)
                      : 0.0,
                    bg ? bg.store_credit_amount : 0.0,
                    fetchDatas.couponInfo ? fetchDatas.couponInfo : 0
                  )}
                </th>
              </tr>
            </tfoot>
          </table>
          <table
            className="ui two column table text-center"
            style={{
              textAlign: "center",
              margin: "0.15in auto",
              borderColor: "#999",
              borderLeft: "none",
              borderRight: "none"
            }}
          >
            <tbody>
              <tr>
                <td
                  className="align-middle"
                  style={{ borderRight: "1px solid #999" }}
                >
                  <h4 style={{ margin: "0" }}>Order Questions?</h4>
                  <u>Email us</u> at support@organicstart.com.
                </td>
                <td className="align-middle">
                  <h5 style={{ margin: "0" }}>
                    Translated instructions, ingredients & nutrition labels at
                    OrganicStart.com.
                  </h5>
                </td>
              </tr>
            </tbody>
          </table>
          <table
            className="ui column table text-center"
            style={{
              textAlign: "center",
              margin: "0.15in auto",
              borderColor: "#999",
              border: "none",
              borderLeft: "none",
              borderRight: "none"
            }}
          >
            <tbody>
              <tr>
                <td>
                  <img
                    src={iconQuotes[picker].icon}
                    style={{
                      float: "left",
                      maxWidth: "0.75in",
                      height: "auto"
                    }}
                    alt="icon"
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                  <h3 className="ui header">
                    Prepared by {iconQuotes[picker].name}
                  </h3>
                  <div className="sub header" style={{ color: "#000" }}>
                    "{iconQuotes[picker].quote}"
                  </div>
                </td>
                <td>
                  <img
                    src={iconQuotes[shipper].icon}
                    style={{
                      float: "left",
                      maxWidth: "0.75in",
                      height: "auto"
                    }}
                    alt="icon"
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                  <h3 className="ui header">
                    Prepared by {iconQuotes[shipper].name}
                  </h3>
                  <div className="sub header" style={{ color: "#000" }}>
                    "{iconQuotes[shipper].quote}"
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
const getCarrier = (carrier, boxPackage) => {
  if (carrier && boxPackage) {
    return packages[carrier][boxPackage].NAME;
  }
  return "";
};

const calculateTime = (startDate, endDate) => {
  let date1 = moment(startDate);
  let date2 = moment(endDate);
  let hours = date2.diff(date1, "Hours");
  let mins = moment
    .utc(moment(endDate, "HH:mm:ss").diff(moment(startDate, "HH:mm:ss")))
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

const formatDate = (string, storeId = null) => {
  const date = moment.utc(string);
  return storeId === 201185
    ? date.format(" MM/DD/YYYY")
    : date.format("Do MMMM YYYY");
};

const calculateTotal = (items, shipping = 0, discount = 0, coupon = 0) => {
  let subTotal = 0;
  let totalCoupon = 0;
  if (coupon.length >= 1) {
    coupon.map(x => (totalCoupon += x.discount));
  }
  for (let sub in items) {
    subTotal += items[sub].unitPrice * items[sub].quantity;
  }
  return (subTotal + shipping - discount - totalCoupon).toFixed(2);
};

const renderCoupon = coupons => {
  if (coupons) {
    let name = "";
    return coupons.map(coupon => {
      switch (coupon.code) {
        case "gift":
          name = "*** FREE GIFT ***";
          break;
        case "new":
          name = "FREE BOOKLET";
          break;
        default:
          name = "Discount";
          break;
      }
      return (
        <tr key={coupon.coupon_id}>
          <td>{name}</td>
          <td className="text-center">
            $
            {coupon.discount
              ? `-${parseFloat(coupon.discount).toFixed(2)}`
              : "0.00"}
          </td>
          <td className="text-center">1</td>
          <td>
            $
            {coupon.discount
              ? `-${parseFloat(coupon.discount).toFixed(2)}`
              : "0.00"}
          </td>
        </tr>
      );
    });
  }
  return null;
};

const renderOrder = items => {
  return items.map(item => {
    return (
      <tr key={item.orderItemId}>
        <td>{item.name}</td>
        <td className="text-center">${item.unitPrice}</td>
        <td className="text-center">{item.quantity}</td>
        <td>${(item.unitPrice * item.quantity).toFixed(2)}</td>
      </tr>
    );
  });
};

function mapStateToProps({ authState, batchState }) {
  return {
    displayName: authState.displayName,
    warehouseLocation: authState.warehouseLocation,
    email: authState.email,
    picker: batchState.picker,
    shipper: batchState.shipper,
    totalCount: batchState.totalCount,
    fetchDatas: batchState.fetchDatas,
    orderNumber: batchState.orderNumber,
    shipmentItems: batchState.shipmentItems,
    loading: batchState.loading,
    note: batchState.note
  };
}

export default connect(
  mapStateToProps,
  null
)(FetchDetail);
