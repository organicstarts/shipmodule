import React, { Component } from "react";
import { connect } from "react-redux";
import { login, checkLoginState } from "../../actions/auth";
import logo from "../../logo.svg";
import { Button, Image, Form } from "semantic-ui-react";
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
        <div className="App container tc" style={{ margin: "50px auto" }}>
          <header style={{ marginBottom: "50px" }}>
            <Image src={logo} size="medium" centered alt="Organic Start" />
          </header>
          <Form onSubmit={this.login}>
            <Form.Field>
              <Form.Input
                fluid
                label="Pin Number"
                placeholder="123456"
                name="pin"
                value={this.state.pin}
                onChange={this.handleChange}
                required
                autoFocus
              />
            </Form.Field>

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

            <Button type="submit" fluid size="large" color="green">
              Log In
            </Button>
          </Form>
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
