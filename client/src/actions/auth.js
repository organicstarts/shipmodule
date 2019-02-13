import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_CHECK } from "../constants/actionTypes";

const login = ( state ) => ({
  type: AUTH_LOGIN,
  payload: state
});

const logout = () => ({
  type: AUTH_LOGOUT
});

const checkLoginState = () => ({
  type: AUTH_CHECK
});

export { login, logout, checkLoginState };
