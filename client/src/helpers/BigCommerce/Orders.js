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

export const getAllOrders = async () => {
  return await retriever
    .fetchJSON("os", "orders?limit=200&sort=date_created:desc")
    .then(dataArray => {
      return dataArray.data;
    })
    .catch(log.error);
};

export const getShippingInfo = async orderId => {
  return await retriever
    .fetchJSON("os", "orders/" + orderId + "/shippingaddresses")
    .then(dataArray => {
      return dataArray.data;
    });
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
