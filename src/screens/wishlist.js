import React from 'react';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import {withTranslation} from 'react-i18next';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {Header, ThemedView} from 'src/components';
import {IconHeader, TextHeader, CartIcon} from 'src/containers/HeaderComponent';
import Empty from 'src/containers/Empty';
import List from 'src/containers/WishList/List';

import {removeWishList} from 'src/modules/common/actions';
import {fetchWishList} from 'src/modules/product/actions';
import {
  loadingWishListSelector,
  dataWishListSelector,
} from 'src/modules/product/selectors';

import {wishListSelector} from 'src/modules/common/selectors';

import {margin} from 'src/components/config/spacing';
import {homeTabs} from 'src/config/navigator';

class WishListScreen extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData = (data = this.props.wishList) => {
    const {dispatch} = this.props;
    dispatch(fetchWishList(data.toJS()));
  };

  removeItem = product_id => {
    const {dispatch} = this.props;
    dispatch(removeWishList(product_id));
  };

  componentDidUpdate(prevProps) {
    const {wishList} = this.props;
    if (!isEqual(wishList, prevProps.wishList)) {
      this.fetchData(wishList);
    }
  }
  renderData = data => {
    const {t, navigation} = this.props;
    if (!data || data.size < 1) {
      return (
        <Empty
          icon="heart"
          title={t('empty:text_title_wishlist')}
          subTitle={t('empty:text_subtitle_wishlist')}
          titleButton={t('common:text_go_shopping')}
          clickButton={() => navigation.navigate(homeTabs.shop)}
        />
      );
    }
    return <List data={data.toJS()} removeItem={this.removeItem} />;
  };

  render() {
    const {wishList, data, loading, t} = this.props;

    const subtitle =
      wishList.size > 1
        ? t('common:text_items', {count: wishList.size})
        : t('common:text_item', {count: wishList.size});

    return (
      <ThemedView style={styles.container}>
        <Header
          centerComponent={
            <TextHeader title={t('common:text_wishList')} subtitle={subtitle} />
          }
          leftComponent={<IconHeader />}
          rightComponent={<CartIcon />}
        />
        {loading ? (
          <View style={styles.viewLoading}>
            <ActivityIndicator size="small" />
          </View>
        ) : (
          this.renderData(data)
        )}
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewLoading: {
    marginVertical: margin.large,
  },
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

const mapStateToProps = state => ({
  data: dataWishListSelector(state),
  loading: loadingWishListSelector(state),
  wishList: wishListSelector(state),
});

export default connect(mapStateToProps)(withTranslation()(WishListScreen));
