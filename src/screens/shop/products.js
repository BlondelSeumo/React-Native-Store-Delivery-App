import React from 'react';
import {connect} from 'react-redux';
import concat from 'lodash/concat';
import find from 'lodash/find';
import flatMap from 'lodash/flatMap';
import compact from 'lodash/compact';
import unescape from 'lodash/unescape';

import {Map, fromJS} from 'immutable';

import {View, StyleSheet} from 'react-native';

import {useTranslation} from 'react-i18next';
import {Header, ThemedView} from 'src/components';
import Container from 'src/containers/Container';
import {TextHeader, IconHeader, CartIcon} from 'src/containers/HeaderComponent';
import Loading from 'src/containers/Loading/LoadingDefault';
import Empty from 'src/containers/Empty';

import Refine from './containers/Refine';
import SwitchProduct from './containers/SwitchProduct';
import CategoryList from './product/CategoryList';
import Style1 from './products/Style1';
import Style2 from './products/Style2';
import Style3 from './products/Style3';
import Style4 from './products/Style4';

import {sortBySelector, filterBySelector} from 'src/modules/product/selectors';
import {
  currencySelector,
  daysBeforeNewProductSelector,
  defaultCurrencySelector,
  languageSelector,
  productViewSelector,
} from 'src/modules/common/selectors';

import {
  clearFilter,
  fetchProducts as clearData,
} from 'src/modules/product/actions';
import {getProducts} from 'src/modules/product/service';
import {categorySelector} from 'src/modules/category/selectors';
import {locationSelector} from 'src/modules/auth/selectors';
import {
  PRODUCT_VIEW_STYLE_1,
  PRODUCT_VIEW_STYLE_2,
  PRODUCT_VIEW_STYLE_3,
  PRODUCT_VIEW_STYLE_4,
} from 'src/modules/common/constants';

import {margin} from 'src/components/config/spacing';
import {mainStack, homeTabs} from 'src/config/navigator';

import {prepareProductItem} from 'src/utils/product';

const components = {
  [PRODUCT_VIEW_STYLE_1]: Style1,
  [PRODUCT_VIEW_STYLE_2]: Style2,
  [PRODUCT_VIEW_STYLE_3]: Style3,
  [PRODUCT_VIEW_STYLE_4]: Style4,
};

const findCategory = (categoryId = '', lists = []) => {
  if (!categoryId || !lists || lists.length < 1) {
    return null;
  }
  var loopWhile = true;

  var category = null;
  var listFlat = lists;

  while (loopWhile && listFlat.length > 0) {
    const categoryFind = find(listFlat, c => c.id === parseInt(categoryId, 0));
    if (categoryFind) {
      category = categoryFind;
      loopWhile = false;
    } else {
      listFlat = compact(flatMap(listFlat, ca => ca.categories));
    }
  }
  return category;
};

class ProductsScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
    const {t, categories, route} = props;

    const categoryId = route?.params?.id ?? '';
    const category = findCategory(categoryId, categories);
    const name =
      route?.params?.name ?? category?.name ?? t('common:text_product');

    this.state = {
      category,
      name,
      loading: true,
      refreshing: false,
      loadingMore: false,
      data: [],
      page: 1,
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  componentDidUpdate(prevProps) {
    const {route} = this.props;

    const sort = route?.params?.sortBy ?? Map();
    const filter = route?.params?.filterBy ?? Map();

    const prevSort = prevProps?.route?.params?.sortBy ?? Map();
    const prevFilter = prevProps?.route?.params?.filterBy ?? Map();

    if (!sort.equals(prevSort) || !filter.equals(prevFilter)) {
      this.fetchProducts(1);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearData([]));
    this.props.dispatch(clearFilter());
  }

  getData = page => {
    const {sortBy, filterBy, lang, location, route} = this.props;
    const {category} = this.state;

    const query = Map({
      status: 'publish',
      lang: lang,
      per_page: 4,
      page: page,
      lat: location.latitude,
      lng: location.longitude,
    })
      .merge(sortBy.get('query'))
      .merge(filterBy)
      .merge(route?.params?.filterBy ?? Map())
      .set(
        'category',
        filterBy.get('category')
          ? filterBy.get('category')
          : category && category.id
          ? category.id
          : '',
      );
    return getProducts(query.toJS());
  };

  fetchProducts = async (page = this.state.page) => {
    try {
      const dataGet = await this.getData(page);

      if (dataGet.length <= 4 && dataGet.length > 0) {
        this.setState(preState => {
          return {
            loading: false,
            refreshing: false,
            loadingMore: dataGet.length === 4,
            data: page === 1 ? dataGet : concat(preState.data, dataGet),
          };
        });
      } else {
        this.setState(preState => {
          return {
            loadingMore: false,
            loading: false,
            refreshing: false,
            data: page === 1 ? [] : preState.data,
          };
        });
      }
    } catch (e) {
      this.setState({
        loading: false,
      });
    }
  };

  handleCategoryPress = (id, name) => {
    this.props.navigation.push(mainStack.products, {
      id: id,
      name: unescape(name),
    });
  };

  handleLoadMore = () => {
    const {loadingMore} = this.state;

    if (loadingMore) {
      this.setState(
        prevState => ({
          page: prevState.page + 1,
          loadingMore: true,
        }),
        () => {
          this.fetchProducts();
        },
      );
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
      },
      () => {
        this.fetchProducts();
      },
    );
  };

  render() {
    const {
      productView,
      defaultCurrency,
      currency,
      days,
      navigation,
      t,
    } = this.props;
    const {category, name, data, loading, loadingMore, refreshing} = this.state;

    const Component =
      components[productView] || components[PRODUCT_VIEW_STYLE_1];

    const dataPrepare = data.map(item =>
      prepareProductItem(fromJS(item), currency, defaultCurrency, days).toJS(),
    );

    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={name} />}
          rightComponent={<CartIcon />}
        />
        {loading ? (
          <Loading />
        ) : data.length ? (
          <View style={styles.viewList}>
            <Container style={styles.viewRefineSwitch}>
              <Refine
                onPress={() =>
                  navigation.navigate(mainStack.refine, {
                    category: category,
                    data,
                  })
                }
              />
              <SwitchProduct productView={productView} />
            </Container>
            <Container style={styles.viewListCategory}>
              <CategoryList
                onPress={this.handleCategoryPress}
                data={
                  category && category.categories ? category.categories : null
                }
              />
            </Container>
            <Component
              data={dataPrepare}
              loadingMore={loadingMore}
              refreshing={refreshing}
              handleLoadMore={this.handleLoadMore}
              handleRefresh={this.handleRefresh}
            />
          </View>
        ) : (
          <Empty
            icon="box"
            title={t('empty:text_title_product')}
            subTitle={t('empty:text_subtitle_product')}
            titleButton={t('common:text_go_shopping')}
            clickButton={() => navigation.navigate(homeTabs.shop)}
          />
        )}
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  viewRefineSwitch: {
    marginTop: margin.base,
    marginBottom: margin.large,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewList: {
    flex: 1,
  },
  viewListCategory: {
    marginBottom: margin.big,
  },
});

const mapStateToProps = state => {
  const {data} = categorySelector(state);
  return {
    sortBy: sortBySelector(state),
    filterBy: filterBySelector(state),
    lang: languageSelector(state),
    categories: data,
    location: locationSelector(state),
    productView: productViewSelector(state),
    currency: currencySelector(state),
    defaultCurrency: defaultCurrencySelector(state),
    days: daysBeforeNewProductSelector(state),
  };
};

const ProductsScreenComponent = connect(mapStateToProps)(ProductsScreen);

export default function(props) {
  const {t} = useTranslation();
  return <ProductsScreenComponent t={t} {...props} />;
}
