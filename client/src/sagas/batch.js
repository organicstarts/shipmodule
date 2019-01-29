import { call, put } from "redux-saga/effects";
import { BATCH_LOADED } from "../constants/actionTypes";
import axios from "axios";

function* handleGetBatch(action) {
  try {
    const payload = yield call(getBatch, action.batchNumber);
    yield put({ type: BATCH_LOADED, payload });
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

const getBatch = batchNumber => {
  return axios.get(`ss/getbatch?batchNumber=${batchNumber}`).then(res => res);
};

export { handleGetBatch };
