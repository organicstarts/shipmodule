import React, { Component } from "react";
import { Image } from "semantic-ui-react";
import logo from "./logo.svg";
import { ClipLoader } from "react-spinners";
import { withRouter } from "react-router-dom";
import { BatchOrders, FetchOrder, FraudOrders } from "./components";
import { auth, provider } from "./config/firebaseconf";
import { Button } from "semantic-ui-react";
import "tachyons";

class Main extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      user: null,
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
      let email = result.additionalUserInfo.profile.hd
      let isNewUser = result.additionalUserInfo.isNewUser;
      if (!isNewUser || email === "organicstart.com") {
        this.setState({
          user: result.user,
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
        this.setState({ user });
      }
    });
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
            <BatchOrders />
            <FetchOrder />
            <FraudOrders />
            <Button fluid size="large" color="green" onClick={this.logout}>Log Out</Button>
          </div>
        ) : (
          <div>
            {this.state.error? <h1 className="red"> Wrong Account Information</h1>: ""}
          <Button fluid size="large" color="green" onClick={this.login}>Log In</Button>
          </div>
        )}
      </div>
    );
  }
  render() {
    return (
      <div className="App container tc">
        <header style={{ marginTop: "50px", marginBottom: "50px"}}>
          <Image src={logo} size="medium" centered alt="Organic Start" />
        </header>
        {this.renderHome()}
      </div>
    );
  }
}

export default withRouter(Main);
