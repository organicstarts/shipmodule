import React from "react";
import { Button, Checkbox } from "semantic-ui-react";

const FraudDetail = props => {
  return renderDetails(props);
};

const renderDetails = props => {
  if (!props.error || props.error.length === 0) {
    return "";
  }

  return (
    <div className="ui segments " style={{ margin: "2rem 0" }}>
      <div
        className={`ui inverted segment ${renderClassName(props.error)} `}
        onClick={() => props.handleClick(props.index)}
        style={{ cursor: "pointer" }}
      >
        <p className="lead">
          <br />
          {renderEmail(props)}
          <br />
        </p>
      </div>
      {props.show && (
        <div className="ui inverted segment secondary row">
          <div className="col-12 center">
            <h1>
              Order Count: {props.count} <br />
              Email: {props.email}
            </h1>
          </div>
          <div className="col-lg-6 col-sm-12">
            <h2 style={{ marginTop: "25px" }}>Shipping</h2>
            {renderCustomerShippingInfo(props.orderID, props.shipping)}
          </div>
          <div className="col-lg-6 col-sm-12">
            <h2 style={{ marginTop: "25px" }}>Billing</h2>
            {renderCustomerInfo(
              props.orderID,
              props.billingName,
              props.billingPhone,
              props.billingStreet1,
              props.billingStreet2,
              props.billingCity,
              props.billingState,
              props.billingZip,
              props.billingCountry,
              props.billingCompany
            )}
          </div>
          <div
            className="col-lg-12"
            style={{ textAlign: "center", marginTop: "25px" }}
          >
            <Button
              size="large"
              color="olive"
              onClick={() =>
                window.open(
                  `https://organicstart.com/manage/orders?viewId=0&page=1&keywords=${
                    props.email
                  }&sortField=id&sortOrder=desc`
                )
              }
            >
              Check BigCommmerce
            </Button>
          </div>
        </div>
      )}
      <div
        className={`ui inverted segment secondary ${renderClassName(
          props.error
        )}`}
      >
        <h2 className="ui h2">Order #: {props.orderNumber}</h2>
        <h3 className="ui">Status: {props.status}</h3>
        <h3 className="ui">Order Placed: {props.createdAt}</h3>
        <h3 className="ui">Fraud Search Time Stamp: {props.timeStamp}</h3>
        <label>Fraud Order Checked:</label>
        <Checkbox
          style={{ marginLeft: "5px" }}
          type="checkbox"
          checked={props.checked}
          onChange={() => props.handleStatus(props, props.index)}
        />
      </div>
    </div>
  );
};

const renderCustomerShippingInfo = (orderID, shipping) => {
  return shipping.map(data => {
    return (
      <div key={data.street_1} style={{ marginTop: "25px" }}>
        {data.first_name} {data.last_name} <br />
        {data.company ? [data.company, <br key={orderID} />] : ""}
        {data.street_1}
        <br />
        {data.street_2 ? [data.street_2, <br key={orderID} />] : ""}
        {data.city}, {data.state} {data.zip} <br />
        {data.country}
        <br />
        phone: {data.phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")} <br />
      </div>
    );
  });
};

const renderCustomerInfo = (
  orderID,
  name,
  phone,
  street1,
  street2,
  city,
  state,
  zip,
  country,
  company
) => {
  return (
    <div style={{ marginTop: "25px" }}>
      {name} <br />
      {company ? [company, <br key={orderID} />] : ""}
      {street1}
      <br />
      {street2 ? [street2, <br key={orderID} />] : ""}
      {city}, {state} {zip}, <br />
      {country}
      <br />
      phone: {phone} <br />
    </div>
  );
};
const renderClassName = error => {
  let classString = "";
  if (error.length > 1) {
    classString = "red";
  } else if (
    error.includes("state") ||
    error.includes("postalcodes") ||
    error.includes("contries")
  ) {
    classString = "red";
  } else if (error.includes("email")) {
    classString = "orange";
  } else {
    classString = "yellow";
  }

  return classString;
};

const renderEmail = props => {
  let render = [];
  for (let i in props.error) {
    if (props.error[i] === "email") {
      render.push(
        <span key={i}>
          <strong>WEIRD EMAIL</strong>
          <br />
          Email: {props.email}
          <br />
          <br />
        </span>
      );
    }
    if (props.error[i] === "cities") {
      render.push(
        detail("WEIRD CITIES", props.billingCity, props.shippingCity, i)
      );
    }
    if (props.error[i] === "states") {
      render.push(
        detail("DIFFERENT STATE", props.billingState, props.shippingState, i)
      );
    }
    if (props.error[i] === "postalcodes") {
      render.push(
        detail("DIFFERENT POSTAL CODE", props.billingZip, props.shippingZip, i)
      );
    }
    if (props.error[i] === "countires") {
      render.push(
        detail(
          "DIFFERENT BILLING / SHIPPING COUNTRY",
          props.billingCountry,
          props.shippingCountry,
          i
        )
      );
    }
  }

  return render;
};

const detail = (type, billing, shipping, i) => {
  return (
    <span key={i}>
      <strong>{type}</strong>
      <br />
      Billing: {billing}
      <br />
      Shipping: {shipping}
      <br />
      <br />
    </span>
  );
};

export default FraudDetail;
