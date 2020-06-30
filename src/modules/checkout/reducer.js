import {fromJS} from 'immutable';
import * as Actions from './constants';

export const initState = fromJS({
  shipping_methods: {
    loading: false,
    data: [],
    error: null,
  },
  chosen_methods: {},
  payment_method: '',
  update_order: {
    loading: false,
    nonce: '',
  },
  checkout: {
    loading: false,
    redirect: '',
    result: '',
  },
});

function checkoutReducer(state = initState, {type, payload, error}) {
  switch (type) {
    case Actions.GET_SHIPPING_METHODS:
      return state.setIn(['shipping_methods', 'loading'], true);

    case Actions.GET_SHIPPING_METHODS_SUCCESS:
      return state
        .set('shipping_methods', {
          data: fromJS(payload.data),
          loading: false,
          error: null,
        })
        .set('chosen_methods', fromJS(payload.chosen_methods));

    case Actions.UPDATE_ORDER_REVIEW:
      return state.setIn(['update_order', 'loading'], true);

    case Actions.UPDATE_ORDER_REVIEW_ERROR:
      return state
        .setIn(['update_order', 'loading'], false)
        .setIn(['update_order', 'error'], error);

    case Actions.UPDATE_ORDER_REVIEW_SUCCESS:
      return state
        .setIn(['update_order', 'loading'], false)
        .setIn(['update_order', 'nonce'], payload.nonce);

    case Actions.CHECKOUT:
      return state.setIn(['checkout', 'loading'], true);

    case Actions.CHECKOUT_ERROR:
      return state
        .setIn(['checkout', 'loading'], false)
        .setIn(['checkout', 'error'], error);

    case Actions.CHECKOUT_SUCCESS:
      return state
        .setIn(['checkout', 'loading'], false)
        .setIn(['checkout', 'result'], payload.result)
        .setIn(['checkout', 'redirect'], payload.redirect);

    case Actions.UPDATE_DATA:
      return state.setIn(payload.path, payload.value);

    default:
      return state;
  }
}

export default checkoutReducer;
