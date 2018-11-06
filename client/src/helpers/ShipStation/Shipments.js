// Retriever Helper is designed to replace the fetch functions.
import * as retriever from "../../helpers/Retriever";
import * as log from "../Log";

export const recentShipments = () => {
  return retriever.fetchJSON(
    "ss",
    "shipments?sortDir=DESC&page=1&pageSize=500&includeShipmentItems=true"
  );
};

export const shipments = orderID => {
  return retriever.fetchJSON("ss", "shipments?orderId=" + orderID);
};

export const order = orderID => {
  return retriever.fetchJSON("ss", "orders/" + orderID);
};

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
