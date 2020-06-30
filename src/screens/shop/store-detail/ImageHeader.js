import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Image, withTheme} from 'src/components';
import {white} from 'src/components/config/colors';
import {padding, borderRadius} from 'src/components/config/spacing';
import LinearGradient from 'react-native-linear-gradient';

const ImageHeader = props => {
  const {bannerUrl, width, height} = props;
  return (
    <View>
      <Image
        source={
          bannerUrl
            ? {uri: bannerUrl}
            : require('src/assets/images/pDefault.png')
        }
        style={{width, height}}
      />

      <LinearGradient
        colors={['#000', 'transparent']}
        style={styles.viewLinear}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewLinear: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  viewCount: {
    position: 'absolute',
    bottom: padding.large,
    right: padding.large,
  },
  boxView: {
    borderRadius: borderRadius.base,
  },
  viewRowCount: {
    flexDirection: 'row',
    marginHorizontal: 3,
    alignItems: 'center',
  },
  textCount: {
    color: white,
    lineHeight: 24,
    marginLeft: 3,
  },
});

ImageHeader.defaultProps = {
  width: 375,
  height: 240,
};

export default withTheme(ImageHeader);
