import React, { Component } from "react";
import FraudDetail from "./FraudDetail";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import { ClipLoader } from "react-spinners";
import axios from "axios";

class FraudList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: this.props.fraudDatas.map(element => false),
      checked: this.props.fraudDatas.map(element => {
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
      .put("fb/updatefraudtofile", {
        checked: newCheckedStatus[index],
        orderNumber: e.orderNumber
      })
      .then(response => {
        if (response.data.msg === "success") {
          let currentTime = moment().format("dddd, MMMM DD YYYY hh:mma");
          axios
            .post("fb/writetofile", {
              action: newCheckedStatus[index] ? "Fraud Check" : "Fraud UnCheck",
              orderNumber: e.orderNumber,
              user: this.props.displayName,
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
    setTimeout(
      function() {
        const { newDatas } = this.props;
        let saved = [];
        newDatas.map(data => {
          if (checkError(data)) {
            data.timeStamp = moment().format("dddd, MMMM DD YYYY hh:mma");
            return saved.push(data);
          }
          return null;
        });
        console.log(saved);
        axios
          .post("fb/writefraudtofile", {
            saved: saved
          })
          .then(response => {
            if (response.data.msg === "success") {
              console.log("logged");
            } else if (response.data.msg === "fail") {
              console.log("failed to log.");
            }
          });
      }.bind(this),
      3000
    );
  }

  renderFraudList = () => {
    const { fraudDatas } = this.props;
    return fraudDatas
      .map((data, index) => {
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
            shippingCity={data.shippingInfo ? data.shippingInfo[0].city : ""}
            shippingState={data.shippingInfo ? data.shippingInfo[0].state : ""}
            shippingZip={data.shippingInfo ? data.shippingInfo[0].zip : ""}
            show={this.state.toggle[index]}
            index={index}
            handleClick={this.toggleMenu.bind(this)}
            handleStatus={this.checkChange.bind(this)}
            status={data.status}
            checked={
              this.state.checked[index] ? this.state.checked[index] : false
            }
            createdAt={data.date_created ? data.date_created : data.createdAt}
            timeStamp={data.timeStamp ? data.timeStamp : ""}
          />
        );
      })
      .reverse();
  };

  render() {
    if (this.state.loading) {
      return (
        <ClipLoader
          sizeUnit={"px"}
          size={720}
          color={"#36D7B7"}
          loading={this.state.loading}
        />
      );
    }
    return (
      <div className="container">
        <Link to="/">Go Back</Link>
        {this.renderFraudList()}
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
    if (data.shippingInfo) {
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
    }
    if (errors.length > 0) return errors;
    return null;
  }
};

function mapStateToProps({ authState, batchState }) {
  return {
    displayName: authState.displayName,
    fraudDatas: batchState.fraudDatas,
    savedFraud: batchState.savedFraud,
    newDatas: batchState.newDatas,
    loading: batchState.loading
  };
}

export default connect(
  mapStateToProps,
  null
)(FraudList);
