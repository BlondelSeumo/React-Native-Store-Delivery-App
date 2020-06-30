import React from 'react';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Text} from 'src/components';
import Container from 'src/containers/Container';
import ViewUnderline from 'src/containers/ViewUnderline';
import {currencySelector} from 'src/modules/common/selectors';
import currencyFormatter from 'src/utils/currency-formatter';
import {margin} from 'src/components/config/spacing';

const TotalCart = props => {
  const {t} = useTranslation();
  const {totals, currency} = props;
  return (
    <ViewUnderline>
      <Container style={styles.container}>
        <View style={styles.itemProduct}>
          <View style={styles.itemAddon}>
            <Text h4 bold style={styles.nameAddon}>
              {t('cart:text_subtotal')}
            </Text>
            <Text h4 colorSecondary style={styles.priceAddon}>
              {currencyFormatter(totals.subtotal, currency)}
            </Text>
          </View>
          <View style={styles.itemAddon}>
            <Text h4 bold style={styles.nameAddon}>
              {t('cart:text_shipping')}
            </Text>
            <Text h4 colorSecondary style={styles.priceAddon}>
              {currencyFormatter(totals.shipping_total, currency)}
            </Text>
          </View>
          {totals.discount_total ? (
            <View style={styles.itemAddon}>
              <Text h4 bold style={styles.nameAddon}>
                {t('cart:text_coupon')}
              </Text>
              <Text h4 colorSecondary style={styles.priceAddon}>
                {currencyFormatter(totals.discount_total, currency)}
              </Text>
            </View>
          ) : null}
        </View>
      </Container>
    </ViewUnderline>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: margin.large + 4,
  },
  itemProduct: {
    marginTop: margin.large + 4,
  },
  textNameProduct: {
    flex: 1,
    marginRight: margin.base,
  },
  itemAddon: {
    marginTop: 6,
    flexDirection: 'row',
  },
  nameAddon: {
    flex: 1,
  },
  valueAddon: {
    maxWidth: 90,
    marginLeft: margin.small,
  },
  priceAddon: {
    width: 100,
    marginLeft: margin.small - 1,
    textAlign: 'right',
  },
});

const mapStateToProps = state => {
  return {
    currency: currencySelector(state),
  };
};

export default connect(mapStateToProps)(TotalCart);
