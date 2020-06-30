import React from 'react';

import {Map} from 'immutable';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';

import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Header, ThemedView} from 'src/components';
import ShippingForm from 'src/screens/cart/containers/ShippingForm';
import Container from 'src/containers/Container';
import Button from 'src/containers/Button';
import {TextHeader, CartIcon, IconHeader} from 'src/containers/HeaderComponent';

import {
  authSelector,
  shippingAddressSelector,
} from 'src/modules/auth/selectors';
import {
  updateCustomer,
  updateShippingAddressSuccess,
} from 'src/modules/auth/actions';
import {validatorAddress} from 'src/modules/cart/validator';

import {margin} from 'src/components/config/spacing';
import {showMessage} from 'react-native-flash-message';

class AddressBookScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shipping: props.shippingAddress,
      errors: {},
    };
    this.handleSave = this.handleSave.bind(this);
    this.updateAddressData = this.updateAddressData.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  handleSave() {
    const {dispatch, t} = this.props;
    const {shipping} = this.state;
    const errors = validatorAddress(shipping);
    if (errors.size > 0) {
      this.setState({
        errors: errors.toJS(),
      });
      showMessage({
        message: t('notifications:text_fill_value'),
        type: 'danger',
      });
    } else {
      this.setState({
        errors: {},
      });
      dispatch(updateCustomer({shipping}, this.updateAddressData));
    }
  }

  updateAddressData() {
    const {dispatch, navigation, route} = this.props;
    const {shipping} = this.state;
    dispatch(updateShippingAddressSuccess(shipping));
    if (route?.params?.goBack) {
      navigation.goBack();
    }
  }

  onChange(key, value) {
    this.setState(preState => {
      return {
        shipping: preState.shipping.set(key, value),
      };
    });
  }

  render() {
    const {shipping, errors} = this.state;
    const {
      t,
      auth: {pendingUpdateCustomer},
    } = this.props;
    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={t('common:text_address')} />}
          rightComponent={<CartIcon />}
        />
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.keyboard}
          enabled={Platform.OS === 'ios'}>
          <ScrollView>
            <Container>
              <ShippingForm
                data={shipping}
                onChange={this.onChange}
                errors={Map(errors)}
              />
              <Button
                title={t('profile:text_button_address')}
                containerStyle={styles.button}
                onPress={this.handleSave}
                loading={pendingUpdateCustomer}
              />
            </Container>
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  button: {
    marginVertical: margin.big,
  },
});

const mapStateToProps = state => ({
  shippingAddress: shippingAddressSelector(state),
  auth: authSelector(state),
});

export default connect(mapStateToProps)(withTranslation()(AddressBookScreen));
