import * as log from "../Log";
import axios from "axios";

export const getOrder = async orderNumber => {
  return await axios
    .get(`/os/getorder?orderid=${orderNumber}`)
    .then(dataArray => {
      return dataArray.data;
    })
    .catch(log.error);
};

export const getAllOrders = async minId => {
  return await axios
    .get(`/os/getallorders?min=${minId}`)
    .then(dataArray => {
      return dataArray.data;
    })
    .catch(log.error);
};

export const getShippingInfo = async orderId => {
  return await axios
    .get(`/os/getshipping?orderid=${orderId}`)
    .then(dataArray => {
      return dataArray.data;
    })
    .catch(log.error);
};

export const getOrderCount = async customerNumber => {
  return await axios
    .get(`/os/getordercount?customerid=${customerNumber}`)
    .then(dataArray => {
      return dataArray.data.length;
    })
    .catch(log.error);
};

export const getCoupon = async orderNumber => {
  return await axios
    .get(`/os/getordercoupon?orderid=${orderNumber}`)
    .then(dataArray => {
      if (dataArray.data) return dataArray.data;
      return "";
    })
    .catch(log.error);
};
