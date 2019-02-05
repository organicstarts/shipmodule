import { call, put } from "redux-saga/effects";
import {
  BATCH_LOADED,
  FETCH_LOADED,
  ALL_ORDERS_LOADED
} from "../constants/actionTypes";
import axios from "axios";

function* handleGetBatch(action) {
  try {
    const payload = yield call(getBatch, action.payload.batchNumber);
    yield put({ type: BATCH_LOADED, payload });
    action.payload.history.push("/batchList");
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* handleGetOrderDetail(action) {
  try {
    const payload = yield call(getShipmentOrder, action.payload.orderNumber);
    yield put({ type: FETCH_LOADED, payload });
    action.payload.history.push("/fetchDetail");
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* handleGetAllOrders(action) {
  try {
    const payload = yield call(getAllOrders, action.payload.oneData);
    yield put({ type: ALL_ORDERS_LOADED, payload });
    action.payload.history.push("/fraudList");
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

const getBatch = batchNumber => {
  return axios
    .get(`ss/getbatch?batchNumber=${batchNumber}`)
    .then(async data => {
      return await getBatchDetails(data.data);
    });
};

const getShipmentOrder = orderNumber => {
  return axios
    .get(`ss/getshipmentorder?orderNumber=${orderNumber}`)
    .then(async data => {
      return await getBatchDetails(data.data);
    });
};

const getBatchDetails = async data => {
  return await Promise.all(
    data.map(async data => {
      if (data.orderNumber) {
        await getOrder(data.orderNumber).then(async x => {
          if (x) {
            data.bigCommerce = x;
            await getOrderCount(x.customer_id).then(y => (data.orderCount = y));
          } else {
            data.bigCommerce = null;
            data.orderCount = null;
          }
        });
        await getCoupon(data.orderNumber).then(
          coupon => (data.couponInfo = coupon)
        );

        return data;
      }
    })
  );
};

const getOrder = async orderNumber => {
  return await axios
    .get(`/os/getorder?orderid=${orderNumber}`)
    .then(dataArray => {
      return dataArray.data;
    })
    .catch(error => console.log(error));
};

const getAllOrders = async minId => {
  return await axios
    .get(`/os/getallorders?min=${minId}`)
    .then(dataArray => {
      return dataArray.data;
    })
    .then(async datas => {
      return await Promise.all(
        datas.map(async data => {
          if (data.id)
            await getShippingInfo(data.id).then(async x => {
              data.shippingInfo = x;
            });
          await getOrderCount(data.customer_id).then(
            y => (data.orderCount = y)
          );
          return data;
        })
      );
    })
    .catch(error => console.log(error));
};

const getShippingInfo = async orderId => {
  return await axios
    .get(`/os/getshipping?orderid=${orderId}`)
    .then(dataArray => {
      return dataArray.data;
    })
    .catch(error => console.log(error));
};

const getOrderCount = async customerNumber => {
  return await axios
    .get(`/os/getordercount?customerid=${customerNumber}`)
    .then(dataArray => {
      return dataArray.data.length;
    })
    .catch(error => console.log(error));
};

const getCoupon = async orderNumber => {
  return await axios
    .get(`/os/getordercoupon?orderid=${orderNumber}`)
    .then(dataArray => {
      if (dataArray.data) return dataArray.data;
      return "";
    })
    .catch(error => console.log(error));
};

export { handleGetBatch, handleGetOrderDetail, handleGetAllOrders };
