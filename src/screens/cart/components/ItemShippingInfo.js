import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import find from 'lodash/find';
import {View, TouchableOpacity, Dimensions, StyleSheet} from 'react-native';
import {ThemedView, ListItem, Text} from 'src/components';
import TextHtml from 'src/containers/TextHtml';
import ItemAddress from './ItemAddress';
import {orange} from 'src/components/config/colors';
import {padding, margin, borderRadius} from 'src/components/config/spacing';
import {lineHeights} from 'src/components/config/fonts';

import {mainStack} from 'src/config/navigator';

const {width} = Dimensions.get('window');

const ItemShippingInfo = props => {
  const {shippingAddress, data, onPress, fit, index} = props;
  const {t} = useTranslation();
  const navigation = useNavigation();
  // method selected
  const selected = data.chosen_method || data.index;
  const method = find(data.available_methods, ['id', selected]);

  const WIDTH_ITEM = fit ? width - 2 * padding.large : width * 0.8;
  return (
    <ThemedView
      style={[
        styles.container,
        {width: WIDTH_ITEM},
        index === 0 && styles.containerFirst,
      ]}>
      <View style={styles.content}>
        <ListItem
          type="underline"
          title={t('cart:text_method')}
          leftIcon={{
            name: 'truck-fast',
            type: 'material-community',
            size: 24,
            color: orange,
          }}
          chevron={{
            name: 'keyboard-arrow-right',
            type: 'material',
            size: 30,
          }}
          titleProps={{
            h4: true,
            medium: true,
            numberOfLines: 1,
          }}
          rightElement={
            <TouchableOpacity style={styles.viewMethod} onPress={onPress}>
              {method ? (
                <TextHtml value={method.label} />
              ) : (
                <Text>{t('cart:text_select_mode')}</Text>
              )}
            </TouchableOpacity>
          }
          contentContainerStyle={styles.item}
          containerStyle={styles.containerItem}
          pad={0}
        />
        <ItemAddress
          name={data?.store?.store_name || t('cart:text_vendor_store')}
          address={data?.store?.store_location || t('cart:text_no_address')}
        />
        <ItemAddress
          type="customer"
          name={t('cart:text_shipping_address')}
          address={shippingAddress?.address_1 || t('cart:text_no_address')}
          onSelectCustomer={() =>
            navigation.navigate(mainStack.address_book, {goBack: true})
          }
        />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.base,
    marginRight: margin.large,
  },
  containerFirst: {
    marginLeft: margin.large,
  },
  content: {
    paddingHorizontal: padding.large - 2,
  },
  viewMethod: {
    paddingHorizontal: 3,
    flex: 1,
    overflow: 'hidden',
    height: lineHeights.base,
    alignItems: 'flex-end',
  },
  containerItem: {
    minHeight: 0,
    paddingVertical: padding.large + 4,
    marginBottom: margin.big - 2,
  },
  item: {
    marginHorizontal: margin.base + 2,
  },
});
export default ItemShippingInfo;
