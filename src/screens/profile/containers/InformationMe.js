import React from 'react';
import {useTranslation} from 'react-i18next';

import {StyleSheet} from 'react-native';
import {Text, ListItem, ThemeConsumer} from 'src/components';

import {margin, padding} from 'src/components/config/spacing';
import {mainStack} from 'src/config/navigator';

const InformationMe = ({isLogin, clickPage}) => {
  const {t} = useTranslation();
  if (!isLogin) {
    return null;
  }
  const textTitleProps = {
    medium: true,
  };

  return (
    <ThemeConsumer>
      {({theme}) => (
        <>
          <Text medium style={styles.title} colorFourth>
            {t('profile:text_title_information')}
          </Text>
          <ListItem
            leftIcon={{
              name: 'account',
              type: 'material-community',
              color: theme.colors.textColorFourth,
              size: 22,
            }}
            title={t('common:text_account')}
            type="underline"
            titleProps={textTitleProps}
            chevron
            pad={padding.large}
            onPress={() => clickPage(mainStack.account)}
          />
          <ListItem
            leftIcon={{
              name: 'file-document-box',
              type: 'material-community',
              color: theme.colors.textColorFourth,
              size: 22,
            }}
            title={t('common:text_orders')}
            type="underline"
            titleProps={textTitleProps}
            chevron
            pad={padding.large}
            onPress={() => clickPage(mainStack.order_list)}
          />
        </>
      )}
    </ThemeConsumer>
  );
};
const styles = StyleSheet.create({
  title: {
    marginTop: margin.big + 4,
    marginBottom: margin.small,
  },
  itemEnd: {
    borderBottomWidth: 0,
  },
});

InformationMe.defaultProps = {
  isLogin: false,
  clickPage: () => {},
};
export default InformationMe;
