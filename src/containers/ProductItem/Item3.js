import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {withNavigation} from '@react-navigation/compat';
import includes from 'lodash/includes';
import unescape from 'lodash/unescape';
import {useTranslation} from 'react-i18next';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Text, Image, withTheme} from 'src/components';
import RatingItem from 'src/containers/RatingItem';
import TimeItem from 'src/containers/TimeItem';
import DirectionItem from 'src/containers/DirectionItem';
import BadgeItem from 'src/containers/BadgeItem';
import Button from 'src/containers/Button';
import Price from './Price';
import PopupAddOns from './PopupAddOns';

import {SIMPLE} from 'src/config/product';
import {mainStack} from 'src/config/navigator';

import {styleCommonItem} from './style_common';
import {padding, margin, borderRadius} from 'src/components/config/spacing';
import {withAddToCart} from 'src/hoc/hoc-add-to-cart';

const listStatus = ['instock', 'onbackorder'];

const Item3 = props => {
  const {t} = useTranslation();
  const {
    item,
    width,
    navigation,
    navigationType,
    theme,
    containerStyle,
  } = props;

  const {
    name,
    images,
    price_format,
    on_sale,
    is_new,
    type,
    average_rating,
    purchasable,
    stock_status,
    meta_data,
    distance_matrix,
  } = item;

  // Product addons
  const addons = meta_data.find(meta => meta.key === '_product_addons');
  const isAddOns = addons && addons.value && addons.value.length > 0;
  const addonsSelected = props.state?.cart_item_data?.addons ?? [];

  // distance
  const {distance, duration} =
    distance_matrix &&
    distance_matrix.elements &&
    distance_matrix.elements.length &&
    distance_matrix.elements[0].status === 'OK'
      ? distance_matrix.elements[0]
      : {};
  const sizeImage = width - 2 * padding.base;
  return (
    <TouchableOpacity
      onPress={() =>
        navigation[navigationType](mainStack.product, {product: item})
      }
      activeOpacity={0.9}
      style={[{width}, styles.container, containerStyle && containerStyle]}>
      <View
        style={[
          styleCommonItem.shadow,
          styles.viewInfomation,
          {backgroundColor: theme.colors.support.bgColor},
        ]}>
        <View style={styles.content}>
          <Image
            source={
              images && images.length
                ? {uri: images[0].shop_catalog, cache: 'reload'}
                : require('src/assets/images/pDefault.png')
            }
            style={[{width: sizeImage, height: sizeImage}]}
            PlaceholderContent={<ActivityIndicator />}
            resizeMode="cover"
            containerStyle={[styles.image, {borderRadius: sizeImage / 2}]}
          />
          <View style={styles.listBadge}>
            {on_sale ? (
              <BadgeItem title={t('common:text_promo')} nameColor="orange" />
            ) : null}
            {is_new ? (
              <BadgeItem title={t('common:text_new')} nameColor="blue" />
            ) : null}
          </View>
        </View>
        <View style={styles.viewInfo}>
          {duration || distance ? (
            <View style={styles.viewDuration}>
              {duration ? (
                <TimeItem time={duration.text} style={styles.time} />
              ) : null}
              {distance ? <DirectionItem title={distance.text} /> : null}
            </View>
          ) : null}
          <RatingItem rating={average_rating} style={styles.rating} />
          <Text numberOfLines={2} medium style={styles.textName}>
            {unescape(name)}
          </Text>
          <Price priceFormat={price_format} h4 />
          {purchasable &&
          type === SIMPLE &&
          includes(listStatus, stock_status) ? (
            <Button
              onPress={isAddOns ? props.toggleModal : props.addCart}
              loading={props.loading}
              title="+ Add"
              titleProps={{
                h6: true,
              }}
              buttonStyle={styles.buttonAdd}
              containerStyle={styles.viewButtonAdd}
            />
          ) : null}
        </View>
      </View>
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
          addonsSelected={addonsSelected}
          quantity={props.state.quantity}
          updateAddons={props.updateAddons}
          decrement={props.decrement}
          increment={props.increment}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 46,
  },
  viewInfomation: {
    flex: 1,
    borderRadius: borderRadius.base,
  },
  content: {
    marginTop: -46,
    paddingHorizontal: padding.base,
  },
  image: {
    overflow: 'hidden',
  },
  listBadge: {
    position: 'absolute',
    bottom: 0,
    left: padding.base,
    right: padding.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewInfo: {
    paddingHorizontal: padding.base,
    alignItems: 'center',
    marginVertical: margin.large,
  },
  viewDuration: {
    flexDirection: 'row',
    marginBottom: margin.small,
  },
  time: {
    marginRight: margin.large,
  },
  rating: {
    marginBottom: margin.small - 3,
  },
  textName: {
    marginBottom: margin.small + 1,
    textAlign: 'center',
  },
  buttonAdd: {
    minHeight: 24,
    paddingHorizontal: margin.small - 2,
  },
  viewButtonAdd: {
    marginTop: margin.small + 1,
  },
});

Item3.defaultProps = {
  width: 204,
  navigationType: 'navigate',
};

const mapStateToProps = state => {
  return {};
};

export default compose(
  withTheme,
  withNavigation,
  connect(
    mapStateToProps,
    null,
  ),
  withAddToCart,
)(Item3);
