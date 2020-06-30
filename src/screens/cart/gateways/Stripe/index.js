/**
 *
 * Handle Payment via Stripe
 * The Stripe JS SDK store here: https://github.com/rnlab/geteways-stripe
 * @version 1.0.0
 * @author ngocdt@rnlab.io
 * @since 1.0.0
 */

import React from 'react';
import {StyleSheet} from 'react-native';

import {View} from 'react-native';
import {WebView} from 'react-native-webview';
import {withTheme} from 'src/components';

import {PUBLISHABLE_KEY} from 'src/config/stripe';

class PaymentStripe extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  onMessage = event => {
    const {handlePaymentProgress} = this.props;
    handlePaymentProgress({
      method: 'stripe',
      data: event.nativeEvent.data,
    });
  };

  render() {
    const {theme} = this.props;

    return (
      <View style={styles.container}>
        <WebView
          style={styles.webView}
          onMessage={this.onMessage}
          originWhitelist={['*']}
          source={{
            uri: `https://geteways-f7203.firebaseapp.com?theme=${
              theme.key
            }&pk=${PUBLISHABLE_KEY}`,
          }}
        />
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
});

export default withTheme(PaymentStripe);
