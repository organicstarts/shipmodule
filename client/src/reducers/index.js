import { combineReducers } from 'redux';
import authReducer from './auth';
import batchReducer from './order';

const rootReducer = combineReducers({
  authState: authReducer,
  batchState: batchReducer,
});

export default rootReducer;