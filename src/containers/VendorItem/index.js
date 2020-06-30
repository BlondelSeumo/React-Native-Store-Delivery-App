import React from 'react';
import {withNavigation} from '@react-navigation/compat';
import Item1 from './Item1';
import Item2 from './Item2';
import Item3 from './Item3';
import Default from './Default';

import {mainStack} from 'src/config/navigator';

const VendorItem = ({
  item,
  containerStyle,
  type,
  width,
  height,
  typeUrl,
  onPress,
  navigation,
  ...rest
}) => {
  if (!item) {
    return null;
  }
  const goDetail = () => {
    navigation.navigate(mainStack.store_detail, {vendor: item});
  };
  switch (type) {
    case 'one':
      return (
        <Item1
          item={item}
          style={containerStyle}
          clickPage={onPress || goDetail}
          typeUrl={typeUrl}
          {...rest}
        />
      );
    case 'two':
      return (
        <Item2
          item={item}
          style={containerStyle}
          clickPage={onPress || goDetail}
          typeUrl={typeUrl}
          {...rest}
        />
      );
    case 'three':
      return (
        <Item3
          item={item}
          style={containerStyle}
          clickPage={onPress || goDetail}
          typeUrl={typeUrl}
          {...rest}
        />
      );
    default:
      return (
        <Default
          item={item}
          style={containerStyle}
          clickPage={onPress || goDetail}
          width={width}
          height={height}
          typeUrl={typeUrl}
          {...rest}
        />
      );
  }
};

VendorItem.defaultProps = {};
export default withNavigation(VendorItem);
