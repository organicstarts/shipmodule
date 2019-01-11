import React, { Component } from "react";
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
import { auth, provider } from "./config/firebaseconf";
import { Button } from "semantic-ui-react";
import "tachyons";

class Main extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      user: null,
      displayName: null,
      error: false
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.renderHome = this.renderHome.bind(this);
  }

  login() {
    this.setState({
      loading: true
    });
    auth.signInWithPopup(provider).then(result => {
      let email = result.additionalUserInfo.profile.hd;
      let isNewUser = result.additionalUserInfo.isNewUser;
      if (!isNewUser || email === "organicstart.com") {
        this.setState({
          user: result.user,
          displayName: result.user.displayName,
          loading: false,
          error: false
        });
      } else {
        result.user.delete().then(x => {
          this.setState({
            user: null,
            loading: false,
            error: true
          });
        });
      }
    });
  }

  logout() {
    auth.signOut().then(() => {
      this.setState({
        user: null
      });
    });
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user, displayName: user.displayName });
      }
    });
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
        {this.state.user ? (
          <div>
            <MediaQuery minDeviceWidth={374}>
              <BatchOrders
                displayName={this.state.displayName}
                email={this.state.user.email}
              />
              <FetchOrder displayName={this.state.displayName} />
              <FraudOrders displayName={this.state.displayName} />
            </MediaQuery>
            <Inventory
              displayName={this.state.displayName}
              email={this.state.user.email}
              compareEmail={this.compareEmail}
            />
            {this.compareEmail(this.state.user.email) ? <Log /> : ""}
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

export default withRouter(Main);
