import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  View,
  Text as TextRN,
  TouchableNativeFeedback,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';

import {withTheme, ViewPropTypes} from 'src/components/config';
import {
  renderNode,
  nodeType,
  conditionalStyle,
  color as Color,
} from '../helpers';
import Icon from '../icons/Icon';
import Text from '../text/Text';

const defaultLoadingProps = (type, textColor) => ({
  color: textColor,
  size: 'small',
});

class Button extends Component {
  componentDidMount() {
    const {linearGradientProps, ViewComponent} = this.props;
    if (linearGradientProps && !global.Expo && !ViewComponent) {
      console.error(
        "You need to pass a ViewComponent to use linearGradientProps !\nExample: ViewComponent={require('react-native-linear-gradient')}",
      );
    }
  }

  render() {
    const {
      TouchableComponent,
      containerStyle,
      onPress,
      buttonStyle,
      type,
      size,
      loading,
      loadingStyle,
      loadingProps: passedLoadingProps,
      title,
      titleProps,
      titleStyle,
      icon,
      iconContainerStyle,
      iconRight,
      disabled,
      disabledStyle,
      disabledTitleStyle,
      secondary,
      raised,
      linearGradientProps,
      ViewComponent = !disabled && linearGradientProps && global.Expo
        ? global.Expo.LinearGradient
        : View,
      theme,
      color,
      colorSecondary,
      ...attributes
    } = this.props;

    if (
      Platform.OS === 'android' &&
      buttonStyle.borderRadius &&
      !attributes.background
    ) {
      if (Platform.Version >= 21) {
        attributes.background = TouchableNativeFeedback.Ripple(
          'ThemeAttrAndroid',
          false,
        );
      } else {
        attributes.background = TouchableNativeFeedback.SelectableBackground();
      }
    }

    const bgColor = secondary
      ? theme.colors.bgColorSecondary
      : theme.colors.primary;
    const textColor =
      type !== 'solid' ? bgColor : secondary ? colorSecondary : color;

    const loadingProps = {
      ...defaultLoadingProps(type, textColor),
      ...passedLoadingProps,
    };
    const textProps =
      size === 'small'
        ? {
            h6: true,
            medium: false,
            ...titleProps,
          }
        : titleProps;

    const buttonClick =
      onPress && !loading ? onPress : () => console.log('Loading...');
    return (
      <View
        style={StyleSheet.flatten([
          styles.container,
          {
            borderRadius:
              buttonStyle.borderRadius || styles.container.borderRadius,
          },
          containerStyle,
          raised && !disabled && styles.raised(type),
        ])}>
        <TouchableComponent
          onPress={buttonClick}
          activeOpacity={0.3}
          disabled={disabled}
          {...attributes}>
          <ViewComponent
            {...linearGradientProps}
            style={StyleSheet.flatten([
              styles.button(type, size, bgColor),
              buttonStyle,
              disabled && styles.disabled(type, theme),
              disabled && disabledStyle,
            ])}>
            {loading && (
              <ActivityIndicator
                style={StyleSheet.flatten([styles.loading, loadingStyle])}
                color={loadingProps.color}
                size={loadingProps.size}
                {...loadingProps}
              />
            )}

            {!loading &&
              icon &&
              !iconRight &&
              renderNode(Icon, icon, {
                containerStyle: StyleSheet.flatten([
                  styles.iconContainer,
                  iconContainerStyle,
                ]),
              })}

            {!loading && !!title && (
              <Text
                style={StyleSheet.flatten([
                  styles.title(textColor),
                  titleStyle,
                  disabled && styles.disabledTitle(theme),
                  disabled && disabledTitleStyle,
                ])}
                medium
                {...textProps}>
                {title}
              </Text>
            )}

            {!loading &&
              icon &&
              iconRight &&
              renderNode(Icon, icon, {
                containerStyle: StyleSheet.flatten([
                  styles.iconContainer,
                  iconContainerStyle,
                ]),
              })}
          </ViewComponent>
        </TouchableComponent>
      </View>
    );
  }
}

Button.propTypes = {
  title: PropTypes.string,
  titleStyle: TextRN.propTypes.style,
  titleProps: PropTypes.object,
  buttonStyle: ViewPropTypes.style,
  type: PropTypes.oneOf(['solid', 'clear', 'outline']),
  size: PropTypes.oneOf(['big', 'small']),
  loading: PropTypes.bool,
  loadingStyle: ViewPropTypes.style,
  loadingProps: PropTypes.object,
  onPress: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  icon: nodeType,
  iconContainerStyle: ViewPropTypes.style,
  iconRight: PropTypes.bool,
  linearGradientProps: PropTypes.object,
  TouchableComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  ViewComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  disabled: PropTypes.bool,
  disabledStyle: ViewPropTypes.style,
  disabledTitleStyle: TextRN.propTypes.style,
  raised: PropTypes.bool,
  theme: PropTypes.object,
  secondary: PropTypes.bool,
};

Button.defaultProps = {
  title: '',
  iconRight: false,
  TouchableComponent: Platform.select({
    android: TouchableNativeFeedback,
    default: TouchableOpacity,
  }),
  onPress: () => console.log('Please attach a method to this component'),
  type: 'solid',
  size: 'big',
  buttonStyle: {
    borderRadius: 3,
  },
  disabled: false,
  raised: false,
  loading: false,
  secondary: false,
};

const styles = {
  button: (type, size, bgColor) => ({
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    backgroundColor: type === 'solid' ? bgColor : 'transparent',
    minHeight: size === 'small' ? 34 : 46,
    paddingHorizontal: 12,
    borderWidth: type !== 'clear' ? 1 : 0,
    borderColor: bgColor,
  }),
  container: {},
  disabled: (type, theme) => ({
    ...conditionalStyle(type === 'solid', {
      backgroundColor: theme.colors.disabled,
    }),
    ...conditionalStyle(type !== 'clear', {
      borderColor: theme.colors.disabled,
    }),
  }),
  disabledTitle: theme => ({
    color: Color(theme.colors.disabled).darken(0.3),
  }),
  title: textColor => ({
    color: textColor,
    textAlign: 'center',
  }),
  iconContainer: {
    marginHorizontal: 5,
  },
  raised: type =>
    type !== 'clear' && {
      backgroundColor: '#fff',
      ...Platform.select({
        android: {
          elevation: 4,
        },
        default: {
          shadowColor: 'rgba(0,0,0, .4)',
          shadowOffset: {height: 1, width: 1},
          shadowOpacity: 1,
          shadowRadius: 1,
        },
      }),
    },
  loading: {
    marginVertical: 2,
  },
};

export {Button};
export default withTheme(Button, 'Button');
