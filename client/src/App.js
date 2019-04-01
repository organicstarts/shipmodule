import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "./actions/auth";
import Router from "./Router";
import Sidebar from "./components/common/Sidebar";
import { Button, Container, Menu } from "semantic-ui-react";

import "./index.css";

const MINUTES_UNITL_AUTO_LOGOUT = 1; // in mins
const CHECK_INTERVAL = 15000; // in ms
const STORE_KEY = "lastAction";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:
        (window.outerWidth || window.screen.availWidth) > 767 ? true : false,
      width: window.outerWidth || window.screen.availWidth
    };
    this.check();
    this.initListener();
    this.initInterval();
  }

  handleToggle = () => this.setState({ visible: !this.state.visible });

  componentDidMount() {
    window.addEventListener("resize", this.update);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.update);
  }

  update = () => {
    this.setState({
      width: window.outerWidth || window.screen.availWidth,
      visible: this.state.width > 767 ? true : false
    });
  };

  getLastAction() {
    return parseInt(localStorage.getItem(STORE_KEY));
  }

  setLastAction(lastAction) {
    localStorage.setItem(STORE_KEY, lastAction.toString());
  }
  /*
  check actions on HTML body to see if the user is still active
  */
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
    const { width, visible } = this.state;
    const styles = {
      containerStyle: {
        paddingLeft: width > 767 ? "calc(18rem + 30px)" : "0",
        marginTop: "95px",
        width: "100%",
        position: "relative"
      },
      mobileStyle: {
        paddingLeft:
          width > 767 ? "calc(3.4rem + 30px)" : width > 373 ? "3.4rem" : "0",
        paddingRight: 0,
        marginTop: "95px",
        width: "100%",
        position: "relative"
      }
    };
    const { containerStyle, mobileStyle } = styles;
    return (
      <div className="App">
        <Menu fixed="top" size="massive" borderless className="noprint navbar">
          <Menu.Item
            position="right"
            style={{ marginTop: "15px", marginRight: "15px" }}
          >
            <Button
              circular
              color="red"
              icon="power off"
              onClick={this.props.logout}
            />
          </Menu.Item>
        </Menu>
        <Sidebar
          visible={visible}
          handleToggle={this.handleToggle}
          width={width}
        />
        <Container
          fluid
          className="nopadding print-remove-margin"
          style={visible ? containerStyle : mobileStyle}
        >
          <Router />
        </Container>
      </div>
    );
  }
}

function mapStateToProps({ authState }) {
  return {
    email: authState.email
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { logout }
  )(App)
);
