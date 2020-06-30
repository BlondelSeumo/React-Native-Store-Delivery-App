import {createSelector} from 'reselect';
import {fromJS} from 'immutable';
import {billingAddressInit, shippingAddressInit} from './config';
import {LOCATION_DEFAULT} from '../../config/constant';

export const auth = state => state.auth;
export const authSelector = createSelector(
  auth,
  data => data.toJS(),
);

export const isLoginSelector = createSelector(
  auth,
  data => data.get('isLogin'),
);

export const locationSelector = createSelector(
  auth,
  data => {
    let location;
    const user = data.get('user').toJS();
    if (user?.location?.lat && user?.location?.lng) {
      return {
        latitude: user.location.lat,
        longitude: user.location.lng,
        formatted_address: user.location.name,
      };
    } else {
      location = data.get('location').toJS();
    }
    return location || LOCATION_DEFAULT;
  },
);

/**
 * Get user id
 */
export const userIdSelector = createSelector(
  auth,
  data => data.getIn(['user', 'ID']),
);

/**
 * Get shipping address
 */
export const shippingAddressSelector = createSelector(
  auth,
  data =>
    data.get('shippingAddress') && data.get('shippingAddress').size > 0
      ? data.get('shippingAddress')
      : fromJS(shippingAddressInit),
);

/**
 * Get billding address
 */
export const billingAddressSelector = createSelector(
  auth,
  data =>
    data.get('billingAddress') && data.get('billingAddress').size > 0
      ? data.get('billingAddress')
      : fromJS(billingAddressInit),
);

/**
 * Token selector
 * @type {OutputSelector<unknown, *, (res: *) => *>}
 */
export const tokenSelector = createSelector(
  auth,
  data => data.get('token'),
);
