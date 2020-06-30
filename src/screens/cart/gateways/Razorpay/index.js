import React, {Component} from 'react';

import {WebView} from 'react-native-webview';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

class Razorpay extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: true,
    };
  }

  handleResponse = data => {
    const {nextStep} = this.props;
    if (data.url.includes('order-received') && data.canGoBack) {
      nextStep();
    } else {
      return;
    }
  };

  render() {
    const {loading} = this.state;
    const {redirect} = this.props;

    return (
      <View style={styles.container}>
        <WebView
          source={{uri: redirect}}
          onNavigationStateChange={data => this.handleResponse(data)}
          style={styles.webView}
          onLoad={() => this.setState({loading: false})}
        />
        {loading && (
          <View style={styles.viewLoading}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
    width: '100%',
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
});

Razorpay.propTypes = {};

export default Razorpay;
