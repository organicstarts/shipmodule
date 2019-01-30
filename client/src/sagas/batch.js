import { call, put } from "redux-saga/effects";
import { BATCH_LOADED } from "../constants/actionTypes";
import {
  getOrder,
  getOrderCount,
  getCoupon
} from "../helpers/BigCommerce/Orders";
import axios from "axios";

function* handleGetBatch(action) {
  try {
    const payload = yield call(getBatch, action.payload.batchNumber);
    yield put({ type: BATCH_LOADED, payload });
    yield put(action.payload.history.push("/batch"));
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

const getBatch = batchNumber => {
  return axios
    .get(`ss/getbatch?batchNumber=${batchNumber}`)
    .then(async res => {
      return await Promise.all(
        res.data.map(async data => {
          if (data.orderNumber) {
            await getOrder(data.orderNumber).then(async x => {
              if (x) {
                data.bigCommerce = x;
                await getOrderCount(x.customer_id).then(
                  y => (data.orderCount = y)
                );
              } else {
                data.bigCommerce = null;
                data.orderCount = null;
              }
            });
            await getCoupon(data.orderNumber).then(
              coupon => (data.couponInfo = coupon)
            );
          }
          return data;
        })
      );
    })
    .then(data => {
      return data;
    });
};

export { handleGetBatch };
