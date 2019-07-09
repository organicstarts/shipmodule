import {
  SHIPMENT_METRICS_LOADED,
  ORDER_METRICS_LOADED,
  CUSTOMER_METRICS_LOADED,
  PRODUCT_METRICS_LOADED
} from "../constants/actionTypes";
import moment from "moment";
import stateAbbrv from "../config/states_hash_abbrv.json";
const INITIAL_STATE = {
  shipmentMetrics: [],
  orderMetrics: [],
  customerMetrics: {},
  productMetrics: [],
  productLoading: true,
  customerLoading: true,
  shippedLoading: true,
  orderLoading: true
};

const setShipmentMetrics = (state, action) => {
  let byUser = [["Warehouse", "Shipped count"]];
  let byFillTime = [["Age", "Open Orders"]];
  let eastCount = 0;
  let westCount = 0;
  action.payload.byUser.map(data => {
    if (
      data.name.includes("Julian Padro") ||
      data.name.includes("Jason Rouvas") ||
      data.name.includes("Richard Fernandez")
    ) {
      return (eastCount += data.count);
    }
    if (
      data.name.includes("Stephen Tagarelli") ||
      data.name.includes("Jonathan Castro")
    ) {
      return (westCount += data.count);
    } else {
      return null;
    }
  });
  byUser.push(["OS East", eastCount]);
  byUser.push(["OS West", westCount]);

  action.payload.byFillTime.map(data => {
    return byFillTime.push([data.name + " Days", data.count]);
  });

  return Object.assign({}, state, {
    shipmentMetrics: {
      byUser: byUser,
      byFillTime: byFillTime,
      byCarrier: action.payload.byCarrier
    },
    shippedLoading: false
  });
};

const setOrderMetrics = (state, action) => {
  let byInterval = [["Year", "Shipped", "Orders"]];
  let date;
  action.payload.byInterval.map(data => {
    if (action.payload.byInterval[0].interval.includes("T03:")) {
      date = moment(data.interval).format("M/D");
    } else {
      date = moment(data.interval).format("h a");
    }
    return byInterval.push([date, data.shippedCount, data.newCount]);
  });
  return Object.assign({}, state, {
    orderMetrics: {
      byInterval: byInterval,
      shipments: action.payload.summary[0].shippedCount,
      orders: action.payload.summary[0].totalOrderCount
    },
    orderLoading: false
  });
};

const setProductMetrics = (state, action) => {
  let top5 = [];
  action.payload.top5ByQuantity.map(data => {
    return top5.push({
      name: data.name,
      image: data.imageUrl,
      count: data.count
    });
  });
  return Object.assign({}, state, {
    productMetrics: {
      top5: top5
    },
    productLoading: false
  });
};

const setCustomerMetrics = (state, action) => {
  let byState = {};
  let eastCount = 0;
  let westCount = 0;
  let byInterval = [["Year", "New Customers", "Returning Customers"]];
  let date;
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
  action.payload.byInterval.map(data => {
    if (action.payload.byInterval[0].interval.includes("T03:")) {
      date = moment(data.interval).format("M/D");
    } else {
      date = moment(data.interval).format("ha");
    }
    return byInterval.push([date, data.newCount, data.returningCount]);
  });

  return Object.assign({}, state, {
    customerMetrics: {
      byState: byState,
      byInterval: byInterval,
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
    case PRODUCT_METRICS_LOADED: {
      return setProductMetrics(state, action);
    }
    case "API_ERRORED": {
      return { ...INITIAL_STATE };
    }
    default:
      return state;
  }
}

export default metricReducer;
