import React from "react";
import BatchDetail from "./BatchDetail";
import SlipDetail from "./SlipDetail";

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
        <div className="row text-right">
          <div className="col-12">
            <strong>Total Items Required: {props.location.state.detail.totalCount}</strong>
          </div>
        </div>
      </div>

      <div>{renderSlipList(props)}</div> 
   </div>
  );
};

const renderBatchList = props => {
  const { shipItems } = props.location.state.detail;
  console.log(shipItems)
  return shipItems.map(data => {
    if (data.length > 1) {
      return data.map(data => (
        <BatchDetail
          key={data.orderItemId}
          sku={data.sku}
          text={data.name}
          image={data.imageUrl}
          quantity={data.quantity}
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
        quantity={data.quantity}
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
  return <SlipDetail 
    shipmentInfo = {batchDatas[0].shipmentItems}
    name = {batchDatas[0].shipTo.name}
    email = {batchDatas[0].customerEmail}
    company = {batchDatas[0].shipTo.company}
    street1 = {batchDatas[0].shipTo.street1}
    street2 = {batchDatas[0].shipTo.street2}
    city = {batchDatas[0].shipTo.city}
    state = {batchDatas[0].shipTo.state}
    zip = {batchDatas[0].shipTo.postalCode}
    total = {batchDatas[0].shipmentItems.length}
    orderID = {batchDatas[0].orderNumber}
    created = {batchDatas[0].createDate}
    shipmentCost = {batchDatas[0].shipmentCost}

  />
}

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
    marginBottom: "4in"
  }
};

export default BatchList;
