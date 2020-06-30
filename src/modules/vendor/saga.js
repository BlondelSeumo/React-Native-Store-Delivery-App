import {put, call, takeEvery} from 'redux-saga/effects';
import * as Actions from './constants';

import {getVendor, getVendorsForMap} from './service';

/**
 * Fetch vendor detail saga
 * @returns {IterableIterator<*>}
 */
function* fetchVendorDetailSaga({payload}) {
  try {
    if (payload) {
      const data = yield call(getVendor, payload);
      const vendor = {
        ...data,
        vendor_id: payload,
      };
      yield put({type: Actions.FETCH_VENDOR_DETAIL_SUCCESS, data: vendor});
    }
  } catch (e) {
    yield put({type: Actions.FETCH_VENDOR_DETAIL_ERROR, error: e});
  }
}

function* fetchVendorListForMapSaga({payload}) {
  try {
    const data = yield call(getVendorsForMap, payload);
    yield put({type: Actions.FETCH_VENDOR_LIST_SUCCESS, data});
  } catch (e) {
    console.log(e);
    yield put({type: Actions.FETCH_VENDOR_LIST_ERROR, error: e});
  }
}

export default function* vendorSaga() {
  yield takeEvery(Actions.FETCH_VENDOR_DETAIL, fetchVendorDetailSaga);
  yield takeEvery(Actions.FETCH_VENDOR_LIST, fetchVendorListForMapSaga);
}
