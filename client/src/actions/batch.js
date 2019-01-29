import { GET_BATCH, SET_SHIPMENT_ITEMS } from "../constants/actionTypes";

const getBatch = (batchNumber, resolve, reject) => ({
  type: GET_BATCH,
  batchNumber,
  resolve: resolve,
  reject: reject
});

const setShipmentItems = shiptmentItems => ({
  type: SET_SHIPMENT_ITEMS,
  shiptmentItems
});

export { getBatch, setShipmentItems };
