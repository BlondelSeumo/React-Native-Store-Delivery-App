import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import ProductItem from 'src/containers/ProductItem';
import {padding} from 'src/components/config/spacing';

const {width} = Dimensions.get('window');

class Style3 extends React.Component {
  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
  }
  renderFooter = () => {
    if (!this.props.loadingMore) {
      return <View style={styles.viewFooter} />;
    }

    return (
      <View style={[styles.viewFooter, styles.viewLoadingFooter]}>
        <ActivityIndicator animating size="small" />
      </View>
    );
  };

  onEndReachedComponent() {
    this.props.handleLoadMore();
    this.onEndReachedCalledDuringMomentum = false;
  }
  render() {
    const {data, refreshing, handleRefresh} = this.props;
    const pad = padding.large;
    const wImage = width - 2 * pad;
    const hImage = (wImage * 200) / 168;
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={item => `${item.id}`}
        data={data}
        renderItem={({item}) => (
          <ProductItem
            item={item}
            width={wImage}
            height={hImage}
            containerStyle={{marginHorizontal: pad}}
          />
        )}
        onMomentumScrollBegin={() =>
          (this.onEndReachedCalledDuringMomentum = false)
        }
        onEndReached={() => this.onEndReachedComponent()}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        ListFooterComponent={this.renderFooter}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    height: 36,
  },
  viewFooter: {
    marginBottom: 26,
  },
  viewLoadingFooter: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
  },
});

export default Style3;
