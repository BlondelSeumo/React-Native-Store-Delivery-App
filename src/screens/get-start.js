import React from 'react';

import {connect} from 'react-redux';
import {StatusBar} from 'react-native';
import {ThemedView} from 'src/components';
import GetStartSwiper from 'src/containers/GetStartSwiper';

import {closeGettingStarted} from 'src/modules/common/actions';
import {routerMainSelector} from 'src/modules/common/selectors';

class GetStartScreen extends React.Component {
  handleGettingStarted = () => {
    const {navigation, router} = this.props;
    navigation.navigate(router);
  };

  render() {
    return (
      <ThemedView isFullView>
        <StatusBar hidden />
        <GetStartSwiper handleGettingStarted={this.handleGettingStarted} />
      </ThemedView>
    );
  }
}

const mapStateToProps = state => {
  return {
    router: routerMainSelector(state),
  };
};

const mapDispatchToProps = {
  handleCloseGettingStarted: closeGettingStarted,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GetStartScreen);
