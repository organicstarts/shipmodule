import React from "react";
import moment from "moment";
import BatchDetail from "./BatchDetail";
import SlipDetail from "./SlipDetail";
import boxes from "../../config/boxes";
import packages from "../../config/packages";

const BatchList = props => {
  return (
    <div>
      <div style={styles.pickList}>
        <div className="row">
          <h1 className="col-6" style={styles.margin}>
            Product Pick List
          </h1>
          <p className="col-6 text-right" style={styles.margin}>
            Batch #{props.location.state.detail.batchNumber}
          </p>
        </div>
        <div className="row">
          <div className="col-1">&#10004;</div>
          <div className="col-1" />
          <div className="col-2 text-center">
            <strong>Code</strong>
          </div>
          <div className="col-6">
            <strong>Product Name</strong>
          </div>
          <div className="col-1" />
          <div className="col-1 text-center">
            <strong>#</strong>
          </div>
        </div>
        <div>{renderBatchList(props)}</div>
        <div className="row" style={{ textAlign: "right" }}>
          <div className="col-12">
            <strong>
              Total Items Required: {props.location.state.detail.totalCount}
            </strong>
          </div>
        </div>
      </div>

      <div>{renderSlipList(props)}</div>
    </div>
  );
};

const renderBatchList = props => {
  const { shipItems } = props.location.state.detail;
  console.log(shipItems);
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
        />
      ));
    }
    return (
      <BatchDetail
        key={data.orderItemId}
        sku={data.sku}
        text={data.name}
        image={data.imageUrl}
        quantity={data.combineTotal ? data.combineTotal : data.quantity}
        warehouse={data.warehouseLocation}
        fullBox={data.fullBox ? data.fullBox : null}
        loose={data.loose ? data.loose : null}
      />
    );
  });
};

const renderSlipList = props => {
  const { batchDatas } = props.location.state.detail;
  console.log(batchDatas);
  return batchDatas.map(data => {
    return (
      <SlipDetail
        key={data.orderId}
        customerId={data.bigCommerce.customer_id}
        carrier={data.carrierCode}
        orderTotal={data.orderCount}
        carrierCode={getCarrier(data.carrierCode, data.packageCode)}
        box={calculateBox(data.dimensions)}
        batchNumber={data.batchNumber}
        shipmentInfo={data.shipmentItems}
        name={data.shipTo.name}
        email={data.customerEmail}
        company={data.shipTo.company}
        street1={data.shipTo.street1}
        street2={data.shipTo.street2}
        city={data.shipTo.city}
        state={data.shipTo.state}
        zip={data.shipTo.postalCode}
        total={getTotal(data.shipmentItems)}
        credit={data.bigCommerce.store_credit_amount}
        orderID={data.orderNumber}
        created={formatDate(data.bigCommerce.date_created)}
        shipDate={formatDate(data.bigCommerce.date_shipped)}
        shipmentCost={data.shipmentCost}
        shipDuration={calculateTime(data.bigCommerce.date_created, data.bigCommerce.date_shipped)}
      />
    );
  });
};

const getCarrier = (carrier, boxPackage) => {
  return packages[carrier][boxPackage].NAME;
}

const calculateTime = (startDate, endDate) => {
  let date1 = moment(startDate)
  let date2 = moment(endDate);
  let hours = date2.diff(date1,"Hours")

  return hours


}

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
  // var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  //return new Date(string).toLocaleDateString([],options);
  const date = moment(string);
  return date.format("Do MMMM YYYY");
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
