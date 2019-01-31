import {
  GET_BATCH,
  GET_ORDER_DETAIL,
  SET_SHIPMENT_ITEMS
} from "../constants/actionTypes";

const getBatch = (stateInfo, history) => {
  const { picker, shipper, batchNumber } = stateInfo;
  return {
    type: GET_BATCH,
    payload: { batchNumber, shipper, picker, history }
  };
};
const setShipmentItems = () => ({
  type: SET_SHIPMENT_ITEMS
});

const getOrderDetail = (stateInfo, history) => {
  const { picker, shipper, orderNumber } = stateInfo;
  return {
    type: GET_ORDER_DETAIL,
    payload: { orderNumber, shipper, picker, history }
  };
};

export { getBatch, setShipmentItems, getOrderDetail };
