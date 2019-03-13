import {
  GET_BATCH,
  GET_ORDER_DETAIL,
  GET_ALL_ORDERS,
  SET_SHIPMENT_ITEMS,
  GET_ALL_OSW_ORDERS
} from "../constants/actionTypes";

const getBatch = (stateInfo, history) => {
  const { picker, shipper, batchNumber } = stateInfo;
  return {
    type: GET_BATCH,
    payload: { batchNumber, shipper, picker, history }
  };
};
const setShipmentItems = warehouse => ({
  type: SET_SHIPMENT_ITEMS,
  warehouse
});

const getOrderDetail = (stateInfo, history) => {
  const { picker, shipper, orderNumber } = stateInfo;
  return {
    type: GET_ORDER_DETAIL,
    payload: { orderNumber, shipper, picker, history }
  };
};

const getAllOrders = (stateInfo, history) => {
  const { oneData, savedData } = stateInfo;
  return {
    type: GET_ALL_ORDERS,
    payload: { oneData, savedData, history }
  };
};

const oswGetAllOrders = endTime => {
  return {
    type: GET_ALL_OSW_ORDERS,
    payload: { endTime }
  };
};

export {
  getBatch,
  setShipmentItems,
  getOrderDetail,
  getAllOrders,
  oswGetAllOrders
};
