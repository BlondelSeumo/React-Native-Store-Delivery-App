import React, {Component} from 'react';

import {connect} from 'react-redux';

import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  Platform,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {Text, Avatar, Image, ThemeConsumer} from 'src/components';
import Container from 'src/containers/Container';
import Pagination from 'src/containers/Pagination';

import {languageSelector} from 'src/modules/common/selectors';

import {padding} from 'src/components/config/spacing';

const {width} = Dimensions.get('window');

class SlideshowBasic extends Component {
  state = {
    pagination: 0,
  };

  render() {
    const {language, fields, widthComponent, clickGoPage} = this.props;
    const {pagination} = this.state;

    if (
      !fields ||
      typeof fields !== 'object' ||
      Object.keys(fields).length < 1
    ) {
      return null;
    }

    const widthImage =
      fields.width && parseInt(fields.width, 0)
        ? parseInt(fields.width, 0)
        : 375;
    const heightImage =
      fields.height && parseInt(fields.height, 0)
        ? parseInt(fields.height, 0)
        : 390;
    const images = fields?.images ?? [];

    const widthView = !fields.boxed
      ? widthComponent
      : widthComponent - 2 * padding.large;
    const heightView = (widthView * heightImage) / widthImage;
    const heightFooter =
      fields.indicator || images.find(i => i.enable_button) ? 25 : 0;
    const heightScroll = heightView + heightFooter;

    const autoplayDelay =
      fields.auto_play_delay && parseInt(fields.auto_play_delay, 0)
        ? parseInt(fields.auto_play_delay, 0)
        : 1000;
    const autoplayInterval =
      fields.auto_play_interval && parseInt(fields.auto_play_interval, 0)
        ? parseInt(fields.auto_play_interval, 0)
        : 1800;

    const styleImage = {
      width: widthView,
      height: heightView,
      justifyContent: 'flex-end',
    };

    return (
      <ThemeConsumer>
        {({theme}) => (
          <Container disable={!fields.boxed ? 'all' : 'none'}>
            <Carousel
              data={images}
              renderItem={({item}) => (
                <View style={{height: heightScroll}}>
                  <Image
                    ImageComponent={ImageBackground}
                    style={styleImage}
                    imageStyle={styles.viewImage}
                    source={
                      item.image && item.image[language]
                        ? {uri: item.image[language]}
                        : require('src/assets/images/pDefault.png')
                    }>
                    <View style={styles.viewInfo}>
                      {item?.heading?.text?.[language] ? (
                        <Text medium style={item?.heading?.style}>
                          {item.heading.text[language]}
                        </Text>
                      ) : null}
                      <Text
                        light
                        style={[styles.textTitle, item?.subTitle?.style]}>
                        {item?.subTitle?.text?.[language]} && `$
                        {item.subTitle.text[language]} `}
                        {item?.title?.text?.language ? (
                          <Text
                            medium
                            style={[styles.textTitle, item.title.style]}>
                            {item.title.text[language]}
                          </Text>
                        ) : null}
                      </Text>
                    </View>
                  </Image>
                  {item.enable_button && (
                    <Avatar
                      icon={{
                        name: 'arrow-right',
                        size: 22,
                        color: theme.colors.bgColor,
                        isRotateRTL: true,
                      }}
                      rounded
                      size={50}
                      containerStyle={styles.buttonNext}
                      overlayContainerStyle={{
                        backgroundColor: theme.colors.primary,
                      }}
                      onPress={() => clickGoPage(item.action)}
                    />
                  )}
                </View>
              )}
              sliderWidth={widthView}
              itemWidth={widthView}
              inactiveSlideOpacity={1}
              inactiveSlideScale={1}
              autoplayDelay={autoplayDelay}
              autoplayInterval={autoplayInterval}
              loop
              autoplay={fields.auto_play}
              onSnapToItem={index => this.setState({pagination: index})}
            />
            {fields.indicator && (
              <Pagination
                activeVisit={pagination}
                count={images.length}
                containerStyle={styles.viewPagination}
              />
            )}
          </Container>
        )}
      </ThemeConsumer>
    );
  }
}

const styles = StyleSheet.create({
  viewImage: {
    resizeMode: 'stretch',
  },
  viewInfo: {
    paddingHorizontal: padding.base,
    paddingVertical: padding.big,
  },
  textTitle: {
    fontSize: 40,
  },
  viewPagination: {
    position: 'absolute',
    bottom: 0,
    left: padding.large,
    justifyContent: 'flex-start',
    marginRight: 50 + padding.large,
  },
  buttonNext: {
    position: 'absolute',
    bottom: 0,
    right: padding.large,
    ...Platform.select({
      android: {
        elevation: 4,
      },
    }),
  },
});

const mapStateToProps = state => ({
  language: languageSelector(state),
});

SlideshowBasic.defaultProps = {
  widthComponent: width,
};

export default connect(mapStateToProps)(SlideshowBasic);
