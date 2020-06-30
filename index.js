/**
 *
 * Lekima - Store Delivery Full React Native Application for Wordpress Woocomerce.
 *
 * @author rnlab
 * @package rn_lekima
 * @format
 */

import 'react-native-gesture-handler';

import {AppRegistry, YellowBox} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

YellowBox.ignoreWarnings([""]);

AppRegistry.registerComponent(appName, () => App);
