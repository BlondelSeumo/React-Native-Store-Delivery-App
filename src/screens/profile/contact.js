import React from 'react';
import {connect} from 'react-redux';
import {View, Image, Dimensions} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {Header, Icon, Text, ThemeConsumer, ThemedView} from 'src/components';

import {IconHeader} from 'src/containers/HeaderComponent';

import {configsSelector, languageSelector} from 'src/modules/common/selectors';

import {grey5} from 'src/components/config/colors';
import {margin, padding, borderRadius} from 'src/components/config/spacing';
import {useTranslation} from 'react-i18next';
import CurrentLocationMarker from 'src/components/MapClustering/CurrentLocationMarker';

const {width, height} = Dimensions.get('window');

const WIDTH_MAP = width;
const HEIGHT_MAP = (height * 2) / 3;

const ASPECT_RATIO = WIDTH_MAP / HEIGHT_MAP;

const LATITUDE = 20.990721;
const LONGITUDE = 105.787064;

const LATITUDE_DELTA = 0.0422;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class ContactScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  render() {
    const {configs, language, theme, t} = this.props;
    return (
      <ThemedView isFullView colorSecondary>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          <Marker
            coordinate={{
              latitude: LATITUDE,
              longitude: LONGITUDE,
            }}
            centerOffset={{x: -18, y: -60}}
            anchor={{x: 0.69, y: 1}}>
            <CurrentLocationMarker />
          </Marker>
        </MapView>
        <View style={styles.content(theme.colors.support.bgColor)}>
          <Text h2 medium style={styles.title}>
            {t('profile:text_name_contact')}
          </Text>
          <View style={styles.row}>
            <View
              style={[
                styles.flex,
                styles.marginRight('small'),
                styles.listInfo,
              ]}>
              <View style={[styles.viewInfo, styles.row]}>
                <Icon
                  name="mail"
                  type="feather"
                  size={15}
                  color={grey5}
                  containerStyle={styles.marginRight('small')}
                />
                <Text>{configs.get('email')}</Text>
              </View>
              <View style={[styles.viewInfo, styles.row]}>
                <Icon
                  name="phone-call"
                  type="feather"
                  size={15}
                  color={grey5}
                  containerStyle={styles.marginRight('small')}
                />
                <Text>{configs.get('phone')}</Text>
              </View>
              <View style={[styles.viewInfo, styles.row]}>
                <Icon
                  name="map"
                  type="feather"
                  size={15}
                  color={grey5}
                  containerStyle={styles.marginRight('small')}
                />
                <Text>
                  {typeof configs.get('address') === 'string'
                    ? configs.get('address')
                    : configs.getIn(['address', language])}
                </Text>
              </View>
            </View>
            <Image
              source={require('src/assets/images/maps-and-flags.png')}
              resizeMode="stretch"
            />
          </View>
        </View>
        <View style={styles.header}>
          <Header
            backgroundColor="transparent"
            leftComponent={<IconHeader />}
          />
        </View>
      </ThemedView>
    );
  }
}

const styles = {
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  map: {
    flex: 1,
  },
  content: bgColor => ({
    backgroundColor: bgColor,
    paddingVertical: padding.big,
    paddingHorizontal: padding.big,
    borderTopLeftRadius: borderRadius.big,
    borderTopRightRadius: borderRadius.big,
    marginTop: -margin.big,
  }),
  title: {
    marginBottom: margin.big - margin.base,
  },
  listInfo: {
    flex: 1,
    marginTop: margin.base,
  },
  row: {
    flexDirection: 'row',
  },
  marginRight: size => ({
    marginRight: margin[size],
  }),
  viewInfo: {
    alignItems: 'center',
    marginBottom: margin.base,
  },
};

const mapStateToProps = state => {
  return {
    configs: configsSelector(state),
    language: languageSelector(state),
  };
};

const ContactScreenComponent = connect(mapStateToProps)(ContactScreen);

export default function(props) {
  const {t} = useTranslation();
  return (
    <ThemeConsumer>
      {({theme}) => <ContactScreenComponent {...props} t={t} theme={theme} />}
    </ThemeConsumer>
  );
}
