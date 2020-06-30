import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import Qs from 'qs';
import React, {Component} from 'react';
import {borderRadius} from 'src/components/config/spacing';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon as IconComponent} from 'src/components';

const WINDOW = Dimensions.get('window');

const defaultStyles = {
  container: {
    flex: 1,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 15,
    flex: 1,
    height: 46,
  },
  poweredContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  powered: {},
  listView: {
    width: WINDOW.width,
    position: 'absolute',
    top: WINDOW.height - 600,
    height: 300,
    backgroundColor: 'white',
    elevation: 10,
    shadowOffset: {
      width: -10,
      height: -100,
    },
    shadowOpacity: 1,
    shadowRadius: 6.27,
    marginTop: 10,
    shadowColor: '#000000',
  },
  row: {
    paddingTop: 18,
    paddingBottom: 18,
    marginLeft: 15,
    marginRight: 15,
    height: 75,
    flexDirection: 'row',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#c8c7cc',
  },
  description: {},
  loader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
  },
  androidLoader: {
    marginRight: -15,
  },
  listItemLocation: {
    flex: 1,
  },
  touchItemLocation: {
    width: WINDOW.width,
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 0.3,
  },
  itemLocation: {
    width: WINDOW.width,
    flexDirection: 'row',
  },
  iconLocation: {
    marginTop: 10,
  },
  itemLocationRight: {
    paddingLeft: 16,
  },
  textTitleLocation: {
    fontSize: 16,
    color: '#121212',
  },
  textDescriptionLocation: {
    fontSize: 12,
    color: '#999999',
    marginTop: 8,
  },
  flatListLocation: {
    paddingBottom: 50,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WINDOW.width - 38,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: borderRadius.base,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    height: 46,
    shadowRadius: 6.27,
    marginLeft: 15,
    paddingLeft: 15,
  },
};

export default class GooglePlacesAutocomplete extends Component {
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
    loading: false,
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
    return <ActivityIndicator animating={true} size="small" />;
  }

  _renderRowData = rowData => {
    return (
      <View style={defaultStyles.itemLocation}>
        <IconComponent
          style={defaultStyles.iconLocation}
          name="location-on"
          size={16}
          type={'material'}
          color={'#adb5bd'}
        />
        <View style={defaultStyles.itemLocationRight}>
          <Text
            style={defaultStyles.textTitleLocation}
            numberOfLines={this.props.numberOfLines}>
            {rowData?.structured_formatting?.main_text}
          </Text>
          <Text
            style={defaultStyles.textDescriptionLocation}
            numberOfLines={this.props.numberOfLines}>
            {rowData?.structured_formatting?.secondary_text}
          </Text>
        </View>
      </View>
    );
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

  _renderRow = (rowData = {}) => {
    if (
      (rowData?.type === 'current' && rowData?.formatted_address) ||
      rowData?.structured_formatting?.main_text
    ) {
      return (
        <ScrollView
          style={defaultStyles.listItemLocation}
          scrollEnabled={this.props.isRowScrollable}
          keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={defaultStyles.touchItemLocation}
            onPress={() => this._onPress(rowData)}
            underlayColor={this.props.listUnderlayColor || '#c8c7cc'}>
            <View
              style={[
                this.props.suppressDefaultStyles ? {} : defaultStyles.row,
                this.props.styles.row,
              ]}>
              {this._renderLoader(rowData)}
              {this._renderRowData(rowData)}
            </View>
          </TouchableOpacity>
        </ScrollView>
      );
    }
    return null;
  };

  _onBlur = () => {};

  _onFocus = () => this.setState({listViewDisplayed: true});

  _getFlatList = () => {
    const keyGenerator = () =>
      Math.random()
        .toString(36)
        .substr(2, 10);
    if (!this.state.dataSource || this.state.dataSource.length <= 1) {
      return <View />;
    }
    return (
      <FlatList
        contentContainerStyle={defaultStyles.flatListLocation}
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
    let {
      onFocus,
      clearButtonMode,
      InputComp,
      ...userProps
    } = this.props.textInputProps;
    const TextInputComp = InputComp ? InputComp : TextInput;
    return (
      <View style={[defaultStyles.container]}>
        <View style={defaultStyles.content}>
          <IconComponent
            name="search"
            size={24}
            type={'material'}
            color={'black'}
          />
          <TextInputComp
            editable={this.props.editable}
            returnKeyType={this.props.returnKeyType}
            keyboardAppearance={this.props.keyboardAppearance}
            autoFocus={this.props.autoFocus}
            style={[
              this.props.suppressDefaultStyles ? {} : defaultStyles.textInput,
              this.props.styles.textInput,
            ]}
            value={this.state.text}
            placeholder={this.props.placeholder}
            onSubmitEditing={this.props.onSubmitEditing}
            placeholderTextColor={this.props.placeholderTextColor}
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
        </View>
        {this._getFlatList()}
      </View>
    );
  }
}

GooglePlacesAutocomplete.propTypes = {
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
  needGetCurrentLocation: PropTypes.bool,
  showListOnFocus: PropTypes.bool,
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
  listUnderlayColor: PropTypes.string,
  debounce: PropTypes.number,
  isRowScrollable: PropTypes.bool,
  text: PropTypes.string,
  textInputHide: PropTypes.bool,
  suppressDefaultStyles: PropTypes.bool,
  numberOfLines: PropTypes.number,
  onSubmitEditing: PropTypes.func,
  editable: PropTypes.bool,
};
GooglePlacesAutocomplete.defaultProps = {
  placeholder: 'Search',
  placeholderTextColor: '#A8A8A8',
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
  needGetCurrentLocation: true,
  showListOnFocus: false,
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

// this function is still present in the library to be retrocompatible with version < 1.1.0
const create = function create(options = {}) {
  return React.createClass({
    render() {
      return <GooglePlacesAutocomplete {...options} />;
    },
  });
};

module.exports = {
  GooglePlacesAutocomplete,
  create,
};
