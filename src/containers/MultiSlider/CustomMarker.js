import React from 'react';

import {View} from 'react-native';
import {withTheme, Text} from 'src/components';

import {white} from 'src/components/config/colors';
import {padding, borderRadius} from 'src/components/config/spacing';

const WIDTH_CIRCLE = 19;
const WIDTH_PREFIX = 70;
const SIZE_TRIANGLE = 7;

class CustomMarker extends React.Component {
  render() {
    const {theme, value, renderMarker} = this.props;
    const valueMarker = renderMarker ? renderMarker(value) : value;
    return (
      <View style={styles.container}>
        <View style={styles.c(theme.colors.bgColor, theme.colors.textColor)}>
          <View style={styles.c_small(theme.colors.textColor)} />
        </View>
        <View style={styles.prefix}>
          <View style={styles.viewPrice(theme.colors.primary)}>
            <Text h6 medium style={styles.textValue}>
              {valueMarker}
            </Text>
          </View>
          <View style={styles.triangle(theme.colors.primary)} />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    position: 'relative',
  },
  c: (bg, border) => ({
    width: WIDTH_CIRCLE,
    height: WIDTH_CIRCLE,
    borderRadius: WIDTH_CIRCLE / 2,
    backgroundColor: bg,
    borderWidth: 1,
    borderColor: border,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  c_small: bg => ({
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: bg,
  }),
  prefix: {
    position: 'absolute',
    top: -50,
    left: -(WIDTH_PREFIX - WIDTH_CIRCLE) / 2,
    alignItems: 'center',
  },
  viewPrice: bg => ({
    minHeight: 30,
    width: WIDTH_PREFIX,
    padding: padding.small - 2,
    backgroundColor: bg,
    borderRadius: borderRadius.small,
    alignItems: 'center',
  }),
  triangle: border => ({
    width: 0,
    height: 0,
    borderTopWidth: SIZE_TRIANGLE,
    borderLeftWidth: SIZE_TRIANGLE,
    borderRightWidth: SIZE_TRIANGLE,
    borderTopColor: border,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  }),
  textValue: {
    color: white,
    textAlign: 'center',
  },
};

export default withTheme(CustomMarker);
