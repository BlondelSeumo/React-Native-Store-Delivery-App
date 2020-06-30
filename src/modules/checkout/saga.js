import {put, call, takeEvery, select} from 'redux-saga/effects';

import forEach from 'lodash/forEach';
import merge from 'lodash/merge';

import {
  shippingAddressSelector,
  billingAddressSelector,
} from 'src/modules/auth/selectors';
import {
  chosenMethodsSelector,
  paymentMethodsSelector,
  nonceSelector,
} from './selectors';

import {getShippingMethods, updateOrderReview, checkout} from './service';
import {handleError} from 'src/utils/error';

import * as Actions from './constants';

/**
 *
 * Update order review
 *
 */
function* updateOrderReviewSaga({payload}) {
  try {
    // Get shipping address
    const shipping = yield select(shippingAddressSelector);

    // Get billing address
    const billing = yield select(billingAddressSelector);

    // get shipping methods
    const shippingMethods = yield select(chosenMethodsSelector);

    const data = {
      shipping_method: shippingMethods.toJS(),

      first_name: billing.get('first_name'),
      last_name: billing.get('last_name'),
      address_1: billing.get('address_1'),
      address_2: billing.get('address_2'),
      city: billing.get('city'),
      state: billing.get('state'),
      company: billing.get('company'),
      postcode: billing.get('postcode'),
      country: billing.get('country'),
      email: billing.get('email'),
      phone: billing.get('phone'),

      s_first_name: shipping.get('first_name'),
      s_last_name: shipping.get('last_name'),
      s_address_1: shipping.get('address_1'),
      s_address_2: shipping.get('address_2'),
      s_city: shipping.get('city'),
      s_state: shipping.get('state'),
      s_company: shipping.get('company'),
      s_postcode: shipping.get('postcode'),
      s_country: shipping.get('country'),

      has_full_address: true,
    };

    const res = yield call(updateOrderReview, data);
    yield put({type: Actions.UPDATE_ORDER_REVIEW_SUCCESS, payload: res});
    yield call(payload.cb, res);
  } catch (error) {
    console.log(error);
    yield put({type: Actions.UPDATE_ORDER_REVIEW_ERROR, error});
  }
}

/**
 *
 * Get shipping methods
 *
 */
function* getShippingMethodSaga() {
  try {
    const data = yield call(getShippingMethods);

    const chosen_methods = {};

    // Chosen methods
    forEach(data, pke => {
      if (!pke.store) {
        chosen_methods['0'] = pke.chosen_method;
      } else {
        const vendorId =
          pke.store && pke.store.vendor_id ? pke.store.vendor_id : 0;
        chosen_methods[`${vendorId}`] = pke.chosen_method;
      }
    });

    yield put({
      type: Actions.GET_SHIPPING_METHODS_SUCCESS,
      payload: {
        data,
        chosen_methods,
      },
    });
  } catch (e) {
    yield call(handleError, e);
  }
}

/**
 *
 * Progress the checkout
 *
 */
function* processCheckout({payload}) {
  try {
    // Get shipping address
    const shipping = yield select(shippingAddressSelector);

    // Get billing address
    const billing = yield select(billingAddressSelector);

    // get payment method
    const paymentMethod = yield select(paymentMethodsSelector);

    // Get nonce
    const nonce = yield select(nonceSelector);

    const data = {
      payment_method: paymentMethod,

      billing_first_name: billing.get('first_name'),
      billing_last_name: billing.get('last_name'),
      billing_address_1: billing.get('address_1'),
      billing_address_2: billing.get('address_2'),
      billing_city: billing.get('city'),
      billing_state: billing.get('state'),
      billing_company: billing.get('company'),
      billing_postcode: billing.get('postcode'),
      billing_country: billing.get('country'),
      billing_email: billing.get('email'),
      billing_phone: billing.get('phone'),

      shipping_first_name: shipping.get('first_name'),
      shipping_last_name: shipping.get('last_name'),
      shipping_address_1: shipping.get('address_1'),
      shipping_address_2: shipping.get('address_2'),
      shipping_city: shipping.get('city'),
      shipping_state: shipping.get('state'),
      shipping_company: shipping.get('company'),
      shipping_postcode: shipping.get('postcode'),
      shipping_country: shipping.get('country'),
    };

    const res = yield call(checkout, nonce, merge(data, payload.data));
    if (res.result === 'success') {
      yield put({type: Actions.CHECKOUT_SUCCESS, payload: res});
    } else {
      yield put({type: Actions.CHECKOUT_ERROR, error: {message: res.message}});
    }
    yield call(payload.cb, res);
  } catch (error) {
    console.log(error);
    yield put({type: Actions.CHECKOUT_ERROR, error});
  }
}

export default function* cartSaga() {
  yield takeEvery(Actions.GET_SHIPPING_METHODS, getShippingMethodSaga);
  yield takeEvery(Actions.UPDATE_ORDER_REVIEW, updateOrderReviewSaga);
  yield takeEvery(Actions.CHECKOUT, processCheckout);
}
