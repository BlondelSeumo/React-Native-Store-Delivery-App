import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {withNavigation} from '@react-navigation/compat';
import {withAddToCart} from 'src/hoc/hoc-add-to-cart';
import includes from 'lodash/includes';
import unescape from 'lodash/unescape';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import {Text, Image, withTheme} from 'src/components';
import RatingItem from 'src/containers/RatingItem';
import TimeItem from 'src/containers/TimeItem';
import DirectionItem from 'src/containers/DirectionItem';
import BadgeItem from 'src/containers/BadgeItem';
import Price from './Price';
import ButtonAdd from './ButtonAdd';
import PopupAddOns from './PopupAddOns';

import {SIMPLE} from 'src/config/product';

import {mainStack} from 'src/config/navigator';
import {padding, margin, borderRadius} from 'src/components/config/spacing';

const listStatus = ['instock', 'onbackorder'];

const Item2 = props => {
  const {t} = useTranslation();
  const {item, navigationType, theme, navigation, containerStyle} = props;
  if (!item) {
    return null;
  }
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

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {borderColor: theme.colors.border},
        containerStyle && containerStyle,
      ]}
      onPress={() =>
        navigation[navigationType](mainStack.product, {product: item})
      }>
      <Image
        source={
          images && images.length
            ? {uri: images[0].shop_catalog, cache: 'reload'}
            : require('src/assets/images/pDefault.png')
        }
        style={styles.image}
      />
      <View style={styles.viewRight}>
        <View style={styles.listBadge}>
          {on_sale ? (
            <BadgeItem
              title={t('common:text_promo')}
              nameColor="orange"
              style={styles.badge}
            />
          ) : null}
          {is_new ? (
            <BadgeItem title={t('common:text_new')} nameColor="blue" />
          ) : null}
        </View>
        <Text style={styles.textName} h4 medium numberOfLines={1}>
          {unescape(name)}
        </Text>
        <View style={styles.viewInfo}>
          <RatingItem rating={average_rating} style={styles.viewRating} />
          {duration ? (
            <TimeItem time={duration.text} style={styles.viewTime} />
          ) : null}
          {distance ? <DirectionItem title={distance.text} /> : null}
        </View>
        <View style={styles.viewPrice}>
          <Price priceFormat={price_format} />
          {purchasable &&
          type === SIMPLE &&
          includes(listStatus, stock_status) ? (
            <ButtonAdd
              onPress={isAddOns ? props.toggleModal : props.addCart}
              loading={props.loading}
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
    borderBottomWidth: 1,
    paddingTop: padding.large,
    paddingBottom: padding.large + 4,
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.base,
  },
  viewRight: {
    flex: 1,
    marginLeft: margin.large,
  },
  listBadge: {
    flexDirection: 'row',
    marginBottom: margin.small + 1,
  },
  badge: {
    marginRight: margin.small - 2,
  },
  textName: {
    marginBottom: margin.small,
  },
  viewInfo: {
    flexDirection: 'row',
    marginBottom: margin.large + 1,
  },
  viewRating: {
    marginRight: margin.large + 2,
  },
  viewTime: {
    marginRight: margin.large - 1,
  },
  viewPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

Item2.defaultProps = {
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
)(Item2);
