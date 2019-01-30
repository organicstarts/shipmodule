import { GET_BATCH, SET_SHIPMENT_ITEMS } from "../constants/actionTypes";

const getBatch = (batchNumber, history) => ({
  type: GET_BATCH,
  payload: { batchNumber, history }
});

const setShipmentItems = shiptmentItems => ({
  type: SET_SHIPMENT_ITEMS,
  shiptmentItems
});

export { getBatch, setShipmentItems };
