import Geolocation from '@react-native-community/geolocation';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import Qs from 'qs';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  TextInput,
  View,
} from 'react-native';
import {Icon as IconComponent, withTheme, ListItem} from 'src/components';
import {red} from 'src/components/config/colors';
import {borderRadius, margin, padding} from 'src/components/config/spacing';
import fonts, {sizes} from 'src/components/config/fonts';
import {GOOGLE_API_KEY} from 'src/config/constant';

const defaultStyles = {
  container: {
    flex: 1,
    paddingHorizontal: padding.large,
  },
  textInputContainer: theme => ({
    backgroundColor: theme.colors.bgColorSecondary,
    height: 46,
    borderRadius: borderRadius.base,
    flexDirection: 'row',
    alignItems: 'center',
  }),
  textInput: theme => ({
    height: 28,
    paddingTop: 4.5,
    paddingBottom: 4.5,
    paddingLeft: padding.large,
    paddingRight: padding.small,
    fontSize: sizes.base,
    flex: 1,
    color: theme.colors.textColor,
    ...fonts.medium,
  }),
  listView: {},
  row: {
    paddingTop: 14,
    paddingBottom: 14,
    height: 70,
    flexDirection: 'row',
  },
  description: {},
  loader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
  },
  item: {
    paddingVertical: padding.large,
    alignItems: 'flex-start',
  },
  itemCurrent: {
    paddingVertical: padding.large + 4,
  },
  itemSubtitle: {
    marginTop: 5,
    lineHeight: 16,
  },
  itemIconLeft: {
    marginTop: 6,
  },
  viewIconLeft: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: margin.large,
  },
};

class GooglePlacesAutocompleteComponent extends Component {
  _isMounted = false;
  _results = [];
  _requests = [];

  constructor(props) {
    super(props);
    this.state = this.getInitialState.call(this);
  }

  getInitialState = () => ({
    text: this.props.getDefaultValue(),
    dataSource: [],
    currentUserAddress: {},
    loading: true,
    listViewDisplayed:
      this.props.listViewDisplayed === 'auto'
        ? false
        : this.props.listViewDisplayed,
  });

  buildRowsFromResults = (results, isFrist = false) => {
    let res = [];
    if (!isFrist) {
      res.unshift(this.state.currentUserAddress);
    }

    res = res.map(place => ({
      ...place,
      isPredefinedPlace: true,
    }));

    return [...res, ...results];
  };

  UNSAFE_componentWillMount() {
    this._request = this.props.debounce
      ? debounce(this._request, this.props.debounce)
      : this._request;
  }

  componentDidMount() {
    // This will load the default value's search results after the view has
    // been rendered
    this._handleChangeText(this.state.text);
    this._isMounted = true;
    Geolocation.getCurrentPosition(
      position => {
        if (position) {
          this.getAddressFromCurrentLocation(
            position?.coords?.latitude,
            position?.coords?.longitude,
          );
        } else {
          this.setState({
            loading: false,
          });
        }
      },
      error => {
        this.setState({
          loading: false,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 5000,
        distanceFilter: 0,
      },
    );
  }

  getAddressFromCurrentLocation(lat, long) {
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${GOOGLE_API_KEY}`;
    fetch(URL, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          loading: false,
        });
        if (data.results && data.results.length) {
          const fristItem = data.results[0];
          this.setState({
            currentUserAddress: {...fristItem, type: 'current'},
            dataSource: this.buildRowsFromResults(
              [{...fristItem, type: 'current'}],
              true,
            ),
          });
        }
      })
      .catch(error => {
        this.setState({
          loading: false,
        });
        return error;
      });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let listViewDisplayed = true;

    if (nextProps.listViewDisplayed !== 'auto') {
      listViewDisplayed = nextProps.listViewDisplayed;
    }

    if (
      typeof nextProps.text !== 'undefined' &&
      this.state.text !== nextProps.text
    ) {
      this.setState(
        {
          listViewDisplayed: listViewDisplayed,
        },
        this._handleChangeText(nextProps.text),
      );
    } else {
      this.setState({
        listViewDisplayed: listViewDisplayed,
      });
    }
  }

  componentWillUnmount() {
    this._abortRequests();
    this._isMounted = false;
  }

  _abortRequests = () => {
    this._requests.map(i => i.abort());
    this._requests = [];
  };

  _onPress = rowData => {
    if (rowData?.type === 'current' && rowData?.formatted_address) {
      this.props.onPress(null, rowData);
      return;
    }
    if (
      rowData.isPredefinedPlace !== true &&
      this.props.fetchDetails === true
    ) {
      if (rowData.isLoading === true) {
        // already requesting
        return;
      }

      Keyboard.dismiss();

      this._abortRequests();

      // display loader
      this._enableRowLoader(rowData);

      // fetch details
      const request = new XMLHttpRequest();
      this._requests.push(request);
      request.timeout = this.props.timeout;
      request.ontimeout = this.props.onTimeout;
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }

        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);
          if (responseJSON.status === 'OK') {
            if (this._isMounted === true) {
              const details = responseJSON.result;
              this._disableRowLoaders();
              this._onBlur();

              this.setState({
                text: this._renderDescription(rowData),
              });

              delete rowData.isLoading;
              this.props.onPress(rowData, details);
            }
          } else {
            this._disableRowLoaders();

            if (this.props.autoFillOnNotFound) {
              this.setState({
                text: this._renderDescription(rowData),
              });
              delete rowData.isLoading;
            }

            if (!this.props.onNotFound) {
              console.warn(
                'google places autocomplete: ' + responseJSON.status,
              );
            } else {
              this.props.onNotFound(responseJSON);
            }
          }
        } else {
          this._disableRowLoaders();

          if (!this.props.onFail) {
            console.warn(
              'google places autocomplete: request could not be completed or has been aborted',
            );
          } else {
            this.props.onFail(
              'request could not be completed or has been aborted',
            );
          }
        }
      };

      request.open(
        'GET',
        'https://maps.googleapis.com/maps/api/place/details/json?' +
          Qs.stringify({
            key: this.props.query.key,
            placeid: rowData.place_id,
            language: this.props.query.language,
            ...this.props.GooglePlacesDetailsQuery,
          }),
      );

      if (this.props.query.origin !== null) {
        request.setRequestHeader('Referer', this.props.query.origin);
      }

      request.send();
    }
  };

  _enableRowLoader = rowData => {
    let rows = this.buildRowsFromResults(this._results);
    for (let i = 0; i < rows.length; i++) {
      if (
        rows[i].place_id === rowData.place_id ||
        (rows[i].isCurrentLocation === true &&
          rowData.isCurrentLocation === true)
      ) {
        rows[i].isLoading = true;
        this.setState({
          dataSource: rows,
        });
        break;
      }
    }
  };

  _disableRowLoaders = () => {
    if (this._isMounted === true) {
      for (let i = 0; i < this._results.length; i++) {
        if (this._results[i].isLoading === true) {
          this._results[i].isLoading = false;
        }
      }

      this.setState({
        dataSource: this.buildRowsFromResults(this._results),
      });
    }
  };

  _filterResultsByTypes = (unfilteredResults, types) => {
    if (types.length === 0) {
      return unfilteredResults;
    }

    const results = [];
    for (let i = 0; i < unfilteredResults.length; i++) {
      let found = false;

      for (let j = 0; j < types.length; j++) {
        if (unfilteredResults[i].types.indexOf(types[j]) !== -1) {
          found = true;
          break;
        }
      }

      if (found === true) {
        results.push(unfilteredResults[i]);
      }
    }
    return results;
  };

  _request = text => {
    this._abortRequests();
    if (text.length >= this.props.minLength) {
      const request = new XMLHttpRequest();
      this._requests.push(request);
      request.timeout = this.props.timeout;
      request.ontimeout = this.props.onTimeout;
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }

        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);
          if (typeof responseJSON.predictions !== 'undefined') {
            if (this._isMounted === true) {
              const results =
                this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding'
                  ? this._filterResultsByTypes(
                      responseJSON.predictions,
                      this.props.filterReverseGeocodingByTypes,
                    )
                  : responseJSON.predictions;

              this._results = results;
              this.setState({
                dataSource: this.buildRowsFromResults(results),
              });
            }
          }
          if (typeof responseJSON.error_message !== 'undefined') {
            if (!this.props.onFail) {
              console.warn(
                'google places autocomplete: ' + responseJSON.error_message,
              );
            } else {
              this.props.onFail(responseJSON.error_message);
            }
          }
        } else {
        }
      };
      if (this.props.preProcess) {
        text = this.props.preProcess(text);
      }
      request.open(
        'GET',
        'https://maps.googleapis.com/maps/api/place/autocomplete/json?&input=' +
          encodeURIComponent(text) +
          '&' +
          Qs.stringify(this.props.query),
      );
      if (this.props.query.origin !== null) {
        request.setRequestHeader('Referer', this.props.query.origin);
      }

      request.send();
    } else {
      this._results = [];
      this.setState({
        dataSource: this.buildRowsFromResults([]),
      });
    }
  };

  _onChangeText = text => {
    this._request(text);

    this.setState({
      text: text,
      listViewDisplayed: this._isMounted || this.props.autoFocus,
    });
  };

  _handleChangeText = text => {
    this._onChangeText(text);

    const onChangeText =
      this.props &&
      this.props.textInputProps &&
      this.props.textInputProps.onChangeText;

    if (onChangeText) {
      onChangeText(text);
    }
  };

  _getRowLoader() {
    const {theme} = this.props;
    return (
      <ActivityIndicator
        animating={true}
        size="small"
        color={theme.colors.primary}
      />
    );
  }

  _renderRowData = rowData => {
    const {theme} = this.props;
    if (rowData?.type === 'current' && rowData?.formatted_address) {
      return (
        <ListItem
          onPress={() => this._onPress(rowData)}
          activeOpacity={0.6}
          title="User current location"
          subtitle={rowData?.formatted_address}
          titleProps={{
            h4: true,
            medium: true,
            numberOfLines: 1,
          }}
          subtitleStyle={defaultStyles.itemSubtitle}
          subtitleProps={{
            numberOfLines: 1,
          }}
          type="underline"
          leftIcon={
            <IconComponent
              name="gps-fixed"
              size={16}
              type={'material'}
              color={theme.colors.textColorFourth}
              containerStyle={defaultStyles.itemIconLeft}
            />
          }
          containerStyle={[defaultStyles.item, defaultStyles.itemCurrent]}
          chevron={{
            size: 24,
          }}
          pad={padding.large}
        />
      );
    } else if (rowData?.structured_formatting?.main_text) {
      return (
        <ListItem
          onPress={() => this._onPress(rowData)}
          activeOpacity={0.6}
          title={rowData?.structured_formatting?.main_text}
          subtitle={rowData?.structured_formatting?.secondary_text}
          titleProps={{
            h4: true,
            medium: true,
            numberOfLines: 1,
          }}
          subtitleStyle={defaultStyles.itemSubtitle}
          subtitleProps={{
            numberOfLines: 1,
          }}
          type="underline"
          leftIcon={
            <IconComponent
              name="place"
              size={16}
              type={'material'}
              color={theme.colors.textColorFourth}
              containerStyle={defaultStyles.itemIconLeft}
            />
          }
          rightElement={this._renderLoader(rowData)}
          containerStyle={defaultStyles.item}
          pad={padding.large}
        />
      );
    } else {
      return null;
    }
  };

  _renderDescription = rowData => {
    if (this.props.renderDescription) {
      return this.props.renderDescription(rowData);
    }

    return rowData.description || rowData.formatted_address || rowData.name;
  };

  _renderLoader = rowData => {
    if (rowData.isLoading === true) {
      return (
        <View
          style={[
            this.props.suppressDefaultStyles ? {} : defaultStyles.loader,
            this.props.styles.loader,
          ]}>
          {this._getRowLoader()}
        </View>
      );
    }

    return null;
  };

  _renderRow = (rowData = {}, sectionID, rowID) => {
    if (
      (rowData?.type === 'current' && rowData?.formatted_address) ||
      rowData?.structured_formatting?.main_text
    ) {
      return this._renderRowData(rowData);
    }
    return null;
  };

  _onBlur = () => {};

  _onFocus = () => this.setState({listViewDisplayed: true});

  _renderLeftButton = () => {
    if (this.props.renderLeftButton) {
      return this.props.renderLeftButton();
    }
  };

  _renderRightButton = () => {
    if (this.props.renderRightButton) {
      return this.props.renderRightButton();
    }
  };

  _getFlatList = () => {
    const keyGenerator = () =>
      Math.random()
        .toString(36)
        .substr(2, 10);
    return (
      <FlatList
        scrollEnabled={!this.props.disableScroll}
        style={[defaultStyles.listView]}
        data={this.state.dataSource}
        keyExtractor={keyGenerator}
        extraData={[this.state.dataSource, this.props]}
        renderItem={({item}) => this._renderRow(item)}
        {...this.props}
      />
    );
  };
  render() {
    const {theme} = this.props;
    let {
      onFocus,
      clearButtonMode,
      InputComp,
      ...userProps
    } = this.props.textInputProps;
    const TextInputComp = InputComp ? InputComp : TextInput;
    if (this.state.loading) {
      return (
        <ActivityIndicator animating={true} size="large" color={'black'} />
      );
    }
    return (
      <View style={[defaultStyles.container]}>
        {!this.props.textInputHide && (
          <View
            style={[
              this.props.suppressDefaultStyles
                ? {}
                : defaultStyles.textInputContainer(theme),
              this.props.styles.textInputContainer,
            ]}>
            {this._renderLeftButton()}
            <View style={defaultStyles.viewIconLeft}>
              <IconComponent
                name="place"
                size={20}
                type={'material'}
                color={red}
              />
            </View>
            <TextInputComp
              editable={this.props.editable}
              returnKeyType={this.props.returnKeyType}
              keyboardAppearance={this.props.keyboardAppearance}
              autoFocus={this.props.autoFocus}
              style={[
                this.props.suppressDefaultStyles
                  ? {}
                  : defaultStyles.textInput(theme),
                this.props.styles.textInput,
              ]}
              value={this.state.text}
              placeholder={this.props.placeholder}
              onSubmitEditing={this.props.onSubmitEditing}
              placeholderTextColor={
                this.props.placeholderTextColor || theme.colors.textColorThird
              }
              onFocus={
                onFocus
                  ? () => {
                      this._onFocus();
                      onFocus();
                    }
                  : this._onFocus
              }
              onBlur={this._onBlur}
              underlineColorAndroid={this.props.underlineColorAndroid}
              clearButtonMode={
                clearButtonMode ? clearButtonMode : 'while-editing'
              }
              {...userProps}
              onChangeText={this._handleChangeText}
            />
            {this._renderRightButton()}
          </View>
        )}

        {this._getFlatList()}
        {this.props.children}
      </View>
    );
  }
}

GooglePlacesAutocompleteComponent.propTypes = {
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  underlineColorAndroid: PropTypes.string,
  returnKeyType: PropTypes.string,
  keyboardAppearance: PropTypes.oneOf(['default', 'light', 'dark']),
  onPress: PropTypes.func,
  onNotFound: PropTypes.func,
  onFail: PropTypes.func,
  minLength: PropTypes.number,
  fetchDetails: PropTypes.bool,
  autoFocus: PropTypes.bool,
  autoFillOnNotFound: PropTypes.bool,
  getDefaultValue: PropTypes.func,
  timeout: PropTypes.number,
  onTimeout: PropTypes.func,
  query: PropTypes.object,
  GoogleReverseGeocodingQuery: PropTypes.object,
  GooglePlacesSearchQuery: PropTypes.object,
  GooglePlacesDetailsQuery: PropTypes.object,
  styles: PropTypes.object,
  textInputProps: PropTypes.object,
  enablePoweredByContainer: PropTypes.bool,
  predefinedPlaces: PropTypes.array,
  currentLocation: PropTypes.bool,
  currentLocationLabel: PropTypes.string,
  nearbyPlacesAPI: PropTypes.string,
  enableHighAccuracyLocation: PropTypes.bool,
  filterReverseGeocodingByTypes: PropTypes.array,
  predefinedPlacesAlwaysVisible: PropTypes.bool,
  enableEmptySections: PropTypes.bool,
  renderDescription: PropTypes.func,
  renderRow: PropTypes.func,
  renderLeftButton: PropTypes.func,
  renderRightButton: PropTypes.func,
  debounce: PropTypes.number,
  isRowScrollable: PropTypes.bool,
  text: PropTypes.string,
  textInputHide: PropTypes.bool,
  suppressDefaultStyles: PropTypes.bool,
  numberOfLines: PropTypes.number,
  onSubmitEditing: PropTypes.func,
  editable: PropTypes.bool,
};
GooglePlacesAutocompleteComponent.defaultProps = {
  placeholder: 'Search',
  isRowScrollable: true,
  underlineColorAndroid: 'transparent',
  returnKeyType: 'default',
  keyboardAppearance: 'default',
  onPress: () => {},
  onNotFound: () => {},
  onFail: () => {},
  minLength: 0,
  fetchDetails: false,
  autoFocus: false,
  autoFillOnNotFound: false,
  keyboardShouldPersistTaps: 'always',
  getDefaultValue: () => '',
  timeout: 20000,
  onTimeout: () => console.warn('google places autocomplete: request timeout'),
  query: {
    key: 'missing api key',
    language: 'en',
    types: 'geocode',
  },
  GoogleReverseGeocodingQuery: {},
  GooglePlacesDetailsQuery: {},
  GooglePlacesSearchQuery: {
    rankby: 'distance',
    type: 'restaurant',
  },
  styles: {},
  textInputProps: {},
  enablePoweredByContainer: true,
  predefinedPlaces: [],
  currentLocation: false,
  currentLocationLabel: 'Current location',
  nearbyPlacesAPI: 'GooglePlacesSearch',
  enableHighAccuracyLocation: true,
  filterReverseGeocodingByTypes: [],
  predefinedPlacesAlwaysVisible: false,
  enableEmptySections: true,
  listViewDisplayed: 'auto',
  debounce: 0,
  textInputHide: false,
  suppressDefaultStyles: false,
  numberOfLines: 1,
  onSubmitEditing: () => {},
  editable: true,
};

const GooglePlacesAutocomplete = withTheme(GooglePlacesAutocompleteComponent);

// this function is still present in the library to be retrocompatible with version < 1.1.0
const create = function create(options = {}) {
  return React.createClass({
    render() {
      return <GooglePlacesAutocomplete {...options} />;
    },
  });
};

export default GooglePlacesAutocomplete;

module.exports = {
  GooglePlacesAutocomplete,
  create,
};
