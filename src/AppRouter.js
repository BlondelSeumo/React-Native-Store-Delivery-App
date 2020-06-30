import React from 'react';
import {StatusBar} from 'react-native';

import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {compose} from 'redux';
import FlashMessage from 'react-native-flash-message';
import {ThemeProvider} from 'src/components';
import {getThemeLight, darkColors} from 'src/components/config/theme';
import Router from 'src/navigation/root-switch';

import {
  themeSelector,
  colorsSelector,
  languageSelector,
  loadingSelector,
} from './modules/common/selectors';
import {
  userIdSelector
} from './modules/auth/selectors';

import './config-i18n';
import OneSignal from "react-native-onesignal";
import {APP_ID} from "./config/onesignal";

class AppRouter extends React.Component {

  componentDidMount() {
    OneSignal.init(APP_ID);
    const {userId} = this.props;
    if (userId) {
      OneSignal.sendTag("user_id", userId);
    }
  }

  render() {
    const {theme, colors, language, i18n} = this.props;

    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }

    const themeColor = theme === 'light' ? getThemeLight(colors) : darkColors;
    const barStyle = theme === 'light' ? 'dark-content' : 'light-content';

    return (
      <ThemeProvider theme={themeColor}>
        <StatusBar
          translucent
          barStyle={barStyle}
          backgroundColor="transparent"
        />
        <Router/>
        <FlashMessage position="top"/>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    language: languageSelector(state),
    theme: themeSelector(state),
    colors: colorsSelector(state),
    loading: loadingSelector(state),
    userId: userIdSelector(state),
  };
};

export default compose(
  withTranslation(),
  connect(mapStateToProps),
)(AppRouter);
