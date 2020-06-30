import React from 'react';
import {compose} from 'redux';
import {withNavigation} from '@react-navigation/compat';
import {withTranslation} from 'react-i18next';

import {StyleSheet, Image} from 'react-native';
import {Text} from 'src/components';

import Container from 'src/containers/Container';
import Button from 'src/containers/Button';

import {homeTabs} from 'src/config/navigator';

import {margin, padding} from 'src/components/config/spacing';
import {lineHeights} from 'src/components/config/fonts';

class Done extends React.Component {
  handleContinue = () => {
    const {navigation} = this.props;
    navigation.pop();
    navigation.navigate(homeTabs.shop);
  };

  render() {
    const {t} = this.props;
    return (
      <Container style={styles.container}>
        <Image
          source={require('src/assets/images/order_success.png')}
          style={styles.image}
        />
        <Text h2 medium style={styles.textTitle}>
          {t('cart:text_congrats')}
        </Text>
        <Text colorSecondary style={styles.textDescription}>
          {t('cart:text_congrats_description')}
        </Text>
        <Button
          title={t('cart:text_shopping')}
          onPress={this.handleContinue}
          buttonStyle={styles.button}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
  },
  textTitle: {
    marginTop: 4,
    marginBottom: margin.base,
  },
  textDescription: {
    width: 250,
    textAlign: 'center',
    lineHeight: lineHeights.h4,
    marginBottom: 44,
  },
  button: {
    paddingHorizontal: padding.big - 1,
  },
});

export default compose(
  withTranslation(),
  withNavigation,
)(Done);
