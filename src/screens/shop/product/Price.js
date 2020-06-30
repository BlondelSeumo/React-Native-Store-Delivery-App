import React from 'react';
import {View} from 'react-native';
import {Text, withTheme} from 'src/components';
import {margin} from 'src/components/config/spacing';

const Price = props => {
  const {priceFormat, containerStyle, theme} = props;
  if (!priceFormat || (!priceFormat.regular_price && !priceFormat.sale_price)) {
    return (
      <View style={containerStyle}>
        <Text h2Style={styles.price(theme)}>0</Text>
      </View>
    );
  }
  const {regular_price, sale_price} = priceFormat;
  if (sale_price) {
    return (
      <View style={containerStyle}>
        <Text h2 medium h2Style={[styles.price(theme), styles.textPriceSale]}>
          {sale_price}
        </Text>
        <Text h4 medium h4Style={styles.textRegularSale}>
          {regular_price}
        </Text>
      </View>
    );
  }
  return (
    <View style={containerStyle}>
      <Text h2 medium h2Style={styles.price(theme)}>
        {regular_price}
      </Text>
    </View>
  );
};

const styles = {
  price: theme => ({
    color: theme.colors.primary,
  }),
  textPriceSale: {
    marginBottom: margin.small - 2,
  },
  textRegularSale: {
    textDecorationLine: 'line-through',
  },
};

export default withTheme(Price);
