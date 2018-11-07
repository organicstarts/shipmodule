// Retriever Helper is designed to replace the fetch functions.
import * as retriever from "../../helpers/Retriever";
import * as log from "../Log";

const recentShipments = () => {
  return retriever.fetchJSON(
    "ss",
    "shipments?sortDir=DESC&page=1&pageSize=500&includeShipmentItems=true"
  );
};

const shipments = orderID => {
  return retriever.fetchJSON("ss", "shipments?orderId=" + orderID);
};

const order = orderID => {
  return retriever.fetchJSON("ss", "orders/" + orderID);
};

const tag = () => {
  return retriever.fetchJSON("ss","accounts/listtags")
}

export const getBatch = async batch => {
  return await recentShipments()
    .then(dataArray => {
      const batchArray = dataArray.data.shipments.filter(data => {
        return data.batchNumber === batch;
      });
      return batchArray;
    })
    .catch(log.error);
};

export const getTag = async () =>{
  return await tag().then(data => console.log(data))
}