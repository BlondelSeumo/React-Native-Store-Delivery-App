import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';
import compact from 'lodash/compact';
import unescape from 'lodash/unescape';
import {withTranslation} from 'react-i18next';
import {View, StyleSheet, Dimensions, ActivityIndicator} from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {ThemedView, Header, Icon, ThemeConsumer} from 'src/components';
import {IconHeader, CartIcon} from 'src/containers/HeaderComponent';
import ViewUnderline from 'src/containers/ViewUnderline';
import Heading from 'src/containers/Heading';
import ImageHeader from './store-detail/ImageHeader';
import InfoVendor from './store-detail/InfoVendor';
import ProductList from 'src/screens/home/containers/ProductList';
import Products from 'src/screens/home/containers/Products';
import Empty from 'src/containers/Empty';

import {padding, margin} from 'src/components/config/spacing';
import {white} from 'src/components/config/colors';
import {homeTabs, mainStack} from 'src/config/navigator';
import {getProducts} from 'src/modules/product/service';
import {
  currencySelector,
  daysBeforeNewProductSelector,
  defaultCurrencySelector,
  languageSelector,
} from 'src/modules/common/selectors';
import {prepareProductItem} from 'src/utils/product';
import {exclude_categories} from 'src/config/category';
import {excludeCategory} from 'src/utils/category';

const {width} = Dimensions.get('window');
const WIDTH_BANNER = width;
const HEIGHT_BANNER = (WIDTH_BANNER * 240) / 375;

class Vendor extends Component {
  constructor(props) {
    super(props);
    const {route} = props;
    const vendor = route?.params?.vendor ?? null;
    this.state = {
      vendor,
      loadingProduct: true,
      products: [],
      categories: [],
    };
  }

  componentDidMount() {
    this.getProduct();
  }

  prepareProduct = item => {
    const {currency, defaultCurrency, days} = this.props;
    const mapItem = Map(item);
    const result = prepareProductItem(mapItem, currency, defaultCurrency, days);
    return result.toJS();
  };

  getProduct = async () => {
    try {
      const {language} = this.props;
      const {vendor} = this.state;
      if (vendor && vendor.id) {
        const query = {
          status: 'publish',
          vendor_id: vendor.id,
          lang: language,
        };
        const data = await getProducts(query);
        const listCategoriesGroup = data.map(p => p.categories);
        const listCategories = compact(flatten(listCategoriesGroup));
        const categories = excludeCategory(
          uniqBy(listCategories, 'id'),
          exclude_categories,
        );

        this.setState({
          products: data.map(this.prepareProduct),
          categories: categories,
          loadingProduct: false,
        });
      }
    } catch (e) {
      this.state({
        loadingProduct: false,
      });
    }
  };

  goStoreInfo = () => {
    const {navigation} = this.props;
    const {vendor} = this.state;
    navigation.navigate(mainStack.store_info, {vendor});
  };

  render() {
    const {navigation, t} = this.props;
    const {vendor, loadingProduct, products, categories} = this.state;

    if (!vendor) {
      return (
        <ThemedView isFullView>
          <Empty
            icon="box"
            title={t('empty:text_title_product')}
            subTitle={t('empty:text_subtitle_product')}
            titleButton={t('common:text_go_shopping')}
            clickButton={() => navigation.navigate(homeTabs.shop)}
          />
        </ThemedView>
      );
    }

    return (
      <ThemeConsumer>
        {({theme}) => (
          <ThemedView isFullView>
            <ParallaxScrollView
              backgroundColor={'transparent'}
              contentBackgroundColor={theme.colors.bgColor}
              parallaxHeaderHeight={HEIGHT_BANNER}
              renderBackground={() => (
                <ImageHeader
                  bannerUrl={vendor.mobile_banner_url}
                  width={WIDTH_BANNER}
                  height={HEIGHT_BANNER}
                />
              )}
              renderFixedHeader={() => (
                <Header
                  leftComponent={<IconHeader color={white} />}
                  backgroundColor={'transparent'}
                  rightComponent={
                    <View style={styles.viewHeaderRight}>
                      <Icon
                        name="info-circle"
                        type="font-awesome"
                        color={white}
                        size={18}
                        containerStyle={styles.iconInfo}
                        onPress={this.goStoreInfo}
                      />
                      <CartIcon />
                    </View>
                  }
                />
              )}
              stickyHeaderHeight={100}>
              <InfoVendor vendor={vendor} />
              <ViewUnderline style={styles.viewFeature}>
                <ProductList
                  headingElement={
                    <Heading
                      title={t('catalog:text_most_featured')}
                      containerStyle={styles.viewHeadingFeature}
                      subTitle={t('common:text_show_all')}
                    />
                  }
                  navigationType="push"
                  fields={{
                    boxed: false,
                    width: 142,
                    height: 141.5,
                  }}
                  filter={{
                    vendor_id: vendor.vendor_id,
                    featured: true,
                  }}
                  layout="threecolumns"
                />
              </ViewUnderline>

              {loadingProduct ? (
                <View style={styles.viewLoading}>
                  <ActivityIndicator />
                </View>
              ) : (
                categories.map((c, index) => {
                  const productCa = products.filter(p => {
                    const caProduct = p?.categories ?? [];
                    const caFind = caProduct.find(ca => ca.id === c.id);
                    return caFind;
                  });
                  return (
                    <ViewUnderline key={index}>
                      <Heading
                        title={unescape(c.name)}
                        containerStyle={styles.viewHeadingGroupProduct}
                      />
                      <Products
                        data={productCa}
                        layout="list"
                        fields={{
                          width: 100,
                          height: 100,
                        }}
                        navigationType="push"
                      />
                    </ViewUnderline>
                  );
                })
              )}
            </ParallaxScrollView>
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
  viewFeature: {
    paddingBottom: 45,
  },
  viewHeadingFeature: {
    paddingTop: 0,
    marginTop: margin.large + 4,
  },
  viewLoading: {
    marginVertical: margin.large,
  },
  viewHeadingGroupProduct: {
    paddingTop: 0,
    marginTop: margin.large + 4,
    paddingBottom: padding.large,
  },
  viewGroupProductLastest: {
    borderBottomWidth: 0,
  },
});

const mapStateToProps = state => ({
  language: languageSelector(state),
  days: daysBeforeNewProductSelector(state),
  currency: currencySelector(state),
  defaultCurrency: defaultCurrencySelector(state),
});

export default connect(mapStateToProps)(withTranslation()(Vendor));
