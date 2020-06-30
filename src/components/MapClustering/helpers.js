import GeoViewport from '@mapbox/geo-viewport';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const isMarker = (child: any) =>
  child &&
  child.props &&
  child.props.coordinate &&
  child.props.cluster !== false;

export const calculateBBox = (region: any) => {
  let lngD;
  if (region.longitudeDelta < 0) {
    lngD = region.longitudeDelta + 360;
  } else {
    lngD = region.longitudeDelta;
  }

  return [
    region.longitude - lngD, // westLng - min lng
    region.latitude - region.latitudeDelta, // southLat - min lat
    region.longitude + lngD, // eastLng - max lng
    region.latitude + region.latitudeDelta, // northLat - max lat
  ];
};

export const returnMapZoom = (region: any, bBox: any, minZoom: number) => {
  const viewport =
    region.longitudeDelta >= 40
      ? {zoom: minZoom}
      : GeoViewport.viewport(bBox, [width, height]);

  return viewport.zoom;
};

export const markerToGeoJSONFeature = (marker: any, index: number) => {
  return {
    type: 'Feature',
    geometry: {
      coordinates: [
        marker.props.coordinate.longitude,
        marker.props.coordinate.latitude,
      ],
      index: index,
      type: 'Point',
    },
    properties: {
      point_count: 0,
      index,
      ..._removeChildrenFromProps(marker.props),
    },
  };
};

export const generateSpiral = (
  count: number,
  centerLocation: any,
  clusterChildren: any,
) => {
  const res = [];
  res.length = count;
  let angle = 0;
  for (let i = 0; i < count; i++) {
    angle = 0.25 * (i * 0.5);
    const latitude = centerLocation[1] + 0.0002 * angle * Math.cos(angle);
    const longitude = centerLocation[0] + 0.0002 * angle * Math.sin(angle);
    res[i] = {
      longitude,
      latitude,
      image: clusterChildren[i] && clusterChildren[i].properties.image_url,
      id:
        clusterChildren[i] &&
        parseFloat(clusterChildren[i].properties.identifier),
      total_merchants:
        clusterChildren[i] && clusterChildren[i].properties.total_merchants,
      onPress: clusterChildren[i] && clusterChildren[i].properties.onPress,
    };
  }

  return res;
};

export const returnMarkerStyle = (points: number) => {
  if (points >= 10) {
    return {
      width: 74,
      height: 74,
      size: 60,
      fontSize: 26,
    };
  }
  if (points > 1 && points < 10) {
    return {
      width: 58,
      height: 58,
      size: 42,
      fontSize: 22,
    };
  }

  return {
    width: 54,
    height: 54,
    size: 40,
    fontSize: 20,
  };
};

const _removeChildrenFromProps = (props: any) => {
  const newProps = {};
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      newProps[key] = props[key];
    }
  });
  return newProps;
};
