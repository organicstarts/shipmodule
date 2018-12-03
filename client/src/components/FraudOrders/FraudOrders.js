import React, { Component } from "react";
import { ClipLoader } from "react-spinners";
import { Button, Segment } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import {
  getOrderCount,
  getAllOrders,
  getShippingInfo
} from "../../helpers/BigCommerce/Orders";
import firebase from "../../config/firebaseconf";
import axios from "axios";
import moment from "moment";

class FraudOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      displayName: this.props.displayName,
      fraudDatas: [],
      savedData: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.firebaseRef = firebase.database().ref(`/fraud`);
    this.firebaseRef
      .on("value", snapshot => {
        const payload = snapshot.val();
        if (payload) {
          this.setState({
            savedData: payload.log[0]
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
    let currentTime = moment().format("dddd, MMMM DD YYYY hh:mma");
    axios
      .post("/writetofile", {
        action: "Fraud Search",
        user: this.state.displayName,
        currentTime
      })
      .then(response => {
        if (response.data.msg === "success") {
          console.log("logged");
        } else if (response.data.msg === "fail") {
          console.log("failed to log.");
        }
      });
    getAllOrders(
      this.state.savedData.length > 0 ? this.state.savedData[0].id + 1 : 0
    )
      .then(async data => {
        await Promise.all(
          data.map(async data => {
            if (data.id)
              await getShippingInfo(data.id).then(async x => {
                data.shippingInfo = x;
              });
            await getOrderCount(data.customer_id).then(
              y => (data.orderCount = y)
            );
          })
        );
        if (this.state.savedData.length > 0) {
          this.state.savedData.map(save => data.push(save));
        }
        this.setState({
          fraudDatas: data
        });
      })
      .then(x => {
        this.props.history.push({
          pathname: "/fraud",
          state: { detail: this.state }
        });
      });
  }
  renderButton() {
    if (this.state.loading) {
      return (
        <ClipLoader
          sizeUnit={"px"}
          size={34}
          color={"#36D7B7"}
          loading={this.state.loading}
        />
      );
    }
    return (
      <Button fluid size="large" color="red" onClick={this.handleClick}>
        Search for Fraudulent Orders
      </Button>
    );
  }
  render() {
    return (
      <Segment color="red" padded="very">
        {this.renderButton()}
      </Segment>
    );
  }
}

export default withRouter(FraudOrders);
