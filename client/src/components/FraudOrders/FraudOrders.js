import React, { Component } from "react";
import { ClipLoader } from "react-spinners";
import { Button } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { getAllShipments } from "../../helpers/ShipStation/Shipments";
import { getOrder } from "../../helpers/BigCommerce/Orders";

class FraudOrders extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      fraudDatas: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ loading: true });

    getAllShipments().then(async data => {
      console.log(data);
      this.setState({
        fraudDatas: data
      });
      await Promise.all(
        data.map(async data => {
          if (data.orderNumber)
            await getOrder(data.orderNumber).then(async x => {
              data.bigCommerce = x;
            });
        })
      ).then(x => {
        this.props.history.push({
          pathname: "/fraud",
          state: { detail: this.state }
        });
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
