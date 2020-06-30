import React from 'react';
import {TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {Icon, withTheme} from 'src/components';
import {white} from 'src/components/config/colors';

const Index = props => {
  const {loading, style, iconProps, theme, ...rest} = props;
  if (loading) {
    return <ActivityIndicator size="small" color={theme.colors.primary} />;
  }
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      {...rest}
      style={[
        styles.container,
        {backgroundColor: theme.colors.primary},
        style && style,
      ]}>
      <Icon name="add" type="material" size={17} color={white} {...iconProps} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default withTheme(Index);
