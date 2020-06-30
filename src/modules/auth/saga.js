import firebase from '@react-native-firebase/app';
import {GoogleSignin} from '@react-native-community/google-signin';
import {LoginManager} from 'react-native-fbsdk';
import AsyncStorage from '@react-native-community/async-storage';
import {put, call, select, takeEvery} from 'redux-saga/effects';
import {showMessage} from 'react-native-flash-message';
import {handleError} from 'src/utils/error';

import languages from 'src/locales';

import * as Actions from './constants';

import {userIdSelector} from './selectors';
import {
  loginWithEmail,
  loginWithMobile,
  registerWithEmail,
  loginWithGoogle,
  loginWithFacebook,
  logout,
  changeEmail,
  changePassword,
  forgotPassword,
  updateCustomer,
  getCustomer,
  loginWithApple,
  digitsLoginUser,
  digitsCreateUser,
  digitsLogoutUser,
  isLogin,
} from './service';

import {validatorForgotPassword, validatorChangePassword} from './validator';

import appleAuth, {
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';

import {languageSelector, requiredLoginSelector} from '../common/selectors';

import NavigationService from 'src/utils/navigation';
import {rootSwitch} from 'src/config/navigator';
import {shippingAddressInit} from './config';

/**
 * Sign out
 * @returns {Promise<void>}
 */
async function signOut() {
  const method = await AsyncStorage.getItem('method');

  // Logout rest api
  await logout();

  // Sign Out Firebase
  if (method === 'otp') {
    await firebase.auth().signOut();
  }

  // Sign Out Google
  if (method === 'google') {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  }

  // Sign Out Apple
  if (method === 'apple') {
    await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGOUT,
    });
  }

  // Sign Out Facebook
  if (method === 'facebook') {
    LoginManager.logOut();
  }

  // Sign Out Digits
  if (method === 'otp-digits') {
    await digitsLogoutUser();
  }
}

/**
 * Do login success
 * @param token
 * @param user
 * @returns {IterableIterator<*>}
 */
function* doLoginSuccess(token, user = {}, method = 'email') {
  yield put({
    type: Actions.SIGN_IN_WITH_EMAIL_SUCCESS,
    payload: {token, user},
  });

  yield put({
    type: Actions.GET_CUSTOMER,
    payload: user.ID,
  });

  yield call(AsyncStorage.setItem, 'token', token);
  yield call(AsyncStorage.setItem, 'method', method);

  yield call(NavigationService.navigate, rootSwitch.main);
}

/**
 * Sign In saga
 * @param username
 * @param password
 * @returns {IterableIterator<*>}
 */
function* signInWithEmailSaga({username, password}) {
  try {
    const language = yield select(languageSelector);
    const {token, user} = yield call(loginWithEmail, {
      username,
      password,
      language,
    });
    yield call(doLoginSuccess, token, user, 'email');
  } catch (e) {
    yield put({
      type: Actions.SIGN_IN_WITH_EMAIL_ERROR,
      payload: {
        message: e.message,
      },
    });
  }
}

/**
 * Sign In With OTP
 * @param data
 * @returns {Generator<<"PUT", PutEffectDescriptor<{payload: {message: *}, type: string}>>|<"CALL", CallEffectDescriptor>, void, ?>}
 */
function* signInWithOtpSaga({payload}) {
  try {
    const {success, data} = yield call(digitsLoginUser, payload.data);
    if (success) {
      const {token, user} = data;
      yield call(doLoginSuccess, token, user, 'otp-digits');
    } else {
      yield call(handleError, new Error('Something wrong.'));
    }
  } catch (e) {
    yield put({
      type: Actions.SIGN_IN_WITH_OTP_ERROR,
      payload: {
        message: e.message,
      },
    });
  }
}

/**
 * Sign up with email
 * @param payload
 * @returns {IterableIterator<*>}
 */
function* signUpWithOtplSaga({payload}) {
  try {
    const language = yield select(languageSelector);
    const {success, data} = yield call(digitsCreateUser, payload.data);
    if (success) {
      const {token, user} = data;
      yield call(showMessage, {
        message: languages[language].notifications.text_create_user_success,
        type: 'info',
      });
      yield call(doLoginSuccess, token, user, 'otp-digits');
    } else {
      yield call(handleError, new Error('Something wrong.'));
    }
  } catch (e) {
    console.log(e);
    yield call(handleError, e);
    yield put({
      type: Actions.SIGN_UP_WITH_EMAIL_ERROR,
      payload: {
        message: e.message,
      },
    });
  }
}

/**
 * Sign In mobile saga
 * @param tokenId
 * @returns {IterableIterator<*>}
 */
function* signInWithMobileSaga({tokenId}) {
  try {
    const {token, user} = yield call(loginWithMobile, tokenId);
    yield call(doLoginSuccess, token, user, 'otp');
  } catch (e) {
    yield call(handleError, e);
    yield put({
      type: Actions.SIGN_IN_WITH_MOBILE_ERROR,
    });
  }
}

/**
 * Sign up with email
 * @param payload
 * @returns {IterableIterator<*>}
 */
function* signUpWithEmailSaga({payload}) {
  try {
    const {data} = payload;
    const language = yield select(languageSelector);
    const {token, user} = yield call(registerWithEmail, data);
    yield call(showMessage, {
      message: languages[language].notifications.text_create_user_success,
      type: 'info',
    });
    yield call(doLoginSuccess, token, user, 'otp');
  } catch (e) {
    yield call(handleError, e);
    yield put({
      type: Actions.SIGN_UP_WITH_EMAIL_ERROR,
      payload: {
        message: e.message,
      },
    });
  }
}

/**
 * Sign in with google
 * @param payload
 * @returns {IterableIterator<CallEffect | *>}
 */
function* signInWithGoogleSaga({payload}) {
  try {
    const {idToken} = payload;
    const {token, user} = yield call(loginWithGoogle, {idToken});
    yield call(doLoginSuccess, token, user, 'google');
  } catch (e) {
    yield call(handleError, e);
    yield put({
      type: Actions.SIGN_IN_WITH_GOOGLE_ERROR,
    });
  }
}

/**
 * Sign in with Google
 * @param payload
 * @returns {IterableIterator<CallEffect | *>}
 */
function* signInWithFacebookSaga({payload}) {
  try {
    const {data} = payload;
    const {token, user} = yield call(loginWithFacebook, data);
    yield call(doLoginSuccess, token, user, 'facebook');
  } catch (e) {
    yield call(handleError, e);
    yield put({
      type: Actions.SIGN_IN_WITH_FACEBOOK_ERROR,
    });
  }
}

/**
 * Sign in with Apple
 * @param payload
 * @returns {IterableIterator<CallEffect | *>}
 */
function* signInWithAppleSaga({payload}) {
  try {
    const {token, user} = yield call(loginWithApple, payload);
    yield call(doLoginSuccess, token, user, 'apple');
  } catch (e) {
    yield call(handleError, e);
    yield put({
      type: Actions.SIGN_IN_WITH_FACEBOOK_ERROR,
    });
  }
}

function* forgotPasswordSideEffect(action) {
  try {
    const language = yield select(languageSelector);
    const errors = validatorForgotPassword(action.email, language);
    if (errors.size > 0) {
      yield put({
        type: Actions.FORGOT_PASSWORD_ERROR,
        payload: {
          message: languages[language].notifications.text_fill_value,
          errors: errors.toJS(),
        },
      });
    } else {
      yield call(forgotPassword, action.email);
      yield put({
        type: Actions.FORGOT_PASSWORD_SUCCESS,
      });
      yield call(showMessage, {
        message: languages[language].notifications.text_forgot_password_success,
        type: 'info',
      });
    }
  } catch (e) {
    yield put({
      type: Actions.FORGOT_PASSWORD_ERROR,
      payload: {
        message: e.message,
      },
    });
  }
}

function* checkAuthSideEffect() {
  try {
    const user = yield call(isLogin);
    if (!user || !user.ID) {
      yield call(signOut);
      yield call(AsyncStorage.removeItem, 'token');
      yield put({type: Actions.SIGN_OUT_SUCCESS});
      console.log('checkAuthSideEffect', 'token not validate!');
    } else {
      console.log('Token validate ok!');
    }
  } catch (e) {
    console.log('checkAuthSideEffect', e);
  }
}

/**
 * Change Email Saga
 * @param payload
 * @returns {IterableIterator<*>}
 */
function* changeEmailSaga({payload}) {
  try {
    yield call(changeEmail, payload);
    yield put({type: Actions.CHANGE_EMAIL_SUCCESS});
  } catch (e) {
    yield call(handleError, e);
    yield put({type: Actions.CHANGE_EMAIL_ERROR});
  }
}

/**
 * Change Password Saga
 * @param payload
 * @returns {IterableIterator<*>}
 */
function* changePasswordSaga({payload}) {
  try {
    const language = yield select(languageSelector);
    const errors = validatorChangePassword(payload, language);
    if (errors.size > 0) {
      yield put({
        type: Actions.CHANGE_PASSWORD_ERROR,
        payload: {
          message: languages[language].notifications.text_fill_value,
          errors: errors.toJS(),
        },
      });
    } else {
      const data = {
        password_old: payload.password_old,
        password_new: payload.password_new,
      };
      yield call(changePassword, data);
      yield put({
        type: Actions.CHANGE_PASSWORD_SUCCESS,
      });
      yield call(showMessage, {
        message: languages[language].notifications.text_change_password_success,
        type: 'info',
      });
    }
  } catch (e) {
    yield put({
      type: Actions.CHANGE_PASSWORD_ERROR,
      payload: {
        message: e.message,
      },
    });
  }
}

/**
 * Sign out saga
 * @returns {IterableIterator<*>}
 */
function* signOutSaga() {
  try {
    const requiredLogin = yield select(requiredLoginSelector);
    yield call(AsyncStorage.removeItem, 'token');
    if (requiredLogin) {
      yield call(NavigationService.navigate, rootSwitch.auth);
    }
    yield put({type: Actions.SIGN_OUT_SUCCESS});
    yield call(signOut);
  } catch (e) {
    console.log(e);
  }
}

/**
 * Get shipping address
 * @returns {IterableIterator<*>}
 */
function* getCustomerSaga({payload}) {
  try {
    const customer = yield call(getCustomer, payload);
    yield put({
      type: Actions.GET_CUSTOMER_SUCCESS,
      payload: customer,
    });
  } catch (e) {
    yield put({
      type: Actions.GET_CUSTOMER_ERROR,
      payload: shippingAddressInit,
    });
  }
}

/**
 * Update customer
 * @returns {IterableIterator<*>}
 */
function* updateCustomerSaga({payload}) {
  try {
    const {data, cb} = payload;
    const userID = yield select(userIdSelector);
    yield call(updateCustomer, userID, data);
    yield put({
      type: Actions.UPDATE_CUSTOMER_SUCCESS,
    });
    yield call(showMessage, {
      message: 'Update success',
      type: 'success',
    });
    yield call(cb);
  } catch (e) {
    yield put({
      type: Actions.UPDATE_CUSTOMER_ERROR,
    });
    yield call(showMessage, {
      message: e.message,
      type: 'danger',
    });
  }
}

function* updateLocation(payload) {
  yield put({
    type: Actions.UPDATE_LOCATION_SUCCESS,
    payload: payload,
  });
}

export default function* authSaga() {
  yield takeEvery(Actions.SIGN_IN_WITH_EMAIL, signInWithEmailSaga);
  yield takeEvery(Actions.SIGN_IN_WITH_MOBILE, signInWithMobileSaga);
  yield takeEvery(Actions.SIGN_UP_WITH_EMAIL, signUpWithEmailSaga);
  yield takeEvery(Actions.SIGN_IN_WITH_GOOGLE, signInWithGoogleSaga);
  yield takeEvery(Actions.SIGN_IN_WITH_FACEBOOK, signInWithFacebookSaga);
  yield takeEvery(Actions.SIGN_IN_WITH_APPLE, signInWithAppleSaga);
  yield takeEvery(Actions.SIGN_OUT, signOutSaga);
  yield takeEvery(Actions.CHANGE_EMAIL, changeEmailSaga);
  yield takeEvery(Actions.CHANGE_PASSWORD, changePasswordSaga);
  yield takeEvery(Actions.FORGOT_PASSWORD, forgotPasswordSideEffect);
  yield takeEvery(Actions.GET_CUSTOMER, getCustomerSaga);
  yield takeEvery(Actions.UPDATE_CUSTOMER, updateCustomerSaga);

  yield takeEvery(Actions.SIGN_IN_WITH_OTP, signInWithOtpSaga);
  yield takeEvery(Actions.SIGN_UP_WITH_OTP, signUpWithOtplSaga);
  yield takeEvery(Actions.UPDATE_LOCATION, updateLocation);

  yield takeEvery(Actions.IS_LOGIN, checkAuthSideEffect);
}
