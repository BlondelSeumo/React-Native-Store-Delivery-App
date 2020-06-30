import React from 'react';
import {StyleSheet, View} from 'react-native';
import {withTheme} from 'src/components';
import {padding} from 'src/components/config/spacing';

const ViewUnderline = props => {
  const {secondary, style, theme, ...rest} = props;
  const borderColor = secondary
    ? theme.colors.borderSecondary
    : theme.colors.border;
  return (
    <View
      style={[
        props.positionPadding === 'top' ? styles.viewTop : styles.viewBottom,
        {
          borderColor: borderColor,
        },
        style && style,
      ]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  viewBottom: {
    borderBottomWidth: 10,
    paddingHorizontal: padding.large,
    paddingBottom: padding.large + 4,
  },
  viewTop: {
    borderTopWidth: 10,
    paddingTop: padding.large + 4,
  },
});

ViewUnderline.defaultProps = {
  secondary: false,
};

export default withTheme(ViewUnderline);
