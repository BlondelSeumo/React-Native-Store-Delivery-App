import React, {Component} from 'react';

import OneSignal from 'react-native-onesignal';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppRouter from './AppRouter';
import NavigationService from 'src/utils/navigation';

import configureStore from './config-store';
import {getDemoSelector} from './modules/common/selectors';
import {tokenSelector} from './modules/auth/selectors';
import demoConfig from './utils/demo';
import globalConfig from './utils/global';
import {APP_ID} from './config/onesignal';

const {store, persistor} = configureStore();

import './config-i18n';

class App extends Component {
  componentDidMount() {
    OneSignal.init(APP_ID);

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);

    store.subscribe(() => {
      const state = store.getState();
      demoConfig.setData(getDemoSelector(state).toJS());
      globalConfig.setToken(tokenSelector(state));
    });
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
  }

  render() {
    return (
      <NavigationContainer
        ref={navigationRef =>
          NavigationService.setTopLevelNavigator(navigationRef)
        }>
        <SafeAreaProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <AppRouter />
            </PersistGate>
          </Provider>
        </SafeAreaProvider>
      </NavigationContainer>
    );
  }
}

export default App;
