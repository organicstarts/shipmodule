import {
  AUTH_DATA_LOADED_OUT,
  AUTH_DATA_LOADED_IN,
  AUTH_CHECK_LOADED,
  AUTH_LOGIN
} from "../constants/actionTypes";

const INITIAL_STATE = {
  user: "",
  displayName: "",
  email: "",
  loading: false
};

const setLoading = (state, action) => {
  return Object.assign({}, state, {
    loading: true
  });
};
const authUserLogIn = (state, action) => {
  if (action.payload) {
    return Object.assign({}, state, {
      user: action.payload.user,
      email: action.payload.user.email,
      displayName: action.payload.user.displayName,
      loading: false
    });
  }
  return state;
};

const authUserLogOut = (state, action) => {
  return Object.assign({}, state, {
    user: "",
    email: "",
    displayName: ""
  });
};

const authCheckUser = (state, action) => {
  if (action.payload) {
    return Object.assign({}, state, {
      user: action.payload,
      email: action.payload.email,
      displayName: action.payload.displayName,
      loading: false
    });
  }
  return state;
};

function authReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_DATA_LOADED_IN: {
      return authUserLogIn(state, action);
    }
    case AUTH_DATA_LOADED_OUT: {
      return authUserLogOut(state, action);
    }
    case AUTH_CHECK_LOADED: {
      return authCheckUser(state, action);
    }
    case AUTH_LOGIN: {
      return setLoading(state, action);
    }
    default:
      return state;
  }
}

export default authReducer;
