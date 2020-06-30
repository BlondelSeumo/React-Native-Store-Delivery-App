import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Icon, Text} from 'src/components';
import OpacityView from 'src/containers/OpacityView';
import {black, white} from 'src/components/config/colors';
import {borderRadius} from 'src/components/config/spacing';

const ViewCountImageHeader = props => {
  const {count, onPress} = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <OpacityView bgColor={black} opacity={0.4} style={styles.boxView}>
        <View style={styles.viewRowCount}>
          <Icon name={'image'} color={white} type={'material'} size={18} />
          <Text style={styles.textCount}>{count}</Text>
        </View>
      </OpacityView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  boxView: {
    borderRadius: borderRadius.base,
  },
  viewRowCount: {
    height: 24,
    flexDirection: 'row',
    marginHorizontal: 3,
    alignItems: 'center',
  },
  textCount: {
    color: white,
    marginLeft: 3,
  },
});

ViewCountImageHeader.defaultProps = {
  count: 0,
};

export default ViewCountImageHeader;
