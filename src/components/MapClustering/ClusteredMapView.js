import React, {createRef, memo, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView from 'react-native-maps';
import SuperCluster from 'supercluster';
import ClusterMarker from './ClusteredMarker';
import {
  calculateBBox,
  isMarker,
  markerToGeoJSONFeature,
  returnMapZoom,
} from './helpers';
import {ThemeConsumer} from 'src/components/config';
import LinearGradient from 'react-native-linear-gradient';
import VendorItem from 'src/containers/VendorItem';
import {Modalize} from 'react-native-modalize';
const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.77;
const screen = Dimensions.get('window');

const ClusteredMapView = ({
  radius,
  maxZoom,
  minZoom,
  extent,
  nodeSize,
  isLoadContent,
  merchants,
  children,
  onClusterPress,
  onRegionChangeComplete,
  preserveClusterPressBehavior,
  clusteringEnabled,
  clusterColor,
  clusterTextColor,
  spiderLineColor,
  layoutAnimationConf,
  animationEnabled,
  renderCluster,
  onSelectecMarker,
  onChangeZoom,
  listViewType,
  ...restProps
}) => {
  const [markers, updateMarkers] = useState([]);
  const [superCluster, setSuperCluster] = useState(null);
  const [currentRegion, updateRegion] = useState(
    restProps.region || restProps.initialRegion,
  );

  const [isSpiderfier, updateSpiderfier] = useState(false);
  const [clusterChildren, updateClusterChildren] = useState(null);
  const mapRef = createRef();
  const modalizeRef = createRef();

  const propsChildren = useMemo(() => React.Children.toArray(children), [
    children,
  ]);
  useEffect(() => {
    const rawData = [];
    const otherChildrenEffect = [];

    if (!clusteringEnabled) {
      return;
    }

    React.Children.forEach(children, (child, i) => {
      if (isMarker(child)) {
        rawData.push(markerToGeoJSONFeature(child, i));
      } else {
        otherChildrenEffect.push(child);
      }
    });

    const superClusterEffect = new SuperCluster({
      radius,
      maxZoom,
      minZoom,
      extent,
      nodeSize,
    });

    superClusterEffect.load(rawData);

    const bBox = calculateBBox(currentRegion);
    const zoom = returnMapZoom(currentRegion, bBox, minZoom);
    const markersEffect = superClusterEffect.getClusters(bBox, zoom);
    onChangeZoom(zoom);
    updateMarkers(markersEffect);
    setSuperCluster(superClusterEffect);
  }, [
    children,
    restProps.region,
    restProps.initialRegion,
    clusteringEnabled,
    radius,
    maxZoom,
    minZoom,
    extent,
    nodeSize,
    currentRegion,
    propsChildren,
    onChangeZoom,
  ]);

  const _onRegionChangeComplete = region => {
    if (superCluster) {
      const bBox = calculateBBox(region);
      const zoom = returnMapZoom(region, bBox, minZoom);
      const markersChanged = superCluster.getClusters(bBox, zoom);

      if (animationEnabled && Platform.OS === 'ios') {
        LayoutAnimation.configureNext(layoutAnimationConf);
      }

      if (zoom >= 17 && markersChanged.length === 1 && clusterChildren) {
        updateSpiderfier(true);
      } else {
        updateSpiderfier(false);
      }
      onChangeZoom(zoom);
      updateMarkers(markersChanged);
      onRegionChangeComplete(region, markersChanged);
      updateRegion(region);
    }
  };

  const selectMerchant = value => {
    if (value && value?.store_lat) {
      mapRef.current?.fitToCoordinates(
        [
          {
            latitude: parseFloat(value.store_lat),
            longitude: parseFloat(value.store_lng),
          },
        ],
        {animated: true},
      );
    }
  };

  const _renderItem = (item, index) => {
    if (listViewType === 'horizontal') {
      return (
        <VendorItem
          type="one"
          item={item}
          containerStyle={[
            styles.itemHorizontal,
            index === 0 && styles.itemHorizontalFirst,
          ]}
          onPressDirection={() => selectMerchant(item)}
        />
      );
    }
    return (
      <VendorItem
        item={item}
        width={CARD_WIDTH}
        height={(CARD_WIDTH * 142) / 300}
        containerStyle={styles.itemVertical}
        typeUrl="banner_url"
        onPressDirection={() => selectMerchant(item)}
      />
    );
  };

  const _onClusterPress = cluster => () => {
    const childrenCluster = superCluster.getLeaves(cluster.id);
    updateClusterChildren(childrenCluster);

    if (preserveClusterPressBehavior) {
      onClusterPress(cluster, childrenCluster);
      return;
    }

    const coordinates = childrenCluster.map(({geometry}) => ({
      latitude: geometry.coordinates[1],
      longitude: geometry.coordinates[0],
    }));
    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: {top: 300, left: 300, right: 300, bottom: 300},
      animated: true,
    });
    onClusterPress(cluster, childrenCluster);
  };

  const gotToMyLocation = () => {
    if (
      restProps.initialRegion?.latitude &&
      restProps.initialRegion?.longitude
    ) {
      mapRef.current?.animateToRegion({
        latitude: restProps.initialRegion?.latitude,
        longitude: restProps.initialRegion?.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      });
    }
  };
  return (
    <View style={styles.container}>
      <MapView
        {...restProps}
        style={{width: screen.width, height: screen.height}}
        zoomEnabled
        zoomTapEnabled
        ref={map => {
          restProps.mapRef(map);
          mapRef.current = map;
        }}
        onRegionChangeComplete={_onRegionChangeComplete}>
        {markers.map(marker =>
          marker.properties.point_count === 0 ? (
            propsChildren[marker.properties.index]
          ) : !isSpiderfier ? (
            renderCluster ? (
              renderCluster({
                onPress: _onClusterPress(marker),
                clusterColor,
                clusterTextColor,
                ...marker,
              })
            ) : (
              <ClusterMarker
                key={`cluster-${marker.id}`}
                {...marker}
                onPress={_onClusterPress(marker)}
                clusterColor={clusterColor}
                clusterTextColor={clusterTextColor}
              />
            )
          ) : null,
        )}
      </MapView>
      <TouchableOpacity
        onPress={gotToMyLocation}
        style={styles.buttonCurrentLocation}>
        <Icon size={20} name={'my-location'} color={'#000000'} />
      </TouchableOpacity>
      {listViewType !== 'horizontal' ? (
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.0)', 'rgba(0, 0, 0, 0.5)']}
          style={styles.viewFlatList}>
          <FlatList
            data={merchants}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            style={styles.viewHorizontal}
            contentContainerStyle={styles.containerViewHorizontal}
            renderItem={info =>
              _renderItem(info.item, info.index, merchants.length)
            }
            horizontal={true}
          />
        </LinearGradient>
      ) : null}
      <ThemeConsumer>
        {({theme}) => {
          return listViewType === 'horizontal' ? (
            <Modalize
              handlePosition="inside"
              ref={modalizeRef}
              alwaysOpen={200}
              modalTopOffset={200}
              handleStyle={[
                styles.modalHandle,
                {
                  backgroundColor: theme.colors.bgColorSecondary,
                },
              ]}
              modalStyle={[
                styles.modal,
                {
                  backgroundColor: theme.colors.bgColor,
                },
              ]}>
              {merchants.map((item, index) => (
                <View key={index}>{_renderItem(item, index)}</View>
              ))}
            </Modalize>
          ) : null;
        }}
      </ThemeConsumer>
    </View>
  );
};

ClusteredMapView.defaultProps = {
  clusteringEnabled: true,
  animationEnabled: true,
  preserveClusterPressBehavior: false,
  layoutAnimationConf: LayoutAnimation.Presets.spring,
  // SuperCluster parameters
  radius: Dimensions.get('window').width * 0.06,
  maxZoom: 20,
  minZoom: 1,
  extent: 512,
  nodeSize: 64,
  // Map parameters
  edgePadding: {top: 300, left: 300, right: 300, bottom: 300},
  // Cluster styles
  clusterColor: '#00B386',
  clusterTextColor: '#FFFFFF',
  spiderLineColor: '#FF0000',
  // Callbacks
  onRegionChangeComplete: () => {},
  onChangeZoom: zoom => {},
  onClusterPress: () => {},
  mapRef: () => {},
};

const styles = StyleSheet.create({
  viewFlatList: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    marginBottom: 0,
  },
  container: {
    flex: 1,
  },
  cluster: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    marginTop: -14,
  },
  buttonCurrentLocation: {
    width: 40,
    height: 40,
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: {
      height: 6,
      width: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: CARD_WIDTH + 50,
    right: 15,
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  itemHorizontal: {
    marginHorizontal: 18,
  },
  itemHorizontalFirst: {
    marginTop: 16,
  },
  itemVertical: {
    marginLeft: 20,
  },
  viewHorizontal: {
    marginBottom: 16,
  },
  containerViewHorizontal: {
    paddingRight: 18,
  },
  modalHandle: {
    height: 6,
    width: 60,
    borderRadius: 6,
  },
  modal: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});
export default memo(ClusteredMapView);
