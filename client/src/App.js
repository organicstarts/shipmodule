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
      visible: window.outerWidth > 767 ? true : false,
      width: window.outerWidth
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
      width: window.outerWidth,
      visible: this.state.width > 767 ? true : false
    });
  };

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
    const { width, visible } = this.state;
    const styles = {
      containerStyle: {
        paddingLeft: "10%",
        marginTop: "95px",
        width: "95%",
        position: "relative"
      },
      mobileStyle: {
        paddingLeft: width > 767 ? "3%" : "10.5%",
        paddingRight: 0,
        marginTop: "95px",
        width: "95%",
        position: "relative"
      }
    };
    const { containerStyle, mobileStyle } = styles;
    console.log(visible);
    console.log(visible ? containerStyle : mobileStyle);
    return (
      <div className="App">
        <Menu fixed="top" borderless className="noprint navbar">
          <Menu.Item position="right">
            <Button color="red" onClick={this.props.logout}>
              Sign Out
            </Button>
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
