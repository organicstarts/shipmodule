// Retriever Helper is designed to replace the fetch functions.
import * as retriever from "../../helpers/Retriever";
import * as log from "../Log";

export const shipments = (destination, path) => {
  return retriever.fetchJSON(destination, path);
};

export const getBatch = async(batch) => {
  return await shipments("ss", "shipments")
    .then(dataArray => {
      const batchArray = dataArray.data.shipments.filter(data => {
        return data.batchNumber === batch;
      });
      return batchArray;
    })
    .catch(log.error);
};
