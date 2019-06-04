import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { Icon, Image, Menu, Transition, Header, Grid } from "semantic-ui-react";
import MediaQuery from "react-responsive";
import logo from "../../logo.png";
import "./styles.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "home",
      items: [
        {
          show: true,
          name: "home",
          displayName: "Home",
          route: "/",
          icon: "home"
        },
        {
          show: true,
          name: "batch",
          displayName: "Generate Batch",
          route: "/batch",
          icon: "list alternate"
        },
        {
          show: true,
          name: "fetch",
          displayName: "Packing Slip",
          route: "/fetch",
          icon: "newspaper"
        },
        {
          show: true,
          name: "fraud",
          displayName: "Fraud Search",
          route: "/fraud",
          icon: "search"
        },
        {
          show: true,
          name: "fulfillment",
          displayName: "OSW Fulfillment",
          route: "/fulfillment",
          icon: "shipping fast"
        },
        {
          show: true,
          name: "inventory",
          displayName: "Inventory",
          route: "/inventory",
          icon: "warehouse"
        },
        {
          show: true,
          name: "scanning",
          displayName: "Scanning",
          route: "/scanning",
          icon: "barcode"
        },
        {
          show: true,
          name: "cancel",
          displayName: "Cancel Order",
          route: "/cancel",
          icon: "user cancel"
        },
        {
          show: this.compareEmail(this.props.email),
          name: "log",
          displayName: "Admin Log",
          route: "/logList",
          icon: "book"
        },
        {
          show: this.compareEmail(this.props.email),
          name: "invoice",
          displayName: "Invoice Check",
          route: "/invoice",
          icon: "list"
        }
      ]
    };
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

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

  renderItems() {
    const { items, activeItem } = this.state;

    return items.map(item => {
      if (item.show) {
        return (
          <Menu.Item
            key={item.name}
            as={Link}
            to={item.route}
            name={item.name}
            active={activeItem === item.name}
            onClick={this.handleItemClick}
          >
            <Icon
              style={{ float: "left", paddingRight: "25px" }}
              name={item.icon}
            />
            {item.displayName}
          </Menu.Item>
        );
      }
      return null;
    });
  }
  renderMobileItems() {
    const { items } = this.state;

    return items.map(item => {
      if (item.show) {
        return (
          <Menu.Item key={item.name} as={Link} to={item.route}>
            <Icon name={item.icon} />
          </Menu.Item>
        );
      }
      return null;
    });
  }

  render() {
    const { visible } = this.props;
    return (
      <div>
        <Transition.Group
          className="noprint"
          animation="fade right"
          duration={500}
        >
          {visible && (
            <Menu
              className="noprint"
              fixed="left"
              vertical
              inverted
              pointing
              size="large"
              style={{
                zIndex: 31111,
                paddingTop: "0",
                marginTop: "0",
                boxShadow: ".15px 1px 30px -9px #555",
                backgroundColor: "#303030"
              }}
            >
              <Header className="sidebar-header sidebar-color">
                <Grid.Row columns={2}>
                  <Grid.Column width={4} style={{ marginLeft: "5px" }}>
                    <Menu.Item as={Link} to="/">
                      <Image
                        size="mini"
                        src={logo}
                        style={{ marginRight: "5px" }}
                        inline
                      />
                      Brainiac
                    </Menu.Item>
                  </Grid.Column>
                  <Grid.Column width={1} style={{ marginLeft: "40px" }}>
                    <Menu.Item
                      as="a"
                      onClick={this.props.handleToggle}
                      style={{ marginTop: "20px" }}
                      fitted="vertically"
                    >
                      <Icon name="sidebar" />
                    </Menu.Item>
                  </Grid.Column>
                </Grid.Row>

                <p className="sidebar-text" style={{ paddingTop: "25px" }}>
                  {this.props.displayName}
                </p>
                <p className="sidebar-text">{this.props.email}</p>
                <div className="photo">
                  <Image circular src={this.props.profileImg} />
                </div>
              </Header>
              {this.renderItems()}
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
                  zIndex: 31111,
                  paddingTop: "0",
                  marginTop: "0",
                  boxShadow: ".15px 1px 30px -9px #555",
                  backgroundColor: "#303030",
                  maxWidth: "3.4rem"
                }}
              >
                <Header
                  className="sidebar-header sidebar-color mobile"
                  style={{ padding: 0 }}
                >
                  <Menu.Item
                    as="a"
                    onClick={this.props.handleToggle}
                    fitted="horizontally"
                  >
                    <Icon name="sidebar" />
                  </Menu.Item>

                  <div className="photo mobile">
                    <Image circular src={this.props.profileImg} />
                  </div>
                </Header>
                {this.renderMobileItems()}
              </Menu>
            )}
          </Transition.Group>
        </MediaQuery>
      </div>
    );
  }
}

function mapStateToProps({ authState }) {
  return {
    email: authState.email,
    displayName: authState.displayName,
    profileImg: authState.profileImg
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(App)
);
