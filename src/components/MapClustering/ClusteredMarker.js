import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'src/components';
import {Marker} from 'react-native-maps';
import {returnMarkerStyle} from './helpers';

const ClusteredMarker = ({
  geometry,
  properties,
  onPress,
  clusterColor,
  clusterTextColor,
}) => {
  const points = properties.point_count;
  const {width, height, fontSize} = returnMarkerStyle(points);
  const generateColorMaker = count => {
    return '#f2711c';
  };
  return (
    <Marker
      coordinate={{
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
      }}
      style={[
        styles.marker,
        {
          zIndex: points + 1,
        },
      ]}
      onPress={onPress}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={[
          styles.container,
          {
            width: width,
            height: height + 15,
          },
        ]}>
        <View
          style={[
            styles.viewCluster,
            {
              borderRadius: (width + 15) / 2,
              width,
              height,
              backgroundColor: generateColorMaker(points),
            },
          ]}
        />
        <View style={[styles.cluster]}>
          <Text medium style={{fontSize, color: clusterTextColor}}>
            {points}
          </Text>
        </View>
      </TouchableOpacity>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  cluster: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    marginTop: -14,
  },
  marker: {
    shadowColor: '#000000',
    shadowOffset: {
      height: 6,
      width: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  viewCluster: {
    borderColor: 'white',
    borderWidth: 3,
    borderBottomRightRadius: 0,
    position: 'absolute',
    top: 0,
    transform: [{rotate: '45deg'}],
    zIndex: 0,
  },
});

export default memo(ClusteredMarker);
