import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {ThemedView, Header} from 'src/components';
import {IconHeader, TextHeader} from 'src/containers/HeaderComponent';

class LinkingWebview extends React.Component {
  render() {
    const {t, route} = this.props;
    const url = route?.params?.url ?? '';

    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={t('common:text_link_webview')} />}
        />
        {url ? <WebView source={{uri: url}} style={styles.webView} /> : null}
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  webView: {
    backgroundColor: 'transparent',
  },
});
export default function(props) {
  const {t} = useTranslation();
  return <LinkingWebview t={t} {...props} />;
}
