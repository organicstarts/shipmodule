import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_CHECK } from "../constants/actionTypes";

const login = () => ({
  type: AUTH_LOGIN
});

const logout = () => ({
  type: AUTH_LOGOUT
});

const checkLoginState = () => ({
  type: AUTH_CHECK
});

export { login, logout, checkLoginState };
