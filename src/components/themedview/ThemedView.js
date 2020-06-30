import React from 'react';

import PropTypes from 'prop-types';

import {StyleSheet, View} from 'react-native';

import {ThemeConsumer} from 'src/components/config';

import ViewPropTypes from 'src/components/config/ViewPropTypes';

const ThemedViewElement = ({
  colorSecondary,
  isFullView,
  style,
  ...restProps
}) => {
  return (
    <ThemeConsumer>
      {({theme}) => (
        <View
          {...restProps}
          style={StyleSheet.flatten([
            {
              backgroundColor: colorSecondary
                ? theme.colors.bgColorSecondary
                : theme.colors.bgColor,
            },
            isFullView && {flex: 1},
            style && style,
          ])}
        />
      )}
    </ThemeConsumer>
  );
};

ThemedViewElement.propTypes = {
  colorSecondary: PropTypes.bool,
  isFullView: PropTypes.bool,
  style: ViewPropTypes.style,
};

ThemedViewElement.defaultProps = {
  colorSecondary: false,
  isFullView: false,
};

export default ThemedViewElement;
