import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_CHECK, GET_TOKEN } from "../constants/actionTypes";

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

const getToken = () => ({
  type: GET_TOKEN
})
export { login, logout, checkLoginState, getToken };
