import React from 'react';

import {connect} from 'react-redux';
import {Map} from 'immutable';
import {withTranslation} from 'react-i18next';

import {StyleSheet, ScrollView} from 'react-native';
import {Text} from 'src/components';
import {Row, Col} from 'src/containers/Gird';
import Button from 'src/containers/Button';
import Heading from 'src/containers/Heading';
import Container from 'src/containers/Container';
import ViewFooterFixed from 'src/containers/ViewFooterFixed';
import PaymentMethod from './PaymentMethod';
import PaymentForm from './PaymentForm';

import {updateOrderReview} from 'src/modules/checkout/actions';
import {
  selectOrder,
  selectOrderPending,
  selectUpdateOrderPending,
} from 'src/modules/order/selectors';
import {
  selectedPaymentMethod,
  cartTotalSelector,
} from 'src/modules/cart/selectors';
import {updateOrderReviewLoadingSelector} from 'src/modules/checkout/selectors';
import {billingAddressSelector} from 'src/modules/auth/selectors';

import {changeData} from 'src/modules/auth/actions';

import {margin, padding} from 'src/components/config/spacing';
import {red} from 'src/components/config/colors';

class Payment extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      errors: Map(),
      visible: false,
    };
    this.onChange = this.onChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.callBack = this.callBack.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  setModalVisible(visible) {
    this.setState({
      visible: visible,
    });
  }

  onChange(key, value) {
    const {dispatch} = this.props;
    dispatch(changeData(['billingAddress', key], value));
  }

  callBack(res) {
    if (res.result === 'success') {
      this.setModalVisible(true);
    }
  }

  handleConfirm() {
    const {dispatch} = this.props;
    dispatch(updateOrderReview(this.callBack));
  }

  render() {
    const {loading, backStep, nextStep, billing, params, t} = this.props;
    const {errors, visible} = this.state;

    return (
      <ViewFooterFixed
        footerElement={
          <Row>
            <Col>
              <Button
                secondary
                onPress={() => backStep()}
                title={t('common:text_back')}
              />
            </Col>
            <Col>
              <Button
                loading={loading}
                onPress={this.handleConfirm}
                title={t('common:text_payment')}
              />
            </Col>
          </Row>
        }>
        <ScrollView>
          <Container>
            <Heading
              title={t('cart:text_payment_method')}
              containerStyle={styles.headerText}
            />
            <Text style={{color: red}}>{errors.get('payment_method')}</Text>
            <PaymentMethod
              nextStep={nextStep}
              setModalVisible={this.setModalVisible}
              visible={visible}
            />
            <PaymentForm
              data={billing}
              onChange={this.onChange}
              errors={errors}
              params={params}
            />
          </Container>
        </ScrollView>
      </ViewFooterFixed>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    paddingTop: padding.large,
    paddingBottom: padding.small,
  },
  footer: {
    marginBottom: margin.big,
  },
});

const mapStateToProps = state => ({
  updatedPending: selectUpdateOrderPending(state),
  pending: selectOrderPending(state),
  order: selectOrder(state),
  billing: billingAddressSelector(state),
  selected: selectedPaymentMethod(state),
  total: cartTotalSelector(state),
  loading: updateOrderReviewLoadingSelector(state),
});

export default connect(mapStateToProps)(withTranslation()(Payment));
