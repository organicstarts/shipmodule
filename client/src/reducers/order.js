import {
  BATCH_LOADED,
  FETCH_LOADED,
  ALL_ORDERS_LOADED,
  GET_ALL_ORDERS,
  GET_BATCH,
  GET_ORDER_DETAIL,
  SET_SHIPMENT_ITEMS,
  ALL_OSW_ORDERS_LOADED,
  GET_ALL_OSW_ORDERS,
  OSW_ORDER_LOADED,
  GET_OSW_ORDER
} from "../constants/actionTypes";
import _ from "lodash";
import products from "../config/products.json";
import productInfo from "../config/productinfo.json";

/*
map through batchdatas, place in 1D array and create a key/value pair
map through Keys(sku) -> add quantities of each object in key to totalCount
Special case sku.includes("TK || first char is an integer") => parse data first to combine with existing matching skus 
*/
const sortShipments = (data, warehouse) => {
  const shipmentArray = data.map(shipItems => shipItems);
  let items = [];
  let count = 0;
  let tkSku = [];
  let sortable = [];
  let name = "";

  for (let i = 0; i < shipmentArray.length; i++) {
    items = items.concat(shipmentArray[i]);
  }

  const group = _.groupBy(items, item => {
    if (
      item.sku &&
      !isNaN(item.sku.charAt(0)) &&
      item.sku.includes("-") &&
      !item.sku.includes("PRMX") &&
      item.sku.match(/\d-\d/) === null
    ) {
      let x = parseInt(item.sku.split(/-(.*)/)[0]);
      item.sku = item.sku.split(/-(.*)/)[1];
      item.combineTotal = x * item.quantity;

      // if (item.sku.charAt(0) === "H" && item.sku.includes("-DE-H")) {
      //   let x = item.sku.split(/-DE(.*)/)[0];
      //   let y = item.sku.split(/-DE(.*)/)[1];
      //   item.sku = x + y;
      // }
    } else if (item.sku && item.sku.includes("TK")) {
      let x = parseInt(item.sku.split(/-/)[1]);
      let tempSku = item.sku.split(/TK-(.\d|\d)-/)[2];
      let split = tempSku.split(/-/);
      let skusplit1 = "";
      let skusplit2 = "";

      if (
        tempSku.charAt(0) === "H" &&
        (tempSku.includes(`HP-DE`) || tempSku.includes(`HP-UK`))
      ) {
        skusplit1 = split[0] + "-" + split[1] + "-" + split[2];
        skusplit2 = split[3] + "-" + split[4] + "-" + split[5];
      } else {
        skusplit1 = split[0] + "-" + split[1];
        skusplit2 = split[2] + "-" + split[3];
      }

      let sku1 = {
        sku: skusplit1,
        aliasName: products[0][skusplit1],
        orderItemId: item.orderItemId,
        warehouseLocation: item.warehouseLocation,
        imageUrl: item.imageUrl,
        check: false,
        isTk: true,
        quantity: x / 2
      };
      let sku2 = {
        sku: skusplit2,
        aliasName: products[0][skusplit2],
        orderItemId: item.orderItemId + 1,
        warehouseLocation: item.warehouseLocation,
        imageUrl: item.imageUrl,
        check: false,
        isTk: true,
        quantity: x / 2
      };
      tkSku.push(sku1);
      tkSku.push(sku2);
    }

    return item.sku;
  });

  for (let key in group) {
    if (group[key].length > 1 && key !== "") {
      const totalCount = group[key]
        .map(x => {
          return x.combineTotal ? x.combineTotal : x.quantity;
        })
        .reduce((accumulator, amount) => {
          return accumulator + amount;
        }, 0);
      group[key].splice(1);
      group[key][0].combineTotal = totalCount;
    }
    for (let sku of tkSku) {
      if (sku.sku.includes(key)) {
        sku.isTk = false;
        if (group[key][0].combineTotal) {
          group[key][0].combineTotal += sku.quantity;
        } else {
          group[key][0].combineTotal = group[key][0].quantity + sku.quantity;
        }
      }
    }

    name = products[0][group[key][0].sku];
    if (name) {
      group[key][0].aliasName = name;
    } else {
      group[key][0].aliasName = group[key][0].name;
    }

    if (group[key].length > 1 && key === "") {
      sortable.push(group[key]);
    } else if (key.includes("TK")) {
      continue;
    } else {
      sortable.push(group[key][0]);
    }
    /*
    add total of key(sku) to the total item count if it exist
    */
    count += group[key][0].combineTotal
      ? group[key][0].combineTotal
      : group[key][0].quantity;
    if (group[key][0].warehouseLocation) {
      if (group[key][0].warehouseLocation.includes(",")) {
        const binPickNum = group[key][0].warehouseLocation.split(", ");
        if (warehouse === "East coast") {
          group[key][0].warehouseLocation = binPickNum[0];
        } else if (warehouse === "West coast") {
          group[key][0].warehouseLocation = binPickNum[1];
        }
      }
    }
  }

  if (tkSku) {
    for (let i in tkSku) {
      for (let j in sortable) {
        if (sortable[j].sku === tkSku[i].sku) {
          tkSku[i].check = true;
          if (tkSku[i].isTk) {
            sortable[j].quantity += tkSku[i].quantity;
          }
        }
      }
      if (!tkSku[i].check) {
        sortable.push(tkSku[i]);
      }
    }
  }

  sortable.sort(compare);
  let returnObj = {
    totalCount: count,
    sortable
  };
  return returnObj;
};

const calculatePackage = shipItems => {
  for (let item in shipItems) {
    if (
      productInfo[shipItems[item].sku] &&
      !shipItems[item].sku.includes("OB-") &&
      !shipItems[item].sku.includes("HOL-") &&
      !shipItems[item].sku.includes("PRMX")
    ) {
      const packagePer = productInfo[shipItems[item].sku].package;
      let fullBox = 0;
      let loose = 0;
      if (
        (shipItems[item].combineTotal
          ? shipItems[item].combineTotal
          : shipItems[item].quantity) /
          packagePer >=
        1
      ) {
        fullBox = Math.floor(
          (shipItems[item].combineTotal
            ? shipItems[item].combineTotal
            : shipItems[item].quantity) / packagePer
        );
        shipItems[item].fullBox = fullBox;

        if (
          (shipItems[item].combineTotal
            ? shipItems[item].combineTotal
            : shipItems[item].quantity) /
            packagePer !==
          fullBox
        ) {
          loose =
            (shipItems[item].combineTotal
              ? shipItems[item].combineTotal
              : shipItems[item].quantity) -
            fullBox * packagePer;
          shipItems[item].loose = loose;
        }
      }
    }
  }
  return shipItems;
};

//helper func to compare warehouse locations
const compare = (a, b) => {
  let x = a.warehouseLocation;
  let y = b.warehouseLocation;
  if (!x) {
    x = 999;
  } else if (isNaN(x)) {
    x = x.charCodeAt(0) + 100;
  }
  if (!y) {
    y = 999;
  } else if (isNaN(y)) {
    y = y.charCodeAt(0) + 100;
  }

  if (isNaN(x) && isNaN(y)) {
    return x.localeCompare(y);
  }
  return x - y;
};

/*
Helper sort batch by order number
*/
const compareBatch = (a, b) => {
  return b.orderNumber - a.orderNumber;
};

const INITIAL_STATE = {
  batchNumber: "",
  orderNumber: "",
  picker: "",
  shipper: "",
  batchDatas: [],
  shipmentItems: [],
  fetchDatas: [],
  savedFraud: [],
  fraudDatas: [],
  newDatas: [],
  loading: true,
  prevBatch: [],
  oswOrders: [],
  oswLoading: false,
  showOsw: false
};

const applyBatch = (state, action) => {
  const data = action.payload.sort(compareBatch);
  return Object.assign({}, state, {
    batchDatas: data,
    shipmentItems: data.map(datas => datas.shipmentItems)
  });
};

const applyFetch = (state, action) => {
  const data = action.payload[0] ? action.payload[0] : [];
  return Object.assign({}, state, {
    fetchDatas: data,
    loading: false
  });
};

const applyFraud = (state, action) => {
  const data = action.payload;
  return Object.assign({}, state, {
    newDatas: data,
    fraudDatas: state.savedFraud.concat(data.reverse()),
    loading: false
  });
};

const setShipmentItems = (state, action) => {
  const data = sortShipments(state.shipmentItems, action.warehouse);
  const totalCount = data.totalCount;
  const calculatedData = calculatePackage(data.sortable);
  return Object.assign({}, state, {
    shipmentItems: calculatedData,
    totalCount: totalCount,
    loading: false
  });
};

const applyOswOrders = (state, action) => {
  return Object.assign({}, state, {
    oswOrders: action.payload,
    showOsw: true,
    oswLoading: false
  });
};

function batchReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_BATCH: {
      let saveBatchInfo = state.prevBatch;
      if (saveBatchInfo) {
        if (saveBatchInfo.length > 4) {
          saveBatchInfo.shift();
        }
        if (
          !saveBatchInfo.find(
            data => action.payload.batchNumber === data.batchNumber
          )
        ) {
          saveBatchInfo.push({
            batchNumber: action.payload.batchNumber,
            picker: action.payload.picker,
            shipper: action.payload.shipper
          });
        }
      }
      return Object.assign({}, state, {
        batchNumber: action.payload.batchNumber,
        picker: action.payload.picker,
        shipper: action.payload.shipper,
        loading: true,
        prevBatch: saveBatchInfo
      });
    }
    case GET_ORDER_DETAIL: {
      return Object.assign({}, state, {
        orderNumber: action.payload.orderNumber,
        picker: action.payload.picker,
        shipper: action.payload.shipper,
        loading: true
      });
    }
    case BATCH_LOADED: {
      return applyBatch(state, action);
    }
    case SET_SHIPMENT_ITEMS: {
      return setShipmentItems(state, action);
    }
    case FETCH_LOADED: {
      return applyFetch(state, action);
    }
    case GET_ALL_ORDERS: {
      return Object.assign({}, state, {
        savedFraud: action.payload.savedData,
        loading: true
      });
    }
    case ALL_ORDERS_LOADED: {
      return applyFraud(state, action);
    }
    case ALL_OSW_ORDERS_LOADED: {
      return applyOswOrders(state, action);
    }
    case OSW_ORDER_LOADED: {
      return applyOswOrders(state, action);
    }
    case GET_ALL_OSW_ORDERS: {
      return Object.assign({}, state, {
        showOsw: false,
        oswLoading: true
      });
    }
    case GET_OSW_ORDER: {
      return Object.assign({}, state, {
        showOsw: false,
        oswLoading: true
      });
    }
    default:
      return state;
  }
}

export default batchReducer;
