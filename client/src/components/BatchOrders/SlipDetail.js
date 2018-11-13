import React from "react";
import logo from "../../images/logo.jpg";
import "./slipdetail.css";

const SlipDetail = props => {
  return (
    <div className="packing-slip">
      <div className="row header pad-top">
        <div className="col-4 text-center">
          <img src={logo} className="img-fluid" alt="logo" />
          <br />
          <i>"Healthy Starts from Day One."</i>
        </div>
        <div
          className="col-2 offset-6 text-center"
          style={{ zIndex: "999", color: "#000!important", fontSize: "1.75em" }}
        >
          <br />
          <strong>1</strong>
          <br />
          {props.box}
        </div>
      </div>
      <div className="ui divider shipping-info" />
      <div className="row details">
        <div className="col-7">
          <h1 className="shipping-name">{props.name.toUpperCase()}</h1>
          Customer <strong>{props.customerId}</strong>
          <br />
          {props.email}
          <br />
          {props.company ? [props.company, <br key={props.orderID} />] : ""}
          {props.street1}
          <br />
          {props.street2 ? [props.street2, <br key={props.orderID} />] : ""}
          {props.city}, {props.state} {props.zip}
          <br />
        </div>
        <div className="col-5">
          <strong>{props.total}</strong> Total Items
          <br />
          Order <strong>#{props.orderID}</strong>
          <br />
          Batch <strong>#{props.batchNumber}</strong>
          <br />
          Order placed on the <strong>{props.created}</strong><br />
          Shipped on the <strong>{props.shipDate}</strong><br />
          <small>about {props.shipDuration} hours after you ordered. Yeah that was fast ;)</small>
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
        style={{ borderColor: "#999", borderLeft: "none", borderRight: "none" }}
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
        <tbody>{renderOrder(props.shipmentInfo)}</tbody>
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
            <th style={{ padding: ".78571429em .78571429em 0 .78571429em" }}>
              ${calculateTotal(props.shipmentInfo)}
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
              ${parseFloat(props.shipmentCost).toFixed(2)}
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
              $-{parseFloat(props.credit).toFixed(2)}
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
              ${calculateTotal(props.shipmentInfo, props.shipmentCost, props.credit)}
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
    </div>
  );
};

const calculateTotal = (items, shipping = 0, discount = 0) => {
  let subTotal = 0;
  for (let sub in items) {
    subTotal += items[sub].unitPrice * items[sub].quantity;
  }
  return (subTotal + shipping - discount) .toFixed(2);
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

export default SlipDetail;
