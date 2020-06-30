import React from 'react';

import {useTranslation} from 'react-i18next';
import {Header, ThemeConsumer, ThemedView} from 'src/components';

import {IconHeader, CartIcon, TextHeader} from 'src/containers/HeaderComponent';
import ContainerPrivacy from './containers/ContainerPrivacy';

class SettingScreen extends React.Component {
  render() {
    const {t} = this.props;
    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={t('common:text_privacy')} />}
          rightComponent={<CartIcon />}
        />
        <ContainerPrivacy />
      </ThemedView>
    );
  }
}
export default function(props) {
  const {t} = useTranslation();
  return (
    <ThemeConsumer>
      {({theme}) => <SettingScreen {...props} t={t} theme={theme} />}
    </ThemeConsumer>
  );
}
