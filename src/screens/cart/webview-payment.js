import React, {Component} from 'react';

import {WebView} from 'react-native-webview';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import {ThemedView} from 'src/components';
import Button from 'src/containers/Button';
import Container from 'src/containers/Container';
import {homeTabs} from 'src/config/navigator';
import {connect} from 'react-redux';
import {margin} from 'src/components/config/spacing';
import queryString from 'qs';
import {URL} from 'react-native-url-polyfill';

class WebviewPayment extends Component {
  constructor(props, context) {
    super(props, context);
    const {route} = props;
    this.state = {
      loading: true,
      uri: route?.params?.uri ?? '',
    };
  }

  handleContinue = () => {
    const {navigation} = this.props;
    navigation.pop();
    navigation.navigate(homeTabs.shop);
  };

  handleResponse = request => {
    const {navigation} = this.props;
    const {url} = request;

    const parsed = queryString.parse(new URL(url).search);

    // Cancel order
    if (parsed.cancel_order) {
      navigation.goBack();
    }
  };

  render() {
    const {loading, uri} = this.state;
    const {
      screenProps: {t},
    } = this.props;
    return (
      <ThemedView isFullView>
        <WebView
          source={{uri}}
          onNavigationStateChange={data => this.handleResponse(data)}
          style={styles.webView}
          onLoad={() => this.setState({loading: false})}
        />
        {loading && (
          <View style={styles.viewLoading}>
            <ActivityIndicator size="large" />
          </View>
        )}
        <Container style={styles.footer}>
          <Button
            title={t('cart:text_shopping')}
            onPress={this.handleContinue}
          />
        </Container>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  viewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  footer: {
    marginVertical: margin.big,
  },
});

WebviewPayment.propTypes = {};

export default connect()(WebviewPayment);
