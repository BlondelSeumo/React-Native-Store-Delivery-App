import React, {Component} from 'react';

import {Map} from 'immutable';
import take from 'lodash/take';
import isEqual from 'lodash/isEqual';
import split from 'lodash/split';

import {withNavigation} from '@react-navigation/compat';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import {mainStack} from 'src/config/navigator';
import {productListTypes} from 'src/config/product';

import Container from 'src/containers/Container';
import Heading from 'src/containers/Heading';
import Products from '../Products';

import {
  currencySelector,
  defaultCurrencySelector,
  languageSelector,
  daysBeforeNewProductSelector,
} from 'src/modules/common/selectors';
import {locationSelector} from 'src/modules/auth/selectors';
import {getProducts, topSellers} from 'src/modules/product/service';
import {prepareProductItem} from 'src/utils/product';
import {handleError} from 'src/utils/error';

const initHeader = {
  style: {},
};

const getType = fields => {
  if (!fields) {
    return productListTypes.latest;
  }
  const type =
    fields.product_type && fields.product_type.type
      ? fields.product_type.type
      : fields.type
      ? fields.type
      : productListTypes.latest;
  return type;
};

const getInclude = fields => {
  if (!fields) {
    return [];
  }
  const ids =
    fields.product_type &&
    fields.product_type.type === productListTypes.custom &&
    fields.product_type.ids
      ? fields.product_type.ids
      : '';
  return split(ids, ',');
};

class ProductList extends Component {
  constructor(props, context) {
    super(props, context);
    const type = getType(props.fields);
    const per_page =
      props.fields && props.fields.limit ? props.fields.limit : 4;
    const include = getInclude(props.fields);

    this.state = {
      data: [],
      loading: false,
      per_page,
      type,
      include: include,
    };
  }

  componentDidMount() {
    if (this.props.fields) {
      this.getFilter();
    }
  }

  getFilter = async (type = this.state.type) => {
    try {
      let results = this.state.include;
      if (type === productListTypes.best_sales) {
        const topSellerProducts = await topSellers({
          period: 'year',
        });
        if (topSellerProducts.length) {
          results = topSellerProducts.map(({product_id}) => product_id);
        }
      }
      this.setState(
        {
          include: results,
        },
        this.fetchData,
      );
    } catch (e) {
      this.fetchData();
    }
  };

  fetchData = () => {
    const {per_page, include} = this.state;

    const {language, filter, location} = this.props;
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          const query = {
            lang: language,
            status: 'publish',
            include: take(include, per_page),
            per_page,
            ...filter,
            lat: location.latitude,
            lng: location.longitude,
          };
          const data = await getProducts(query);
          this.setState({
            data,
            loading: false,
          });
        } catch (error) {
          this.setState({
            loading: false,
          });
          handleError(error);
        }
      },
    );
  };

  /**
   * Re fetch data if receive different data
   * @param prevProps
   */
  componentDidUpdate(prevProps) {
    if (
      !isEqual(prevProps.fields, this.props.fields) ||
      !isEqual(prevProps.location, this.props.location)
    ) {
      const per_page =
        this.props.fields && this.props.fields.limit
          ? this.props.fields.limit
          : 4;
      const type = getType(this.props.fields);
      const include = getInclude(this.props.fields);
      this.fetchDataUpdate(per_page, type, include);
    }
  }

  fetchDataUpdate = (per_page, type, include) => {
    this.setState(
      {
        per_page,
        type,
        include,
      },
      () => this.getFilter(type, per_page),
    );
  };

  /**
   * Prepare product item to render on FlatList
   * @param item
   * @returns {*}
   */
  prepareProduct = item => {
    const {currency, defaultCurrency, days} = this.props;
    const mapItem = Map(item);
    const result = prepareProductItem(mapItem, currency, defaultCurrency, days);
    return result.toJS();
  };

  render() {
    const {
      navigation,
      navigationType,
      headingElement,
      layout,
      fields,
      widthComponent,
      language,
      t,
    } = this.props;
    const {data, loading, per_page, include} = this.state;

    if (
      !fields ||
      typeof fields !== 'object' ||
      Object.keys(fields).length < 1
    ) {
      return null;
    }

    const heading = fields?.text_heading ?? initHeader;

    const listData = data.map(this.prepareProduct);

    const headerDisable = !fields.boxed ? 'all' : 'none';
    const styleHeader = {
      paddingTop: 0,
    };
    return (
      <>
        {headingElement ||
          (fields && fields.disable_heading && (
            <Container disable={headerDisable}>
              {headingElement ? (
                headingElement
              ) : (
                <Heading
                  title={heading?.text?.[language] ?? t('common:text_product')}
                  style={heading.style}
                  containerStyle={styleHeader}
                  onPress={() =>
                    navigation.navigate(mainStack.products, {
                      name: heading?.text?.[language],
                      filterBy: Map({
                        include: include,
                      }),
                    })
                  }
                  subTitle={t('common:text_show_all')}
                />
              )}
            </Container>
          ))}
        <Products
          data={listData}
          layout={layout}
          fields={fields}
          widthComponent={widthComponent}
          navigationType={navigationType}
          loading={loading}
          limit={per_page}
        />
      </>
    );
  }
}

ProductList.defaultProps = {
  headingElement: null,
  filter: {},
};

const mapStateToProps = state => ({
  currency: currencySelector(state),
  defaultCurrency: defaultCurrencySelector(state),
  language: languageSelector(state),
  days: daysBeforeNewProductSelector(state),
  location: locationSelector(state),
});

export default compose(
  withTranslation(),
  withNavigation,
  connect(mapStateToProps),
)(ProductList);
