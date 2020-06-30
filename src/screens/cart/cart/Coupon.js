import React from 'react';

import {connect} from 'react-redux';

import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {ListItem, Avatar, ThemeConsumer} from 'src/components';
import ViewUnderline from 'src/containers/ViewUnderline';
import InputCoupon from './InputCoupon';

import {margin} from 'src/components/config/spacing';
import {
  couponsDeleteLoadingSelector,
  couponsAppliedSelector,
} from 'src/modules/cart/selectors';
import {removeCoupon} from 'src/modules/cart/actions';

class CartScreen extends React.Component {
  removeCoupon = code => {
    const {dispatch} = this.props;
    dispatch(removeCoupon(code));
  };

  renderLeftIcon(loading, theme) {
    if (loading) {
      return <ActivityIndicator />;
    }
    return (
      <Avatar
        icon={{
          name: 'percent',
          size: 14,
        }}
        rounded
        size={25}
        overlayContainerStyle={{backgroundColor: theme.colors.primary}}
      />
    );
  }

  render() {
    const {coupons, removeCouponLoading} = this.props;
    return (
      <ThemeConsumer>
        {({theme}) => (
          <ViewUnderline style={styles.container}>
            <View style={styles.viewCode}>
              <InputCoupon />
              {coupons.map(coupon => (
                <ListItem
                  key={coupon}
                  title={coupon.toUpperCase()}
                  type="underline"
                  leftIcon={this.renderLeftIcon(removeCouponLoading, theme)}
                  rightIcon={{
                    name: 'x',
                    size: 19,
                    onPress: () => this.removeCoupon(coupon),
                  }}
                  titleProps={{
                    h6: true,
                    medium: true,
                  }}
                  containerStyle={styles.couponContainer}
                />
              ))}
            </View>
          </ViewUnderline>
        )}
      </ThemeConsumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  couponContainer: {
    minHeight: 0,
    borderBottomWidth: 0,
    marginTop: margin.small + 1,
  },
});

CartScreen.defaultProps = {
  placeholder: 'Coupon code',
  applyButtonTitle: 'Apply',
};

const mapStateToProps = state => {
  return {
    coupons: couponsAppliedSelector(state),
    removeCouponLoading: couponsDeleteLoadingSelector(state),
  };
};

export default connect(mapStateToProps)(CartScreen);
