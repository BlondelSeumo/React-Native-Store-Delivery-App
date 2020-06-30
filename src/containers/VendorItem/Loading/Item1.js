import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ThemeConsumer} from 'src/components';

const Item1 = props => {
  const {style} = props;
  return (
    <ThemeConsumer>
      {({theme}) => (
        <View
          style={[
            styles.view,
            {
              backgroundColor: theme.colors.bgColorSecondary,
              borderColor: theme.colors.borderSecondary,
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
    height: 150,
    borderBottomWidth: 1,
  },
});

export default Item1;
