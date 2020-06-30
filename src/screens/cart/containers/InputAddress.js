import React from 'react';
import {withNavigation} from '@react-navigation/compat';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, Icon} from 'src/components';
import Label, {MIN_HEIGHT} from 'src/containers/ViewLabel';
import {mainStack} from 'src/config/navigator';
import {margin} from 'src/components/config/spacing';

class InputAddress extends React.Component {
  constructor(props) {
    const {value} = props;
    super(props);
    this.state = {
      isHeading: value ? true : false,
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.updateHeading(this.props.value ? true : false);
    }
  }
  updateHeading = isHeading => {
    this.setState({
      isHeading,
    });
  };
  onGoBack(value) {
    if (value?.formatted_address) {
      this.props.onChangeText(value.formatted_address);
    }
  }

  render() {
    const {label, error, value, navigation} = this.props;
    const {isHeading} = this.state;
    return (
      <Label label={label} error={error} isHeading={isHeading}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(mainStack.select_address, {
              onGoBack: text => this.onGoBack(text),
            })
          }
          style={styles.touch}>
          {value ? (
            <Text numberOfLines={1} medium style={styles.text}>
              {value}
            </Text>
          ) : (
            <View style={styles.text} />
          )}
          <Icon
            name="chevron-right"
            type="material"
            size={24}
            isRotateRTL
            containerStyle={styles.icon}
          />
        </TouchableOpacity>
      </Label>
    );
  }
}

const styles = StyleSheet.create({
  touch: {
    height: MIN_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    marginLeft: margin.large,
  },
  icon: {
    marginHorizontal: margin.small,
  },
});

InputAddress.defaultProps = {
  label: 'Address',
};

export default withNavigation(InputAddress);
