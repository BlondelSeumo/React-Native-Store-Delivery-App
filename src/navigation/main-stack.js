import React from 'react';

import {mainStack} from 'src/config/navigator';

import {createStackNavigator} from '@react-navigation/stack';

import HomeTabs from './home-tabs';
import Products from 'src/screens/shop/products';
import Product from 'src/screens/shop/product';
import ProductReview from 'src/screens/shop/product-review';
import ProductReviewForm from 'src/screens/shop/product-review-form';
import Search from 'src/screens/shop/search';

import Stores from 'src/screens/shop/stores';
import StoreDetail from 'src/screens/shop/store-detail';
import StoreInfo from 'src/screens/shop/store-info';

import Refine from 'src/screens/shop/refine';
import FilterAttribute from 'src/screens/shop/filter-attribute';
import FilterCategory from 'src/screens/shop/filter-category';
import FilterPrice from 'src/screens/shop/filter-price';

import PrivacyScreen from 'src/screens/profile/privacy';
import TermScreen from 'src/screens/profile/term';
import ContactScreen from 'src/screens/profile/contact';
import AboutScreen from 'src/screens/profile/about';

import Blogs from 'src/screens/blog/blogs';
import Blog from 'src/screens/blog/blog';

import LinkingWebview from 'src/screens/linking-webview';
import Checkout from 'src/screens/cart/checkout';
import WeViewCheckout from 'src/screens/cart/webview-checkout';
import WeViewPayment from 'src/screens/cart/webview-payment';
import WeViewThankYou from 'src/screens/cart/webview-thankyou';

import SettingScreen from 'src/screens/profile/setting';
import HelpScreen from 'src/screens/profile/help';
import AccountScreen from 'src/screens/profile/account';
import ChangePasswordScreen from 'src/screens/profile/change-password';
import AddressBookScreen from 'src/screens/profile/address-book';
import OrderList from 'src/screens/profile/orders';
import OrderDetail from 'src/screens/profile/order';
import DemoConfig from 'src/screens/profile/demo-config';
import EditAccount from 'src/screens/profile/edit-account';
import SelectAddress from 'src/screens/profile/select-address';
import PageScreen from 'src/screens/profile/Page';

import Wishlist from 'src/screens/wishlist';

const Stack = createStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName={mainStack.home_tab}
      screenOptions={{gestureEnabled: false}}>
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.home_tab}
        component={HomeTabs}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.products}
        component={Products}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.product}
        component={Product}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.product_review}
        component={ProductReview}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.product_review_form}
        component={ProductReviewForm}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.search}
        component={Search}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.privacy}
        component={PrivacyScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.term}
        component={TermScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.contact}
        component={ContactScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.page}
        component={PageScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.about}
        component={AboutScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.linking_webview}
        component={LinkingWebview}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.stores}
        component={Stores}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.store_detail}
        component={StoreDetail}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.store_info}
        component={StoreInfo}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.blogs}
        component={Blogs}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.blog_detail}
        component={Blog}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.refine}
        component={Refine}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.filter_attribute}
        component={FilterAttribute}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.filter_category}
        component={FilterCategory}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.filter_price}
        component={FilterPrice}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.checkout}
        component={Checkout}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.webview_checkout}
        component={WeViewCheckout}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.webview_payment}
        component={WeViewPayment}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.webview_thank_you}
        component={WeViewThankYou}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.setting}
        component={SettingScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.help}
        component={HelpScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.account}
        component={AccountScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.change_password}
        component={ChangePasswordScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.address_book}
        component={AddressBookScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.order_list}
        component={OrderList}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.order_detail}
        component={OrderDetail}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.demo_config}
        component={DemoConfig}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.edit_account}
        component={EditAccount}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.select_address}
        component={SelectAddress}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={mainStack.wish_list}
        component={Wishlist}
      />
    </Stack.Navigator>
  );
}

export default MainStack;
