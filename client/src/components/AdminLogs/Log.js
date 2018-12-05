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
    this.setState({ loading: !this.state.loading });
  }

  renderLogList() {
    const { logDatas } = this.state;

    return Object.keys(logDatas)
      .map(key => {
        return (
          <LogDetail
            key={key}
            action={logDatas[key].action}
            batchorOrder={
              logDatas[key].batch !== "N/A"
                ? logDatas[key].batch
                : logDatas[key].order
            }
            user={logDatas[key].user}
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
          <Button fluid size="large" color="orange" onClick={this.handleClick}>
            Close Log
          </Button>
          <div
            style={{
              paddingTop: "25px",
              overflowY: "scroll",
              maxHeight: "599px"
            }}
          >
            <table style={{color: "black", paddingRight: "10px"}}>
              <thead>
                <tr>
                  <th style={styles.border}>
                    <strong>Action</strong>
                  </th>
                  <th style={styles.border}>
                    <strong>Date</strong>
                  </th>
                  <th style={styles.border}>
                    <strong>User</strong>
                  </th>
                  <th style={styles.border}>
                    <strong>Batch/Order</strong>
                  </th>
                  <th style={styles.border}>
                    <strong>Picker</strong>
                  </th>
                  <th style={styles.borderLast}>
                    <strong>Shipper</strong>
                  </th>
                </tr>
              </thead>
              {this.renderLogList()}
            </table>
          </div>
        </div>
      );
    }
    return (
      <Button fluid size="large" color="orange" onClick={this.handleClick}>
        View Log
      </Button>
    );
  }
  render() {
    return (
      <Segment color="orange" padded="very">
        {this.renderLog()}
      </Segment>
    );
  }
}

const styles = {
  border: {
    borderBottom: "1px solid #ccc",
    borderRight: "1px solid #ccc",
    borderCollapse: "separate",
    borderSpacing: "4px"
  },
  borderLast: {
    borderBottom: "1px solid #ccc",
    borderCollapse: "separate",
    borderSpacing: "4px"
  }
};

export default withRouter(Log);
