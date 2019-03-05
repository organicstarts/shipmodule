import {
  SHIPMENT_METRICS_LOADED,
  ORDER_METRICS_LOADED,
  CUSTOMER_METRICS_LOADED
} from "../constants/actionTypes";
import moment from "moment";
import stateAbbrv from "../config/states_hash_abbrv.json";
const INITIAL_STATE = {
  shipmentMetrics: [],
  orderMetrics: [],
  customerMetrics: {},
  customerLoading: true,
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
    shipmentMetrics: {
      byUser: byUser,
      byFillTime: byFillTime,
      byCarrier: action.payload.byCarrier,
      returns: action.payload.summary.returns,
      shipments: action.payload.summary.shipments
    },
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

const setCustomerMetrics = (state, action) => {
  let byState = {};
  let eastCount = 0;
  let westCount = 0;
  action.payload.byState.map(data => {
    if (stateAbbrv[data.name]) {
      let stateCode = stateAbbrv[data.name].code;
      let stateLocation = stateAbbrv[data.name].location;
      if (stateLocation === "east") eastCount += data.count;
      if (stateLocation === "west") westCount += data.count;
      byState[stateCode] = { data: data.count, fillKey: stateLocation };
    }
    return byState;
  });
  return Object.assign({}, state, {
    customerMetrics: {
      byState: byState,
      eastTotal: eastCount,
      westTotal: westCount
    },
    customerLoading: false
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
    case CUSTOMER_METRICS_LOADED: {
      return setCustomerMetrics(state, action);
    }
    case "API_ERRORED": {
      return { ...INITIAL_STATE };
    }
    default:
      return state;
  }
}

export default metricReducer;
