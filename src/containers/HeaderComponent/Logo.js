import React from 'react';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {TouchableOpacity, Image} from 'react-native';

import {listImageSelector} from 'src/modules/common/selectors';
import {homeDrawer, homeTabs} from 'src/config/navigator';

const Logo = ({images, ...rest}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(homeTabs.home_drawer, {screen: homeDrawer.home})
      }>
      <Image source={images.logo} resizeMode="stretch" {...rest} />
    </TouchableOpacity>
  );
};

const mapStateToProps = state => {
  return {
    images: listImageSelector(state),
  };
};

export default connect(mapStateToProps)(Logo);
