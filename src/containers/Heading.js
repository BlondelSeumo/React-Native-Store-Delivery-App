// @flow
import React from 'react';

import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, withTheme} from 'src/components';
import {padding} from 'src/components/config/spacing';

type Props = {
  title: string,
  subTitle?: string,
  onPress?: Function,
};

const Heading = function(props: Props) {
  const {
    title,
    subTitle,
    onPress,
    subTitleComponent,
    style,
    containerStyle,
    theme,
  } = props;

  return (
    <View style={[styles.container, containerStyle && containerStyle]}>
      <Text medium h3 h3Style={[styles.textTitle, style && style]}>
        {title}
      </Text>
      {subTitleComponent ? (
        subTitleComponent
      ) : subTitle ? (
        <TouchableOpacity onPress={onPress} style={styles.touchSubtitle}>
          <Text style={{color: theme.colors.primary}}>{subTitle}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: padding.big,
  },
  textTitle: {
    flex: 1,
    paddingRight: padding.large,
  },
  touchSubtitle: {
    paddingVertical: 5,
    justifyContent: 'center',
  },
});

Heading.defaultProps = {
  onPress: () => {},
};

export default withTheme(Heading);
