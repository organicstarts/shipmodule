import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllOrders } from "../../actions/order";
// import { ClipLoader } from "react-spinners";
import { Button, Segment } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import firebase from "../../config/firebaseconf";
import axios from "axios";
import moment from "moment";

class FraudOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      displayName: this.props.displayName,
      savedData: [],
      newData: [],
      oneData: 0
    };
    this.handleClick = this.handleClick.bind(this);
    this.firebaseRef = firebase.database().ref(`/fraud`);
    this.firebaseRef
      .orderByKey()
      .limitToLast(1)
      .once("value", snapshot => {
        const payload = snapshot.val();
        if (payload) {
          console.log(payload)
          const key = Object.keys(snapshot.val());
          this.setState({
            oneData: payload[key].id + 1
          });
        }
      })

    this.fraudRef = firebase.database().ref("/fraud");
    this.fraudRef.orderByKey().on("value", snapshot => {
      const payload = snapshot.val();
      if (payload) {
        let dataArray = [];
        Object.keys(payload).map(key => dataArray.push(payload[key]));
        this.setState({
          savedData: dataArray
        });
      }
    });
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  /*
  log click to firebase for admin log
  send get request for past 200 orders; if there's saved ordernumber from previous search
  start search from the last saved ordernumber
  combine response data with saved datas
  push to fraudlist
  */
  handleClick() {
    const { oneData, savedData } = this.state;
    this.setState({ loading: true });
    let currentTime = moment().format("dddd, MMMM DD YYYY hh:mma");
    axios
      .post("fb/writetofile", {
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

    this.props.getAllOrders({ oneData, savedData }, this.props.history);
    // .then(async data => {
    //   await Promise.all(
    //     data.map(async data => {
    //       if (data.id)
    //         await getShippingInfo(data.id).then(async x => {
    //           data.shippingInfo = x;
    //         });
    //       await getOrderCount(data.customer_id).then(
    //         y => (data.orderCount = y)
    //       );
    //     })
    //   );
    //   let tempArray = JSON.parse(JSON.stringify(data));
    //   if (this.state.savedData.length > 0) {
    //     this.state.savedData.map(save => tempArray.push(save));
    //   }
    //   this.setState({
    //     fraudDatas: tempArray,
    //     newData: data
    //   });
    // })
    // .then(x => {
    //   this.props.history.push({
    //     pathname: "/fraud",
    //     state: { detail: this.state }
    //   });
    // });
  }
  renderButton() {
    // if (this.state.loading) {
    //   return (
    //     <ClipLoader
    //       sizeUnit={"px"}
    //       size={34}
    //       color={"#36D7B7"}
    //       loading={this.state.loading}
    //     />
    //   );
    // }
    return (
      <Button
        fluid
        size="large"
        loading={this.state.loading}
        color="red"
        onClick={this.handleClick}
      >
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

const mapStateToProps = ({ authState }) => {
  return {
    displayName: authState.displayName
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { getAllOrders }
  )(FraudOrders)
);
