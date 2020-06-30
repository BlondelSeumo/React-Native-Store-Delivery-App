import React from 'react';

import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity, Dimensions} from 'react-native';

import {Header, ThemedView, Icon, ThemeConsumer} from 'src/components';
import {TextHeader} from 'src/containers/HeaderComponent';
import {Marker} from 'react-native-maps';
import MarkerSingleView from 'src/components/MapClustering/MarkerSingle';
import CurrentLocationMarker from 'src/components/MapClustering/CurrentLocationMarker';
import MapView from 'src/components/MapClustering';
import ModalFilter from './containers/ModalFilter';

import {getSiteConfig, languageSelector} from 'src/modules/common/selectors';
import {fetchVendorListForMap} from 'src/modules/vendor/actions';
import {locationSelector} from 'src/modules/auth/selectors';
import {vendorListForMapSelector} from 'src/modules/vendor/selectors';

import {padding} from 'src/components/config/spacing';
import {sizes} from 'src/components/config/fonts';
import {INIT_SORTBY} from './config';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;

const LATITUDE_DELTA = 0.0322;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO + 0.1;
const TypeListMerchant = {
  HORIZONTAL: 'horizontal',
  VERTICAl: 'vertical	',
};

class MapExplorer extends React.Component {
  state = {
    data: [],
    page: 1,
    loading: true,
    loadingMore: false,
    refreshing: false,
    error: null,
    type: TypeListMerchant.VERTICAl,
    currentPosition: null,
    isModalFilter: false,
    sortBy: INIT_SORTBY,
  };

  componentDidMount() {
    console.log('run componentDidMount MapExplorer');
    const {dispatch, location} = this.props;
    dispatch(
      fetchVendorListForMap(
        this.generateParamsGetListVendor(
          location?.latitude,
          location?.longitude,
        ),
      ),
    );
  }

  componentDidUpdate(nextProps) {
    const location = this.props.location;
    if (
      location?.latitude !== this.state.currentPosition?.latitude ||
      location?.longitude !== this.state.currentPosition?.longitude ||
      !this.state.currentPosition
    ) {
      this.props.dispatch(
        fetchVendorListForMap(
          this.generateParamsGetListVendor(
            location?.latitude,
            location?.longitude,
          ),
        ),
      );
    }
  }

  generateParamsGetListVendor(lat, long) {
    const {sortBy} = this.state;
    if (lat && long) {
      this.setState({
        currentPosition: {
          latitude: lat,
          longitude: long,
        },
      });
    }
    return {
      // orderby: 'newness_desc',
      // wcfmmp_radius_range: 10,
      wcfmmp_radius_lat: lat,
      wcfmmp_radius_lng: long,
      // wcfmmp_store_category: 64,
      ...sortBy,
    };
  }

  renderLeftHeader() {
    const {type} = this.state;
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({
            type:
              type === TypeListMerchant.VERTICAl
                ? TypeListMerchant.HORIZONTAL
                : TypeListMerchant.VERTICAl,
          })
        }>
        <Icon
          size={22}
          name={
            type === TypeListMerchant.VERTICAl
              ? 'view-grid'
              : 'format-list-checkbox'
          }
          type={'material-community'}
        />
      </TouchableOpacity>
    );
  }
  renderRightHeader() {
    return (
      <TouchableOpacity onPress={() => this.setModalFilterVisible(true)}>
        <Icon size={22} name={'filter-list'} type="material" />
      </TouchableOpacity>
    );
  }

  setModalFilterVisible = value => {
    this.setState({
      isModalFilter: value,
    });
  };
  handleApply = data => {
    this.setState(
      {
        sortBy: data,
      },
      () => {
        const {dispatch, location} = this.props;
        dispatch(
          fetchVendorListForMap(
            this.generateParamsGetListVendor(
              location?.latitude,
              location?.longitude,
            ),
          ),
        );
      },
    );
  };
  render() {
    const {vendor, t} = this.props;
    const {type, isModalFilter, sortBy} = this.state;
    return (
      <ThemeConsumer>
        {({theme}) => (
          <ThemedView isFullView>
            <Header
              leftComponent={this.renderLeftHeader()}
              centerComponent={
                <TextHeader
                  title={t('common:text_map_explore')}
                  titleStyle={{fontSize: sizes.h3, color: theme.colors.primary}}
                />
              }
              rightComponent={this.renderRightHeader()}
              containerStyle={styles.header}
            />
            {this.state.currentPosition ? (
              <MapView
                listViewType={type}
                merchants={vendor}
                onSelectecMarker={markers => {}}
                initialRegion={{
                  latitude: this.state.currentPosition.latitude,
                  longitude: this.state.currentPosition.longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}>
                {vendor &&
                  vendor.map((item, index) => (
                    <Marker
                      key={index}
                      identifier={item.id + ''}
                      coordinate={{
                        latitude: parseFloat(item.store_lat),
                        longitude: parseFloat(item.store_lng),
                      }}
                      centerOffset={{x: -18, y: -60}}
                      title={item.name}
                      anchor={{x: 0.69, y: 1}}>
                      <MarkerSingleView marker={item.location} />
                    </Marker>
                  ))}
                <Marker
                  coordinate={{
                    latitude: parseFloat(this.state.currentPosition.latitude),
                    longitude: parseFloat(this.state.currentPosition.longitude),
                  }}
                  centerOffset={{x: -18, y: -60}}
                  anchor={{x: 0.69, y: 1}}>
                  <CurrentLocationMarker />
                </Marker>
              </MapView>
            ) : null}
            <ModalFilter
              visible={isModalFilter}
              setModalFilterVisible={this.setModalFilterVisible}
              sortBy={sortBy}
              handleApply={this.handleApply}
            />
          </ThemedView>
        )}
      </ThemeConsumer>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: padding.base + 1,
  },
});

const mapStateToProps = state => {
  return {
    language: languageSelector(state),
    siteConfig: getSiteConfig(state),
    location: locationSelector(state),
    vendor: vendorListForMapSelector(state),
  };
};

export default connect(mapStateToProps)(withTranslation()(MapExplorer));
