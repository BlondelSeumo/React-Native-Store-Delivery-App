import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text, withTheme} from 'src/components';
import {margin} from 'src/components/config/spacing';

const Quantity = props => {
  const {quantity, decrement, increment, big, theme} = props;

  const sizeButton = big ? 35 : 22;
  const marginText = big ? margin.large : margin.small - 2;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={quantity === 1}
        onPress={decrement}
        style={[
          styles.btn(sizeButton, theme),
          quantity === 1 && styles.disable(theme),
        ]}>
        <Text
          h4
          medium
          style={[
            styles.textButton(theme),
            quantity === 1 && styles.textButtonDisable(theme),
          ]}>
          -
        </Text>
      </TouchableOpacity>
      <Text
        medium
        h3={big}
        style={{color: theme.colors.primary, marginHorizontal: marginText}}>
        {quantity}
      </Text>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={increment}
        style={styles.btn(sizeButton, theme)}>
        <Text h4 bold style={styles.textButton(theme)}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: (size, theme) => ({
    width: size,
    height: size,
    borderWidth: 1,
    borderRadius: size / 2,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  disable: theme => ({
    borderColor: theme.colors.disabled,
  }),
  textButton: theme => ({
    color: theme.colors.primary,
  }),
  textButtonDisable: theme => ({
    color: theme.colors.disabled,
  }),
};

Quantity.defaultProps = {
  big: false,
};

export default withTheme(Quantity);
