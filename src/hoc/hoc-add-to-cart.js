import React, {useReducer} from 'react';

import merge from 'lodash/merge';
import {useBoolean} from 'src/utils/use-boolean';
import {addToCart} from 'src/modules/cart/actions';
import {showMessage} from 'react-native-flash-message';

import {homeTabs, rootSwitch, mainStack} from 'src/config/navigator';

/**
 * HOC for handle add to cart action
 * @param WrappedComponent
 * @return {function(*): *}
 */
export function withAddToCart(WrappedComponent) {
  /**
   * Cart reducer for product item
   * @param state
   * @param action
   * @return {{cart_item_data: *}|*|{quantity: number}|{quantity: *}}
   */
  function reducer(state, action) {
    switch (action.type) {
      case 'increment':
        return {
          ...state,
          quantity: state.quantity + 1,
        };
      case 'decrement':
        return {
          ...state,
          quantity: state.quantity > 1 ? state.quantity - 1 : 1,
        };
      case 'update_cart_item_data':
        return {
          ...state,
          cart_item_data: action.payload,
        };
      case 'reset':
        return action.payload;
      default:
        throw new Error();
    }
  }

  return function Cart(props) {
    /**
     * Init cart state
     * @type {{quantity: number, variation_id: number, cart_item_data: {}, variation: []}}
     */
    const initialState = {
      quantity: 1,
      variation_id: 0,
      variation: [],
      cart_item_data: {},
    };

    const [visible, {toggle: toggleModal}] = useBoolean(false);
    const [state, dispatch] = useReducer(reducer, initialState);
    const [loading, {setTrue, setFalse}] = useBoolean(false);
    const [bLoading, {setTrue: bSetTrue, setFalse: bSetFalse}] = useBoolean(
      false,
    );

    /**
     * Function call back after adding to cart
     * @param payload
     * @param type
     */
    const callBack = (payload, type = '') => {
      setFalse();
      bSetFalse();
      dispatch({type: 'reset', payload: initialState});
      if (type === 'buyNow' && payload.success) {
        toggleModal();
        props.navigation.navigate(mainStack.home_tab, {screen: homeTabs.cart});
      }

      // Show notification error
      if (!payload.success) {
        toggleModal();
        props.navigation.navigate(rootSwitch.auth);
        // Show message if false add to cart
        showMessage({
          message: payload.error.message,
          type: 'danger',
        });
      } else {
        showMessage({
          message: 'Add to cart successfully!',
          type: 'success',
        });
      }
    };

    /**
     * Add to cart action
     * @param id : product id
     */
    const addCart = id => {
      setTrue();
      props.dispatch(addToCart(merge(state, {product_id: id}), callBack));
    };

    /**
     * Action buy now, buy now will navigate user to screen cart
     * @param id
     */
    const buyNow = id => {
      bSetTrue();
      props.dispatch(
        addToCart(merge(state, {product_id: id}), payload =>
          callBack(payload, 'buyNow'),
        ),
      );
    };

    return (
      <WrappedComponent
        {...props}
        loading={loading}
        bLoading={bLoading}
        visible={visible}
        toggleModal={toggleModal}
        addCart={addCart}
        buyNow={buyNow}
        state={state}
        updateAddons={data =>
          dispatch({type: 'update_cart_item_data', payload: {addons: data}})
        }
        decrement={() => dispatch({type: 'decrement'})}
        increment={() => dispatch({type: 'increment'})}
      />
    );
  };
}
