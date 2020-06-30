import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import unescape from 'lodash/unescape';
import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Text, Image, ThemeConsumer} from 'src/components';
import Carousel from 'react-native-snap-carousel';

import {mainStack} from 'src/config/navigator';

import {margin, padding, borderRadius} from 'src/components/config/spacing';
import {timeAgo} from 'src/utils/time';

const {width} = Dimensions.get('window');
const sliderWidth = width;
const itemWidth = sliderWidth - 90;
const itemHeight = (itemWidth * 334) / 286;
const heightImage = (itemWidth * 253) / 286;

const LastestBlog = ({data}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  return (
    <ThemeConsumer>
      {({theme}) => (
        <View style={styles.container}>
          <Text medium h2 style={styles.textTitle}>
            {t('blog:text_lastest')}
          </Text>
          <Carousel
            data={data}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            loop
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(mainStack.blog_detail, {blog: item})
                }
                activeOpacity={1}>
                <Image
                  ImageComponent={ImageBackground}
                  source={
                    item.rnlab_featured_media_url
                      ? {uri: item.rnlab_featured_media_url}
                      : require('src/assets/images/pDefault.png')
                  }
                  containerStyle={styles.containerImage}
                  style={styles.viewImage}
                  imageStyle={styles.image}>
                  <View
                    style={[
                      styles.viewInfo,
                      {
                        backgroundColor: theme.colors.support.bgColor,
                      },
                    ]}>
                    <Text medium h4 style={styles.textName}>
                      {unescape(item.title.rendered)}
                    </Text>
                    <Text h6 colorThird>
                      {timeAgo(item.date_gmt)}
                    </Text>
                  </View>
                </Image>
              </TouchableOpacity>
            )}
            slideStyle={styles.slider}
            inactiveSlideOpacity={1}
          />
        </View>
      )}
    </ThemeConsumer>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 60,
  },
  textTitle: {
    marginVertical: margin.large,
    marginHorizontal: margin.large,
  },
  slider: {
    width: itemWidth,
  },
  containerImage: {
    borderRadius: borderRadius.base,
    overflow: 'hidden',
    margin: 1,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
    }),
  },
  viewImage: {
    width: itemWidth,
    height: itemHeight,
    justifyContent: 'flex-end',
  },
  image: {
    width: itemWidth,
    height: heightImage,
    resizeMode: 'stretch',
  },
  viewInfo: {
    padding: padding.large,
  },
  textName: {
    marginBottom: margin.small,
  },
});

export default LastestBlog;
