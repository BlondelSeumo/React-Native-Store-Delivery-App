import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {Avatar, Text, Icon, Image} from 'src/components';
import OpacityView from 'src/containers/OpacityView';
import Rating from 'src/containers/Rating';
import DirectionItem from 'src/containers/DirectionItem';
import {white} from 'src/components/config/colors';
import {padding, margin, borderRadius} from 'src/components/config/spacing';

const Item3 = props => {
  const {t} = useTranslation();
  const {item, clickPage} = props;
  const {
    store_name,
    mobile_banner_url,
    gravatar,
    featured,
    avg_review_rating,
    matrix,
  } = item;

  const {distance, duration} =
    matrix && matrix.length && matrix[0].status === 'OK' ? matrix[0] : {};

  const rating =
    parseFloat(avg_review_rating) > 0 ? parseFloat(avg_review_rating) : 0;

  return (
    <TouchableOpacity onPress={clickPage}>
      <Image
        ImageComponent={ImageBackground}
        source={
          mobile_banner_url
            ? {uri: mobile_banner_url}
            : require('src/assets/images/pDefault.png')
        }
        style={styles.imageBg}
        containerStyle={styles.containerImage}>
        <OpacityView bgColor={'#000'} opacity={0.6} style={styles.content}>
          <Avatar
            source={
              gravatar
                ? {uri: gravatar}
                : require('src/assets/images/pDefault.png')
            }
            size={60}
            rounded
          />
          <View style={styles.viewRight}>
            {featured || distance || duration ? (
              <View style={styles.viewHeader}>
                {featured ? (
                  <Text h6 h6Style={[styles.text, styles.viewItemHeader]}>
                    {t('catalog:text_store_featured')}
                  </Text>
                ) : null}
                {duration ? (
                  <Text h6 h6Style={[styles.text, styles.viewItemHeader]}>
                    {duration.text}
                  </Text>
                ) : null}
                {distance ? (
                  <DirectionItem title={distance.text} color={white} />
                ) : null}
              </View>
            ) : null}
            <Text h3 medium h3Style={styles.text} numberOfLines={1}>
              {store_name}
            </Text>
            <View style={styles.viewRating}>
              <View style={styles.rating}>
                <Text h4 medium h4Style={[styles.text, styles.textRating]}>
                  {rating.toFixed(1)}
                </Text>
                <Rating startingValue={rating} readonly />
              </View>
              <Icon
                size={24}
                type="material"
                name="chevron-right"
                isRotateRTL
                color={white}
              />
            </View>
          </View>
        </OpacityView>
      </Image>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  containerImage: {
    borderRadius: borderRadius.large,
    overflow: 'hidden',
  },
  imageBg: {
    width: '100%',
    height: 120,
  },
  content: {
    paddingHorizontal: padding.large,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  viewRight: {
    flex: 1,
    marginLeft: margin.large + 3,
  },
  viewHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: margin.small - 7,
  },
  viewItemHeader: {
    marginRight: margin.large - 1,
  },
  viewRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 1,
  },
  rating: {
    flexDirection: 'row',
  },
  textRating: {
    marginRight: margin.small - 3,
  },
  text: {
    color: white,
  },
});
export default Item3;
