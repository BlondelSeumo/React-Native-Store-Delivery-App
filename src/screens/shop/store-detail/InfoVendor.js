import React from 'react';
import floor from 'lodash/floor';
import {View, Platform} from 'react-native';
import {Avatar, Text, withTheme} from 'src/components';
import TextHtml from 'src/containers/TextHtml';
import Rating from 'src/containers/Rating';
import ViewUnderline from 'src/containers/ViewUnderline';
import FeatureVendor from './FeatureVendor';
import TimeItem from 'src/containers/TimeItem';
import DirectionItem from 'src/containers/DirectionItem';
import BadgeItem from 'src/containers/BadgeItem';
import {white, orange} from 'src/components/config/colors';
import {margin, borderRadius} from 'src/components/config/spacing';
import includes from 'lodash/includes';

const InfoVendor = ({vendor, theme}) => {
  if (!vendor) {
    return null;
  }
  const {
    gravatar,
    store_name,
    avg_review_rating,
    total_review_rating,
    featured,
    shipping_methods,
    shop_description,
    matrix,
  } = vendor;
  const {distance, duration} =
    matrix && matrix.length && matrix[0].status === 'OK' ? matrix[0] : {};
  const {colors} = theme;

  const valueRating = avg_review_rating || '0';
  const convertRating = parseFloat(valueRating);
  const countRating = total_review_rating || 0;
  const countPrecision = -countRating.toString().length + 1;

  const free = shipping_methods
    ? includes(shipping_methods, 'free_shipping')
    : false;
  const pickup = shipping_methods
    ? includes(shipping_methods, 'local_pickup')
    : false;

  const styleHtml = {
    div: {
      color: colors.textColorSecondary,
    },
    span: {
      color: colors.textColorSecondary,
    },
    p: {
      color: colors.textColorSecondary,
    },
  };

  return (
    <ViewUnderline>
      <Avatar
        source={
          gravatar ? {uri: gravatar} : require('src/assets/images/pDefault.png')
        }
        size={60}
        rounded
        containerStyle={styles.avatar}
      />
      <FeatureVendor isFeature={featured} style={styles.viewFeature} />
      <Text h2 medium style={styles.textName}>
        {store_name}
      </Text>
      <Text colorThird style={styles.textType}>
        Fast Food
      </Text>
      <View style={styles.viewRatingTime}>
        <View style={styles.viewRating}>
          <Rating startingValue={convertRating} readonly />
          <Text style={styles.textRating} h4 bold>
            {convertRating}
          </Text>
          <Text style={styles.textCountRating} colorSecondary>
            ({floor(countRating, countPrecision)}+)
          </Text>
        </View>
        {distance || duration ? (
          <View style={styles.viewTime}>
            {duration ? (
              <TimeItem time={duration.text} style={styles.time} />
            ) : null}
            {distance ? <DirectionItem title={distance.text} /> : null}
          </View>
        ) : null}
      </View>
      {free || pickup ? (
        <View style={styles.viewListAtr}>
          {free ? (
            <BadgeItem
              title="free ship"
              nameColor="greenBlue"
              style={styles.badge}
            />
          ) : null}
          {pickup ? <BadgeItem title="pickup" nameColor="violet" /> : null}
        </View>
      ) : null}
      <TextHtml value={shop_description} style={styleHtml} />
    </ViewUnderline>
  );
};

const styles = {
  avatar: {
    borderWidth: borderRadius.small,
    borderColor: white,
    marginTop: -30,
    marginBottom: margin.base,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
      },
      default: {
        elevation: 5,
      },
    }),
  },
  viewFeature: {
    marginBottom: margin.small - 1,
  },
  textName: {
    marginBottom: margin.small + 1,
  },
  textType: {
    marginBottom: margin.base,
  },
  viewRatingTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: margin.large,
  },
  viewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textRating: {
    marginLeft: margin.small,
    color: orange,
  },
  textCountRating: {
    marginLeft: margin.small - 3,
  },
  viewTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: margin.large,
  },
  time: {
    marginRight: margin.large - 1,
  },
  viewListAtr: {
    marginBottom: margin.small,
    flexDirection: 'row',
  },
  badge: {
    marginRight: margin.small,
  },
};

export default withTheme(InfoVendor);
