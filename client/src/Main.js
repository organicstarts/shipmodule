import React, { Component } from "react";
import { connect } from "react-redux";
import { login, logout, checkLoginState } from "./actions/auth";
import { Image } from "semantic-ui-react";
import logo from "./logo.svg";
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
import { Button } from "semantic-ui-react";
import "tachyons";
import Scanning from "./components/InventorySystem/Scanning";

class Main extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      error: false
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.renderHome = this.renderHome.bind(this);
  }

  login() {
    this.props.login();
  }

  logout() {
    this.props.logout();
  }

  componentDidMount() {
    this.props.checkLoginState();
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
    if (this.state.loading) {
      return (
        <ClipLoader
          sizeUnit={"px"}
          size={54}
          color={"#36D7B7"}
          loading={this.state.loading}
        />
      );
    }
    return (
      <div>
        {this.props.user ? (
          <div>
            <MediaQuery minDeviceWidth={374}>
              <BatchOrders
                displayName={this.props.displayName}
                email={this.props.user.email}
              />
              <FetchOrder displayName={this.props.displayName} />
              <FraudOrders displayName={this.props.displayName} />
              <Inventory
                displayName={this.props.displayName}
                email={this.props.user.email}
                compareEmail={this.compareEmail}
              />
            </MediaQuery>
            <Scanning
              displayName={this.props.displayName}
              email={this.props.user.email}
            />

            {this.compareEmail(this.props.user.email) ? <Log /> : ""}
            <Button
              style={{ marginTop: "25px" }}
              fluid
              size="large"
              color="green"
              onClick={this.logout}
            >
              Log Out
            </Button>
          </div>
        ) : (
          <div>
            {this.state.error ? (
              <h1 className="red"> You don't belong here fool!</h1>
            ) : (
              ""
            )}
            <Button fluid size="large" color="green" onClick={this.login}>
              Log In
            </Button>
          </div>
        )}
      </div>
    );
  }
  render() {
    return (
      <div className="App container tc" style={{ margin: "50px auto" }}>
        <header style={{ marginBottom: "50px" }}>
          <MediaQuery minDeviceWidth={374}>
            {matches => {
              if (matches) {
                return (
                  <Image
                    src={logo}
                    size="medium"
                    centered
                    alt="Organic Start"
                  />
                );
              } else {
                return (
                  <Image src={logo} size="small" centered alt="Organic Start" />
                );
              }
            }}
          </MediaQuery>
        </header>
        {this.renderHome()}
      </div>
    );
  }
}

function mapStateToProps({ authState }) {
  return {
    user: authState.user,
    displayName: authState.displayName,
    email: authState.email
  };
}

export default connect(
  mapStateToProps,
  { login, logout, checkLoginState }
)(withRouter(Main));
