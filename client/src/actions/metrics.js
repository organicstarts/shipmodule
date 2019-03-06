import {
  GET_SHIPMENT_METRICS,
  GET_ORDER_METRICS,
  GET_CUSTOMER_METRICS,
  GET_PRODUCT_METRICS
} from "../constants/actionTypes";

const getShipmentMetrics = (token, startDate, endDate) => ({
  type: GET_SHIPMENT_METRICS,
  payload: { token, startDate, endDate }
});

const getOrderMetrics = (token, startDate, endDate) => ({
  type: GET_ORDER_METRICS,
  payload: { token, startDate, endDate }
});

const getCustomerMetrics = (token, startDate, endDate) => ({
  type: GET_CUSTOMER_METRICS,
  payload: { token, startDate, endDate }
});

const getProductMetrics = (token, startDate, endDate) => ({
  type: GET_PRODUCT_METRICS,
  payload: { token, startDate, endDate }
});

export { getShipmentMetrics, getOrderMetrics, getCustomerMetrics, getProductMetrics };
