// @flow
import * as React from 'react';
import {StyleSheet, View} from 'react-native';

type Props = {
  value: string,
};

const AttributeColor = (props: Props) => (
  <View
    style={[
      styles.container,
      {
        backgroundColor: props.color,
      },
    ]}
  />
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    width: 20,
    height: 20,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
  },
});
export default AttributeColor;
