import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';

import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MapView, {ProviderPropType} from 'react-native-maps';
import {Button, withTheme} from 'src/components';
import {Col, Row} from 'src/containers/Gird';
import ViewFooterFixed from 'src/containers/ViewFooterFixed';
import ItemShippingInfo from '../components/ItemShippingInfo';
import SelectShipping from '../components/SelectShipping';

import {shippingAddressSelector} from 'src/modules/auth/selectors';

import {
  shippingMethodsLoadingSelector,
  shippingMethodsDataSelector,
} from 'src/modules/checkout/selectors';
import {updateData} from 'src/modules/checkout/actions';

import {authSelector} from 'src/modules/auth/selectors';
import {padding} from 'src/components/config/spacing';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 20.990721;
const LONGITUDE = 105.787064;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Shipping extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
        methodSelected: {},
        indexMethodSelected: null,
        shippingMethod: [],
      },
      polylines: [],
      listMarkerStartEnd: [],
      editing: null,
      loading: true,

      selected: 0, // The index vendor package
      visible: false,
    };

    this.handleOpenSelectShippingMethod = this.handleOpenSelectShippingMethod.bind(
      this,
    );
    this.handleSelectShippingMethod = this.handleSelectShippingMethod.bind(
      this,
    );
  }

  handleNext = () => {
    const {nextStep} = this.props;
    nextStep();
  };

  /**
   *
   * Handle click button on the Shipping Item to choose shipping method for vendor.
   *
   * @param index int - vendor package shipping index
   *
   **/
  handleOpenSelectShippingMethod(index) {
    this.setState(
      {
        selected: index,
      },
      this.setModalVisible,
    );
  }

  /**
   *
   * Handle select the shipping method and update to state
   *
   * @param method string - The shipping method Id
   *
   * */
  handleSelectShippingMethod(method) {
    const {selected} = this.state;
    const {updateDataFc} = this.props;
    updateDataFc(
      ['shipping_methods', 'data', selected, 'chosen_method'],
      method,
    );
  }

  setModalVisible = () => {
    this.setState(preState => {
      return {
        visible: !preState.visible,
      };
    });
  };
  render() {
    const {selected, visible} = this.state;

    const {
      backStep,
      t,
      theme,
      methods,
      loading,
      updateDataFc,
      shippingAddress,
    } = this.props;

    if (loading) {
      return (
        <View style={styles.viewLoading}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      );
    }

    return (
      <ViewFooterFixed
        footerElement={
          <Row>
            <Col>
              <Button
                secondary
                onPress={backStep}
                title={t('common:text_back')}
              />
            </Col>
            <Col>
              <Button onPress={this.handleNext} title={t('common:text_next')} />
            </Col>
          </Row>
        }>
        <MapView
          ref={map => {
            this.mapRef = map;
          }}
          loadingEnabled={loading}
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}
        />

        {methods.length > 0 ? (
          <View style={styles.shippingMethods}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {methods.map((item, index) => (
                <ItemShippingInfo
                  key={index}
                  onChange={updateDataFc}
                  fit={methods.length === 1}
                  data={item}
                  index={index}
                  shippingAddress={shippingAddress}
                  onPress={() => this.handleOpenSelectShippingMethod(index)}
                />
              ))}
            </ScrollView>
          </View>
        ) : null}
        {methods[selected] ? (
          <SelectShipping
            data={methods[selected]}
            visible={visible}
            setModalVisible={this.setModalVisible}
            onChange={this.handleSelectShippingMethod}
            t={t}
          />
        ) : null}
      </ViewFooterFixed>
    );
  }
}

Shipping.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  viewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  shippingMethods: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: padding.large,
  },
});

const mapStateToProps = state => ({
  shippingAddress: shippingAddressSelector(state).toJS(),
  loading: shippingMethodsLoadingSelector(state),
  methods: shippingMethodsDataSelector(state).toJS(),

  auth: authSelector(state),
});

const mapDispatchToProps = {
  updateDataFc: updateData,
};

export default compose(
  withTheme,
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Shipping);
