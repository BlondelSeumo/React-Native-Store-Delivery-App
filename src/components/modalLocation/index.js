import React from 'react';
import {withTranslation} from 'react-i18next';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {
  Header,
  Icon as IconComponent,
  Modal,
  ThemedView,
  withTheme,
} from 'src/components';
import {TextHeader} from 'src/containers/HeaderComponent';
import {languageSelector} from 'src/modules/common/selectors';
import {GooglePlacesAutocomplete} from '../GoogleSearchLocation';
import {updateLocation} from 'src/modules/auth/actions';
import {authSelector} from 'src/modules/auth/selectors';
import {GOOGLE_API_KEY} from 'src/config/constant';

class ModalSearchLocation extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      location: '',
    };
  }

  componentDidMount() {}

  closeModal() {
    this.props.closeModal();
  }

  renderItem(item) {
    return (
      <TouchableOpacity>
        <Text>{item.description}</Text>
      </TouchableOpacity>
    );
  }
  render() {
    const {t, language, auth, visibleModal} = this.props;
    return (
      <Modal
        visible={visibleModal}
        style={styles.modal}
        needHeader={false}
        setModalVisible={() => this.closeModal()}
        ratioHeight={1}>
        <ThemedView isFullView>
          <Header
            leftComponent={
              <IconComponent
                name="chevron-left"
                size={28}
                onPress={() => this.closeModal()}
              />
            }
            centerComponent={<TextHeader title={t('common:text_location')} />}
          />
          <GooglePlacesAutocomplete
            placeholder={t('common:text_placholder_location')}
            minLength={2}
            autoFocus={true}
            returnKeyType={'search'}
            fetchDetails={true}
            listViewDisplayed={true}
            nearbyPlacesAPI="GoogleReverseGeocoding"
            GooglePlacesDetailsQuery={{
              fields: 'formatted_address,geometry',
            }}
            onPress={(data, details = null) => {
              this.props.dispatch(
                updateLocation({
                  latitude: details?.geometry?.location.lat,
                  longitude: details?.geometry?.location.lng,
                  formatted_address: details?.formatted_address,
                }),
              );
              if (auth.isLogin || this.props.find) {
                this.props.onSelectLocation(details);
              } else {
                this.closeModal();
              }
            }}
            query={{
              key: GOOGLE_API_KEY,
              language: language, // language of the results
            }}
            keyboardShouldPersistTaps="handled"
            GooglePlacesSearchQuery={{
              rankby: 'distance',
            }}
            currentLocation={true}
          />
        </ThemedView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});

const mapStateToProps = state => ({
  language: languageSelector(state),
  auth: authSelector(state),
});

export default compose(
  withTheme,
  withTranslation(),
  connect(
    mapStateToProps,
    null,
  ),
)(ModalSearchLocation);
