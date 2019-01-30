import { BATCH_LOADED, GET_BATCH } from "../constants/actionTypes";

/*
Helper sort batch by order number
*/
const compareBatch = (a, b) => {
  return b.orderNumber - a.orderNumber;
};

const INITIAL_STATE = {
  batchNumber: "",
  batchDatas: [],
  shipmentItems: []
};

const applyBatch = (state, action) => {
  const data = action.payload.sort(compareBatch);
  return Object.assign({}, state, {
    batchDatas: [...state.batchDatas, data]
  });
};

function batchReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_BATCH: {
      return Object.assign({}, state, {
        batchNumber: action.payload.batchNumber
      });
    }
    case BATCH_LOADED: {
      return applyBatch(state, action);
    }
    default:
      return state;
  }
}

export default batchReducer;
