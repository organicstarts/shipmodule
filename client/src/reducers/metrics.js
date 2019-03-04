import {
  SHIPMENT_METRICS_LOADED,
  ORDER_METRICS_LOADED
} from "../constants/actionTypes";
import moment from "moment";

const INITIAL_STATE = {
  shipmentMetrics: [],
  orderMetrics: [],
  shippedLoading: true,
  orderLoading: true
};

const setShipmentMetrics = (state, action) => {
  let byUser = [["Warehouse", "Shipped count"]];
  let byFillTime = [["Age", "Open Orders"]];
  action.payload.byUser.map(data => {
    if (data.name.includes("Julian Padro")) {
      return byUser.push(["OS East", data.count]);
    } else if (data.name.includes("Jonathan Castro")) {
      return byUser.push(["OS West", data.count]);
    } else {
      return null;
    }
  });

  action.payload.byFillTime.map(data => {
    return byFillTime.push([data.name, data.count]);
  });

  return Object.assign({}, state, {
    shipmentMetrics: { byUser: byUser, byFillTime: byFillTime },
    shippedLoading: false
  });
};

const setOrderMetrics = (state, action) => {
  let byInterval = [["Year", "Shipped", "New Orders"]];
  action.payload.byInterval.map(data => {
    let date = moment(data.interval).format("M/D");
    return byInterval.push([date, data.shippedCount, data.newCount]);
  });
  return Object.assign({}, state, {
    orderMetrics: { byInterval: byInterval },
    orderLoading: false
  });
};

function metricReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHIPMENT_METRICS_LOADED: {
      return setShipmentMetrics(state, action);
    }
    case ORDER_METRICS_LOADED: {
      return setOrderMetrics(state, action);
    }
    case "API_ERRORED": {
      return { ...INITIAL_STATE };
    }
    default:
      return state;
  }
}

export default metricReducer;
