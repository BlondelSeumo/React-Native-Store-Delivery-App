import React from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {Header, ListItem, ThemedView} from 'src/components';
import Container from 'src/containers/Container';
import {TextHeader, IconHeader, CartIcon} from 'src/containers/HeaderComponent';

import {mainStack} from 'src/config/navigator';
import {signOut} from 'src/modules/auth/actions';

class AccountScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  handleLogout = () => {
    this.props.signOut();
    this.props.navigation.goBack();
  };

  render() {
    const {navigation, t} = this.props;
    const titleProps = {
      medium: true,
    };
    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={t('common:text_account')} />}
          rightComponent={<CartIcon />}
        />
        <Container>
          <ListItem
            title={t('profile:text_edit_account')}
            titleProps={titleProps}
            chevron
            type="underline"
            onPress={() => navigation.navigate(mainStack.edit_account)}
          />
          <ListItem
            title={t('profile:text_password')}
            titleProps={titleProps}
            chevron
            type="underline"
            onPress={() => navigation.navigate(mainStack.change_password)}
          />
          <ListItem
            title={t('profile:text_address')}
            titleProps={titleProps}
            chevron
            type="underline"
            onPress={() => navigation.navigate(mainStack.address_book)}
          />
          <ListItem
            title={t('profile:text_signout')}
            titleProps={titleProps}
            type="underline"
            onPress={this.handleLogout}
          />
        </Container>
      </ThemedView>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(signOut()),
});

export default connect(
  null,
  mapDispatchToProps,
)(withTranslation()(AccountScreen));
