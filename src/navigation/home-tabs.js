import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeDrawer from './home-drawer';
import Me from 'src/screens/profile/me';
import Cart from 'src/screens/cart/cart';
import Category from 'src/screens/shop/category';
import MapExplorer from 'src/screens/map-explorer';
import Tabbar from 'src/containers/Tabbar';

import {homeTabs} from 'src/config/navigator';

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator tabBar={props => <Tabbar {...props} />}>
      <Tab.Screen name={homeTabs.home_drawer} component={HomeDrawer} />
      <Tab.Screen name={homeTabs.explorer} component={MapExplorer} />
      <Tab.Screen name={homeTabs.cart} component={Cart} />
      <Tab.Screen name={homeTabs.shop} component={Category} />
      <Tab.Screen name={homeTabs.me} component={Me} />
    </Tab.Navigator>
  );
}
