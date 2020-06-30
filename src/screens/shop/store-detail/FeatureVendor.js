import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Text, Icon, withTheme} from 'src/components';
import {margin} from 'src/components/config/spacing';

const FeatureVendor = ({isFeature, style, theme}) => {
  const {t} = useTranslation();
  if (!isFeature) {
    return null;
  }
  return (
    <View style={[styles.viewFeature, style && style]}>
      <Icon
        name="check-decagram"
        type="material-community"
        size={16}
        color={theme.colors.primary}
      />
      <Text medium style={[styles.textFeature, {color: theme.colors.primary}]}>
        {t('catalog:text_preferred_merchants')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  viewFeature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textFeature: {
    marginLeft: margin.small - 1,
  },
});

FeatureVendor.defaultProps = {
  isFeature: false,
};

export default withTheme(FeatureVendor);
