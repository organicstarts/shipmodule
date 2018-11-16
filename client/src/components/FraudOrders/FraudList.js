import React from "react";
import FraudDetail from "./FraudDetail";
import states_hash from '../../config/states_hash';
const FraudList = props => {
  return <div>{renderFraudList(props)}</div>;
};

const renderFraudList = props => {
  const { fraudDatas } = props.location.state.detail;
  return fraudDatas.map(data => {
    console.log(data);

    return (
      <FraudDetail
        key={data.shipmentId}
        error={checkError(data)}
        email={data.customerEmail}
        orderNumber={data.orderNumber}
        billingCity={data.bigCommerce ? data.bigCommerce.billing_address.city : ""}
        billingState={data.bigCommerce ? data.bigCommerce.billing_address.state : ""}
        billingZip={data.bigCommerce ? data.bigCommerce.billing_address.zip : ""}
        billingCountry={data.bigCommerce ? data.bigCommerce.billing_address.country_iso2 : ""}
        shippingCity={data.shipTo.city}
        shippingState={data.shipTo.state}
        shippingZip={data.shipTo.postalCode}
        shippingCountry={data.shipTo.country}
      />
    );
  });
};

const checkError = data => {
  let errors = [];
  if(!data.bigCommerce || !data.bigCommerce.billing_address){
      return null
  }
  if (data.customerEmail !== data.bigCommerce.billing_address.email) {
    errors.push("email");
  }
  if (data.shipTo.city.toLowerCase() !== data.bigCommerce.billing_address.city.toLowerCase()) {
    errors.push("cities");
  }
  if (states_hash[data.shipTo.state] !== data.bigCommerce.billing_address.state) {
    errors.push("states");
  }
  if (data.shipTo.postalCode.substring(0,5) !== data.bigCommerce.billing_address.zip.substring(0,5)) {
    errors.push("postalcodes");
  }
  if (data.shipTo.country !== data.bigCommerce.billing_address.country_iso2) {
    errors.push("countries");
  }
  return errors;
};

export default FraudList;
