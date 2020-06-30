import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

import {Divider, Avatar, withTheme} from 'src/components';

import {white} from 'src/components/config/colors';
import {margin} from 'src/components/config/spacing';

class Step extends Component {
  render() {
    const {item, active, visit, theme} = this.props;
    const borderColor = active
      ? theme.colors.primary
      : theme.colors.support.borderThirdText;
    const bgColor = active ? theme.colors.primary : 'transparent';
    return (
      <View style={styles.container}>
        {visit !== 'start' && (
          <View style={styles.viewLine}>
            <Divider
              style={[
                styles.line,
                {
                  borderColor: theme.colors.support.borderThirdText,
                },
              ]}
            />
          </View>
        )}
        <View style={styles.icon}>
          <Avatar
            rounded
            size={40}
            icon={{
              name: item.icon,
              type: 'material',
              size: 20,
              color: active ? white : theme.colors.support.colorThirdText,
            }}
            overlayContainerStyle={[
              styles.iconContainer,
              {
                backgroundColor: bgColor,
                borderColor: borderColor,
              },
            ]}
            containerStyle={visit === 'middle' && styles.icon}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewLine: {
    flex: 1,
    height: 1,
    overflow: 'hidden',
    marginHorizontal: margin.small,
  },
  line: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 1,
  },
  icon: {
    marginHorizontal: margin.base - margin.small,
  },
  iconContainer: {
    borderWidth: 1,
  },
});

Step.defaultProps = {
  visit: 'start',
};

export default withTheme(Step);
