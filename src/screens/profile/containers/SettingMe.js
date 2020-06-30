import React from 'react';
import {useTranslation} from 'react-i18next';

import {StyleSheet} from 'react-native';
import {Text, ListItem, Badge, ThemeConsumer} from 'src/components';

import {margin, padding} from 'src/components/config/spacing';
import {mainStack} from 'src/config/navigator';
import {connect} from 'react-redux';
import {signOut} from 'src/modules/auth/actions';
import {wishListSelector} from 'src/modules/common/selectors';

const SettingMe = ({
  isLogin,
  wishList,
  phonenumber,
  clickPage,
  goPhone,
  handleSignOut,
}) => {
  const {t} = useTranslation();
  const textTitleProps = {
    medium: true,
  };
  return (
    <ThemeConsumer>
      {({theme}) => (
        <>
          <Text medium style={styles.title} colorFourth>
            {t('profile:text_title_setting')}
          </Text>
          <ListItem
            leftIcon={{
              name: 'heart',
              type: 'material-community',
              color: theme.colors.textColorFourth,
              size: 22,
            }}
            title={t('common:text_wishList')}
            type="underline"
            titleProps={textTitleProps}
            pad={padding.large}
            rightElement={
              <Badge
                value={wishList.size}
                badgeStyle={styles.badge}
                textStyle={styles.textBadge}
              />
            }
            onPress={() => clickPage(mainStack.wish_list)}
          />
          <ListItem
            leftIcon={{
              name: 'settings',
              type: 'material-community',
              color: theme.colors.textColorFourth,
              size: 22,
            }}
            title={t('common:text_setting')}
            type="underline"
            titleProps={textTitleProps}
            pad={padding.large}
            chevron
            onPress={() => clickPage(mainStack.setting)}
          />
          <ListItem
            leftIcon={{
              name: 'help-circle',
              type: 'material-community',
              color: theme.colors.textColorFourth,
              size: 22,
            }}
            title={t('common:text_help_info')}
            type="underline"
            titleProps={textTitleProps}
            chevron
            pad={padding.large}
            onPress={() => clickPage(mainStack.help)}
          />
          <ListItem
            leftIcon={{
              name: 'phone',
              type: 'material-community',
              color: theme.colors.textColorFourth,
              size: 22,
            }}
            title={t('profile:text_hotline')}
            rightElement={
              <Text colorThird style={styles.phone}>
                {phonenumber}
              </Text>
            }
            type="underline"
            titleProps={textTitleProps}
            pad={padding.large}
            containerStyle={!isLogin && styles.itemEnd}
            onPress={() => goPhone(`tel:${phonenumber}`)}
          />
          {isLogin && (
            <ListItem
              leftIcon={{
                name: 'logout-variant',
                type: 'material-community',
                color: theme.colors.textColorFourth,
                size: 22,
              }}
              title={t('profile:text_signout')}
              type="underline"
              titleProps={textTitleProps}
              pad={padding.large}
              containerStyle={styles.itemEnd}
              onPress={handleSignOut}
            />
          )}
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
  phone: {
    marginHorizontal: margin.small / 2,
  },
  itemEnd: {
    borderBottomWidth: 0,
  },
  badge: {
    height: 20,
    minWidth: 20,
    borderRadius: 10,
  },
  textBadge: {
    fontSize: 9,
  },
});

SettingMe.defaultProps = {
  isLogin: false,
  phonenumber: '',
  clickPage: () => {},
  goPhone: () => {},
};
const mapStateToProps = state => ({
  wishList: wishListSelector(state),
});
const mapDispatchToProps = {
  handleSignOut: signOut,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingMe);
