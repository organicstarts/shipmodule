import React, { Component } from "react";
import { Button, Segment } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import firebase from "../../config/firebaseconf";

class Log extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      logDatas: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.firebaseRef = firebase.database().ref(`/action`);
    this.firebaseRef
      .on("value", snapshot => {
        const payload = snapshot.val();
        if (payload) {
          this.setState({
            logDatas: payload.log
          });
        }
      })
      .bind(this);
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  handleClick() {
    this.setState({ loading: true });
    this.props.history.push({
      pathname: "/log",
      state: { detail: this.state }
    });
  }

  render() {
    return (
      <Segment color="orange" padded="very">
        <Button fluid size="large" color="orange" onClick={this.handleClick}>
          View Log
        </Button>
      </Segment>
    );
  }
}

export default withRouter(Log);
