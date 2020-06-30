import request from 'src/utils/fetch';
import queryString from 'qs';

/**
 * Get shipping method
 */
export const getShippingMethods = () =>
  request.get('/mobile-builder/v1/shipping-methods');

/**
 * Update order Review
 * @param data
 * @returns {Promise | Promise<unknown>}
 */
export const updateOrderReview = data =>
  request.post('/mobile-builder/v1/update-order-review', data);

/**
 * Checkout API
 * @param nonce
 * @param data
 * @returns {Promise | Promise<unknown>}
 */
export const checkout = (nonce, data) =>
  request.post(
    `/mobile-builder/v1/checkout?woocommerce-process-checkout-nonce=${nonce}`,
    queryString.stringify(data),
  );
