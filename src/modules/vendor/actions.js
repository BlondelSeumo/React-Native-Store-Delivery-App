import * as Actions from './constants';

/**
 * Fetch vendor detail
 * @returns {{type: string}}
 */
export function fetchVendorDetail(id) {
  return {
    type: Actions.FETCH_VENDOR_DETAIL,
    payload: id,
  };
}

/**
 * Fetch vendor detail success
 * @returns {{type: string, data: *}}
 */
export function fetchVendorDetailSuccess(data) {
  return {
    type: Actions.FETCH_VENDOR_DETAIL_SUCCESS,
    data,
  };
}

/**
 * Set value loading review
 * @returns {{type: string, payload: boolean}}
 */
export function setLoadingReview(loading) {
  return {
    type: Actions.SET_LOADING_REVIEW,
    payload: loading,
  };
}

/**
 * Fetch vendor list for map
 * @returns {{type: object}}
 */
export function fetchVendorListForMap(payload) {
  return {
    type: Actions.FETCH_VENDOR_LIST,
    payload,
  };
}

/**
 * Fetch vendor detail success
 * @returns {{type: string, data: *}}
 */
export function fetchVendorListSuccess(data) {
  return {
    type: Actions.FETCH_VENDOR_LIST_SUCCESS,
    data,
  };
}
