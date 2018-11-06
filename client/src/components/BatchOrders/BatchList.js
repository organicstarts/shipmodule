import React from "react";
import BatchDetail from "./BatchDetail";

const renderBatchList = props => {
  const { shipItems } = props.location.state.detail;
  console.log(shipItems);
  let totalQuantity = "";
  return Object.keys(shipItems)
    .map(data => {
      if (shipItems[data].length > 1) {
        totalQuantity = shipItems[data]
          .map(x => x.quantity)
          .reduce((accumulator, amount) => amount + accumulator, 0);
        console.log(totalQuantity);
      }
      return (
        <BatchDetail
          key={shipItems[data][0].orderItemId}
          sku={data}
          text={shipItems[data][0].name}
          image={shipItems[data][0].imageUrl}
          quantity={totalQuantity || shipItems[data][0].quantity}
          warehouse={shipItems[data][0].warehouseLocation}
        />
      );
    })
    .sort(compare);
};

//helper func to compare warehouse locations
const compare = (a, b) => {
  return a.props.warehouse - b.props.warehouse;
};

const BatchList = props => {
  return <div>{renderBatchList(props)}</div>;
};

export default BatchList;
