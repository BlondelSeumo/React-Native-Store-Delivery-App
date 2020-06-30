import React from 'react';
import Item2 from './Item2';
import Item3 from './Item3';
import Default from './Default';

const ProductItemLoading = ({containerStyle, type, width, height}) => {
  switch (type) {
    case 'item2':
      return <Item2 style={containerStyle} />;
    case 'item3':
      return <Item3 style={containerStyle} />;
    default:
      return <Default style={containerStyle} width={width} height={height} />;
  }
};

ProductItemLoading.defaultProps = {};
export default ProductItemLoading;
