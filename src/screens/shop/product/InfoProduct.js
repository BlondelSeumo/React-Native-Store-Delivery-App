import React from 'react';
import join from 'lodash/join';
import unescape from 'lodash/unescape';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, ThemeConsumer} from 'src/components';
import Rating from 'src/containers/Rating';
import VendorItem from 'src/containers/VendorItem';
import VendorItemLoading from 'src/containers/VendorItem/Loading';
import ViewUnderline from 'src/containers/ViewUnderline';
import TextHtml from 'src/containers/TextHtml';
import Price from './Price';

import {mainStack} from 'src/config/navigator';
import {orange} from 'src/components/config/colors';
import {padding, margin} from 'src/components/config/spacing';

const InfoProduct = props => {
  const navigation = useNavigation();
  const {product, vendor, loadingVendor} = props;
  if (!product) {
    return null;
  }
  const {
    id,
    name,
    price_format,
    categories,
    average_rating,
    rating_count,
    short_description,
    images,
  } = product;
  const listCategories = categories
    ? categories.map(category => category.name)
    : [];
  const textCategories = join(listCategories, ',  ');
  const numberRating = parseFloat(average_rating) || 0;
  const image = images && images[0] ? images[0] : null;
  return (
    <ThemeConsumer>
      {({theme}) => {
        const styleHtml = {
          div: {
            color: theme.colors.textColorSecondary,
          },
          span: {
            color: theme.colors.textColorSecondary,
          },
          p: {
            color: theme.colors.textColorSecondary,
          },
        };
        return (
          <ViewUnderline style={styles.container}>
            <View style={styles.viewName}>
              <Text h2 medium h2Style={styles.textName}>
                {unescape(name)}
              </Text>
              <Price
                priceFormat={price_format}
                containerStyle={styles.viewPrice}
              />
            </View>
            <Text colorThird style={styles.textCategories}>
              {textCategories}
            </Text>
            <TouchableOpacity
              style={styles.viewRating}
              onPress={() =>
                navigation.navigate(mainStack.product_review, {
                  product_id: id,
                  name: name,
                  image: image?.src ?? null,
                })
              }>
              <Rating startingValue={numberRating} />
              <Text medium style={styles.textRating}>
                {average_rating}
              </Text>
              <Text colorSecondary style={styles.textCountRating}>
                ({rating_count}+)
              </Text>
            </TouchableOpacity>
            <View style={styles.viewDescription}>
              <TextHtml value={short_description} style={styleHtml} />
            </View>
            {loadingVendor ? (
              <VendorItemLoading type="three" />
            ) : vendor.vendor_id ? (
              <VendorItem item={vendor} type="three" />
            ) : null}
          </ViewUnderline>
        );
      }}
    </ThemeConsumer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: padding.base,
  },
  viewName: {
    marginBottom: margin.base,
    flexDirection: 'row',
  },
  textName: {
    flex: 1,
  },
  viewPrice: {
    marginLeft: margin.large,
  },
  textCategories: {
    marginBottom: margin.base,
  },
  viewRating: {
    marginBottom: margin.large + 2,
    flexDirection: 'row',
  },
  textRating: {
    marginLeft: margin.small,
    color: orange,
  },
  textCountRating: {
    marginLeft: margin.small,
  },
  viewDescription: {
    marginBottom: margin.large + 2,
  },
});
export default InfoProduct;
