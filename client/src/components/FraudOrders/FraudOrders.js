import React, { Component } from "react";
import { ClipLoader } from "react-spinners";
import { Button } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import {
  getOrderCount,
  getAllOrders,
  getShippingInfo
} from "../../helpers/BigCommerce/Orders";
import fraudlog from "../../config/fraudlog.json";

class FraudOrders extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      fraudDatas: [],
      savedData: fraudlog
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount(){
    this.updateFile()
  }

  componentWillUnmount() {
    this.updateFile()
  }
  
  updateFile() {
    this.setState({
      savedData: require("../../helpers/BigCommerce/fraudlog.json")
    })
  }

  handleClick() {
    this.setState({ loading: true });
    console.log(this.state.savedData[0]);
    getAllOrders(
      this.state.savedData.length > 0 ? this.state.savedData[0].id + 1 : 0
    )
      .then(async data => {
        console.log(data)
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
          this.state.savedData.map( save => data.push(save))
        }
        this.setState({
          fraudDatas: data
        });
        console.log(data);
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
    return <div className="center">{this.renderButton()}</div>;
  }
}

export default withRouter(FraudOrders);
