import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon, Text, withTheme} from 'src/components';

const TimeItem = ({time, style, theme}) => {
  if (!time) {
    return null;
  }
  return (
    <View style={[styles.container, style && style]}>
      <Icon
        size={15}
        name={'schedule'}
        type={'material'}
        color={theme.colors.textColorFourth}
        containerStyle={styles.icon}
      />
      <Text h6 colorFourth>
        {time}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
});

export default withTheme(TimeItem);
