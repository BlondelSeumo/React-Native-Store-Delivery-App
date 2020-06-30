import React from 'react';

import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {withTheme, Avatar} from 'src/components';

import {padding, margin, borderRadius} from 'src/components/config/spacing';

const ChooseItem = function(props) {
  const {
    active,
    topElement,
    bottomElement,
    containerStyle,
    style,
    theme,
    onPress,
    item,
  } = props;
  const {colors} = theme;
  const borderColor = colors.support.bgColorThirdSecondary;
  const borderColorSelect = colors.primary;

  const borderContent = active ? borderColorSelect : borderColor;
  const borderContentSub = active ? borderColorSelect : 'transparent';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.viewContent,
          {
            borderColor: borderContent,
          },
          containerStyle && containerStyle,
        ]}>
        <TouchableOpacity
          style={[
            styles.touchView,
            {
              backgroundColor: active ? colors.bgColorSelect : colors.bgColor,
              borderColor: borderContentSub,
            },
            style && style,
          ]}
          onPress={() => onPress(item)}>
          <View style={styles.top}>{topElement}</View>
          <View style={styles.bottom}>{bottomElement}</View>
          {active ? (
            <Avatar
              rounded
              icon={{
                name: 'check',
                size: 12,
                color: theme.colors.bgColor,
              }}
              size={20}
              containerStyle={styles.icon}
              overlayContainerStyle={{
                backgroundColor: colors.primary,
              }}
            />
          ) : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  viewContent: {
    borderRadius: borderRadius.base,
    borderWidth: 1,
    zIndex: 2,
    marginVertical: margin.base,
  },
  touchView: {
    paddingHorizontal: padding.large,
    paddingVertical: padding.small,
    borderWidth: 1,
    borderRadius: borderRadius.base - 1,
    minWidth: 150,
    zIndex: 2,
  },
  icon: {
    position: 'absolute',
    right: -10,
    top: -10,
  },
});

ChooseItem.defaultProps = {
  active: false,
  onPress: () => {},
};

export default withTheme(ChooseItem);
