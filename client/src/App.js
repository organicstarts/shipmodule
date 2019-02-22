import PropTypes from "prop-types";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "./actions/auth";
import Router from "./Router";
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility
} from "semantic-ui-react";
import logo from "./logo.svg";
import MediaQuery from "react-responsive";

const MINUTES_UNITL_AUTO_LOGOUT = 1; // in mins
const CHECK_INTERVAL = 15000; // in ms
const STORE_KEY = "lastAction";

const getWidth = () => {
  const isSSR = typeof window === "undefined";

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { sidebarOpened: true };
    this.check();
    this.initListener();
    this.initInterval();
  }
  handleSidebarHide = () => this.setState({ sidebarOpened: false });

  handleToggle = () => this.setState({ sidebarOpened: true });

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
      this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 50000; //approx 1hr
    const diff = timeleft - now;
    const isTimeout = diff < 0;
    if (isTimeout) {
      this.props.logout();
      localStorage.clear();
    }
  }
  render() {
    const { sidebarOpened } = this.state;
    console.log(getWidth)
    if (getWidth < 400) {
      this.setState({ sidebarOpened: false });
    }
    return (
      <div className="App ">
        <Responsive getWidth={getWidth} as={Segment}>
          <Sidebar
            as={Menu}
            animation="push"
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={sidebarOpened}
            width="thin"
          >
            <Menu.Item as="a" active>
              Home
            </Menu.Item>
            <Menu.Item as="a">Work</Menu.Item>
            <Menu.Item as="a">Company</Menu.Item>
            <Menu.Item as="a">Careers</Menu.Item>
            <Menu.Item as="a">Log in</Menu.Item>
            <Menu.Item as="a">Sign Up</Menu.Item>
          </Sidebar>

          <Sidebar.Pusher dimmed={sidebarOpened}>
            {!sidebarOpened ? (
              <Menu.Item onClick={this.handleToggle}>
                <Icon name="sidebar" />
              </Menu.Item>
            ) : (
              ""
            )}
            <Router />
          </Sidebar.Pusher>
        </Responsive>
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
