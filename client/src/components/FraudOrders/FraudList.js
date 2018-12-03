import React, { Component } from "react";
import FraudDetail from "./FraudDetail";
import { Link } from "react-router-dom";
import axios from "axios";

class FraudList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: props.location.state.detail.fraudDatas.map(element => false),
      saveFraud: props.location.state.detail.savedData
    };
  }

  toggleMenu(index) {
    const newToggleStatus = [...this.state.toggle];
    newToggleStatus[index] = !this.state.toggle[index];
    this.setState({ toggle: newToggleStatus });
  }

  componentDidMount() {
    const { fraudDatas } = this.props.location.state.detail;
    let saved = [];
    fraudDatas.map(data => {
      if (checkError(data)) {
        return saved.push(data);
      }
      return null;
    });

    axios
      .post("/fraud/writefraudtofile", {
        saved: saved
      })
      .then(response => {
        if (response.data.msg === "success") {
          console.log("logged");
        } else if (response.data.msg === "fail") {
          console.log("failed to log.");
        }
      });
  }

  renderFraudList = props => {
    const { fraudDatas } = props.location.state.detail;

    return fraudDatas.map((data, index) => {
      return (
        <FraudDetail
          key={data.id}
          orderID={data.id}
          count={data.orderCount}
          error={checkError(data)}
          orderNumber={data.id}
          email={data.billing_address.email}
          billingName={`${data.billing_address.first_name} ${
            data.billing_address.last_name
          }`}
          billingStreet1={data.billing_address.street_1}
          billingStreet2={data.billing_address.street_2}
          billingCity={data.billing_address.city}
          billingState={data.billing_address.state}
          billingZip={data.billing_address.zip}
          billingCompany={data.billing_address.company}
          billingCountry={data.billing_address.country}
          billingPhone={data.billing_address.phone.replace(
            /(\d{3})(\d{3})(\d{4})/,
            "$1-$2-$3"
          )}
          shippingName={`${data.shippingInfo[0].first_name} ${
            data.shippingInfo[0].last_name
          }`}
          shippingStreet1={data.shippingInfo[0].street_1}
          shippingStreet2={data.shippingInfo[0].street_2}
          shippingCity={data.shippingInfo[0].city}
          shippingState={data.shippingInfo[0].state}
          shippingZip={data.shippingInfo[0].zip}
          shippingCompany={data.shippingInfo[0].company}
          shippingCountry={data.shippingInfo[0].country}
          shippingPhone={data.shippingInfo[0].phone.replace(
            /(\d{3})(\d{3})(\d{4})/,
            "$1-$2-$3"
          )}
          show={this.state.toggle[index]}
          index={index}
          handleClick={this.toggleMenu.bind(this)}
        />
      );
    });
  };

  render() {
    return (
      <div className="container">
        <Link to="/" className="noprint">
          Go Back
        </Link>
        {this.renderFraudList(this.props)}
      </div>
    );
  }
}

const checkError = data => {
  if (data.status.toLowerCase() === "incomplete") {
    return null;
  }
  let errors = [];
  if (data.orderCount < 4) {
    const emailArray = [
      "gmail.com",
      "icloud.com",
      "me.com",
      "msn.com",
      "mac.com",
      "mail.com",
      "earthlink.net",
      "hotmail.com",
      "live.com",
      "yahoo.com",
      "ymail.com",
      "aol.com",
      "outlook.com",
      "yahoo.es",
      "sbcglobal.net",
      "naver.com",
      "att.net"
    ];
    let emailEnding = data.billing_address.email.split("@")[1];
    if (!emailArray.includes(emailEnding.toLowerCase())) {
      errors.push("email");
    }
    if (
      data.shippingInfo[0].city
        .toLowerCase()
        .replace(/^[.\s]+|[.\s]+$/g, "") !==
      data.billing_address.city.toLowerCase().replace(/^[.\s]+|[.\s]+$/g, "")
    ) {
      errors.push("cities");
    }
    if (data.shippingInfo[0].state !== data.billing_address.state) {
      errors.push("states");
    }
    if (
      data.shippingInfo[0].zip.substring(0, 5) !==
      data.billing_address.zip.substring(0, 5)
    ) {
      errors.push("postalcodes");
    }
    if (data.shippingInfo[0].country !== data.billing_address.country) {
      errors.push("countries");
    }
    if (errors.length > 0) return errors;
    return null;
  }
};

export default FraudList;
