import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { Icon, Image, Menu, Transition, Header, Grid } from "semantic-ui-react";
import MediaQuery from "react-responsive";
import logo from "../../logo.png";
import "../../index.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "home"
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

  render() {
    const { activeItem } = this.state;
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
              size="small"
              style={{
                textAlign: "left",
                zIndex: 31111,
                paddingTop: "0",
                marginTop: "0",
                boxShadow: ".15px 1px 30px -9px #555",
                backgroundColor: "#303030"
              }}
            >
              <Header className="sidebar-color">
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
                  <Grid.Column width={1} verticalAlign="middle">
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

                <p className="text" style={{ paddingTop: "25px" }}>
                  {this.props.displayName}
                </p>
                <p className="text">{this.props.email}</p>
                <div className="photo">
                  <Image circular src={this.props.profileImg} />
                </div>
              </Header>
              <Menu.Item
                as={Link}
                to="/"
                name="home"
                active={activeItem === "home"}
                onClick={this.handleItemClick}
              >
                <Icon
                  style={{ float: "left", paddingRight: "25px" }}
                  name="home"
                />
                Home
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/batch"
                name="batch"
                active={activeItem === "batch"}
                onClick={this.handleItemClick}
              >
                <Icon
                  style={{ float: "left", paddingRight: "25px" }}
                  name="list alternate"
                />
                Generate Batch
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/fetch"
                name="fetch"
                active={activeItem === "fetch"}
                onClick={this.handleItemClick}
              >
                <Icon
                  style={{ float: "left", paddingRight: "25px" }}
                  name="newspaper"
                />
                Packing Slip
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/fraud"
                name="fraud"
                active={activeItem === "fraud"}
                onClick={this.handleItemClick}
              >
                <Icon
                  style={{ float: "left", paddingRight: "25px" }}
                  name="search"
                />
                Fraud Search
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/inventory"
                name="inventory"
                active={activeItem === "inventory"}
                onClick={this.handleItemClick}
              >
                <Icon
                  style={{ float: "left", paddingRight: "25px" }}
                  name="warehouse"
                />
                Inventory
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/scanning"
                name="scanning"
                active={activeItem === "scanning"}
                onClick={this.handleItemClick}
              >
                <Icon
                  style={{ float: "left", paddingRight: "25px" }}
                  name="barcode"
                />
                Scanning
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/cancel"
                name="cancel"
                active={activeItem === "cancel"}
                onClick={this.handleItemClick}
              >
                <Icon
                  style={{ float: "left", paddingRight: "25px" }}
                  name="user cancel"
                />
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
                  <Icon
                    style={{ float: "left", paddingRight: "25px" }}
                    name="book"
                  />
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
                  zIndex: 31111,
                  paddingTop: "0",
                  marginTop: "0",
                  boxShadow: ".15px 1px 30px -9px #555",
                  backgroundColor: "#303030",
                  maxWidth: "3.4rem"
                }}
              >
                {" "}
                <Header className="sidebar-color mobile" style={{ padding: 0 }}>
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
                  <Icon name="search" />
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
