import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'src/components';
import {red} from 'src/components/config/colors';
import {margin} from 'src/components/config/spacing';

const Price = ({priceFormat, ...rest}) => {
  if (!priceFormat || (!priceFormat.regular_price && !priceFormat.sale_price)) {
    return (
      <Text medium {...rest}>
        0
      </Text>
    );
  }
  if (priceFormat.sale_price) {
    return (
      <View style={styles.viewSale}>
        <Text medium style={styles.textSale} {...rest}>
          {priceFormat.sale_price}
        </Text>
        <Text colorFourth style={styles.textPrice} {...rest}>
          {priceFormat.regular_price}
        </Text>
      </View>
    );
  }

  return (
    <Text medium {...rest}>
      {priceFormat.regular_price}
    </Text>
  );
};

const styles = StyleSheet.create({
  viewSale: {
    flexDirection: 'row',
  },
  textSale: {
    color: red,
  },
  textPrice: {
    textDecorationLine: 'line-through',
    marginLeft: margin.small - 1,
  },
});

export default Price;
