import React, { Component } from "react";
import { Button, Segment } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import firebase from "../../config/firebaseconf";
import LogDetail from "./LogDetail";

class Log extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      logDatas: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.firebaseRef = firebase.database().ref(`/batch`);
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
    this.setState({ loading: !this.state.loading });
  }

  renderLogList() {
    const { logDatas } = this.state;

    return Object.keys(logDatas)
      .map(key => {
        return (
          <LogDetail
            key={key}
            batch={logDatas[key].batch}
            date={logDatas[key].date}
            picker={logDatas[key].picker}
            shipper={logDatas[key].shipper}
          />
        );
      })
      .reverse();
  }

  renderLog() {
    if (this.state.loading) {
      return (
        <div>
          <Button fluid size="large" color="red" onClick={this.handleClick}>
            Close Log
          </Button>
          <table>
            <thead>
              <tr>
                <th>
                  <strong>Date</strong>
                </th>
                <th>
                  <strong>Batch</strong>
                </th>
                <th>
                  <strong>Picker</strong>
                </th>
                <th>
                  <strong>Shipper</strong>
                </th>
              </tr>
            </thead>
            {this.renderLogList()}
          </table>
        </div>
      );
    }
    return (
      <Button fluid size="large" color="red" onClick={this.handleClick}>
        View Log
      </Button>
    );
  }
  render() {
    return (
      <Segment color="red" padded="very">
        {this.renderLog()}
      </Segment>
    );
  }
}

export default withRouter(Log);
