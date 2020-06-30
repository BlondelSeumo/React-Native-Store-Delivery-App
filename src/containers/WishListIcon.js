import React from 'react';

import {connect} from 'react-redux';
import includes from 'lodash/includes';

import {Icon} from 'src/components';
import {red} from 'src/components/config/colors';

import {addWishList, removeWishList} from 'src/modules/common/actions';
import {configsSelector} from 'src/modules/common/selectors';
import {wishListSelector} from 'src/modules/common/selectors';

export function WishListIcon(props) {
  const {
    product_id,
    wishList,
    dispatch,
    color,
    colorSelect,
    configs,
    ...rest
  } = props;

  if (!configs.toggleWishlist) {
    return null;
  }
  const hasList = includes(wishList, product_id);
  const wishListAction = hasList
    ? () => dispatch(removeWishList(product_id))
    : () => dispatch(addWishList(product_id));

  return (
    <Icon
      size={20}
      {...rest}
      type={'material'}
      name={hasList ? 'favorite' : 'favorite-border'}
      color={hasList ? colorSelect : color}
      onPress={wishListAction}
      underlayColor={'transparent'}
    />
  );
}

WishListIcon.defaultProps = {
  colorSelect: red,
};

const mapStateToProps = state => ({
  wishList: wishListSelector(state).toJS(),
  configs: configsSelector(state).toJS(),
});

export default connect(mapStateToProps)(WishListIcon);
