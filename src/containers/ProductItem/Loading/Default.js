import React from 'react';
import {View} from 'react-native';
import {ThemeConsumer} from 'src/components';
import {borderRadius} from 'src/components/config/spacing';

const Default = props => {
  const {width, height, style} = props;
  return (
    <ThemeConsumer>
      {({theme}) => (
        <View
          style={[
            {
              width: width,
              height: height + 90,
              borderRadius: borderRadius.base,
              backgroundColor: theme.colors.bgColorSecondary,
            },
            style && style,
          ]}
        />
      )}
    </ThemeConsumer>
  );
};

export default Default;
