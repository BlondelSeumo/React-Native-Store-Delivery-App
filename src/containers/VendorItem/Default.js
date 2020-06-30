import React from 'react';
import includes from 'lodash/includes';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, View, TouchableOpacity} from 'react-native';
import {Image, Text, Icon, withTheme} from 'src/components';
import RatingItem from 'src/containers/RatingItem';
import TimeItem from 'src/containers/TimeItem';
import DirectionItem from 'src/containers/DirectionItem';
import BadgeItem from 'src/containers/BadgeItem';

import {white} from 'src/components/config/colors';
import {margin, padding, borderRadius} from 'src/components/config/spacing';
import {lineHeights} from 'src/components/config/fonts';

const Default = props => {
  const {t} = useTranslation();
  const {
    item,
    style,
    clickPage,
    width,
    height,
    typeUrl,
    onPressDirection,
    theme,
  } = props;
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
      style={[styles.container(theme), {width}, style && style]}
      onPress={clickPage}
      activeOpacity={0.9}>
      <View>
        <Image
          source={
            item[typeUrl]
              ? {uri: item[typeUrl], cache: 'reload'}
              : require('src/assets/images/pDefault.png')
          }
          style={[
            {
              width,
              height,
            },
            styles.image,
          ]}
          containerStyle={styles.containerImage}
          resizeMode="cover"
          PlaceholderContent={<ActivityIndicator />}
        />

        <View style={styles.viewFooterImage}>
          {free ? (
            <BadgeItem
              title={t('common:text_free_ship')}
              nameColor="greenBlue"
              style={styles.badge}
            />
          ) : null}
          {pickup ? (
            <BadgeItem
              title={t('common:text_pickup')}
              nameColor="violet"
              style={styles.badge}
            />
          ) : null}
        </View>
      </View>
      <View style={styles.viewContent}>
        <View style={styles.viewHeader}>
          <View style={styles.viewHeaderLeft}>
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
              <Text h4 medium style={styles.textName} numberOfLines={2}>
                {store_name}
              </Text>
            </View>
            <Text colorFourth numberOfLines={1}>
              {shop_description.replace(/(<([^>]+)>)/gi, '')}
            </Text>
          </View>
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
        <View style={styles.viewFooterInfo}>
          <RatingItem rating={avg_review_rating} style={styles.rating} />
          {duration ? (
            <TimeItem time={duration.text} style={styles.time} />
          ) : null}
          {distance ? <DirectionItem title={distance.text} /> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  container: theme => ({
    backgroundColor: theme.colors.support.bgColor,
    borderRadius: borderRadius.base,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 3,
    shadowOpacity: 0.08,
    elevation: 3,
    marginBottom: 6,
    marginHorizontal: 4,
  }),
  containerImage: {
    borderTopLeftRadius: borderRadius.base,
    borderTopRightRadius: borderRadius.base,
    overflow: 'hidden',
  },
  image: {},
  viewFooterImage: {
    position: 'absolute',
    bottom: padding.small / 2,
    left: padding.small,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: borderRadius.small,
  },
  badge: {
    marginRight: margin.small,
    marginBottom: padding.small / 2,
  },
  viewContent: {
    padding: padding.base,
    paddingTop: padding.large,
  },
  viewHeader: {
    flexDirection: 'row',
    marginBottom: margin.base,
  },
  viewHeaderLeft: {
    flex: 1,
  },
  viewName: {
    flexDirection: 'row',
    marginBottom: margin.small - 2,
  },
  iconFeature: {
    marginRight: margin.small - 3,
    marginTop: 4,
  },
  textName: {
    flex: 1,
    height: 2 * lineHeights.h4,
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
  viewFooterInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rating: {
    marginRight: margin.big - 3,
  },
  time: {
    marginRight: margin.large - 1,
  },
};

Default.defaultProps = {
  width: 100,
  height: 100,
  typeUrl: 'gravatar',
};

export default withTheme(Default);
