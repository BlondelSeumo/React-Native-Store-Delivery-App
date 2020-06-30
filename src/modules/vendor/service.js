import request from 'src/utils/fetch';
import queryString from 'qs';

import {vendor, plugin_name} from 'src/config/vendor';

const plugin = plugin_name ? plugin_name : 'rnlab-app-control';

/**
 * Fetch vendor data
 * @returns {*}
 */

export const getVendor = vendor_id =>
  request.get(`/mobile-builder/v1/vendor/${vendor_id}`);

/**
 * Fetch products by vendor id
 * @returns {*}
 */

export const getProductsByVendorId = (vendor_id, query) =>
  request.get(
    `/dokan/v1/stores/${vendor_id}/products?${queryString.stringify(query, {
      arrayFormat: 'comma',
    })}`,
  );

/**
 * Fetch list vendor
 * @returns {*}
 */

export const getVendors = query => {
  if (vendor === 'wcfm') {
    return request.get(
      `/${plugin}/v1/vendors?${queryString.stringify(query, {
        arrayFormat: 'comma',
      })}`,
    );
  }
  return request.get(
    `/dokan/v1/stores?${queryString.stringify(query, {
      arrayFormat: 'comma',
    })}`,
  );
};

export const getVendorsForMap = data =>
  request.get(
    `/mobile-builder/v1/vendors?${queryString.stringify(data, {
      arrayFormat: 'comma',
    })}`,
  );
/**
 * Fetch review by vendor id
 * @returns {*}
 */

export const getReviewByVendorId = (vendor_id, query) => {
  return request.get(
    `dokan/v1/stores/${vendor_id}/reviews?${queryString.stringify(query, {
      arrayFormat: 'comma',
    })}`,
  );
};

/**
 * Send contact for vendor
 * @returns {*}
 */

export const sendContactVendorId = (vendor_id, data) =>
  request.post(`/dokan/v1/stores/${vendor_id}/contact`, data);

/**
 * Send review for vendor id
 * @returns {*}
 */

export const sendReviewVendorId = (vendor_id, data) =>
  request.post(`/dokan/v1/stores/${vendor_id}/reviews`, data);
