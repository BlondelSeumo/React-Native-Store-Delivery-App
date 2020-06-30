import {createSelector} from 'reselect';

export const rootCart = state => state.cart;

/**
 * Cart selector
 * @package rn_food
 * @since 1.0.0
 */
export const cartSelector = createSelector(
  rootCart,
  cart => cart.getIn(['cart_data', 'items']),
);

/**
 * Cart total selector
 * @package rn_food
 * @since 1.0.0
 */
export const cartTotalSelector = createSelector(
  rootCart,
  cart => cart.getIn(['cart_data', 'totals']),
);

/**
 * Cart coupons applied selector
 * @package rn_food
 * @since 1.0.0
 */
export const couponsAppliedSelector = createSelector(
  rootCart,
  cart => cart.getIn(['cart_data', 'coupons']).toJS(),
);

/**
 * Cart coupons add loading selector
 * @package rn_food
 * @since 1.0.0
 */
export const couponsAddLoadingSelector = createSelector(
  rootCart,
  cart => cart.get('cart_update_add_coupon_loading'),
);

/**
 * Cart coupons delete loading selector
 * @package rn_food
 * @since 1.0.0
 */
export const couponsDeleteLoadingSelector = createSelector(
  rootCart,
  cart => cart.get('cart_update_delete_coupon_loading'),
);

/**
 * Cart select loading
 * @package rn_food
 * @since 1.0.0
 */
export const cartSelectorLoading = createSelector(
  rootCart,
  cart => cart.get('cart_loading'),
);

/**
 * Select cart list
 */
export const selectCartList = createSelector(
  rootCart,
  cart => cart.get('line_items'),
);

/**
 * Count item in cart
 */
export const cartSizeSelector = createSelector(
  cartSelector,
  items => items.reduce((total, item) => item.get('quantity') + total, 0),
);

/**
 * Select shipping address
 */
export const selectShippingAddress = createSelector(
  rootCart,
  cart => cart.get('shipping'),
);

/**
 * Selected shipping method
 */
export const selectedShippingMethod = createSelector(
  rootCart,
  cart => cart.getIn(['shipping_lines', 0]),
);

/**
 * Select billing address
 */
export const selectBillingAddress = createSelector(
  rootCart,
  cart => cart.get('billing'),
);

/**
 * Selected payment method
 */
export const selectedPaymentMethod = createSelector(
  rootCart,
  cart => cart.get('payment_method'),
);

/**
 * Selected coupon list
 */
export const couponLinesSelector = createSelector(
  rootCart,
  cart => cart.get('coupon_lines'),
);

/**
 * Selected note customer
 */
export const noteCustomerSelector = createSelector(
  rootCart,
  cart => cart.get('customer_note'),
);

/**
 * get shipping method
 */
export const shippingMethodSelector = createSelector(
  rootCart,
  cart => cart.get('shipping_method'),
);
