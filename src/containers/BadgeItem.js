import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'src/components';
import * as colors from 'src/components/config/colors';
import {padding, borderRadius} from 'src/components/config/spacing';
import {sizes} from 'src/components/config/fonts';

const BadgeItem = props => {
  const {title, nameColor, textStyle, style} = props;
  if (!title) {
    return null;
  }
  return (
    <View
      style={[
        styles.view,
        style && style,
        {backgroundColor: colors[nameColor] || colors.red},
      ]}>
      <Text h6 medium h6Style={[styles.text, textStyle && textStyle]}>
        {title.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: padding.small - 3,
    borderRadius: borderRadius.small,
  },
  text: {
    color: colors.white,
    fontSize: sizes.h6 - 2,
    lineHeight: 18,
  },
});
BadgeItem.defaultProps = {
  nameColor: 'red',
};

export default BadgeItem;
