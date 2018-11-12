import * as retriever from "../../helpers/Retriever";
import * as log from "../Log";

export const getOrder = async orderNumber => {
  return await retriever.fetchJSON("os", "orders/" + orderNumber).then(dataArray => {
    console.log(dataArray)  
}).catch(log.error);
};
