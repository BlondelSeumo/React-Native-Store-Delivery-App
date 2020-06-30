import React from 'react';
import ProductItem from '../ProductItem';
import {StyleSheet, I18nManager, View} from 'react-native';
import ButtonSwiper from '../ButtonSwiper';
import {SwipeListView} from 'react-native-swipe-list-view';

const List = React.memo(props => {
  const {data, removeItem} = props;
  return (
    <SwipeListView
      useFlatList
      keyExtractor={item => `${item.id}`}
      data={data}
      renderItem={({item, index}) => (
        <ProductItem
          type="wishlist"
          item={item}
          style={index === 0 ? styles.firstItem : null}
        />
      )}
      leftOpenValue={70}
      rightOpenValue={-70}
      renderHiddenItem={({item}) => (
        <View style={styles.viewSwiper}>
          <ButtonSwiper onPress={() => removeItem(item.id)} />
        </View>
      )}
      disableLeftSwipe={I18nManager.isRTL}
      disableRightSwipe={!I18nManager.isRTL}
    />
  );
});

const styles = StyleSheet.create({
  viewSwiper: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  firstItem: {
    borderTopWidth: 1,
  },
});
export default List;
