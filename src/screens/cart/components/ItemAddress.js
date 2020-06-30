import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, withTheme} from 'src/components';
import {yellow} from 'src/components/config/colors';
import {margin, padding} from 'src/components/config/spacing';

const ItemAddress = props => {
  const {type, name, address, onSelectCustomer, theme} = props;
  const {t} = useTranslation();
  const editButton =
    type !== 'shop' ? (
      <TouchableOpacity style={styles.viewEdit} onPress={onSelectCustomer}>
        <Text style={{color: theme.colors.support.colorThemeSecondary}}>
          {t('common:text_edit')}
        </Text>
      </TouchableOpacity>
    ) : null;
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View
          style={[
            styles.box,
            type === 'shop'
              ? {backgroundColor: theme.colors.primary}
              : styles.boxCustomer,
          ]}
        />
        {type === 'shop' ? (
          <View style={styles.viewDivider}>
            <View
              style={[styles.divider, {borderColor: theme.colors.textColor}]}
            />
          </View>
        ) : null}
      </View>
      <View style={styles.right}>
        <Text h4 medium h4Style={styles.textName} numberOfLines={1}>
          {name}
        </Text>
        <Text h6 colorThird numberOfLines={1}>
          {address}
        </Text>
      </View>
      {editButton}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  right: {
    flex: 1,
    marginLeft: margin.large + 3,
    marginBottom: margin.big - 2,
  },
  left: {
    position: 'relative',
    alignItems: 'center',
  },
  box: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginVertical: 2,
  },
  boxCustomer: {
    backgroundColor: yellow,
  },
  viewDivider: {
    flex: 1,
    width: 1,
    overflow: 'hidden',
  },
  divider: {
    width: 1,
    height: '100%',
    borderWidth: 1,
    borderStyle: 'dotted',
    borderRadius: 1,
  },
  textName: {
    marginBottom: margin.small - 3,
  },
  viewEdit: {
    paddingLeft: padding.small - 1,
    paddingVertical: 2,
    paddingRight: 4,
  },
});

ItemAddress.defaultProps = {
  type: 'shop',
  onSelectCustomer: () => {},
};

export default withTheme(ItemAddress);
