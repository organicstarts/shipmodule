import React, { Component } from "react";
import { ClipLoader } from "react-spinners";
import { Button, Segment } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import firebase from "../../config/firebaseconf";

class Log extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      logDatas: [],

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
    this.setState({ loading: true });

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

export default withRouter(Log);
