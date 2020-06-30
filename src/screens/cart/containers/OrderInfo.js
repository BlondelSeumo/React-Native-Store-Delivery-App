import React from 'react';
import {useTranslation} from 'react-i18next';

import {StyleSheet, ScrollView, View} from 'react-native';
import {Text, Button} from 'src/components';
import ViewFooterFixed from 'src/containers/ViewFooterFixed';
import AvatarOrderInfo from './AvatarOrderInfo';
import InfoCart from 'src/screens/shop/product/InfoCart';

import currencyFormatter from 'src/utils/currency-formatter';
import {margin, padding} from 'src/components/config/spacing';

const OrderInfo = props => {
  const {totals, cart, currency, processCheckout, checkoutLoading} = props;
  const {t} = useTranslation();
  return (
    <ViewFooterFixed
      footerElement={
        <View>
          <View style={styles.viewTotal}>
            <Text h4 medium>
              {t('cart:text_total')}
            </Text>
            <Text h3 medium>
              {currencyFormatter(totals.total, currency)}
            </Text>
          </View>
          <Button
            title={t('common:text_confirm')}
            loading={checkoutLoading}
            onPress={processCheckout}
          />
        </View>
      }
      isShadow={false}
      footerStyle={styles.footer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.viewContent}>
          <AvatarOrderInfo />
          <View style={styles.viewProduct}>
            {Object.keys(cart).map(key => {
              const item = cart[key];
              return (
                <View key={key} style={styles.itemProduct}>
                  <InfoCart
                    nameProduct={item.name}
                    price={currencyFormatter(item.price, currency)}
                    addonsSelected={item.addons}
                    quantity={item.quantity}
                    namePrimary
                    borderSecondary
                  />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </ViewFooterFixed>
  );
};

const styles = StyleSheet.create({
  viewTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: margin.small,
  },
  viewContent: {
    alignItems: 'center',
    paddingHorizontal: padding.big,
  },
  footer: {
    paddingTop: padding.small - 1,
  },
  viewProduct: {
    width: '100%',
    marginTop: margin.big + 4,
  },
  itemProduct: {
    marginBottom: margin.big + 1,
  },
});

export default OrderInfo;
