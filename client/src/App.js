import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "./actions/auth";
import Router from "./Router";
import { Image } from "semantic-ui-react";
import logo from "./logo.svg";
import MediaQuery from "react-responsive";

const MINUTES_UNITL_AUTO_LOGOUT = 1; // in mins
const CHECK_INTERVAL = 15000; // in ms
const STORE_KEY = "lastAction";

class App extends Component {
  constructor(props) {
    super(props);
    this.check();
    this.initListener();
    this.initInterval();
  }

  getLastAction() {
    return parseInt(localStorage.getItem(STORE_KEY));
  }

  setLastAction(lastAction) {
    localStorage.setItem(STORE_KEY, lastAction.toString());
  }

  initListener() {
    document.body.addEventListener("click", () => this.reset());
    document.body.addEventListener("mouseover", () => this.reset());
    document.body.addEventListener("mouseout", () => this.reset());
    document.body.addEventListener("keydown", () => this.reset());
    document.body.addEventListener("keyup", () => this.reset());
    document.body.addEventListener("keypress", () => this.reset());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }

  check() {
    const now = Date.now();
    const timeleft =
      this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 15000; //15 min
    const diff = timeleft - now;
    const isTimeout = diff < 0;
    if (isTimeout) {
      this.props.logout();
      localStorage.clear();
    }
  }
  render() {
    return (
      <div className="App ">
        <header className="noprint" style={{ margin: "50px" }}>
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
        <Router />
      </div>
    );
  }
}

export default withRouter(
  connect(
    null,
    { logout }
  )(App)
);
