import { combineReducers } from 'redux';
import authReducer from './auth';
import archiveReducer from './archive';

const rootReducer = combineReducers({
  authState: authReducer,
  archiveState: archiveReducer,
});

export default rootReducer;