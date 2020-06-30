import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'src/components';
import ViewUnderline from 'src/containers/ViewUnderline';
import FeatureVendor from '../store-detail/FeatureVendor';
import {margin, padding} from 'src/components/config/spacing';

const InfoVendor = props => {
  const {vendor} = props;
  if (!vendor) {
    return null;
  }
  const {store_name, featured, store_location, store_email, phone} = vendor;

  return (
    <ViewUnderline style={styles.container}>
      <FeatureVendor isFeature={featured} style={styles.viewFeature} />
      <Text h2 medium style={styles.textName}>
        {store_name}
      </Text>
      <Text colorThird style={styles.textInfo}>
        {store_location}
      </Text>
      <Text colorThird style={styles.textInfo}>
        {phone}
      </Text>
      <Text colorThird>{store_email}</Text>
    </ViewUnderline>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: margin.base,
    paddingBottom: padding.big - 2,
  },
  viewFeature: {
    marginBottom: margin.small,
  },
  textName: {
    marginBottom: margin.base - 1,
  },
  textInfo: {
    marginBottom: margin.small - 2,
  },
});
export default InfoVendor;
