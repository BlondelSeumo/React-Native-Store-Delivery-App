import React from 'react';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Text} from 'src/components';
import Container from 'src/containers/Container';

import {cartTotalSelector} from 'src/modules/cart/selectors';
import {currencySelector} from 'src/modules/common/selectors';

import currencyFormatter from 'src/utils/currency-formatter';

const CartTotal = props => {
  const {t} = useTranslation();
  const {style, total, currency} = props;
  return (
    <Container style={[styles.container, style && style]}>
      <View style={styles.textTotal}>
        <Text>{t('cart:text_total')}</Text>
      </View>
      <Text h3 medium>
        {currencyFormatter(total, currency)}
      </Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textTotal: {
    flex: 1,
  },
});

const mapStateToProps = state => {
  return {
    total: cartTotalSelector(state),
    currency: currencySelector(state),
  };
};

export default connect(mapStateToProps)(CartTotal);
