import request from 'src/utils/fetch';
import queryString from 'qs';

/**
 * Fetch category data
 * @returns {*}
 */
export const getCategories = query =>
  request.get(
    `/mobile-builder/v1/categories?${queryString.stringify(query, {
      arrayFormat: 'comma',
    })}`,
  );
