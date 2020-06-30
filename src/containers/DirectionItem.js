import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon, Text, withTheme} from 'src/components';

const DirectionItem = ({title, color, style, theme}) => {
  if (!title) {
    return null;
  }
  const colorText = color || theme.colors.primary;
  return (
    <View style={[styles.container, style && style]}>
      <Icon
        size={7}
        name={'fiber-manual-record'}
        type={'material'}
        color={colorText}
        containerStyle={styles.icon}
      />
      <Text h6 style={{color: colorText}}>
        {title}
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

export default withTheme(DirectionItem);
