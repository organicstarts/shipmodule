import { GET_BATCH, GET_BATCH_DETAIL, SET_SHIPMENT_ITEMS } from "../constants/actionTypes";

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

const getBatchDetail = payload => ({
  type: GET_BATCH_DETAIL,
  payload
});

export { getBatch, setShipmentItems, getBatchDetail };
