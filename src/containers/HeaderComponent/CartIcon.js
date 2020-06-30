import React from 'react';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet} from 'react-native';
import {Avatar, Text, ThemeConsumer} from 'src/components';
import {homeTabs, mainStack} from 'src/config/navigator';
import {cartSizeSelector} from 'src/modules/cart/selectors';
import {yellow} from 'src/components/config/colors';

const CartIcon = props => {
  const navigation = useNavigation();
  const {count} = props;
  return (
    <ThemeConsumer>
      {({theme}) => (
        <>
          <Avatar
            size={45}
            icon={{name: 'shopping-cart', size: 22, type: 'material'}}
            rounded
            overlayContainerStyle={{backgroundColor: theme.colors.primary}}
            onPress={() =>
              navigation.navigate(mainStack.home_tab, {screen: homeTabs.cart})
            }
          />
          <View style={styles.viewCount}>
            <Text h6 medium>
              {count}
            </Text>
          </View>
        </>
      )}
    </ThemeConsumer>
  );
};

const styles = StyleSheet.create({
  viewCount: {
    height: 18,
    minHeight: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    justifyContent: 'center',
    backgroundColor: yellow,
    position: 'absolute',
    top: 1,
    right: -5,
  },
});

const mapStateToProps = state => {
  return {
    count: cartSizeSelector(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(CartIcon);
