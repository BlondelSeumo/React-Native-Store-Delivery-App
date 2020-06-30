import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ThemeConsumer} from 'src/components';
import {borderRadius} from 'src/components/config/spacing';

const Item2 = props => {
  const {style} = props;
  return (
    <ThemeConsumer>
      {({theme}) => (
        <View
          style={[
            styles.view,
            {
              backgroundColor: theme.colors.bgColorSecondary,
            },
            style && style,
          ]}
        />
      )}
    </ThemeConsumer>
  );
};

const styles = StyleSheet.create({
  view: {
    width: 135,
    height: 144,
    borderRadius: borderRadius.large,
  },
});

export default Item2;
