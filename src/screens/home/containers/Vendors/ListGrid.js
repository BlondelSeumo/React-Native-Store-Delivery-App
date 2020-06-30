import React from 'react';
import chunk from 'lodash/chunk';
import {StyleSheet, View} from 'react-native';

class ListGrid extends React.Component {
  render() {
    const {data, renderItem, numColumns, spacing, pad} = this.props;
    if (data.length < 1 || numColumns < 1) {
      return null;
    }
    const prepareData = chunk(data, numColumns);

    return prepareData.map((dataRow, index) => (
      <View
        key={index}
        style={[
          styles.container,
          {marginHorizontal: -pad / 2},
          index < prepareData.length - 1 && {marginBottom: spacing},
        ]}>
        {dataRow.map((value, inx) => {
          const valueIndex = index * numColumns + inx;
          return (
            <View
              key={inx}
              style={[
                styles.item,
                {
                  paddingHorizontal: pad / 2,
                },
              ]}>
              {renderItem(value, valueIndex)}
            </View>
          );
        })}
      </View>
    ));
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
});
ListGrid.defaultProps = {
  data: [],
  spacing: 10,
  pad: 10,
  numColumns: 1,
};
export default ListGrid;
