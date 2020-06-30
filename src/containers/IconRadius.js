import React from 'react';
import {View} from 'react-native';
import {Icon, withTheme} from 'src/components';

const IconRadius = props => {
  const {type, isSelect, color, colorSelect, theme} = props;

  const regularColor = color || theme.colors.textColorFourth;
  const selectColor = colorSelect || theme.colors.primary;
  const colorSet = isSelect ? selectColor : regularColor;

  if (type === 'select') {
    return (
      <View
        style={[
          styles.container(colorSet),
          styles.containerBoxed,
          isSelect && styles.containerBoxedSelect(selectColor),
        ]}>
        {isSelect ? (
          <Icon name={'check'} color={theme.colors.bgColor} size={10} />
        ) : null}
      </View>
    );
  }
  return (
    <View style={[styles.container(colorSet), styles.containerRadius]}>
      <View style={styles.radiusDot(colorSet)} />
    </View>
  );
};

const styles = {
  container: color => ({
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: color,
  }),
  containerBoxed: {
    borderWidth: 2,
    borderRadius: 3,
  },
  containerBoxedSelect: colorSelect => ({
    backgroundColor: colorSelect,
  }),
  containerRadius: {
    borderWidth: 1,
    borderRadius: 9,
  },
  radiusDot: color => ({
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color,
  }),
};

IconRadius.defaultProps = {};

export default withTheme(IconRadius);
