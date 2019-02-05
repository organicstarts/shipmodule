import React, { Component } from "react";
import { connect } from "react-redux";
import { login, checkLoginState } from "../../actions/auth";
import logo from "../../logo.svg";
import { Button, Image } from "semantic-ui-react";

class Auth extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
  }

  login() {
    this.props.login();
  }

  componentDidMount() {
    this.props.checkLoginState();
  }

  render() {
    const { children } = this.props;
    if (this.props.displayName) {
      return <React.Fragment>{children}</React.Fragment>;
    } else {
      return (
        <div className="App container tc" style={{ margin: "50px auto" }}>
          <header style={{ marginBottom: "50px" }}>
            <Image src={logo} size="medium" centered alt="Organic Start" />
          </header>
          <Button fluid size="large" color="green" onClick={this.login}>
            Log In
          </Button>
        </div>
      );
    }
  }
}

const mapStateToProps = ({ authState }) => {
  return {
    displayName: authState.displayName,
    email: authState.email,
    loading: authState.loading
  };
};

export default connect(
  mapStateToProps,
  { login, checkLoginState }
)(Auth);
