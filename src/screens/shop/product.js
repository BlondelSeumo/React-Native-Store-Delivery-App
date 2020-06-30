import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {fromJS} from 'immutable';

import findIndex from 'lodash/findIndex';
import concat from 'lodash/concat';
import filter from 'lodash/filter';
import kebabCase from 'lodash/kebabCase';
import {withTranslation} from 'react-i18next';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Header, ThemedView, ThemeConsumer} from 'src/components';
import {Col, Row} from 'src/containers/Gird';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {IconHeader, CartIcon} from 'src/containers/HeaderComponent';
import ViewFooterFixed from 'src/containers/ViewFooterFixed';
import ViewUnderline from 'src/containers/ViewUnderline';
import Button from 'src/containers/Button';
import Empty from 'src/containers/Empty';
import WishListIcon from '../../containers/WishListIcon';
import Quantity from '../../containers/ProductItem/Quantity';

import ImageHeader from 'src/screens/shop/store-detail/ImageHeader';
import InfoProduct from './product/InfoProduct';
import ItemAddOns from './product/ItemAddOns';

import InfoCart from './product/InfoCart';
import ListImageHeader from './product/ListImageHeader';

import {fetchVendorDetail} from 'src/modules/vendor/actions';
import {
  detailVendorSelector,
  loadingDetailVendorSelector,
} from 'src/modules/vendor/selectors';
import {
  currencySelector,
  defaultCurrencySelector,
} from 'src/modules/common/selectors';

import {defaultPropsData, getSingleData} from 'src/hoc/single-data';
import {withLoading} from 'src/hoc/loading';
import {withAddToCart} from 'src/hoc/hoc-add-to-cart';

import {prepareProductItem} from 'src/utils/product';

import {homeTabs} from 'src/config/navigator';

import {white} from 'src/components/config/colors';
import {margin, padding} from 'src/components/config/spacing';

const {width} = Dimensions.get('window');
const WIDTH_BANNER = width;
const HEIGHT_BANNER = (WIDTH_BANNER * 240) / 375;

class Product extends React.Component {
  constructor(props) {
    super(props);
    const {data, currency, defaultCurrency, route} = props;
    const product = route?.params?.product ?? null;
    const dataPrepare = prepareProductItem(
      fromJS(data),
      currency,
      defaultCurrency,
    );
    const dataProduct = product?.id ? product : dataPrepare.toJS();
    this.state = {
      product: dataProduct,
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const {product} = this.state;
    const vendor_id =
      product &&
      product.meta_data &&
      product.meta_data.find(meta => meta.key === '_wcfm_product_author')
        ? product.meta_data.find(meta => meta.key === '_wcfm_product_author')
            .value
        : null;
    dispatch(fetchVendorDetail(vendor_id));
  }

  handleSelectAddons = (data, display = 'select') => {
    const {updateAddons, state} = this.props;
    const addonsSelected = state?.cart_item_data?.addons ?? [];
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

  render() {
    const {
      t,
      vendorDetail,
      loadingVendorDetail,
      currency,
      navigation,
      loading,
      bLoading,
      addCart,
      buyNow,
      state: {quantity},
      decrement,
      increment,
    } = this.props;
    const {product} = this.state;

    if (!product || !product.id) {
      return (
        <ThemedView isFullView>
          <Empty
            title={t('empty:text_title_product_detail')}
            subTitle={t('empty:text_subtitle_product_detail')}
            clickButton={() => navigation.navigate(homeTabs.shop)}
          />
        </ThemedView>
      );
    }

    const image =
      product.images && product.images.length > 0
        ? product.images[0].shop_catalog
        : null;
    const dataAddons =
      product && product.meta_data
        ? product.meta_data.find(m => m.key === '_product_addons')
        : null;
    const addonsSelected = this?.props?.state?.cart_item_data?.addons ?? [];
    return (
      <ThemeConsumer>
        {({theme}) => (
          <ThemedView isFullView>
            <ViewFooterFixed
              footerElement={
                <Row>
                  <Col>
                    <Button
                      secondary
                      title={t('common:text_buy_now')}
                      loading={bLoading}
                      onPress={() => buyNow(product.id)}
                    />
                  </Col>
                  <Col>
                    <Button
                      title={t('common:text_add_cart')}
                      onPress={() => addCart(product.id)}
                      loading={loading}
                    />
                  </Col>
                </Row>
              }>
              <ParallaxScrollView
                backgroundColor={'transparent'}
                contentBackgroundColor={theme.colors.bgColor}
                parallaxHeaderHeight={HEIGHT_BANNER}
                renderBackground={() => (
                  <ImageHeader
                    bannerUrl={image}
                    width={WIDTH_BANNER}
                    height={HEIGHT_BANNER}
                  />
                )}
                renderForeground={() => (
                  <ListImageHeader images={product.images} />
                )}
                renderFixedHeader={() => (
                  <Header
                    leftComponent={<IconHeader color={white} />}
                    backgroundColor={'transparent'}
                    rightComponent={
                      <View style={styles.viewHeaderRight}>
                        <WishListIcon
                          product_id={product.id}
                          color={white}
                          containerStyle={styles.iconInfo}
                        />
                        <CartIcon />
                      </View>
                    }
                  />
                )}
                stickyHeaderHeight={100}>
                <InfoProduct
                  product={product}
                  vendor={vendorDetail}
                  loadingVendor={loadingVendorDetail}
                />

                {dataAddons &&
                  dataAddons.value &&
                  dataAddons.value.length > 0 &&
                  dataAddons.value.map((addOns, index) => {
                    const fieldName = `${product.id}-${kebabCase(
                      addOns.name,
                    )}-${addOns.position}`;
                    return (
                      <ItemAddOns
                        data={{...addOns, field_name: fieldName}}
                        key={index}
                        addonsSelected={addonsSelected}
                        handleSelect={this.handleSelectAddons}
                        currency={currency}
                      />
                    );
                  })}
                <ViewUnderline style={styles.viewDataCart}>
                  <View style={styles.viewQuantity}>
                    <Quantity
                      quantity={quantity}
                      decrement={decrement}
                      increment={increment}
                      big
                    />
                  </View>
                  <InfoCart
                    nameProduct={product.name}
                    price={
                      product?.price_format?.sale_price ||
                      product?.price_format?.regular_price
                    }
                    quantity={quantity}
                    addonsSelected={addonsSelected}
                  />
                </ViewUnderline>
              </ParallaxScrollView>
            </ViewFooterFixed>
          </ThemedView>
        )}
      </ThemeConsumer>
    );
  }
}

const styles = StyleSheet.create({
  viewHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconInfo: {
    marginRight: margin.large + 4,
  },
  viewDataCart: {
    paddingTop: padding.large + 4,
    borderBottomWidth: 0,
  },
  viewQuantity: {
    alignItems: 'center',
    marginBottom: margin.big - 3,
  },
});

const mapStateToProps = state => {
  return {
    vendorDetail: detailVendorSelector(state).toJS(),
    loadingVendorDetail: loadingDetailVendorSelector(state),
    currency: currencySelector(state),
    defaultCurrency: defaultCurrencySelector(state),
  };
};

export default compose(
  defaultPropsData,
  getSingleData,
  withLoading,
  connect(mapStateToProps),
  withAddToCart,
  withTranslation(),
)(Product);
