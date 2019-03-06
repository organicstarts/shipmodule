import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "./actions/auth";
import Router from "./Router";
import {
  Button,
  Container,
  Icon,
  Image,
  Menu,
  Transition
} from "semantic-ui-react";
import logo from "./logo.png";
import MediaQuery from "react-responsive";
import "./index.css";

const MINUTES_UNITL_AUTO_LOGOUT = 1; // in mins
const CHECK_INTERVAL = 15000; // in ms
const STORE_KEY = "lastAction";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpened: true,
      width: window.outerWidth,
      visible: true,
      activeItem: "home"
    };
    this.check();
    this.initListener();
    this.initInterval();
  }
  handleSidebarHide = () => this.setState({ sidebarOpened: false });

  handleToggle = () => this.setState({ visible: !this.state.visible });

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  getLastAction() {
    return parseInt(localStorage.getItem(STORE_KEY));
  }

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
    const { width, visible, activeItem } = this.state;

    return (
      <div className="App">
        <Menu fixed="top" borderless className="noprint navbar">
          <Menu.Item as={Link} to="/">
            <Image
              size="mini"
              src={logo}
              style={{ marginRight: "1.5em", zIndex: 2 }}
            />
            Brainiac
          </Menu.Item>
          <Menu.Item as="a" onClick={this.handleToggle}>
            <Icon name="sidebar" />
          </Menu.Item>
          <Menu.Item position="right">
            <Button color="red" onClick={this.props.logout}>
              Sign Out
            </Button>
          </Menu.Item>
        </Menu>
        <Transition.Group
          className="noprint"
          animation="fade right"
          duration={500}
        >
          {visible && width > 767 && (
            <Menu
              className="noprint"
              fixed="left"
              vertical
              inverted
              pointing
              size="small"
              style={{
                zIndex: 1,
                paddingTop: "20px",
                marginTop: "50px",
                boxShadow: ".15px 1px 30px -9px #555",
                backgroundColor: "#303030"
              }}
            >
              <Menu.Item
                as={Link}
                to="/"
                name="home"
                active={activeItem === "home"}
                onClick={this.handleItemClick}
              >
                Home
              </Menu.Item>

              <Menu.Item
                as={Link}
                to="/batch"
                name="batch"
                active={activeItem === "batch"}
                onClick={this.handleItemClick}
              >
                Batch Order
              </Menu.Item>

              <Menu.Item
                as={Link}
                to="/fetch"
                name="fetch"
                active={activeItem === "fetch"}
                onClick={this.handleItemClick}
              >
                Fetch Order
              </Menu.Item>

              <Menu.Item
                as={Link}
                to="/fraud"
                name="fraud"
                active={activeItem === "fraud"}
                onClick={this.handleItemClick}
              >
                Fraud Search
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/inventory"
                name="inventory"
                active={activeItem === "inventory"}
                onClick={this.handleItemClick}
              >
                Inventory
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/scanning"
                name="scanning"
                active={activeItem === "scanning"}
                onClick={this.handleItemClick}
              >
                Scanning
              </Menu.Item>

              <Menu.Item
                as={Link}
                to="/cancel"
                name="cancel"
                active={activeItem === "cancel"}
                onClick={this.handleItemClick}
              >
                Cancel Order
              </Menu.Item>
              {this.compareEmail(this.props.email) && (
                <Menu.Item
                  as={Link}
                  to="/log"
                  name="log"
                  active={activeItem === "log"}
                  onClick={this.handleItemClick}
                >
                  Admin Log
                </Menu.Item>
              )}
            </Menu>
          )}
        </Transition.Group>
        <MediaQuery minDeviceWidth={374} className="noprint">
          <Transition.Group
            className="noprint"
            animation="fade right"
            duration={500}
          >
            {!visible && (
              <Menu
                className="noprint"
                fixed="left"
                vertical
                icon
                inverted
                style={{
                  zIndex: 1,
                  paddingTop: "20px",
                  marginTop: "50px",
                  boxShadow: ".15px 1px 30px -9px #555",
                  backgroundColor: "#303030"
                }}
              >
                <Menu.Item as={Link} to="/">
                  <Icon name="home" />
                </Menu.Item>

                <Menu.Item as={Link} to="/batch">
                  <Icon name="list alternate outline" />
                </Menu.Item>

                <Menu.Item as={Link} to="/fetch">
                  <Icon name="newspaper outline" />
                </Menu.Item>

                <Menu.Item as={Link} to="/fraud">
                  <Icon name="eye" />
                </Menu.Item>
                <Menu.Item as={Link} to="/inventory">
                  <Icon name="warehouse" />
                </Menu.Item>
                <Menu.Item as={Link} to="/scanning">
                  <Icon name="barcode" />
                </Menu.Item>
                <Menu.Item as={Link} to="/cancel">
                  <Icon name="user cancel" />
                </Menu.Item>
                {this.compareEmail(this.props.email) && (
                  <Menu.Item as={Link} to="/log">
                    <Icon name="book" />
                  </Menu.Item>
                )}
              </Menu>
            )}
          </Transition.Group>
        </MediaQuery>
        <Container
          fluid
          className="nopadding print-remove-margin"
          style={{
            paddingLeft: "10%",
            marginTop: "95px",
            width: "95%",
            position: "relative"
          }}
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
