import Geolocation from '@react-native-community/geolocation';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, Image, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {ThemedView, Text, Button} from 'src/components';
import ModalSearchLocation from 'src/components/modalLocation';
import {
  getAddressFromCurrentLocation,
  LOCATION_DEFAULT,
} from 'src/config/constant';
import {updateLocation} from 'src/modules/auth/actions';
import {closeGettingStarted} from 'src/modules/common/actions';
import {routerMainSelector} from 'src/modules/common/selectors';
import {padding, margin} from 'src/components/config/spacing';

const {width} = Dimensions.get('window');

const SIZE_IMAGE = (width * 3) / 5;

class EnableLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
      loading: false,
    };
  }

  handleGettingStarted = () => {
    const {dispatch} = this.props;
    dispatch(closeGettingStarted());
  };

  openOrCloseModal(status) {
    this.setState({
      visibleModal: status,
    });
  }

  getLocation() {
    this.setState({loading: true});
    Geolocation.getCurrentPosition(
      async position => {
        console.log(position);
        if (position.coords?.latitude) {
          this.getAddress(
            position?.coords?.latitude,
            position?.coords?.longitude,
          );
        } else {
          this.getAddress(
            LOCATION_DEFAULT.latitude,
            LOCATION_DEFAULT.longitude,
          );
        }
      },
      error => {
        console.log(error);
        this.getAddress(LOCATION_DEFAULT.latitude, LOCATION_DEFAULT.longitude);
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 5000,
        distanceFilter: 0,
      },
    );
  }

  async getAddress(latitude, longitude) {
    const result = await getAddressFromCurrentLocation(latitude, longitude);
    this.props.dispatch(updateLocation(result));
    this.setState({loading: false});
    this.handleGettingStarted();
  }

  async userSelectLocation(value) {
    this.openOrCloseModal(false);
    this.handleGettingStarted();
  }

  render() {
    const {t} = this.props;
    return (
      <ThemedView isFullView style={styles.container}>
        <Image
          style={styles.imgMap}
          source={require('src/assets/images/gummyLocation.png')}
          resizeMode="stretch"
        />
        <Text h2 medium style={styles.txtTitle}>
          {t('common:text_find_location')}
        </Text>
        <Text h5 colorSecondary style={styles.textDescription}>
          {t('common:text_find_location_description')}
        </Text>
        <Button
          title={t('common:text_button_enable_location')}
          onPress={() => this.getLocation()}
          loading={this.state.loading}
          containerStyle={[styles.button, styles.buttonLocation]}
        />
        <Button
          secondary
          title={t('common:text_button_add_new_address')}
          onPress={() => this.openOrCloseModal(true)}
          containerStyle={[styles.button, styles.buttonAddress]}
        />
        <Text
          medium
          onPress={this.handleGettingStarted}
          style={styles.textSkip}>
          {t('common:text_skip')}
        </Text>
        <ModalSearchLocation
          find={true}
          closeModal={() => this.openOrCloseModal(false)}
          onSelectLocation={detail => {
            this.userSelectLocation(detail);
          }}
          visibleModal={this.state.visibleModal}
        />
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: padding.big,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgMap: {
    width: SIZE_IMAGE,
    height: SIZE_IMAGE,
  },
  txtTitle: {
    marginTop: margin.big - 1,
  },
  textDescription: {
    textAlign: 'center',
    marginTop: margin.small + 1,
  },
  button: {
    width: 160,
  },
  buttonLocation: {
    marginTop: 40,
  },
  buttonAddress: {
    marginTop: margin.large + 4,
  },
  textSkip: {
    padding: padding.small + 1,
    marginVertical: margin.small + 1,
    textDecorationLine: 'underline',
  },
});

const mapStateToProps = state => {
  return {
    router: routerMainSelector(state),
  };
};
const EnableLocationComponent = connect(
  mapStateToProps,
  null,
)(EnableLocation);
export default function(props) {
  const {t} = useTranslation();
  return <EnableLocationComponent t={t} {...props} />;
}
