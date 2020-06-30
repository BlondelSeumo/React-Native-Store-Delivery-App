import React, {Component} from 'react';

import {useTranslation} from 'react-i18next';
import {Header, ThemeConsumer, ThemedView} from 'src/components';

import {IconHeader, CartIcon, TextHeader} from 'src/containers/HeaderComponent';
import ContainerTerm from './containers/ContainerTerm';

class TermScreen extends Component {
  render() {
    const {t} = this.props;
    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={t('profile:text_term')} />}
          rightComponent={<CartIcon />}
        />
        <ContainerTerm />
      </ThemedView>
    );
  }
}
export default function(props) {
  const {t} = useTranslation();
  return (
    <ThemeConsumer>
      {({theme}) => <TermScreen {...props} t={t} theme={theme} />}
    </ThemeConsumer>
  );
}
