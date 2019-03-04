import React, { Component } from "react";
import { connect } from "react-redux";
import { login, checkLoginState, getToken } from "../../actions/auth";
import logo from "../../logo.png";
import { Button, Form, Grid, Header, Image, Segment } from "semantic-ui-react";
import { ClipLoader } from "react-spinners";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./Auth.css";

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: "",
      layoutName: "default"
    };
    this.handleChange = this.handleChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.login = this.login.bind(this);
  }
  handleChange = e => this.setState({ [e.target.name]: e.target.value });
  login() {
    this.props.login(this.state.pin);
  }

  componentDidMount() {
    this.props.checkLoginState();
    this.props.getToken();
  }

  onChange = input => {
    this.setState({ pin: input });
  };

  onKeyPress = button => {
    const { pin } = this.state;
    switch (button) {
      case "{bksp}": {
        this.setState({
          ...pin,
          pin: this.state.pin.length > 0 ? this.state.pin.length - 1 : ""
        });
        break;
      }
      case "{clr}": {
        this.setState({
          pin: ""
        });
        this.keyboard.clearInput();
        break;
      }
      default:
        return;
    }
  };

  render() {
    const { children } = this.props;
    if (this.props.loading) {
      return (
        <div className="App container tc" style={{ margin: "50px auto" }}>
          <ClipLoader
            sizeUnit={"px"}
            size={720}
            color={"#36D7B7"}
            loading={this.props.loading}
          />
        </div>
      );
    }
    if (this.props.displayName) {
      return <React.Fragment>{children}</React.Fragment>;
    } else {
      return (
        <div className="login-form">
          {/*
          Heads up! The styles below are necessary for the correct render of this example.
          You can do same with CSS, the main idea is that all the elements up to the `Grid`
          below must have a height of 100%.
        */}
          <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}</style>
          <Grid
            textAlign="center"
            style={{ height: "100%" }}
            verticalAlign="middle"
          >
            <Grid.Column style={{ maxWidth: 550 }}>
              <Header as="h2" color="teal" textAlign="center">
                <Image src={logo} /> Log-in to your account
              </Header>
              <Form onSubmit={this.login} size="large">
                <Segment stacked>
                  <Form.Input
                    fluid
                    icon="lock open"
                    iconPosition="left"
                    placeholder="pin number"
                    name="pin"
                    value={this.state.pin}
                    onChange={this.handleChange}
                    required
                    autoFocus
                  />

                  <Keyboard
                    ref={r => (this.keyboard = r)}
                    name="pin"
                    layoutName={this.state.layoutName}
                    value={this.state.pin}
                    onChange={this.onChange}
                    onKeyPress={this.onKeyPress}
                    theme={"hg-theme-default hg-layout-default myTheme "}
                    layout={{
                      default: ["1 2 3", "4 5 6", "7 8 9", "{clr} 0 {bksp}"]
                    }}
                    display={{
                      "{bksp}": "del",
                      "{clr}": "clear"
                    }}
                  />

                  <Button type="submit" fluid size="large" color="teal">
                    Log In
                  </Button>
                </Segment>
              </Form>
            </Grid.Column>
          </Grid>
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
  { login, checkLoginState, getToken }
)(Auth);
