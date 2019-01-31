import {
  AUTH_DATA_LOADED_OUT,
  AUTH_DATA_LOADED_IN,
  AUTH_CHECK_LOADED,
  AUTH_LOGIN
} from "../constants/actionTypes";
import people from "../config/people.json";

const INITIAL_STATE = {
  user: "",
  displayName: "",
  email: "",
  warehouseLocation: "",
  loading: false
};

const setLoading = (state, action) => {
  return Object.assign({}, state, {
    loading: true
  });
};
const authUserLogIn = (state, action) => {
  const warehouse = Object.keys(people)
    .map(key => people[key])
    .filter(data => data.email.includes(action.payload.user.email));
  if (action.payload) {
    return Object.assign({}, state, {
      user: action.payload.user,
      email: action.payload.user.email,
      displayName: action.payload.user.displayName,
      warehouseLocation: warehouse[0].warehouse,
      loading: false
    });
  }
  return state;
};

const authUserLogOut = (state, action) => {
  return Object.assign({}, state, {
    user: "",
    email: "",
    displayName: "",
    warehouseLocation: ""
  });
};

const authCheckUser = (state, action) => {
  const warehouse = Object.keys(people)
    .map(key => people[key])
    .filter(data => data.email.includes(action.payload.email));
  if (action.payload) {
    return Object.assign({}, state, {
      user: action.payload,
      email: action.payload.email,
      displayName: action.payload.displayName,
      warehouseLocation: warehouse[0].warehouse,
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
