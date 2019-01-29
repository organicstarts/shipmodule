import { combineReducers } from 'redux';
import authReducer from './auth';
import batchReducer from './batch';

const rootReducer = combineReducers({
  authState: authReducer,
  batchState: batchReducer,
});

export default rootReducer;