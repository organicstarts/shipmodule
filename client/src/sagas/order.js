import { call, put } from "redux-saga/effects";
import {
  BATCH_LOADED,
  FETCH_LOADED,
  ALL_ORDERS_LOADED,
  ALL_OSW_ORDERS_LOADED,
  OSW_ORDER_LOADED
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
    const payload = yield call(getShipmentOrder, action.payload);
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
function* handleGetAllOswOrders(action) {
  try {
    const payload = yield call(getAllOswOrders, action.payload);
    yield put({ type: ALL_OSW_ORDERS_LOADED, payload });
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}

function* handleGetOswOrder(action) {
  try {
    const payload = yield call(getOswOrder, action.payload);
    yield put({ type: OSW_ORDER_LOADED, payload });
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

const getShipmentOrder = payload => {
  return axios
    .get(
      `ss/getshipmentorder?orderNumber=${payload.orderNumber}&storeId=${
        payload.storeId
      }`
    )
    .then(async data => {
      let filter = data.data.filter(x => x.orderNumber === payload.orderNumber);
      return await getBatchDetails(filter);
    });
};

const getBatchDetails = async data => {
  return await Promise.all(
    data.map(async data => {
      if (data.orderNumber) {
        if (data.advancedOptions.storeId === 135943) {
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
        } else {
          await axios
            .get(`ss/getsingleorder?orderId=${data.orderId}`)
            .then(x => {
              data.couponInfo = x.data.coupon;
              data.shippingAmount = x.data.shippingAmount;
            });
        }
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

const getOswOrder = async action => {
  return await axios
    .get(`/osw/getorder?orderid=${action.orderNumber}&inHouse=true`)
    .then(async res => {
      let resWithRelabel = [];
      await axios
        .get(`osw/bpost?tracking=${res.data.tracking.Other}`)
        .then(xmlData => {
          let resXML = new DOMParser().parseFromString(
            xmlData.data,
            "application/xml"
          );

          if (resXML.getElementsByTagName("relabelBarcode")[0]) {
            res.data["relabel"] = resXML.getElementsByTagName(
              "relabelBarcode"
            )[0].textContent;
            resWithRelabel.push(res.data);
          }
        });
      if (res.data.shippingMethod !== null) {
        if (
          (res.data.tracking.FedEx || res.data.tracking.USPS) &&
          res.data.shippingMethod.includes("EXPRESS")
        ) {
          console.log(res.data);
          resWithRelabel.push(res.data);
        }
      }
      return resWithRelabel;
    })
    .then(async data => {
      let fulfilledData = [];

      if (data.length > 0) {
        await Promise.all(
          data[0].lineItems.map(async item => {
            if (
              item.fulfillmentService === "mike" &&
              data[0].relabel &&
              item.fulfillmentStatus
            ) {
              await axios
                .post("osw/fulfillment", {
                  orderId: data[0].id,
                  locationId: 30977539,
                  tracking: data[0].relabel,
                  trackingCompany:
                    data[0].countryCode === "CA" ? "Canada Post" : "USPS",
                  lineItemId: item.id,
                  notifyCustomer: true
                })
                .then(res => {
                  console.log(`success?`, res);
                  fulfilledData.push(data);
                });
            }

            if (
              item.fulfillmentService === "mike" &&
              !data[0].relabel &&
              item.fulfillmentStatus &&
              data[0].shippingMethod.includes("EXPRESS")
            ) {
              let carrierArr = Object.keys(data[0].tracking);
              let carrier = carrierArr
                .filter(data => data.includes("FedEx"))
                .toString();
              if (!carrier) {
                carrier = carrierArr
                  .filter(data => data.includes("USPS"))
                  .toString();
              }
              await axios
                .post("osw/fulfillment", {
                  orderId: data[0].id,
                  locationId: 30977539,
                  tracking: data[0].tracking[carrier],
                  trackingCompany: carrier,
                  lineItemId: item.id,
                  notifyCustomer: true
                })
                .then(res => {
                  console.log("success?", res);
                  fulfilledData.push(data);
                });
            }
          })
        );
      }
      return fulfilledData;
    })
    .catch(error => console.log(error));
};

const getAllOswOrders = async action => {
  return await axios
    .get(`/osw/getallorders?endTime=${action.endTime}`)
    .then(async res => {
      let resWithRelabel = [];
      await Promise.all(
        res.data.map(async data => {
          if (data.tracking !== null && data.tracking.charAt(0) === "3") {
            console.log(data.tracking);
            await axios
              .get(`osw/bpost?tracking=${data.tracking}`)
              .then(xmlData => {
                let resXML = new DOMParser().parseFromString(
                  xmlData.data,
                  "application/xml"
                );
                if (resXML.getElementsByTagName("relabelBarcode")[0]) {
                  data["relabel"] = resXML.getElementsByTagName(
                    "relabelBarcode"
                  )[0].textContent;
                  resWithRelabel.push(data);
                }
              });
            if (!data.note) {
              await axios
                .put("osw/savenote", {
                  orderId: data.id,
                  bpostTracking: data.tracking
                })
                .then(res => {
                  console.log("saved note");
                });
            }
            // if (data.shippingMethod !== null) {
            //   if (
            //     (data.tracking.FedEx || data.tracking.USPS) &&
            //     data.shippingMethod.includes("EXPRESS")
            //   ) {
            //     console.log(data);
            //     resWithRelabel.push(data);
            //   }
            // }
          }
        })
      );
      return resWithRelabel;
    })
    .then(async fulfillData => {
      console.log(fulfillData);
      let fulfilledData = [];
      await Promise.all(
        fulfillData.map(async data => {
          await Promise.all(
            data.lineItems.map(async item => {
              if (
                // item.fulfillment_service === "mike" &&
                data.relabel &&
                item.fulfillment_status &&
                item.fulfillment_service === "manual" &&
                data.shippingMethod.includes("FREE")
              ) {
                await axios
                  .put("osw/fulfillment", {
                    orderId: data.id,
                    fulfillmentId: data.fulfillmentId,
                    locationId: 30977539,
                    tracking: data.relabel,
                    trackingCompany:
                      data.countryCode === "CA" ? "Canada Post" : "USPS",
                    lineItemId: item.id,
                    notifyCustomer: true
                  })
                  .then(res => {
                    console.log(`success? ${data.countryCode}`, res);
                    fulfilledData.push(data);
                  });
              }
              // if (
              //   // item.fulfillment_service === "mike" &&
              //   !data.relabel &&
              //   item.fulfillment_status &&
              //   item.fulfillment_service === "manual" &&
              //   data.shippingMethod.includes("EXPRESS")
              // ) {
              //   let carrierArr = Object.keys(data.tracking);
              //   let carrier = carrierArr
              //     .filter(data => data.includes("FedEx"))
              //     .toString();
              //   if (!carrier) {
              //     carrier = carrierArr
              //       .filter(data => data.includes("USPS"))
              //       .toString();
              //   }
              //   console.log("hi", carrier);

              //   await axios
              //     .post("osw/fulfillment", {
              //       orderId: data.id,
              //       locationId: 30977539,
              //       tracking: data.tracking[carrier],
              //       trackingCompany: carrier,
              //       lineItemId: item.id,
              //       notifyCustomer: true
              //     })
              //     .then(res => {
              //       console.log("success?", res);
              //       fulfilledData.push(data);
              //     });
              // }
            })
          );
        })
      );
      return fulfilledData;
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
      console.log(datas);
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

export {
  handleGetBatch,
  handleGetOrderDetail,
  handleGetAllOrders,
  handleGetAllOswOrders,
  handleGetOswOrder
};
