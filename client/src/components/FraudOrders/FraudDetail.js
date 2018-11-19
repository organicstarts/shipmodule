import React from "react";
import { Button } from "semantic-ui-react";

const FraudDetail = props => {
  return renderDetails(props);
};

const renderDetails = props => {
  if (!props.error || props.error.length === 0) {
    return "";
  }

  return (
    <div className="ui segments" style={{ margin: "2rem 0" }}>
      <div
        className={`ui inverted segment ${renderClassName(props.error)} `}
        onClick={() => props.handleClick(props.index)}
      >
        <p className="lead">
          <br />
          {renderEmail(props)}
          <br />
          <br />
          {renderCities(props)}
          <br />
          <br />
          {renderStates(props)}
          <br />
          <br />
          {renderZip(props)}
          <br />
          <br />
          {renderCountry(props)}
          <br />
        </p>
      </div>
      {props.show && (
        <div className="ui inverted segment secondary row">
          <div className="col-12 center">
            <h1>Order Count: {props.count}</h1>
            <br />
          </div>
          {renderCustomerInfo(
            props.orderID,
            "Shipping",
            props.shippingName,
            props.shippingPhone,
            props.email,
            props.shippingStreet1,
            props.shippingStreet2,
            props.shippingCity,
            props.shippingState,
            props.shippingZip,
            props.shippingCountry,
            props.shippingCompany
          )}
          {renderCustomerInfo(
            props.orderID,
            "Billing",
            props.billingName,
            props.billingPhone,
            props.email,
            props.billingStreet1,
            props.billingStreet2,
            props.billingCity,
            props.billingState,
            props.billingZip,
            props.billingCountry,
            props.billingCompany
          )}
          <div
            className="col-12"
            style={{ textAlign: "center", marginTop: "25px" }}
          >
            <Button
              size="large"
              color="olive"
              onClick={() =>
                window.open(
                  `https://organicstart.com/manage/orders?viewId=${
                    props.orderNumber
                  }&orderTo=${props.orderNumber}&orderFrom=${props.orderNumber}`
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
      </div>
    </div>
  );
};

const renderCustomerInfo = (
  orderID,
  type,
  name,
  phone,
  email,
  street1,
  street2,
  city,
  state,
  zip,
  country,
  company
) => {
  return (
    <div className="col-6">
      <h2>{type}</h2>
      {name} <br />
      {`phone: ${phone} | email: ${email}`}
      <br />
      {company ? [company, <br key={orderID} />] : ""}
      {street1}
      <br />
      {street2 ? [street2, <br key={orderID} />] : ""}
      {city}, {state} {zip}, {country}
      <br />
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
  for (let i in props.error) {
    if (props.error[i] === "email") {
      return (
        <span>
          <strong>WEIRD EMAIL</strong>
          <br />
          Email: {props.email}
          <br />
        </span>
      );
    }
  }
};
const renderCities = props => {
  for (let i in props.error) {
    if (props.error[i] === "cities") {
      return (
        <span>
          <strong>WEIRD CITIES</strong>
          <br />
          Billing: {props.billingCity}
          <br />
          Shipping: {props.shippingCity}
          <br />
          {/* Order IP: { bigcommerce.ip_address} ({ DATA.orderGeo.city })<br/>
                    Registration IP: { DATA.customer.registration_ip_address} ({ DATA.registrationGeo.city })<br/> */}
        </span>
      );
    }
  }
};
const renderStates = props => {
  for (let i in props.error) {
    if (props.error[i] === "states") {
      return (
        <span>
          <strong>DIFFERENT STATES</strong>
          <br />
          Billing: {props.billingState}
          <br />
          Shipping: {props.shippingState}
          <br />
        </span>
      );
    }
  }
};
const renderZip = props => {
  for (let i in props.error) {
    if (props.error[i] === "postalcodes") {
      return (
        <span>
          <strong>DIFFERENT POSTAL CODE</strong>
          <br />
          Billing: {props.billingZip}
          <br />
          Shipping: {props.shippingZip}
          <br />
        </span>
      );
    }
  }
};
const renderCountry = props => {
  for (let i in props.error) {
    if (props.error[i] === "countires") {
      return (
        <span>
          {" "}
          <strong>DIFFERENT BILLING / SHIPPING COUNTRY</strong>
          <br />
          Billing: {props.billingCountry}
          <br />
          Shipping: {props.shippingCountry}
          <br />
        </span>
      );
    }
  }
};

export default FraudDetail;
