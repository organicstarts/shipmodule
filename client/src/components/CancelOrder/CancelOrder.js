import React from "react";
import { Segment, Button, Form, Header, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { ClipLoader } from "react-spinners";

class CancelOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cancelNumber: "",
      loading: false,
      show: false,
      msg: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  handleSelectChange = (e, data) => this.setState({ [data.name]: data.value });

  /* 
  async get request shipstation api get matching data based on batch number.
  setState for  batchDatas with shipshipstation response
  async get request Bigcommerce for coupon info and customer order count. append result to batchdatas
  */
  handleSubmit() {
    const { cancelNumber } = this.state;
    this.setState({ loading: true, show: false });
    let currentTime = moment().format("dddd, MMMM DD YYYY hh:mma");
    axios
      .post("fb/writetofile", {
        action: "Cancel Order",
        orderNumber: cancelNumber,
        user: this.props.displayName,

        currentTime
      })
      .then(response => {
        if (response.data.msg === "success") {
          console.log("logged");
        } else if (response.data.msg === "fail") {
          console.log("failed to log.");
        }
      });

    axios
      .put(`os/cancelorder`, {
        ordernumber: cancelNumber,
        message: "Brainiac Cancel",
        noEmail: true
      })
      .then(response => {
        if (response.data.msg === "success") {
          axios
            .post("ss/cancelorder", {
              ordernumber: cancelNumber,
              noEmail: true
            })
            .then(res => {
              if (res.data.msg === "success") {
                console.log("successfully cancelled order");
                this.setState({
                  loading: false,
                  show: true,
                  msg: "successfully cancelled order"
                });
              } else {
                console.log("Order was never imported to shipstation");
                this.setState({
                  loading: false,
                  show: true,
                  msg:
                    "Order was never imported to shipstation. Successfully cancelled order "
                });
              }
            });
        }
      })
      .catch(error => console.log(error));
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
      <Button
        disabled={this.state.cancelNumber ? false : true}
        size="large"
        color="red"
        type="submit"
      >
        Cancel Order
      </Button>
    );
  }
  render() {
    return (
      <div>
        <Header as="h1">
          <Icon name="user cancel" />
          <Header.Content>Cancel Retail Order</Header.Content>
        </Header>
        <Segment padded="very" stacked>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Form.Field>
              <Form.Input
                fluid
                label="Order Number"
                placeholder="123456"
                name="cancelNumber"
                value={this.state.cancelNumber}
                onChange={this.handleChange}
                required
              />
            </Form.Field>

            <div style={{ textAlign: "center" }}> {this.renderButton()}</div>
          </Form>
        </Segment>

        {this.state.show && (
          <Segment>
            {this.state.msg} #{this.state.cancelNumber}
          </Segment>
        )}
      </div>
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
    null
  )(CancelOrder)
);
