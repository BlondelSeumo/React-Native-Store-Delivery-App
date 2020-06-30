import React, {useState} from 'react';
import {connect} from 'react-redux';
import unescape from 'lodash/unescape';
import {View, Alert, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Text, Avatar, ThemeConsumer} from 'src/components';
import ChangeCount from 'src/containers/ProductItem/ChangeCount';
import {getCart} from 'src/modules/cart/actions';
import {currencySelector} from 'src/modules/common/selectors';
import {showMessage} from 'react-native-flash-message';

import {updateCartQuantity, removeCartItem} from 'src/modules/cart/service';
import currencyFormatter from 'src/utils/currency-formatter';
import {padding, margin, borderRadius} from 'src/components/config/spacing';

const ItemProduct = React.memo(props => {
  const {product, containerStyle, currency, dispatch} = props;
  const {t} = useTranslation();
  if (!product) {
    return null;
  }
  const [quantity, setQuantity] = useState(product.quantity);
  const {name, thumb, price} = product;

  const updateQuantity = async value => {
    if (quantity <= 0) {
      return;
    }
    if (value === 0) {
      confirmWhenQuantityToZero();
    } else {
      setQuantity(value);
      await updateCartQuantity({
        cart_item_key: product.key,
        quantity: value,
      });
    }
  };

  const generateTextAddOne = () => {
    let finalText = t('cart:text_name_store', {
      name: product?.store?.store_name,
    });
    if (product?.addons?.length) {
      for (let i = 0; i < product?.addons.length; i++) {
        const item = product?.addons[i];
        const lastItem = i === product?.addons.length - 1;
        const endText = !lastItem ? ', ' : '';
        finalText +=
          item.name +
          ': ' +
          item.value +
          '(' +
          currencyFormatter(item?.price || '0', currency) +
          ') ' +
          endText;
      }
    }

    return finalText;
  };

  const confirmWhenQuantityToZero = () => {
    Alert.alert(
      t('common:text_notification'),
      t('common:text_confirm_remove_item_cart'),
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => deleteItem(),
        },
      ],
      {cancelable: false},
    );
  };

  const deleteItem = async () => {
    const res = await removeCartItem({
      cart_item_key: product.key,
    });
    if (res.success) {
      dispatch(getCart());
    } else {
      showMessage('Failed');
    }
  };
  return (
    <ThemeConsumer>
      {({theme}) => (
        <View
          style={[
            styles.container,
            {
              borderColor: theme.colors.border,
            },
            containerStyle && containerStyle,
          ]}>
          <Avatar
            source={
              thumb ? {uri: thumb} : require('src/assets/images/pDefault.png')
            }
            size={100}
            overlayContainerStyle={styles.avatar}
          />
          <View style={styles.right}>
            <Text medium h4>
              {unescape(name)}
            </Text>
            <View style={styles.viewInfo}>
              <Text h5 h5Style={styles.textInfo} colorThird>
                {generateTextAddOne()}
              </Text>
            </View>
            <View style={styles.viewPrice}>
              <Text medium h4>
                {currencyFormatter(price, currency)}
              </Text>
              <ChangeCount
                count={quantity}
                changeValue={value => updateQuantity(value)}
              />
            </View>
          </View>
        </View>
      )}
    </ThemeConsumer>
  );
});

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingVertical: padding.large,
    flexDirection: 'row',
  },
  avatar: {
    borderRadius: borderRadius.base,
    overflow: 'hidden',
  },
  right: {
    flex: 1,
    marginLeft: margin.large,
  },
  viewInfo: {
    marginTop: 5,
  },
  textInfo: {
    lineHeight: 24,
  },
  viewPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
});

const mapStateToProps = state => {
  return {
    currency: currencySelector(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(ItemProduct);
