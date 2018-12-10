import React, { Component } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import BatchDetail from "./BatchDetail";
import SlipDetail from "./SlipDetail";
import boxes from "../../config/boxes";
import packages from "../../config/packages";
import { iconQuotes } from "../../config/peopleicon";
import { Segment } from "semantic-ui-react";
import axios from "axios";

class BatchList extends Component {
  constructor() {
    super();
    this.logprint = this.logprint.bind(this);
  }
  componentDidMount() {
    window.addEventListener("afterprint", this.logprint);
  }

  componentWillUnmount() {
    window.removeEventListener("afterprint", this.logprint);
  }

  logprint() {
    let currentTime = moment().format("dddd, MMMM DD YYYY hh:mma");
    axios
      .post("/writetofile", {
        action: "Print",
        batchNumber: this.props.location.state.detail.batchNumber,
        user: this.props.location.state.detail.user,
        picker: this.props.location.state.detail.picker,
        shipper: this.props.location.state.detail.shipper,
        currentTime
      })
      .then(response => {
        if (response.data.msg === "success") {
          console.log("logged");
        } else if (response.data.msg === "fail") {
          console.log("failed to log.");
        }
      });
  }
  render() {
    if (this.props.location.state.detail.batchDatas.length < 1) {
      return (
        <Segment style={{ marginTop: "50px" }}>
          <Link to="/">Go Back</Link>
          <h1>Batch number not found!</h1>
        </Segment>
      );
    }
    return (
      <div>
        <Link to="/" className="noprint">
          Go Back
        </Link>
        <div style={styles.pickList}>
          <div className="row">
            <h1 className="col-6" style={styles.margin}>
              Product Pick List
            </h1>
            <p
              className="col-6"
              style={{
                fontSize: "large",
                textAlign: "right",
                margin: "0",
                padding: "17px"
              }}
            >
              <strong>
                Batch #{this.props.location.state.detail.batchNumber} <br />
                {formatDateTime(
                  this.props.location.state.detail.batchDatas[0].create_date
                )}
              </strong>
            </p>
          </div>
          <div className="row align-items-center" style={{ padding: "0 15px" }}>
            <div className="col-1" style={{ textAlign: "center" }}>
              &#10004;
            </div>
            <div className="col-1" />
            <div className="col-2" style={{ textAlign: "center" }}>
              <strong>Code</strong>
            </div>
            <div className="col-6">
              <strong>Product Name</strong>
            </div>
            <div className="col-1" />
            <div className="col-1" style={{ textAlign: "center" }}>
              <strong>#</strong>
            </div>
          </div>
          <div>{renderBatchList(this.props)}</div>
          <div className="row" style={{ textAlign: "right" }}>
            <div className="col-12">
              <strong>
                Total Items Required:{" "}
                {this.props.location.state.detail.totalCount}
              </strong>
            </div>
          </div>
        </div>

        <div>{renderSlipList(this.props)}</div>
      </div>
    );
  }
}
const renderBatchList = props => {
  const { shipItems } = props.location.state.detail;
  return shipItems.map(data => {
    if (data.length > 1) {
      return data.map(data => (
        <BatchDetail
          key={data.orderItemId}
          sku={data.sku}
          text={data.name}
          image={data.imageUrl}
          quantity={data.combineTotal ? data.combineTotal : data.quantity}
          warehouse={data.warehouseLocation}
          options={data.options? data.options[0].value: ""}
        />
      ));
    }
    return (
      <BatchDetail
        key={data.orderItemId}
        sku={data.sku}
        text={data.aliasName}
        image={data.imageUrl}
        quantity={data.combineTotal ? data.combineTotal : data.quantity}
        warehouse={data.warehouseLocation}
        fullBox={data.fullBox ? data.fullBox : null}
        loose={data.loose ? data.loose : null}
        options={data.options? data.options[0].value: ""}
      />
    );
  });
};

const renderSlipList = props => {
  const { batchDatas, picker, shipper } = props.location.state.detail;
  return batchDatas.map(data => {
    return (
      <SlipDetail
        key={data.orderId}
        customerId={data.bigCommerce ? data.bigCommerce.customer_id : null}
        carrier={data.carrierCode}
        orderTotal={data.orderCount}
        carrierCode={getCarrier(data.carrierCode, data.packageCode)}
        box={calculateBox(data.dimensions)}
        batchNumber={data.batchNumber}
        shipmentInfo={data.shipmentItems}
        picker={iconQuotes[picker]}
        shipper={iconQuotes[shipper]}
        name={data.shipTo.name}
        email={data.customerEmail}
        company={data.shipTo.company}
        street1={data.shipTo.street1}
        street2={data.shipTo.street2}
        city={data.shipTo.city}
        state={data.shipTo.state}
        zip={data.shipTo.postalCode}
        total={getTotal(data.shipmentItems)}
        credit={data.bigCommerce ? data.bigCommerce.store_credit_amount : 0}
        orderID={data.orderNumber}
        created={
          data.bigCommerce ? formatDate(data.bigCommerce.date_created) : null
        }
        shipDate={
          data.bigCommerce ? formatDate(data.bigCommerce.date_shipped) : null
        }
        coupon={data.couponInfo}
        shipmentCost={data.bigCommerce.shipping_cost_inc_tax}
        shipDuration={
          data.bigCommerce
            ? calculateTime(
                data.bigCommerce.date_created,
                data.bigCommerce.date_shipped
              )
            : null
        }
      />
    );
  });
};

const getCarrier = (carrier, boxPackage) => {
  if (carrier && boxPackage) {
    return packages[carrier][boxPackage].NAME;
  }
  return "";
};

const calculateTime = (startDate, endDate) => {
  let date1 = moment(startDate);
  let date2 = moment(endDate);
  let hours = date2.diff(date1, "Hours");
  let mins = moment
    .utc(moment(date2, "Minutes").diff(moment(date1, "HH:mm:ss")))
    .format("mm");

  return `about ${hours} hours and ${mins} minutes after you ordered. Yeah that was
  fast ;)`;
};

const calculateBox = dimension => {
  if (dimension) {
    const boxSize = dimension.height * dimension.width * dimension.length;
    return boxes[boxSize].name;
  }
  return "";
};
const getTotal = items => {
  let x = 0;
  items.map(item => (x = x + item.quantity));
  return x;
};

const formatDate = string => {
  const date = moment.utc(string);
  return date.format("Do MMMM YYYY");
};

const formatDateTime = string => {
  const date = moment.utc(string);
  return date.format("MMMM DD YYYY");
};

const styles = {
  margin: {
    margin: "0",
    padding: "17px"
  },
  pickList: {
    fontSize: "110% !important",
    background: "#fff",
    zIndex: 5,
    maxWidth: "7.5in",
    margin: "0 auto 5.25in auto",
    marginBottom: "4in",
    pageBreakBefore: "always",
    pageBreakAfter: "always"
  }
};

export default BatchList;
