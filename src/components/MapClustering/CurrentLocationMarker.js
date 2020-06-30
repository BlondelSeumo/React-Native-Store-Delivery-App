import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CurrentLocationMarker: React.FunctionComponent = React.memo(
  ({marker, onPressMaker}) => {
    return (
      <TouchableOpacity activeOpacity={0.5}>
        <Icon size={34} name={'place'} color={'#e60023'} />
      </TouchableOpacity>
    );
  },
);

export default CurrentLocationMarker;
