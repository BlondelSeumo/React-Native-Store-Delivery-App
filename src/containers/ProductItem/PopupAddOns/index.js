import React from 'react';

import {connect} from 'react-redux';

import kebabCase from 'lodash/kebabCase';
import findIndex from 'lodash/findIndex';
import concat from 'lodash/concat';
import filter from 'lodash/filter';
import unescape from 'lodash/unescape';

import {useTranslation} from 'react-i18next';

import {StyleSheet, View, ScrollView} from 'react-native';
import {Modal, Text, Avatar, Button, ThemeConsumer} from 'src/components';
import {Row, Col} from 'src/containers/Gird';
import Container from 'src/containers/Container';
import ViewUnderline from 'src/containers/ViewUnderline';
import ViewFooterFixed from 'src/containers/ViewFooterFixed';
import Quantity from '../Quantity';
import ItemAddOns from 'src/screens/shop/product/ItemAddOns';
import InfoCart from 'src/screens/shop/product/InfoCart';
import RatingItem from 'src/containers/RatingItem';
import DirectionItem from 'src/containers/DirectionItem';
import TimeItem from 'src/containers/TimeItem';

import {currencySelector} from 'src/modules/common/selectors';

import {margin, padding, borderRadius} from 'src/components/config/spacing';

const PopupAddOns = props => {
  const {t} = useTranslation();
  const {
    product,

    addons,
    addonsSelected,
    updateAddons,

    visible,
    toggleModal,

    quantity,
    decrement,
    increment,

    loading,
    addCart,

    bLoading,
    buyNow,

    currency,
  } = props;

  const {
    id,
    name,
    images,
    price_format,
    distance_matrix,
    average_rating,
  } = product;

  // distance
  const {distance, duration} =
    distance_matrix &&
    distance_matrix.elements &&
    distance_matrix.elements.length &&
    distance_matrix.elements[0].status === 'OK'
      ? distance_matrix.elements[0]
      : {};

  const handleSelect = (data, display = 'select') => {
    const index = findIndex(addonsSelected, {
      value: data.value,
      field_name: data.field_name,
    });
    if (index < 0) {
      if (display === 'radiobutton') {
        updateAddons(
          concat(
            filter(
              addonsSelected,
              ({field_name}) => field_name !== data.field_name,
            ),
            data,
          ),
        );
      } else {
        updateAddons(concat(addonsSelected, data));
      }
    } else {
      updateAddons(
        filter(addonsSelected, ({value, field_name}) => {
          if (field_name === data.field_name) {
            return value !== data.value;
          }
          return true;
        }),
      );
    }
  };

  return (
    <ThemeConsumer>
      {({theme}) => (
        <Modal
          visible={visible}
          ratioHeight={0.8}
          setModalVisible={toggleModal}
          topCenterElement={
            <Text h3 medium style={styles.textHeader}>
              {t('common:text_customise_item')}
            </Text>
          }>
          <ViewFooterFixed
            footerElement={
              <Row>
                <Col>
                  <Button
                    secondary
                    loading={bLoading}
                    title={t('common:text_buy_now')}
                    onPress={() => buyNow(id)}
                  />
                </Col>
                <Col>
                  <Button
                    title={t('common:text_add_cart')}
                    loading={loading}
                    onPress={() => addCart(id)}
                  />
                </Col>
              </Row>
            }
            isShadow={false}
            footerStyle={{
              backgroundColor: theme.colors.support.bgColorThird,
            }}>
            <ScrollView>
              <Container>
                <ViewUnderline style={styles.viewProduct} secondary>
                  <View style={styles.info}>
                    <Avatar
                      source={
                        images && images.length
                          ? {uri: images[0].shop_catalog, cache: 'reload'}
                          : require('src/assets/images/pDefault.png')
                      }
                      size={100}
                      containerStyle={styles.avatarProduct}
                    />
                    <View style={styles.viewTextProduct}>
                      <Text
                        medium
                        h4
                        h4Style={styles.textName}
                        numberOfLines={1}>
                        {unescape(name)}
                      </Text>
                      <View style={styles.viewInfo}>
                        <RatingItem
                          rating={average_rating}
                          style={styles.viewRating}
                        />
                        {duration ? (
                          <TimeItem
                            time={duration.text}
                            style={styles.viewTime}
                          />
                        ) : null}
                        {distance ? (
                          <DirectionItem title={distance.text} />
                        ) : null}
                      </View>
                      <View style={styles.viewPrice}>
                        <Text medium h4>
                          {price_format.sale_price
                            ? price_format.sale_price
                            : price_format.regular_price}
                        </Text>
                        <Quantity
                          quantity={quantity}
                          decrement={decrement}
                          increment={increment}
                        />
                      </View>
                    </View>
                  </View>
                </ViewUnderline>
                {addons.value.map((data, index) => {
                  const fieldName = `${id}-${kebabCase(data.name)}-${
                    data.position
                  }`;
                  return (
                    <ItemAddOns
                      key={fieldName}
                      data={{...data, field_name: fieldName}}
                      handleSelect={handleSelect}
                      addonsSelected={addonsSelected}
                      style={styles.viewData}
                      currency={currency}
                      secondary={index === addons.value.length - 1}
                      itemStyle={{borderColor: theme.colors.borderSecondary}}
                    />
                  );
                })}
                <ViewUnderline style={[styles.viewData, styles.totalAddons]}>
                  <InfoCart
                    nameProduct={product.name}
                    price={
                      product?.price_format?.sale_price ||
                      product?.price_format?.regular_price
                    }
                    quantity={quantity}
                    addonsSelected={addonsSelected}
                    borderSecondary
                  />
                </ViewUnderline>
              </Container>
            </ScrollView>
          </ViewFooterFixed>
        </Modal>
      )}
    </ThemeConsumer>
  );
};

const styles = StyleSheet.create({
  textHeader: {
    textAlign: 'center',
  },
  viewProduct: {
    paddingHorizontal: 0,
    paddingBottom: padding.big,
  },
  info: {
    flexDirection: 'row',
  },
  avatarProduct: {
    borderRadius: borderRadius.base,
    overflow: 'hidden',
  },
  viewTextProduct: {
    flex: 1,
    marginLeft: margin.large,
  },
  textName: {
    marginBottom: 5,
  },
  viewInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: margin.large - 1,
  },
  viewRating: {
    marginRight: margin.large + 2,
  },
  viewTime: {
    marginRight: margin.large - 1,
  },
  viewPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewData: {
    paddingHorizontal: 0,
    paddingTop: padding.big,
    paddingBottom: padding.small,
  },
  totalAddons: {
    borderBottomWidth: 0,
  },
});

const mapStateToProps = state => {
  return {
    currency: currencySelector(state),
  };
};

export default connect(mapStateToProps)(PopupAddOns);
