import React, {Component} from 'react';

import {WebView} from 'react-native-webview';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import {ThemedView} from 'src/components';
import Button from 'src/containers/Button';
import Container from 'src/containers/Container';
import {homeTabs} from 'src/config/navigator';
import {connect} from 'react-redux';
import {clearCart} from 'src/modules/cart/actions';
import {margin} from 'src/components/config/spacing';

class WebviewThankYou extends Component {
  constructor(props, context) {
    super(props, context);
    const {route} = props;
    this.state = {
      loading: true,
      uri: route?.params?.uri ?? '',
    };
  }

  handleContinue = () => {
    const {navigation, dispatch} = this.props;
    dispatch(clearCart());
    navigation.pop();
    navigation.navigate(homeTabs.shop);
  };

  handleResponse = data => {
    console.log(data);
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

WebviewThankYou.propTypes = {};

export default connect()(WebviewThankYou);
