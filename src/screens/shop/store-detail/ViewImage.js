import React from 'react';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {StyleSheet, ActivityIndicator, Modal} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Container from 'src/containers/Container';
import {Icon} from 'src/components';
import {white} from 'src/components/config/colors';
import {padding} from 'src/components/config/spacing';

const ViewImage = props => {
  const {visible, images, changeVisible} = props;

  return (
    <Modal visible={visible} transparent={true}>
      <ImageViewer
        onCancel={() => changeVisible()}
        loadingRender={() => <ActivityIndicator />}
        enableSwipeDown={true}
        imageUrls={images}
        renderHeader={() => (
          <Container style={styles.viewHeaderImages}>
            <Icon
              name="x"
              size={24}
              color={white}
              iconStyle={styles.iconClose}
              onPress={changeVisible}
            />
          </Container>
        )}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  viewHeaderImages: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingTop: getStatusBarHeight(),
    zIndex: 9999,
  },
  iconClose: {
    paddingVertical: padding.base,
  },
});

export default ViewImage;
