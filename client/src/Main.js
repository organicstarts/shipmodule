import React, { Component } from "react";
import { connect } from "react-redux";
import { login, logout, checkLoginState } from "./actions/auth";
import { ClipLoader } from "react-spinners";
import { withRouter } from "react-router-dom";
import MediaQuery from "react-responsive";
import {
  BatchOrders,
  FetchOrder,
  FraudOrders,
  Log,
  Inventory
} from "./components";
import "tachyons";
import Scanning from "./components/InventorySystem/Scanning";

class Main extends Component {
  constructor() {
    super();

    this.logout = this.logout.bind(this);
    this.renderHome = this.renderHome.bind(this);
  }

  logout() {
    this.props.logout();
  }

  compareEmail(email) {
    switch (email) {
      case "yvan@organicstart.com":
      case "peter@organicstart.com":
      case "isaiah@organicstart.com":
        return true;
      default:
        return false;
    }
  }
  renderHome() {
    if (this.props.loading) {
      return (
        <ClipLoader
          sizeUnit={"px"}
          size={54}
          color={"#36D7B7"}
          loading={this.props.loading}
        />
      );
    }
    return (
      <div>
        <MediaQuery minDeviceWidth={374}>
          <BatchOrders />
          <FetchOrder />
          <FraudOrders />
          <Inventory compareEmail={this.compareEmail} />
        </MediaQuery>
        <Scanning />

        <MediaQuery minDeviceWidth={374}>
          {this.compareEmail(this.props.email) ? <Log /> : ""}
        </MediaQuery>
      </div>
    );
  }
  render() {
    return <div>{this.renderHome()}</div>;
  }
}

function mapStateToProps({ authState }) {
  return {
    displayName: authState.displayName,
    email: authState.email,
    loading: authState.loading
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { login, logout, checkLoginState }
  )(Main)
);
