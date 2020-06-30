import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Image, Text} from 'src/components';

const ImageBanner = ({
  radius,
  clickBanner,
  contentContainerStyle,
  title,
  language,
  width,
  height,
  style,
  ...rest
}) => {
  return (
    <TouchableOpacity
      style={contentContainerStyle && contentContainerStyle}
      activeOpacity={clickBanner ? 0.2 : 1}
      onPress={clickBanner ? clickBanner : () => {}}>
      <Image
        resizeMode="cover"
        containerStyle={
          radius && {
            borderRadius: radius,
          }
        }
        style={[{width, height}, style && style]}
        {...rest}
      />
      {title?.text?.[language] ? (
        <Text
          style={[
            styles.text,
            {
              width,
            },
            title.style && title.style,
          ]}
          medium>
          {title.text[language]}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    paddingVertical: 5,
  },
});

ImageBanner.defaultProps = {
  width: 100,
  height: 100,
  language: 'en',
};
export default ImageBanner;
