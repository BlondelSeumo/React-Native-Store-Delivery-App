import React from 'react';

import {connect} from 'react-redux';
import {DrawerActions} from '@react-navigation/compat';
import Geolocation from '@react-native-community/geolocation';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {
  ScrollView,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ModalSearchLocation from 'src/components/modalLocation';

import {ThemedView, Text, Header, Icon} from 'src/components';
import {IconHeader} from 'src/containers/HeaderComponent';
import ModalHomePopup from 'src/containers/ModalHomePopup';
import {authSelector} from 'src/modules/auth/selectors';
import {
  dataConfigSelector,
  toggleSidebarSelector,
} from 'src/modules/common/selectors';
import {updateUserSuccess} from 'src/modules/auth/actions';
import {locationSelector} from 'src/modules/auth/selectors';

import Slideshow from './home/containers/Slideshow';
import CategoryList from './home/containers/CategoryList';
import ProductList from './home/containers/ProductList';
import ProductCategory from './home/containers/ProductCategory';
import Banners from './home/containers/Banners';
import TextInfo from './home/containers/TextInfo';
import CountDown from './home/containers/CountDown';
import BlogList from './home/containers/BlogList';
import Testimonials from './home/containers/Testimonials';
import Button from './home/containers/Button';
import Vendors from './home/containers/Vendors';
import Search from './home/containers/Search';
import Divider from './home/containers/Divider';
import {updateUserLocation} from 'src/modules/auth/service';
import {updateLocation} from 'src/modules/auth/actions';
import {fetchSetting} from 'src/modules/common/service';
import {fetchSettingSuccess} from 'src/modules/common/actions';
import {expireConfigSelector} from 'src/modules/common/selectors';
import {categorySelector} from 'src/modules/category/selectors';
import {fetchCategories} from 'src/modules/category/actions';
import {
  LOCATION_DEFAULT,
  getAddressFromCurrentLocation,
} from 'src/config/constant';
import {red, grey6} from 'src/components/config/colors';
import {margin} from 'src/components/config/spacing';

const {width} = Dimensions.get('window');

const containers = {
  slideshow: Slideshow,
  categories: CategoryList,
  products: ProductList,
  productcategory: ProductCategory,
  banners: Banners,
  text: TextInfo,
  countdown: CountDown,
  blogs: BlogList,
  testimonials: Testimonials,
  button: Button,
  vendors: Vendors,
  search: Search,
  divider: Divider,
};

const widthComponent = spacing => {
  if (!spacing) {
    return width;
  }
  const marginLeft =
    spacing.marginLeft && parseInt(spacing.marginLeft, 0)
      ? parseInt(spacing.marginLeft, 0)
      : 0;
  const marginRight =
    spacing.marginRight && parseInt(spacing.marginRight, 0)
      ? parseInt(spacing.marginRight, 0)
      : 0;
  const paddingLeft =
    spacing.paddingLeft && parseInt(spacing.paddingLeft, 0)
      ? parseInt(spacing.paddingLeft, 0)
      : 0;
  const paddingRight =
    spacing.paddingRight && parseInt(spacing.paddingRight, 0)
      ? parseInt(spacing.paddingRight, 0)
      : 0;
  return width - marginLeft - marginRight - paddingLeft - paddingRight;
};

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
      textLocation: '',
    };
  }
  componentDidMount() {
    const {expireConfig, expireCategory, dispatch} = this.props;

    if (!this.props.location.latitude) {
      this.getLocation();
    }
    if (!expireConfig || moment.unix(expireConfig).isBefore(moment())) {
      this.getConfig();
    }
    if (!expireCategory || moment.unix(expireCategory).isBefore(moment())) {
      dispatch(fetchCategories());
    }
  }

  getConfig = async () => {
    try {
      const {dispatch} = this.props;
      // Fetch setting
      let settings = await fetchSetting();
      const {configs, templates, ...rest} = settings;
      dispatch(
        fetchSettingSuccess({
          settings: rest,
          configs: configs,
          templates: templates,
        }),
      );
    } catch (e) {
      console.log('e');
    }
  };

  getLocation() {
    Geolocation.getCurrentPosition(
      async position => {
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
    this.setState({textLocation: result.formatted_address});
  }
  renderContainer(config) {
    const Container = containers[config.type];
    if (!Container) {
      return null;
    }
    return (
      <View key={config.id} style={config.spacing && config.spacing}>
        <Container
          {...config}
          widthComponent={widthComponent(config.spacing)}
        />
      </View>
    );
  }

  openOrCloseModal(status) {
    this.setState({
      visibleModal: status,
    });
  }

  renderCenterComponent() {
    const {
      t,
      auth: {user},
    } = this.props;
    return (
      <TouchableOpacity
        onPress={() => this.openOrCloseModal(true)}
        activeOpacity={0.6}
        style={styles.viewTouchDelivery}>
        <View style={styles.viewDescriptionDelivery}>
          <Text colorFourth h6 h6Style={styles.headerLabelCenter}>
            {t('common:text_delivery_to')}
          </Text>
          <Icon
            name="keyboard-arrow-down"
            type="material"
            size={16}
            color={grey6}
          />
        </View>
        <View style={styles.viewAddress}>
          <Icon
            name="place"
            size={19}
            type="material"
            color={red}
            containerStyle={styles.iconMap}
          />
          <Text numberOfLines={1} h4 medium h4Style={styles.nameAddress}>
            {user?.location?.name ??
              this.props.auth?.location?.formatted_address}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  async userSelectLocation(value) {
    const {dispatch} = this.props;
    let location = value.geometry.location;
    location = {...location, name: value.formatted_address};
    await updateUserLocation({location});
    this.openOrCloseModal(false);
    dispatch(
      updateUserSuccess({
        location,
      }),
    );
  }

  render() {
    const {config, toggleSidebar, navigation} = this.props;
    return (
      <ThemedView isFullView>
        <Header
          leftComponent={
            toggleSidebar ? (
              <IconHeader
                name="align-left"
                size={22}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              />
            ) : null
          }
          centerComponent={this.renderCenterComponent()}
          centerContainerStyle={styles.header}
        />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          {config.map(data => this.renderContainer(data))}
        </ScrollView>
        <ModalHomePopup />
        <ModalSearchLocation
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
  header: {
    alignItems: 'flex-start',
  },
  viewTouchDelivery: {
    width: '100%',
  },
  viewDescriptionDelivery: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  viewAddress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconMap: {
    marginRight: margin.small - 3,
  },
  headerLabelCenter: {
    lineHeight: 14,
  },
  nameAddress: {
    flex: 1,
  },
});

const mapStateToProps = state => {
  return {
    auth: authSelector(state),
    location: locationSelector(state),
    config: dataConfigSelector(state),
    toggleSidebar: toggleSidebarSelector(state),
    expireConfig: expireConfigSelector(state),
    expireCategory: categorySelector(state).expire,
  };
};
const HomeScreenComponent = connect(mapStateToProps)(HomeScreen);
export default function(props) {
  const {t} = useTranslation();
  return <HomeScreenComponent t={t} {...props} />;
}
