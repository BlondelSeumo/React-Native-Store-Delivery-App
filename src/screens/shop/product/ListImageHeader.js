import React from 'react';
import {StyleSheet, View} from 'react-native';
import ViewCountImageHeader from 'src/screens/shop/store-detail/ViewCountImageHeader';
import ViewImage from 'src/screens/shop/store-detail/ViewImage';
import {padding} from 'src/components/config/spacing';

import {useBoolean} from 'src/utils/use-boolean';

const ListImageHeader = props => {
  const {images} = props;
  const listImage = images ? images : [];
  const countImage = listImage.length;
  const [visible, {toggle: toggleModal}] = useBoolean(false);

  return (
    <View style={styles.container}>
      <ViewCountImageHeader
        count={countImage}
        onPress={countImage > 0 ? toggleModal : () => {}}
      />
      <ViewImage
        visible={visible}
        images={listImage.map(img => {
          return {url: img.src};
        })}
        changeVisible={toggleModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: padding.large,
  },
});

export default ListImageHeader;
