// @flow
import React from 'react';
import ItemDefault from 'src/containers/ProductItem/ItemDefault';
import Item2 from 'src/containers/ProductItem/Item2';
import Item3 from 'src/containers/ProductItem/Item3';
import ItemWishlist from './ItemWishlist';

type Props = {
  type: 'default' | 'item2' | 'item3' | 'wishlist' | 'cart' | 'order',
};
const ProductItem = (props: Props) => {
  const {type, item, ...rest} = props;
  if (!item || !item.id) {
    return null;
  }
  if (type === 'wishlist') {
    return <ItemWishlist item={item} {...rest} />;
  } else if (type === 'item2') {
    return <Item2 item={item} {...rest} />;
  } else if (type === 'item3') {
    return <Item3 item={item} {...rest} />;
  }
  return <ItemDefault item={item} {...rest} />;
};

ProductItem.defaultProps = {
  type: 'default',
};

export default ProductItem;
