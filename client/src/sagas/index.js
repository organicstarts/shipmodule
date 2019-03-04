import { takeEvery } from "redux-saga/effects";
import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_CHECK,
  GET_BATCH,
  GET_ORDER_DETAIL,
  GET_ALL_ORDERS,
  GET_TOKEN,
  GET_SHIPMENT_METRICS,
  GET_ORDER_METRICS
} from "../constants/actionTypes";
import {
  handleLogin,
  handleLogOut,
  handleLoginState,
  handleGetToken
} from "./auth";
import {
  handleGetBatch,
  handleGetOrderDetail,
  handleGetAllOrders
} from "./order";
import { handleGetShipmentMetrics, handleGetOrderMetrics } from "./metrics";

export default function* watcherSaga() {
  yield takeEvery(AUTH_LOGIN, handleLogin);
  yield takeEvery(AUTH_LOGOUT, handleLogOut);
  yield takeEvery(AUTH_CHECK, handleLoginState);
  yield takeEvery(GET_TOKEN, handleGetToken);
  yield takeEvery(GET_BATCH, handleGetBatch);
  yield takeEvery(GET_ORDER_DETAIL, handleGetOrderDetail);
  yield takeEvery(GET_ALL_ORDERS, handleGetAllOrders);
  yield takeEvery(GET_SHIPMENT_METRICS, handleGetShipmentMetrics);
  yield takeEvery(GET_ORDER_METRICS, handleGetOrderMetrics);
}
