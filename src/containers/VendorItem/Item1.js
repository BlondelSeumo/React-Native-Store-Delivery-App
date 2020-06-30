import React from 'react';
import includes from 'lodash/includes';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text, Icon, Image, withTheme} from 'src/components';
import RatingItem from 'src/containers/RatingItem';
import TimeItem from 'src/containers/TimeItem';
import DirectionItem from 'src/containers/DirectionItem';
import BadgeItem from 'src/containers/BadgeItem';

import {padding, margin, borderRadius} from 'src/components/config/spacing';
import {white} from 'src/components/config/colors';

const Item1 = ({item, style, clickPage, typeUrl, onPressDirection, theme}) => {
  const {t} = useTranslation();
  if (!item) {
    return null;
  }
  const {
    store_name,
    featured,
    avg_review_rating,
    shop_description,
    matrix,
    shipping_methods,
  } = item;

  // distance
  const {distance, duration} =
    matrix && matrix.length && matrix[0].status === 'OK' ? matrix[0] : {};
  const free = shipping_methods
    ? includes(shipping_methods, 'free_shipping')
    : false;
  const pickup = shipping_methods
    ? includes(shipping_methods, 'local_pickup')
    : false;
  return (
    <TouchableOpacity
      onPress={clickPage}
      style={[
        styles.container,
        {borderColor: theme.colors.border},
        style && style,
      ]}>
      <Image
        source={
          item[typeUrl]
            ? {uri: item[typeUrl], cache: 'reload'}
            : require('src/assets/images/pDefault.png')
        }
        style={styles.image}
        containerStyle={styles.viewImage}
        PlaceholderContent={<ActivityIndicator />}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.viewName}>
          {featured ? (
            <Icon
              size={16}
              name="check-decagram"
              color={theme.colors.primary}
              type="material-community"
              containerStyle={styles.iconFeature}
            />
          ) : null}
          <Text medium h4 numberOfLines={2} style={styles.textName}>
            {store_name}
          </Text>
          {onPressDirection ? (
            <TouchableOpacity
              style={styles.viewButtonDirection(theme)}
              onPress={onPressDirection}>
              <Icon
                size={22}
                name="directions"
                color={white}
                type="material-community"
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <Text colorFourth style={styles.textDescription} numberOfLines={1}>
          {shop_description.replace(/(<([^>]+)>)/gi, '')}
        </Text>
        <View style={styles.viewRatingTime}>
          <RatingItem rating={avg_review_rating} style={styles.rating} />
          {duration ? (
            <TimeItem time={duration.text} style={styles.time} />
          ) : null}
          {distance ? <DirectionItem title={distance.text} /> : null}
        </View>
        <View style={styles.listBadge}>
          {free ? (
            <BadgeItem
              title={t('common:text_free_ship')}
              nameColor="greenBlue"
              style={styles.badge}
            />
          ) : null}
          {pickup ? (
            <BadgeItem
              title={t('common:pickup')}
              nameColor="violet"
              style={styles.badge}
            />
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: padding.large + 4,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  viewImage: {
    borderRadius: borderRadius.base,
    overflow: 'hidden',
  },
  image: {
    width: 110,
    height: 110,
  },
  content: {
    flex: 1,
    marginLeft: margin.large,
  },
  viewName: {
    flexDirection: 'row',
    marginBottom: margin.small,
  },
  textName: {
    flex: 1,
  },
  iconFeature: {
    marginTop: 3,
    marginRight: 6,
  },
  textDescription: {
    marginBottom: margin.large,
  },
  viewRatingTime: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: margin.large,
  },
  rating: {
    marginRight: margin.large + 2,
  },
  time: {
    marginRight: margin.large,
  },
  listBadge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    marginRight: margin.small + 1,
  },
  viewButtonDirection: theme => ({
    width: 36,
    height: 36,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.base,
    marginLeft: margin.base,
  }),
});

Item1.defaultProps = {
  typeUrl: 'gravatar',
};

export default withTheme(Item1);
