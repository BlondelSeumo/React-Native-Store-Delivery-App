import {isImmutable} from 'immutable';

import demoConfig from './demo';
import globalConfig from './global';
import configApi from 'src/config/api';
import {ENABLE_CONFIG_DEMO} from 'src/config/development';

/**
 * General API url and check point
 * @param url
 * @since 1.0.0
 * @package rn_lekima
 * @return {{baseURL: string, isAuth: boolean, isWC: boolean, isQuery: boolean}}
 */
function generalUrl(url) {
  const apiUrl = ENABLE_CONFIG_DEMO
    ? demoConfig.getData().url
    : configApi.API_ENDPOINT;
  const publicKey = ENABLE_CONFIG_DEMO
    ? demoConfig.getData().consumer_key
    : configApi.CONSUMER_KEY;
  const secretKey = ENABLE_CONFIG_DEMO
    ? demoConfig.getData().consumer_secret
    : configApi.CONSUMER_SECRET;

  let baseURL = apiUrl + '/wp-json' + url;

  const isWC = url.indexOf('/wc') === 0;
  const isQuery = url.indexOf('?') >= 0;
  const signQuery = isQuery ? '&' : '?';
  const isAuth =
    url.indexOf('/mobile-builder') === 0 || url.indexOf('/dokan') === 0;
  const isForm =
    url.indexOf('/digits') === 0 ||
    url.indexOf('/mobile-builder/v1/checkout') === 0;

  if (isWC) {
    baseURL = `${baseURL}${signQuery}consumer_key=${publicKey}&consumer_secret=${secretKey}`;
  }

  return {
    baseURL,
    isWC,
    isAuth,
    isQuery,
    isForm,
  };
}

/**
 * Get method
 * @param url
 * @param options
 * @return {Promise<R>}
 */
const get = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const {isAuth, baseURL} = generalUrl(url);
    const token =
      isAuth && globalConfig.getToken()
        ? `Bearer ${globalConfig.getToken()}`
        : null;
    console.log(baseURL);
    fetch(baseURL, {
      ...options,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.code) {
          reject(new Error(data.message));
        } else {
          resolve(data);
        }
      })
      .catch(error => {
        return error;
      });
  });
};

const post = (url, data, method = 'POST') => {
  return new Promise((resolve, reject) => {
    const _data = isImmutable(data) ? data.toJS() : data;
    const {isAuth, baseURL, isForm} = generalUrl(url);
    const token =
      isAuth && globalConfig.getToken()
        ? `Bearer ${globalConfig.getToken()}`
        : null;
    const contentType = isForm
      ? 'application/x-www-form-urlencoded;charset=UTF-8'
      : 'application/json';

    console.log(method, baseURL, _data);

    fetch(baseURL, {
      method: method,
      headers: {
        Accept: 'application/json',
        Authorization: token,
        'Content-Type': contentType,
      },
      body: isForm
        ? _data
        : typeof _data === 'object'
        ? JSON.stringify(_data)
        : null,
    })
      .then(res => res.json())
      .then(dataApi => {
        if (dataApi.code) {
          if (isForm && (dataApi.code === '1' || dataApi.code === 1)) {
            resolve(dataApi);
          } else {
            reject(new Error(dataApi.message));
          }
        } else {
          resolve(dataApi);
        }
      })
      .catch(error => {
        console.error(error);
        reject(error);
      });
  });
};

export default {
  get,
  post,
  put: (url, data) => post(url, data, 'PUT'),
};
