import {
  AUTH_DATA_LOADED_OUT,
  AUTH_DATA_LOADED_IN,
  AUTH_CHECK_LOADED
} from "../constants/actionTypes";

const INITIAL_STATE = {
  user: "",
  displayName: "",
  email: ""
};

const authUserLogIn = (state, action) => {
  if (action.payload) {
    
    return Object.assign({}, state, {
      user: action.payload.user,
      email: action.payload.user.email,
      displayName: action.payload.user.displayName
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
      displayName: action.payload.displayName
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
    default:
      return state;
  }
}

export default authReducer;
