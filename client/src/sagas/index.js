import { takeEvery } from "redux-saga/effects";
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_CHECK } from "../constants/actionTypes";
import { handleLogin, handleLogOut, handleLoginState } from "./auth";

export default function* watcherSaga() {
  yield takeEvery(AUTH_LOGIN, handleLogin);
  yield takeEvery(AUTH_LOGOUT, handleLogOut);
  yield takeEvery(AUTH_CHECK, handleLoginState);
}

