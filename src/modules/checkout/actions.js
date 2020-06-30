import * as Actions from './constants';

/**
 * Update order review
 * @param cb call back function
 * @returns {{payload: *, type: string}}
 */
export function updateOrderReview(cb) {
  return {
    type: Actions.UPDATE_ORDER_REVIEW,
    payload: {
      cb,
    },
  };
}

/**
 * Get shipping methods
 * @returns {{type: string}}
 */
export function getShippingMethods() {
  return {
    type: Actions.GET_SHIPPING_METHODS,
  };
}

/**
 * Progress checkout
 * @returns {{payload: {data: {}, none: string}, type: string}}
 */
export function checkout(cb, data: {}) {
  return {
    type: Actions.CHECKOUT,
    payload: {cb, data},
  };
}

/**
 * Update data checkout state
 * @param path
 * @param value
 * @returns {{payload: {path: *, value: *}, type: string}}
 */
export function updateData(path, value) {
  return {
    type: Actions.UPDATE_DATA,
    payload: {
      path,
      value,
    },
  };
}
