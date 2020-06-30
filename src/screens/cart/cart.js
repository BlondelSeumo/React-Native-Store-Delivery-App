import React from 'react';

import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import isEmpty from 'lodash/isEmpty';

import {ActivityIndicator, View} from 'react-native';
import {Button, Header, Text, ThemedView, ThemeConsumer} from 'src/components';
import {padding} from 'src/components/config/spacing';
import {mainStack, homeTabs} from 'src/config/navigator';
import Empty from 'src/containers/Empty';
import {IconHeader, TextHeader} from 'src/containers/HeaderComponent';
import ViewFooterFixed from 'src/containers/ViewFooterFixed';

import {getCart} from 'src/modules/cart/actions';
import {
  cartSelector,
  cartSelectorLoading,
  cartTotalSelector,
} from 'src/modules/cart/selectors';
import {currencySelector} from 'src/modules/common/selectors';
import currencyFormatter from 'src/utils/currency-formatter';
import ProductsCart from './cart/ProductsCart';

class CartScreen extends React.Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(getCart());
  }

  render() {
    const {t, navigation, data, totals, loading, currency} = this.props;
    return (
      <ThemeConsumer>
        {({theme}) => (
          <ThemedView isFullView>
            <Header
              centerComponent={<TextHeader title={t('common:text_cart')} />}
              leftComponent={<IconHeader />}
            />
            {loading ? (
              <View style={styles.loading}>
                <ActivityIndicator color={theme.colors.primary} />
              </View>
            ) : isEmpty(data) ? (
              <Empty
                icon="shopping-bag"
                title={t('empty:text_title_cart')}
                subTitle={t('empty:text_subtitle_cart')}
                clickButton={() => navigation.navigate(homeTabs.shop)}
              />
            ) : (
              <ViewFooterFixed
                footerElement={
                  <View>
                    <View style={styles.footer}>
                      <Text h4 bold>
                        {t('cart:text_total')}
                      </Text>
                      <Text bold h3>
                        {currencyFormatter(totals.total, currency)}
                      </Text>
                    </View>
                    <Button
                      title={t('cart:text_go_checkout')}
                      onPress={() => navigation.navigate(mainStack.checkout)}
                    />
                  </View>
                }
                isShadow={false}
                footerStyle={styles.viewFooter}>
                <ProductsCart data={data} totals={totals} />
              </ViewFooterFixed>
            )}
          </ThemedView>
        )}
      </ThemeConsumer>
    );
  }
}

const styles = {
  viewFooter: {
    paddingTop: padding.small,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const mapStateToProps = state => {
  return {
    data: cartSelector(state).toJS(),
    totals: cartTotalSelector(state).toJS(),
    loading: cartSelectorLoading(state),
    currency: currencySelector(state),
  };
};

export default connect(mapStateToProps)(withTranslation()(CartScreen));
