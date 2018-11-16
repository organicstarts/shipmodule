import * as retriever from "../../helpers/Retriever";
import * as log from "../Log";

export const getOrder = async orderNumber => {
  return await retriever
    .fetchJSON("os", "orders/" + orderNumber)
    .then(dataArray => {
      return dataArray.data;
    })
    .catch(log.error);
};

export const getOrderCount = async customerNumber => {
  return await retriever
    .fetchJSON("os", "orders?customer_id=" + customerNumber + "&limit=5")
    .then(dataArray => {
      return dataArray.data.length;
    })
    .catch(log.error);
};

export const getCoupon = async orderNumber => {
  return await retriever
    .fetchJSON("os", "orders/" + orderNumber + "/coupons")
    .then(dataArray => {
      if (dataArray.data) return dataArray.data;
      return "";
    })
    .catch(log.error);
};
