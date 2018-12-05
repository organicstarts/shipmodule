import React, { Component } from "react";
import FraudDetail from "./FraudDetail";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";

class FraudList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: props.location.state.detail.fraudDatas.map(element => false),
      saveFraud: props.location.state.detail.savedData,
      checked: props.location.state.detail.fraudDatas.map(element => {
        if (element.checked) {
          return element.checked;
        } else {
          return false;
        }
      })
    };
  }

  /*
  toggle click to show details in FraudDetails 
  */
  toggleMenu(index) {
    const newToggleStatus = [...this.state.toggle];
    newToggleStatus[index] = !this.state.toggle[index];
    this.setState({ toggle: newToggleStatus });
  }

  /*
  toggle boolean for true or false when chacke box is ticked.
  update fraud/log/[ordernumber]/checked: true/false
  save to admin log  
  */
  checkChange(e, index) {
    const newCheckedStatus = [...this.state.checked];
    newCheckedStatus[index] = !this.state.checked[index];
    this.setState({ checked: newCheckedStatus });
    axios
      .put("fraud/updatefraudtofile", {
        checked: newCheckedStatus[index],
        orderNumber: e.orderNumber
      })
      .then(response => {
        if (response.data.msg === "success") {
          let currentTime = moment().format("dddd, MMMM DD YYYY hh:mma");
          axios
            .post("/writetofile", {
              action: newCheckedStatus[index] ? "Fraud Check" : "Fraud UnCheck",
              orderNumber: e.orderNumber,
              user: this.props.location.state.detail.displayName,
              currentTime
            })
            .then(response => {
              if (response.data.msg === "success") {
                console.log("logged");
              } else if (response.data.msg === "fail") {
                console.log("failed to log.");
              }
            });
        } else if (response.data.msg === "fail") {
          console.log("failed to log.");
        }
      });
  }

  /*
  Save order numbers that came up with possible fraud errors to fraud/log firebase
  */
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
      if (data.shippingInfo.length > 1) console.log(data);
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
          shipping={data.shippingInfo}
          shippingCity={data.shippingInfo[0].city}
          shippingState={data.shippingInfo[0].state}
          shippingZip={data.shippingInfo[0].zip}
          show={this.state.toggle[index]}
          index={index}
          handleClick={this.toggleMenu.bind(this)}
          handleStatus={this.checkChange.bind(this)}
          status={data.status}
          checked={
            this.state.checked[index] ? this.state.checked[index] : false
          }
        />
      );
    });
  };

  render() {
    return (
      <div className="container">
        <Link to="/">Go Back</Link>
        {this.renderFraudList(this.props)}
      </div>
    );
  }
}

/*
check data to see if there are any possible fraud orders
compare email, address, city, state, zip, countries for shipping and billing
*/
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
