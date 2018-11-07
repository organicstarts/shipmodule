import React from "react";
import BatchDetail from "./BatchDetail";

const BatchList = props => {
  return<div>{renderBatchList(props)}</div>;
};

const renderBatchList = props => {
  const { shipItems } = props.location.state.detail;
  console.log(shipItems);
  let count = 0;
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
        />
     
    );
  });
};
export default BatchList;
