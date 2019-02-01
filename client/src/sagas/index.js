import { takeEvery } from "redux-saga/effects";
import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_CHECK,
  GET_BATCH,
  GET_ORDER_DETAIL,
  GET_ALL_ORDERS
} from "../constants/actionTypes";
import { handleLogin, handleLogOut, handleLoginState } from "./auth";
import {
  handleGetBatch,
  handleGetOrderDetail,
  handleGetAllOrders
} from "./order";

export default function* watcherSaga() {
  yield takeEvery(AUTH_LOGIN, handleLogin);
  yield takeEvery(AUTH_LOGOUT, handleLogOut);
  yield takeEvery(AUTH_CHECK, handleLoginState);
  yield takeEvery(GET_BATCH, handleGetBatch);
  yield takeEvery(GET_ORDER_DETAIL, handleGetOrderDetail);
  yield takeEvery(GET_ALL_ORDERS, handleGetAllOrders);
}
