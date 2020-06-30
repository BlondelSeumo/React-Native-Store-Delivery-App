import React from 'react';
import {StyleSheet} from 'react-native';
import ProductItem from 'src/containers/ProductItem';

const List = ({data, navigationType}) => {
  return data.map((item, index) => (
    <ProductItem
      key={index}
      type="item2"
      item={item}
      containerStyle={index === data.length - 1 && styles.itemLast}
      navigationType={navigationType}
    />
  ));
};

const styles = StyleSheet.create({
  itemLast: {
    borderBottomWidth: 0,
  },
});

List.defaultProps = {
  data: [],
  width: 204,
  height: 257,
};
export default List;
