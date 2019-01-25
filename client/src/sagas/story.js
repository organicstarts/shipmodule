import { call, put } from 'redux-saga/effects';
import { doAddStories } from '../actions/story';

function* handleFetchStories(action) {
  const { query } = action;
  const result = yield call({}, query);
  yield put(doAddStories(result.hits));
}

export {
  handleFetchStories,
};