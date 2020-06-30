import React from 'react';
import {connect} from 'react-redux';
import groupBy from 'lodash/groupBy';
import {StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'src/components';

import {currencySelector} from 'src/modules/common/selectors';

import currencyFormatter from 'src/utils/currency-formatter';
import {margin, padding} from 'src/components/config/spacing';

const InfoCart = props => {
  const {
    nameProduct,
    price,
    quantity,
    addonsSelected,
    currency,
    theme,
    namePrimary,
    borderSecondary,
  } = props;
  const groupAddons = groupBy(addonsSelected, value => value.field_name);
  const lengthGroupAddons = Object.keys(groupAddons).length;
  const textName = namePrimary ? theme.colors.primary : theme.colors.textColor;
  const borderColor = borderSecondary
    ? theme.colors.borderSecondary
    : theme.colors.border;
  return (
    <View>
      <View style={[styles.viewProduct, {borderColor: borderColor}]}>
        <Text medium style={[styles.textNameProduct, {color: textName}]}>
          {quantity}x {nameProduct}
        </Text>
        <Text medium style={{color: textName}}>
          {price || '0'}
        </Text>
      </View>
      {Object.keys(groupAddons).map((key, inx) => {
        const data = groupAddons[key];
        const firstData = data[0];
        return (
          <View
            key={key}
            style={[
              styles.itemAddon,
              inx === lengthGroupAddons - 1 && styles.itemAddonLast,
            ]}>
            <Text medium style={styles.nameAddon}>
              {firstData.name}
            </Text>
            <View>
              {data.map((addon, inxAddon) => (
                <View
                  key={inxAddon}
                  style={[styles.viewValueAddon, inxAddon === data.length - 1]}>
                  <Text colorSecondary style={styles.valueAddon}>
                    {addon.value}
                  </Text>
                  <Text colorSecondary style={styles.priceAddon}>
                    {parseFloat(addon.price) > 0
                      ? currencyFormatter(addon.price, currency)
                      : '0'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  viewProduct: {
    paddingBottom: padding.small,
    marginBottom: padding.small,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  textNameProduct: {
    flex: 1,
    marginRight: margin.base,
  },
  itemAddon: {
    marginBottom: margin.base,
    flexDirection: 'row',
  },
  itemAddonLast: {
    marginBottom: 0,
  },
  nameAddon: {
    flex: 1,
  },
  viewValueAddon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  viewValueAddonLast: {
    marginBottom: 0,
  },
  valueAddon: {
    maxWidth: 90,
    marginLeft: margin.small,
    textAlign: 'right',
  },
  priceAddon: {
    width: 50,
    marginLeft: margin.small - 1,
    textAlign: 'right',
  },
});

InfoCart.defaultProps = {
  namePrimary: false,
  borderSecondary: false,
};

const mapStateToProps = state => {
  return {
    currency: currencySelector(state),
  };
};

export default connect(mapStateToProps)(withTheme(InfoCart));
