import React from 'react';
import {connect} from 'react-redux';
import includes from 'lodash/includes';
import concat from 'lodash/concat';
import compact from 'lodash/compact';
import flatMap from 'lodash/flatMap';
import unescape from 'lodash/unescape';
import isEqual from 'lodash/isEqual';
import {withTranslation} from 'react-i18next';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import {
  StyleSheet,
  ScrollView,
  Modal,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import {Text, Button, ListItem, ThemeConsumer, SearchBar} from 'src/components';
import ViewFooterFixed from 'src/containers/ViewFooterFixed';
import Container from 'src/containers/Container';
import IconRadius from 'src/containers/IconRadius';
import CustomMarker from 'src/containers/MultiSlider/CustomMarker';
import MultiSlider from 'src/containers/MultiSlider';

import {categorySelector} from 'src/modules/category/selectors';

import {padding, margin} from 'src/components/config/spacing';
import {exclude_categories} from 'src/config/category';
import {MIN_RADIUS, MAX_RADIUS, INIT_SORTBY} from '../config';
const {width} = Dimensions.get('window');
const WIDTH_MODAL = parseInt(width * 0.8, 0);
const WIDTH_MULTI_SLIDER = WIDTH_MODAL - 2 * padding.large - 20;

const titlePropsItem = {
  medium: true,
};

const textRadius = value => `${value}km`;

const listDataCategories = data => {
  if (!data || data.length < 1) {
    return [];
  }

  let results = compact(data);
  let categoriesChildren = compact(flatMap(results, ca => ca.categories));
  let loopWhile = true;

  while (loopWhile) {
    results = concat(results, categoriesChildren);
    categoriesChildren = compact(
      flatMap(categoriesChildren, ca => ca.categories),
    );
    if (categoriesChildren.length < 1) {
      loopWhile = false;
    }
  }
  return results.filter(result => !includes(exclude_categories, result.id));
};

class ModalFilter extends React.Component {
  constructor(props, context) {
    super(props, context);
    const {visible} = props;
    const opacity = visible ? 0.5 : 0;
    this.state = {
      visible: visible,
      opacity: new Animated.Value(opacity),
      showCategory: false,
      sortBy: props.sortBy,
    };
  }

  animation = (type = 'open', cb = () => {}) => {
    const toValue = type === 'open' ? 0.7 : 0;
    const duration = 450;
    Animated.timing(this.state.opacity, {
      toValue,
      duration,
      useNativeDriver: false,
    }).start(cb);
  };

  onShow = () => {
    this.animation();
  };

  componentDidUpdate(preProps) {
    const {visible, sortBy} = this.props;

    if (!visible && preProps.visible !== visible) {
      this.animation('close', () => this.updateVisible(visible));
    }

    if (visible && preProps.visible !== visible) {
      this.updateVisible(visible);
    }

    if (!isEqual(sortBy, preProps.sortBy)) {
      this.updateSortBy(sortBy);
    }
  }
  updateVisible = visible => {
    this.setState({visible});
  };
  updateDataSortBy = (key, value) => {
    this.setState(preState => ({
      sortBy: {
        ...preState.sortBy,
        [key]: value,
      },
    }));
  };
  updateSortBy = data => {
    this.setState({
      sortBy: data,
    });
  };
  renderFilter = () => {
    const {t} = this.props;
    const {
      sortBy: {orderby, search_term},
    } = this.state;
    const dataFilter = [
      {
        key: 'promo',
        title: t('home:text_newness_asc'),
        query: 'newness_asc',
      },
      {
        key: 'free_shipping',
        title: t('home:text_newness_desc'),
        query: 'newness_des',
      },
      {
        key: 'new',
        title: t('home:text_rating_asc'),
        query: 'rating_asc',
      },
      {
        key: 'sale',
        title: t('home:text_rating_desc'),
        query: 'rating_desc',
      },
      {
        key: 'featured',
        title: t('home:text_alphabetical_asc'),
        query: 'alphabetical_asc',
      },
      {
        key: 'rating',
        title: t('home:text_alphabetical_desc'),
        query: 'alphabetical_desc',
      },
    ];

    return (
      <ThemeConsumer>
        {({theme}) => (
          <View>
            <View style={styles.viewFilter}>
              <Text medium h3>
                {t('home:text_filter')}
              </Text>
              <Text
                h6
                colorThird
                onPress={() => this.updateSortBy(INIT_SORTBY)}>
                {t('common:text_clear_all')}
              </Text>
            </View>
            <SearchBar
              cancelButton={false}
              placeholder={t('home:text_search_store')}
              onChangeText={value =>
                this.updateDataSortBy('search_term', value)
              }
              value={search_term}
              platform="ios"
              onClear={() => this.updateDataSortBy('search_term', '')}
              containerStyle={styles.search}
              inputContainerStyle={{
                backgroundColor: theme.colors.support.bgColorSecondary,
              }}
            />
            {dataFilter.map(value => (
              <ListItem
                key={value.key}
                title={value.title}
                rightElement={<IconRadius isSelect={value.query === orderby} />}
                type="underline"
                titleProps={titlePropsItem}
                titleStyle={
                  value.query === orderby && {color: theme.colors.primary}
                }
                containerStyle={[
                  styles.item,
                  {borderColor: theme.colors.borderSecondary},
                ]}
                onPress={() => this.updateDataSortBy('orderby', value.query)}
              />
            ))}
          </View>
        )}
      </ThemeConsumer>
    );
  };

  clickApply = () => {
    const {handleApply, setModalFilterVisible} = this.props;
    const {sortBy} = this.state;
    setModalFilterVisible(false);
    handleApply(sortBy);
  };
  render() {
    const {setModalFilterVisible, category, t} = this.props;
    const {
      opacity,
      visible,
      showCategory,
      sortBy: {wcfmmp_radius_range, wcfmmp_store_category},
    } = this.state;
    const {data} = category;
    const listCategory = listDataCategories(data);
    const right = opacity.interpolate({
      inputRange: [0, 0.7],
      outputRange: [-WIDTH_MODAL, 0],
    });
    const categorySelect = wcfmmp_store_category
      ? listCategory.find(ca => ca.id === wcfmmp_store_category)
      : null;
    return (
      <ThemeConsumer>
        {({theme}) => (
          <Modal
            visible={visible}
            transparent={true}
            onRequestClose={() => setModalFilterVisible(false)}
            onShow={this.onShow}>
            <View style={styles.container}>
              <Animated.View style={[styles.viewOpacity, {opacity: opacity}]}>
                <TouchableOpacity
                  style={styles.touchClose}
                  onPress={() => setModalFilterVisible(false)}
                  activeOpacity={1}
                />
              </Animated.View>
              <Animated.View
                style={[
                  styles.content,
                  {backgroundColor: theme.colors.support.bgColor, right: right},
                ]}>
                <ViewFooterFixed
                  footerElement={
                    <Button
                      title={t('common:text_apply_filter')}
                      onPress={this.clickApply}
                    />
                  }
                  isShadow={false}>
                  <ScrollView>
                    <Container>
                      {this.renderFilter()}
                      <View style={styles.viewSlider}>
                        <MultiSlider
                          values={[wcfmmp_radius_range]}
                          sliderLength={WIDTH_MULTI_SLIDER}
                          onValuesChange={value =>
                            this.updateDataSortBy(
                              'wcfmmp_radius_range',
                              value[0],
                            )
                          }
                          min={MIN_RADIUS}
                          max={MAX_RADIUS}
                          step={1}
                          allowOverlap={false}
                          snapped
                          minMarkerOverlapDistance={40}
                          customMarker={CustomMarker}
                          renderMarker={textRadius}
                          containerStyle={styles.slider}
                        />
                        <View style={styles.footerSlider}>
                          <Text medium colorFourth>
                            {textRadius(MIN_RADIUS)}
                          </Text>
                          <Text medium colorFourth>
                            {textRadius(MAX_RADIUS)}
                          </Text>
                        </View>
                      </View>
                      <ListItem
                        title={t('catalog:text_category')}
                        containerStyle={[
                          styles.item,
                          {borderColor: theme.colors.borderSecondary},
                        ]}
                        titleProps={titlePropsItem}
                        type="underline"
                        rightElement={
                          categorySelect && (
                            <Text h6 colorThird h6Style={styles.textCategory}>
                              {unescape(categorySelect.name)}
                            </Text>
                          )
                        }
                        chevron={
                          showCategory
                            ? {name: 'chevron-up'}
                            : {name: 'chevron-down'}
                        }
                        pad={5}
                        onPress={() =>
                          this.setState({showCategory: !showCategory})
                        }
                      />
                      {showCategory ? (
                        <Container disable="right">
                          {listCategory.map(ca => (
                            <ListItem
                              key={ca.id}
                              title={unescape(ca.name)}
                              titleProps={titlePropsItem}
                              containerStyle={[
                                styles.item,
                                {borderColor: theme.colors.borderSecondary},
                              ]}
                              type="underline"
                              rightElement={
                                <IconRadius
                                  isSelect={categorySelect?.id === ca.id}
                                />
                              }
                              onPress={() =>
                                this.updateDataSortBy(
                                  'wcfmmp_store_category',
                                  ca.id,
                                )
                              }
                            />
                          ))}
                        </Container>
                      ) : null}
                    </Container>
                  </ScrollView>
                </ViewFooterFixed>
              </Animated.View>
            </View>
          </Modal>
        )}
      </ThemeConsumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewOpacity: {
    flex: 1,
    backgroundColor: '#000',
  },
  touchClose: {
    flex: 1,
  },
  content: {
    width: WIDTH_MODAL,
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  item: {
    minHeight: 53,
    paddingVertical: padding.base + 2,
  },
  viewFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: getStatusBarHeight(),
    marginBottom: margin.large + 4,
  },
  search: {
    padding: 0,
    marginBottom: margin.large + 4,
  },
  viewSlider: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  slider: {
    height: 72,
    justifyContent: 'flex-end',
  },
  footerSlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: margin.base + 2,
    marginBottom: margin.large + 4,
    width: '100%',
  },
  textCategory: {
    maxWidth: 100,
  },
});

ModalFilter.defaultProps = {
  visible: false,
  setModalFilterVisible: (value = false) => {},
};

const mapStateToProps = state => ({
  category: categorySelector(state),
});

export default connect(
  mapStateToProps,
  null,
)(withTranslation()(ModalFilter));
