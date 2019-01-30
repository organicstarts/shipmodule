import { BATCH_LOADED, SET_SHIPMENT_ITEMS } from "../constants/actionTypes";

/*
Helper sort batch by order number
*/
const compareBatch = (a, b) => {
  return b.orderNumber - a.orderNumber;
};

const INITIAL_STATE = {
  batchDatas: [],
  shipmentItems: []
};

const applyBatch = (state, action) => {
  const data = action.payload.sort(compareBatch);
  return {
    ...state,
    batchDatas: [...state.batchDatas, data]
  };
};

const setShipmentItems = (state, action) => {
  return {
    ...state,
    shipmentItems: [...state.shipmentItems, action.shipmentItems]
  };
};

function batchReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case BATCH_LOADED: {
      return applyBatch(state, action);
    }
    case SET_SHIPMENT_ITEMS: {
      return setShipmentItems(state, action);
    }
    default:
      return state;
  }
}

export default batchReducer;
