import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {withNavigation} from '@react-navigation/compat';
import unescape from 'lodash/unescape';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Image, Text, ThemeConsumer} from 'src/components';
import Price from '../Price';
import Button from '../Button';

import {configsSelector} from 'src/modules/common/selectors';
import {mainStack} from 'src/config/navigator';

import {SIMPLE} from 'src/config/product';
import {padding, margin} from 'src/components/config/spacing';
import {sizes} from 'src/components/config/fonts';
import {white, black} from 'src/components/config/colors';
import PopupAddOns from './PopupAddOns';
import {withAddToCart} from 'src/hoc/hoc-add-to-cart';

const stockStatusList = ['instock', 'onbackorder'];

const ItemWishlist = React.memo(props => {
  const {t} = useTranslation();
  const {item, style, configs, navigation} = props;
  const {
    name,
    images,
    price_format,
    type,
    purchasable,
    stock_status,
    meta_data,
  } = item;

  // Product addons
  const addons = meta_data.find(meta => meta.key === '_product_addons');
  const isAddOns = addons && addons.value && addons.value.length > 0;
  const addonsSelected = props.state?.cart_item_data?.addons ?? [];

  const goProductDetail = () =>
    navigation.navigate(mainStack.product, {
      product: item,
    });

  const titleButton =
    type === SIMPLE ? t('common:text_add_cart') : t('common:text_choose_item');
  return (
    <ThemeConsumer>
      {({theme}) => (
        <View style={{backgroundColor: theme.colors.support.bgColor}}>
          <TouchableOpacity
            style={[
              styles.container,
              styles.row,
              {borderColor: theme.colors.border},
              style && style,
            ]}
            onPress={goProductDetail}>
            <Image
              source={
                images && images[0]
                  ? {uri: images[0].shop_single, cache: 'reload'}
                  : require('src/assets/images/pDefault.png')
              }
              resizeMode="stretch"
              style={styles.image}
            />
            <View style={[styles.right, styles.col]}>
              <View style={[styles.info, styles.row]}>
                <Text colorSecondary style={[styles.textName, styles.col]}>
                  {unescape(name)}
                </Text>
                <Price price_format={price_format} type={type} />
              </View>
              {type !== SIMPLE ||
              (type === SIMPLE &&
                stockStatusList.includes(stock_status) &&
                purchasable &&
                configs?.toggleCheckout) ? (
                <Button
                  title={titleButton}
                  buttonStyle={styles.button}
                  titleStyle={styles.titleButton}
                  size={'small'}
                  loading={props.loading}
                  onPress={
                    type !== SIMPLE
                      ? goProductDetail
                      : isAddOns
                      ? props.toggleModal
                      : props.addCart
                  }
                />
              ) : null}
            </View>
          </TouchableOpacity>
          {isAddOns ? (
            <PopupAddOns
              product={item}
              visible={props.visible}
              toggleModal={props.toggleModal}
              loading={props.loading}
              bLoading={props.bLoading}
              addCart={props.addCart}
              buyNow={props.buyNow}
              addons={addons}
              quantity={props.state.quantity}
              addonsSelected={addonsSelected}
              updateAddons={props.updateAddons}
              decrement={props.decrement}
              increment={props.increment}
            />
          ) : null}
        </View>
      )}
    </ThemeConsumer>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
  },
  container: {
    padding: padding.large,
    borderBottomWidth: 1,
  },
  image: {
    width: 79,
    height: 94,
  },
  right: {
    paddingLeft: padding.large,
    alignItems: 'flex-start',
  },
  info: {
    marginBottom: margin.small,
  },
  textName: {
    marginRight: margin.large,
  },
  button: {
    paddingHorizontal: padding.big,
    backgroundColor: black,
    borderColor: black,
  },
  titleButton: {
    color: white,
    fontSize: sizes.h6,
  },
});
const mapStateToProps = state => {
  return {
    configs: configsSelector(state).toJS(),
  };
};

export default compose(
  withNavigation,
  connect(
    mapStateToProps,
    null,
  ),
  withAddToCart,
)(ItemWishlist);
