import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View} from 'react-native';
import {Icon, withTheme} from 'src/components';

import {LIST_SWITCH_PRODUCT} from 'src/modules/common/constants';
import {switchProductView} from 'src/modules/common/actions';

import {margin} from 'src/components/config/spacing';

const SwitchProduct = ({theme, productView, switchView}) => {
  return (
    <View style={styles.container}>
      {LIST_SWITCH_PRODUCT.map(value => {
        const propsIcon =
          value.view === productView ? {color: theme.colors.primary} : {};
        return (
          <Icon
            key={value.icon}
            name={value.icon}
            type="material"
            size={20}
            underlayColor="transparent"
            iconStyle={[styles.touch, styles.icon]}
            onPress={() => switchView(value.view)}
            {...propsIcon}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: margin.small,
  },
});

const mapDispatchToProps = dispatch => ({
  switchView: view => dispatch(switchProductView(view)),
});
export default connect(
  null,
  mapDispatchToProps,
)(withTheme(SwitchProduct));
