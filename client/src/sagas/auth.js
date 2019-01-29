import { call, put } from "redux-saga/effects";
import {
  AUTH_DATA_LOADED_IN,
  AUTH_DATA_LOADED_OUT,
  AUTH_CHECK_LOADED
} from "../constants/actionTypes";
import { auth, provider } from "../config/firebaseconf";

function* handleLogin() {
  try {
    const payload = yield call(logIn);
    yield put({ type: AUTH_DATA_LOADED_IN, payload });
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* handleLogOut() {
  try {
    const payload = yield call(logOut);
    yield put({ type: AUTH_DATA_LOADED_OUT, payload });
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* handleLoginState() {
  try {
    const payload = yield call(checkLoginState);
    yield put({ type: AUTH_CHECK_LOADED, payload });
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

const checkLoginState = () => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(user => {
      if (user) {
        resolve(user);
      } else {
        reject(null);
      }
    });
  });
};

const logOut = () => {
  auth.signOut().then(() => {
    return null;
  });
};

const logIn = () => {
  return auth.signInWithPopup(provider).then(result => {
    let email = result.additionalUserInfo.profile.hd;
    let isNewUser = result.additionalUserInfo.isNewUser;
    if (!isNewUser || email === "organicstart.com") {
      return result;
    } else {
      result.user.delete().then(x => {
        return null;
      });
    }
  });
};

export { handleLogin, handleLogOut, handleLoginState };
