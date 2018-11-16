import React from "react";

const FraudDetail = props => {
 return(
     renderDetails(props)
 )
};


const renderDetails = (props) => {
    if(!props.error || (props.error).length === 0 ){
        return "";
    }

    return (
        <div className="ui segments" style={{ margin: "2rem 0" }}>
          <div
            className={`ui inverted segment { DATA.errors|length > 1 ? 'red' : ('STATES' in DATA.errors or 'POSTALCODES' in DATA.errors or 'COUNTRIES' in DATA.errors ? 'red' : ('EMAIL' in DATA.errors ? 'orange' : 'yellow')) `}
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
          <div className="ui inverted segment secondary { DATA.errors|length > 1 ? 'red' : ('STATES' in DATA.errors or 'POSTALCODES' in DATA.errors or 'COUNTRIES' in DATA.errors ? 'red' : ('EMAIL' in DATA.errors ? 'orange' : 'yellow')) }">
            <h2 className="ui h2">{props.orderNumber}</h2>
          </div>
        </div>
      );
   
}

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
