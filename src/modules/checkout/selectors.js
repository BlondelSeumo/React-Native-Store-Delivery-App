import {createSelector} from 'reselect';

export const rootCheckout = state => state.checkout;

export const shippingMethodsSelector = createSelector(
  rootCheckout,
  checkout => checkout.get('shipping_methods'),
);

export const shippingMethodsDataSelector = createSelector(
  rootCheckout,
  checkout => checkout.getIn(['shipping_methods', 'data']),
);

export const shippingMethodsLoadingSelector = createSelector(
  rootCheckout,
  checkout => checkout.getIn(['shipping_methods', 'loading']),
);

export const chosenMethodsSelector = createSelector(
  rootCheckout,
  checkout => checkout.get('chosen_methods'),
);

/**
 * Payment method selector
 * @return string
 */
export const paymentMethodsSelector = createSelector(
  rootCheckout,
  checkout => checkout.get('payment_method'),
);

export const nonceSelector = createSelector(
  rootCheckout,
  checkout => checkout.getIn(['update_order', 'nonce']),
);

export const updateOrderReviewLoadingSelector = createSelector(
  rootCheckout,
  checkout => checkout.getIn(['update_order', 'loading']),
);

/**
 * The state loading progress checkout
 * @return boolean
 */
export const checkoutLoadingSelector = createSelector(
  rootCheckout,
  checkout => checkout.getIn(['checkout', 'loading']),
);

/**
 * The state loading progress checkout
 * @return boolean
 */
export const checkoutRedirectSelector = createSelector(
  rootCheckout,
  checkout => checkout.getIn(['checkout', 'redirect']),
);

/**
 * The state loading progress checkout
 * @return boolean
 */
export const checkoutResultSelector = createSelector(
  rootCheckout,
  checkout => checkout.getIn(['checkout', 'result']),
);
