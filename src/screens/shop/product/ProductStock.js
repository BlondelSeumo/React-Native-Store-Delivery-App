import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Icon, Text, ThemeConsumer} from 'src/components';

const valueTypeStock = {
  instock: {
    icon: 'check',
    color: 'success',
  },
  outofstock: {
    icon: 'x',
    color: 'error',
  },
  onbackorder: {
    icon: 'check',
    color: 'success',
  },
};

const ProductStock = ({product, style}) => {
  const {t} = useTranslation();

  if (!product || !product.get('id')) {
    return null;
  }
  const status = product.get('stock_status') || 'outofstock';
  const quantity = product.get('stock_quantity');

  const valueStock = valueTypeStock[status] || valueTypeStock.outofstock;
  const text =
    status === 'outofstock'
      ? 'catalog:text_stock_out'
      : quantity
      ? 'catalog:text_in_stock'
      : 'catalog:text_stock';

  return (
    <View style={[styles.container, style && style]}>
      <ThemeConsumer>
        {({theme}) => (
          <>
            <Icon
              name={valueStock.icon}
              size={21}
              color={theme.colors[valueStock.color]}
            />
            <Text
              h6
              style={[styles.text, {color: theme.colors[valueStock.color]}]}>
              {t(text, {count: quantity})}
            </Text>
          </>
        )}
      </ThemeConsumer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 4,
  },
});

export default ProductStock;
