import {fromJS} from 'immutable';

import * as Actions from './constants';

const initState = fromJS({
  loading: false,
  data: {},
  isLoadingReview: false,
  vendorMaps: [],
});

export default function vendorReducer(state = initState, action = {}) {
  switch (action.type) {
    case Actions.FETCH_VENDOR_DETAIL:
      return state.set('loading', true).set('data', fromJS({}));
    case Actions.FETCH_VENDOR_DETAIL_SUCCESS:
      return state.set('loading', false).set('data', fromJS(action.data));
    case Actions.FETCH_VENDOR_DETAIL_ERROR:
      return state.set('loading', false);
    case Actions.FETCH_VENDOR_LIST_SUCCESS:
      return state.set('vendorMaps', fromJS(action.data));
    case Actions.SET_LOADING_REVIEW:
      return state.set('isLoadingReview', true);
    default:
      return state;
  }
}
