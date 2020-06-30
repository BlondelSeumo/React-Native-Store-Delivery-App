import React from 'react';
import Item1 from './Item1';
import Item2 from './Item2';
import Item3 from './Item3';
import Default from './Default';

const VendorItemLoading = ({containerStyle, type, width, height}) => {
  switch (type) {
    case 'one':
      return <Item1 style={containerStyle} />;
    case 'two':
      return <Item2 style={containerStyle} />;
    case 'three':
      return <Item3 style={containerStyle} />;
    default:
      return <Default style={containerStyle} width={width} height={height} />;
  }
};

VendorItemLoading.defaultProps = {};
export default VendorItemLoading;
