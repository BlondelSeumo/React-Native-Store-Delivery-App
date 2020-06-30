import React from 'react';
import {StyleSheet, View, Animated} from 'react-native';
import {Text, ThemeConsumer} from 'src/components';
import {margin, padding, borderRadius} from 'src/components/config/spacing';
import fonts, {sizes, lineHeights} from 'src/components/config/fonts';

const MIN_HEIGHT = 46;
const TOP = 8;
const BOTTOM = margin.base - 8;

class ViewLabel extends React.Component {
  UNSAFE_componentWillMount() {
    this._animatedIsFocused = new Animated.Value(this.props.isHeading ? 1 : 0);
  }
  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.props.isHeading ? 1 : 0,
      duration: 120,
      useNativeDriver: false,
    }).start();
  }

  render() {
    const {label, error, children} = this.props;
    const paddingHorizontal = padding.large - margin.small;
    const topCenter = (MIN_HEIGHT - lineHeights.base) / 2;
    return (
      <ThemeConsumer>
        {({theme}) => {
          const {colors} = theme;
          const labelStyle = {
            position: 'absolute',
            left: 0,
            top: this._animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: [topCenter, -TOP],
            }),
            ...fonts.regular,
            fontSize: this._animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: [sizes.base, 10],
            }),
            lineHeight: this._animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: [lineHeights.base, 15],
            }),
            color: this._animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: [colors.textColorThird, colors.textColor],
            }),
            zIndex: this._animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 9999],
            }),
            backgroundColor: colors.bgColor,
            paddingHorizontal: paddingHorizontal,
            marginHorizontal: margin.small,
          };
          return (
            <>
              <View
                style={[
                  styles.container,
                  {
                    borderColor: colors.border,
                  },
                ]}>
                {typeof label === 'string' ? (
                  <Animated.Text style={labelStyle} numberOfLines={1}>
                    {label}
                  </Animated.Text>
                ) : null}
                {children}
              </View>
              {typeof error === 'string' ? (
                <Text
                  style={[
                    styles.textError,
                    {
                      color: colors.error,
                    },
                  ]}>
                  {error}
                </Text>
              ) : null}
            </>
          );
        }}
      </ThemeConsumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: MIN_HEIGHT,
    borderWidth: 1,
    borderRadius: borderRadius.base,
    marginTop: TOP,
    marginBottom: BOTTOM,
  },
  textError: {
    fontSize: 10,
    lineHeight: 15,
    marginBottom: BOTTOM,
  },
});

ViewLabel.defaultProps = {
  isHeading: false,
  visit: 'center',
};

export default ViewLabel;
export {MIN_HEIGHT};
