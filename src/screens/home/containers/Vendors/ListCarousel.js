import React from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';

class ListCarousel extends React.Component {
  render() {
    const {data, renderItem, pad} = this.props;
    if (data.length < 1) {
      return null;
    }
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.viewList}>
          {data.map((value, index) => (
            <View
              key={index}
              style={index < data.length - 1 && {paddingRight: pad}}>
              {renderItem(value, index)}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  viewList: {
    height: '100%',
    flexDirection: 'row',
  },
});

ListCarousel.defaultProps = {
  data: [],
  pad: 10,
};
export default ListCarousel;
