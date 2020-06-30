import React from 'react';
import {connect} from 'react-redux';

import {StyleSheet, View, Dimensions} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import CurrentLocationMarker from 'src/components/MapClustering/CurrentLocationMarker';

import {locationSelector} from 'src/modules/auth/selectors';

const {width} = Dimensions.get('window');

const WIDTH_MAP = width;
const HEIGHT_MAP = (width * 219.4) / 374.5;

const ASPECT_RATIO = WIDTH_MAP / HEIGHT_MAP;

const LATITUDE_DELTA = 0.00422;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapStore = props => {
  const {vendor, location} = props;
  if (!vendor) {
    return null;
  }
  const {store_lat, store_lng} = vendor;
  const latitude = parseFloat(store_lat) || location?.latitude;
  const longitude = parseFloat(store_lng) || location?.longitude;

  return (
    <View style={{height: HEIGHT_MAP, width: WIDTH_MAP}}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}>
        <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          centerOffset={{x: -18, y: -60}}
          anchor={{x: 0.69, y: 1}}>
          <CurrentLocationMarker />
        </Marker>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

const mapStateToProps = state => {
  return {
    location: locationSelector(state),
  };
};

export default connect(mapStateToProps)(MapStore);
