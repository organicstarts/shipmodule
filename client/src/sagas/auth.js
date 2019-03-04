import { call, put } from "redux-saga/effects";
import {
  AUTH_DATA_LOADED_IN,
  AUTH_DATA_LOADED_OUT,
  AUTH_CHECK_LOADED,
  TOKEN_LOADED
} from "../constants/actionTypes";
import axios from "axios";
import { auth } from "../config/firebaseconf";

function* handleLogin(action) {
  try {
    const payload = yield call(logIn, action.payload);
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

function* handleGetToken() {
  try {
    const payload = yield call(getToken);
    yield put({ type: TOKEN_LOADED, payload });
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

const getToken = () => {
  return axios.post("ss/gettoken").then(result => result);
};

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
  return auth.signOut().then(() => {
    document.location.href = "/";
    return null;
  });
};

const logIn = pin => {
  return axios
    .post("/customToken", {
      pin
    })
    .then(token => {
      return auth
        .signInWithCustomToken(token.data)
        .then(result => {
          document.location.href = "/";
          return result;
        })
        .catch(error => {
          console.log(error.message);
        });
    });

  // return auth.signInWithRedirect(provider).then(result => {
  //   let email = result.additionalUserInfo.profile.hd;
  //   let isNewUser = result.additionalUserInfo.isNewUser;
  //   if (!isNewUser || email === "organicstart.com") {
  //     return result;
  //   } else {
  //     result.user.delete().then(x => {
  //       return null;
  //     });
  //   }
  // });
};

export { handleLogin, handleLogOut, handleLoginState, handleGetToken };
