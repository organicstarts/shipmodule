import { combineReducers } from "redux";
import authReducer from "./auth";
import batchReducer from "./order";
import metricReducer from "./metrics";

const rootReducer = combineReducers({
  authState: authReducer,
  batchState: batchReducer,
  metricState: metricReducer
});

export default rootReducer;
