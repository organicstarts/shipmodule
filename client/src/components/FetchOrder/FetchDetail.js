import React, { Component } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import logo from "../../images/logo.jpg";
import "./fetchdetail.css";
import boxes from "../../config/boxes";
import packages from "../../config/packages";
import { iconQuotes } from "../../config/peopleicon";
import axios from "axios";

class FetchDetail extends Component {
  constructor() {
    super();
    this.logprint = this.logprint.bind(this);
  }
  componentDidMount() {
    window.addEventListener("afterprint", this.logprint);
  }

  componentWillUnmount() {
    window.removeEventListener("afterprint", this.logprint);
  }

  logprint() {
    let currentTime = moment().format("dddd, MMMM DD YYYY hh:mma");
    axios
      .post("/writetofile", {
        action: "Print",
        orderNumber: this.props.location.state.detail.orderNumber,
        user: this.props.location.state.detail.user,
        picker: this.props.location.state.detail.picker,
        shipper: this.props.location.state.detail.shipper,
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
    const { fetchData, picker, shipper } = this.props.location.state.detail;
    console.log(fetchData)
    return (
      <div>
        <Link to="/" className="noprint">
          Go Back
        </Link>
        <div className="packing-slip">
          <div className="row header pad-top">
            <div className="col-4 text-center">
              <img src={logo} className="img-fluid" alt="logo" />
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
                {fetchData.orderCount > 3 ? (
                  <p>&#8212;</p>
                ) : (
                  fetchData.orderCount
                )}
              </strong>
              <br />
              {fetchData.carrierCode === "fedex"
                ? ["FDX", <br key={fetchData.orderNumber} />]
                : ""}
              {getCarrier(fetchData.carrierCode, fetchData.packageCode)}
              {calculateBox(fetchData.dimensions)}
            </div>
          </div>
          <div className="ui divider shipping-info" />
          <div className="row details">
            <div className="col-7">
              <h1 className="shipping-name">
                {fetchData.shipTo.name.toUpperCase()}
              </h1>
              Customer <strong>{fetchData.bigCommerce.customer_id}</strong>
              <br />
              {fetchData.customerEmail}
              <br />
              {fetchData.shipTo.company
                ? [fetchData.shipTo.company, <br key={fetchData.orderNumber} />]
                : ""}
              {fetchData.shipTo.street1}
              <br />
              {fetchData.shipTo.street2
                ? [fetchData.shipTo.street2, <br key={fetchData.orderNumber} />]
                : ""}
              {fetchData.shipTo.city}, {fetchData.shipTo.state}{" "}
              {fetchData.shipTo.postalCode}
              <br />
            </div>
            <div className="col-5">
              <strong>{getTotal(fetchData.shipmentItems)}</strong> Total Items
              <br />
              Order <strong>#{fetchData.orderNumber}</strong>
              <br />
              Batch <strong>#{fetchData.batchNumber}</strong>
              <br />
              Order placed on the{" "}
              <strong>{formatDate(fetchData.bigCommerce.date_created)}</strong>
              <br />
              Shipped on the{" "}
              <strong>{formatDate(fetchData.bigCommerce.date_shipped)}</strong>
              <br />
              <small>
                {calculateTime(
                  fetchData.bigCommerce.date_created,
                  fetchData.bigCommerce.date_shipped
                )}
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
              {renderOrder(fetchData.shipmentItems)}
              {renderCoupon(fetchData.couponInfo)}
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
                  ${calculateTotal(fetchData.shipmentItems)}
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
                  ${parseFloat(fetchData.bigCommerce.shipping_cost_inc_tax).toFixed(2)}
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
                  {parseFloat(
                    fetchData.bigCommerce.store_credit_amount
                  ).toFixed(2)}
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
                    fetchData.shipmentItems,
                    parseFloat(fetchData.bigCommerce.shipping_cost_inc_tax),
                    fetchData.bigCommerce.store_credit_amount,
                    fetchData.couponInfo
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
    return boxes[boxSize].name;
  }
  return "";
};
const getTotal = items => {
  let x = 0;
  items.map(item => (x = x + item.quantity));
  return x;
};

const formatDate = string => {
  const date = moment.utc(string);
  return date.format("Do MMMM YYYY");
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

export default FetchDetail;
