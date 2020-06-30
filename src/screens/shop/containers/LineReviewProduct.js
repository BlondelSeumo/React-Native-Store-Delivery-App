import React from 'react';
import {View} from 'react-native';
import {withTheme, ThemeConsumer} from 'src/components';

const HEIGHT = 6;

const Line = ({value, total}) => {
  const setTotal = total !== 0 ? total : value === 0 ? 1 : value;
  return (
    <ThemeConsumer>
      {({theme}) => (
        <View style={styles.container(theme)}>
          <View style={styles.line(theme, value / setTotal)} />
        </View>
      )}
    </ThemeConsumer>
  );
};

const styles = {
  container: theme => ({
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    flexDirection: 'row',
    backgroundColor: theme.colors.bgColorSecondary,
    overflow: 'hidden',
    opacity: 0.8,
  }),
  line: (theme, flex) => ({
    height: '100%',
    backgroundColor: theme.colors.textColor,
    flex: flex,
    borderRadius: HEIGHT / 2,
  }),
};
Line.defaultProps = {
  value: 0,
  total: 1,
};

export default withTheme(Line);
