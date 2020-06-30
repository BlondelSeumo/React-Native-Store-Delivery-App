import React from 'react';
import {withTranslation} from 'react-i18next';
import concat from 'lodash/concat';
import unescape from 'lodash/unescape';
import {
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Text} from 'src/components';
import Container from 'src/containers/Container';
import OpacityView from 'src/containers/OpacityView';
import Notification from './Notification';
import EmptyCategory from './EmptyCategory';

import {borderRadius, margin, padding} from 'src/components/config/spacing';
import {black, white} from 'src/components/config/colors';
import ButtonGroup from 'src/containers/ButtonGroup';
import {excludeCategory} from 'src/utils/category';
import {exclude_categories} from 'src/config/category';

const {width} = Dimensions.get('window');

const noImage = require('src/assets/images/imgCateDefault.png');

class Style3 extends React.Component {
  constructor(props) {
    super(props);
    const {data} = props;
    const listParent = excludeCategory(data, exclude_categories);
    const parent = listParent[0] ? listParent[0] : null;
    this.state = {
      listParent,
      parent,
    };
  }

  changeParent = index => {
    const {listParent} = this.state;
    const findCategory = listParent.find((c, inx) => inx === index);
    if (findCategory && findCategory.id) {
      this.setState({
        parent: findCategory,
      });
    }
  };

  render() {
    const {t, goProducts} = this.props;
    const {listParent, parent} = this.state;

    if (listParent.length < 1) {
      return <EmptyCategory />;
    }
    const size = (width - 2 * padding.large - padding.small) / 2;

    const _childCategories =
      parent && parent.categories ? parent.categories : [];
    const childCategories = excludeCategory(
      _childCategories,
      exclude_categories,
    );

    const listData = parent ? concat(childCategories, parent) : childCategories;

    return (
      <>
        <Container disable="right">
          <ButtonGroup
            lists={listParent}
            visit={listParent.findIndex(c => parent && c.id === parent.id)}
            pad={40}
            containerStyle={styles.listParentCategory}
            contentContainerStyle={styles.contentListParentCategory}
            clickButton={index => this.changeParent(index)}
          />
        </Container>
        <Notification containerStyle={styles.notification} />
        {listData.length < 1 ? (
          <EmptyCategory />
        ) : (
          <Container style={styles.content}>
            <FlatList
              numColumns={2}
              columnWrapperStyle={styles.viewCol}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => `${item.id}`}
              data={listData}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => goProducts(item)}>
                  <Image
                    source={
                      item && item.image && item.image.src
                        ? {uri: item.image.src}
                        : noImage
                    }
                    style={{width: size, height: size}}
                  />
                  <OpacityView style={styles.viewText}>
                    <Text h5Style={styles.text} h5 medium>
                      {parent && item.id === parent.id
                        ? t('catalog:text_view_all')
                        : unescape(item.name)}
                    </Text>
                  </OpacityView>
                </TouchableOpacity>
              )}
            />
          </Container>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  listParentCategory: {
    marginBottom: margin.big - 4,
  },
  contentListParentCategory: {
    paddingRight: margin.large,
  },
  notification: {
    marginBottom: margin.base,
  },
  content: {
    flex: 1,
  },
  viewCol: {
    justifyContent: 'space-between',
    marginBottom: margin.small,
  },
  item: {
    borderRadius: borderRadius.base,
    overflow: 'hidden',
  },
  viewImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: black,
    opacity: 0.4,
  },
  viewText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  text: {
    paddingHorizontal: padding.base,
    paddingVertical: padding.base + 2,
    textAlign: 'center',
    color: white,
  },
});

Style3.defaultProps = {
  goProducts: () => {},
};

export default withTranslation()(Style3);
