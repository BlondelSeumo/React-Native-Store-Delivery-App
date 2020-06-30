import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MarkerSingleView: React.FunctionComponent = React.memo(
  ({marker, onPressMaker}) => {
    return (
      <TouchableOpacity activeOpacity={0.5} style={[styles.container]}>
        <Icon size={20} name={'fiber-manual-record'} color={'#f2711c'} />
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(242, 113, 28, 0.3)',
  },
});

export default MarkerSingleView;
