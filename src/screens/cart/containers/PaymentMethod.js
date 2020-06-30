import React from 'react';

import {compose} from 'redux';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {fromJS} from 'immutable';
import merge from 'lodash/merge';

import {
  View,
  Image,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {Text, Modal, withTheme} from 'src/components';
import ChooseItem from 'src/containers/ChooseItem';
import TextHtml from 'src/containers/TextHtml';
import Heading from 'src/containers/Heading';

import OrderInfo from './OrderInfo';
import Gateways from '../gateways';

import {
  paymentGatewaysSelector,
  currencySelector,
  defaultCurrencySelector,
} from 'src/modules/common/selectors';
import {cartSelector, cartTotalSelector} from 'src/modules/cart/selectors';
import {selectOrderPending} from 'src/modules/order/selectors';

import {checkout, updateData} from 'src/modules/checkout/actions';

import {
  paymentMethodsSelector,
  checkoutLoadingSelector,
  checkoutResultSelector,
} from 'src/modules/checkout/selectors';

import {margin, padding, borderRadius} from 'src/components/config/spacing';
import fonts, {lineHeights} from 'src/components/config/fonts';
import {changeColor, changeLineHeight} from 'src/utils/text-html';

const width = Dimensions.get('window').width;
const paymentAccept = ['cod', 'stripe', 'bacs', 'cheque', 'paypal', 'razorpay'];
const icons = {
  cod: require('src/assets/images/gateway/cod.png'),
  stripe: require('src/assets/images/gateway/stripe.png'),
  bacs: require('src/assets/images/gateway/bacs.png'),
  cheque: require('src/assets/images/gateway/cheque.png'),
  paypal: require('src/assets/images/gateway/paypal.png'),
  razorpay: require('src/assets/images/gateway/razorpay.png'),
};

const contents = {
  OrderInfo,
  Gateways,
};

const getHtml = (message, color) => {
  return `
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style type="text/css">
            body {
                color: ${color};
                font-family: ${fonts.regular.fontFamily};
                padding-left: 16px;
                padding-right: 16px;
            }
            ul {
                padding-left: 10px;
            }
            li {
                margin-bottom: 6px;
            }
        </style>
    </head>
    <body>
        ${message}
    </body>
</html>
`;
};

class PaymentMethod extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      redirect: '',
      message: '',
    };
    this.handlePayment = this.handlePayment.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePaymentProgress = this.handlePaymentProgress.bind(this);
    this.callBack = this.callBack.bind(this);
    this.processCheckout = this.processCheckout.bind(this);
    this.renderCheckoutStep = this.renderCheckoutStep.bind(this);
    this.onChangePaymentMethod = this.onChangePaymentMethod.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible && !this.props.visible) {
      this.updateMessage('');
    }
  }
  updateMessage = value => {
    this.setState({
      message: value,
    });
  };
  /**
   * Handle payment step on Modal
   */
  handlePayment() {
    if (this.flatListPayment) {
      this.flatListPayment.scrollToEnd();
    }
  }

  /**
   * Next step on modal
   */
  handleNext() {
    const {setModalVisible} = this.props;
    setModalVisible(false);
    this.handleConfirm();
  }

  /**
   * Handle progress checkout with addition data
   * @param method
   * @param data
   */
  handlePaymentProgress({method, data}) {
    const {dispatch, nextStep, setModalVisible} = this.props;
    if (method === 'stripe') {
      setModalVisible(false);
      dispatch(checkout(() => nextStep(), {stripe_source: data}));
    }
  }

  /**
   * Handle call back checkout
   * @param data
   */
  callBack(data) {
    const {nextStep, payment_method, setModalVisible} = this.props;
    if (data.result === 'success') {
      // Offline payments
      if (
        payment_method === 'cod' ||
        payment_method === 'bacs' ||
        payment_method === 'cheque'
      ) {
        // Next to success page
        setModalVisible(false);
        nextStep();
      } else {
        // Progress payment method
        this.setState(
          {
            redirect: data.redirect,
          },
          () => this.handlePayment(),
        );
      }
    } else {
      this.updateMessage(data.messages);
    }
  }

  /**
   * Progress checkout
   */
  processCheckout() {
    const {dispatch, payment_method} = this.props;
    if (payment_method === 'stripe') {
      this.handlePayment();
    } else {
      // Do with redirect payment method
      dispatch(checkout(this.callBack));
    }
  }

  /**
   * Render checkout step
   * @param item
   * @return {*}
   */
  renderCheckoutStep({item}) {
    const {
      currency,
      payment_method,
      checkoutLoading,
      redirect,
      totals,
      dataCart,
    } = this.props;
    const ContentComponent = contents[item];

    return (
      <View style={styles.tabContent}>
        <ContentComponent
          selected={payment_method}
          checkoutLoading={checkoutLoading}
          redirect={redirect}
          processCheckout={this.processCheckout}
          currency={currency}
          totals={totals}
          cart={dataCart}
          nextStep={this.handleNext}
          handlePayment={this.handlePayment}
          handlePaymentProgress={this.handlePaymentProgress}
        />
      </View>
    );
  }

  /**
   * On Change payment method
   * @param m
   */
  onChangePaymentMethod(m) {
    const method = fromJS(m);
    const {dispatch} = this.props;
    dispatch(updateData(['payment_method'], method.get('id')));
  }

  /**
   * Render Item payment method
   * @param item
   * @returns {*}
   */
  renderItem({item}) {
    const {payment_method} = this.props;
    const topElement = (
      <Image
        source={icons[item.id]}
        style={styles.image}
        resizeMode="stretch"
      />
    );
    const bottomElement = <Text medium>{item.title}</Text>;
    return (
      <ChooseItem
        key={item.id}
        item={item}
        onPress={this.onChangePaymentMethod}
        active={payment_method && item.id && item.id === payment_method}
        topElement={topElement}
        bottomElement={bottomElement}
        containerStyle={styles.item}
      />
    );
  }

  render() {
    const {
      paymentGateway,
      payment_method,
      theme,
      visible,
      setModalVisible,
    } = this.props;
    const methods = paymentGateway
      .get('data')
      .filter(
        payment =>
          payment.get('enabled') && paymentAccept.includes(payment.get('id')),
      )
      .toJS();

    const method = methods.find(m => m.id === payment_method);

    const html = getHtml(this.state.message, theme.colors.error);
    return (
      <>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {methods.map(item => this.renderItem({item}))}
        </ScrollView>
        {method ? (
          <>
            <Heading title={method.title} containerStyle={styles.headerText} />
            {method.id === 'stripe' ? (
              <Image
                source={require('src/assets/images/gateway/stripesuport.png')}
                style={{marginBottom: margin.large}}
              />
            ) : null}
            <View
              style={[
                styles.viewMethodSelect,
                {borderColor: theme.colors.support.bgColorThirdSecondary},
              ]}>
              <TextHtml
                value={method.description}
                style={merge(
                  changeColor(theme.colors.textColorSecondary),
                  changeLineHeight(lineHeights.h4),
                )}
              />
            </View>
          </>
        ) : null}
        <Modal
          visible={visible}
          setModalVisible={setModalVisible}
          ratioHeight={0.9}>
          {this.state.message ? (
            <WebView
              originWhitelist={['*']}
              source={{html}}
              style={styles.webView}
            />
          ) : (
            <FlatList
              data={['OrderInfo', 'Gateways']}
              horizontal
              pagingEnabled
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              ref={ref => {
                this.flatListPayment = ref;
              }}
              keyExtractor={item => item}
              renderItem={this.renderCheckoutStep}
            />
          )}
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    paddingTop: 41,
    paddingBottom: padding.large,
  },
  item: {
    marginRight: margin.base,
  },
  image: {
    height: 30,
    marginTop: 4,
    marginBottom: 6,
  },
  tabContent: {
    flex: 1,
    width: width,
  },
  viewMethodSelect: {
    padding: padding.big - 2,
    borderWidth: 1,
    borderRadius: borderRadius.large,
  },
  webView: {
    backgroundColor: 'transparent',
  },
});

const mapStateToProps = state => ({
  currency: currencySelector(state),
  defaultCurrency: defaultCurrencySelector(state),
  paymentGateway: paymentGatewaysSelector(state),
  pending: selectOrderPending(state),

  payment_method: paymentMethodsSelector(state),
  checkoutLoading: checkoutLoadingSelector(state),
  result: checkoutResultSelector(state),

  dataCart: cartSelector(state).toJS(),
  totals: cartTotalSelector(state).toJS(),
});

export default compose(
  withTheme,
  withTranslation(),
  connect(mapStateToProps),
)(PaymentMethod);
