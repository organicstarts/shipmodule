import { call, put } from "redux-saga/effects";
import {
  SHIPMENT_METRICS_LOADED,
  ORDER_METRICS_LOADED,
  CUSTOMER_METRICS_LOADED,
  PRODUCT_METRICS_LOADED
} from "../constants/actionTypes";
import axios from "axios";

function* handleGetShipmentMetrics(action) {
  try {
    const payload = yield call(getShipmentMetrics, action.payload);
    yield put({ type: SHIPMENT_METRICS_LOADED, payload });
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* handleGetOrderMetrics(action) {
  try {
    const payload = yield call(getOrderMetrics, action.payload);
    yield put({ type: ORDER_METRICS_LOADED, payload });
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* handleGetCustomerMetrics(action) {
  try {
    const payload = yield call(getCustomerMetrics, action.payload);
    yield put({ type: CUSTOMER_METRICS_LOADED, payload });
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* handleGetProductMetrics(action) {
  try {
    const payload = yield call(getProductMetrics, action.payload);
    yield put({ type: PRODUCT_METRICS_LOADED, payload });
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

const getShipmentMetrics = async payload => {
  return await axios
    .post("ss/getshipmentmetrics", {
      token: payload.token,
      startDate: payload.startDate,
      endDate: payload.endDate
    })
    .then(result => result.data)
    .catch(error => {
      console.log(error.message);
    });
};

const getOrderMetrics = async payload => {
  return await axios
    .post("ss/getordermetrics", {
      token: payload.token,
      startDate: payload.startDate,
      endDate: payload.endDate
    })
    .then(result => result.data)
    .catch(error => {
      console.log(error.message);
    });
};

const getCustomerMetrics = async payload => {
  return await axios
    .post("ss/getcustomermetrics", {
      token: payload.token,
      startDate: payload.startDate,
      endDate: payload.endDate
    })
    .then(result => result.data)
    .catch(error => {
      console.log(error.message);
    });
};

const getProductMetrics = async payload => {
  return await axios
    .post("ss/getproductmetrics", {
      token: payload.token,
      startDate: payload.startDate,
      endDate: payload.endDate
    })
    .then(result => result.data)
    .catch(error => {
      console.log(error.message);
    });
};

export {
  handleGetShipmentMetrics,
  handleGetOrderMetrics,
  handleGetCustomerMetrics,
  handleGetProductMetrics
};
