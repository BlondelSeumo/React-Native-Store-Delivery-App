import React, {Component} from 'react';
import {StyleSheet, Modal, View, ActivityIndicator} from 'react-native';
import {ThemeConsumer} from 'src/components/config';

class Loading extends Component {
  render() {
    const {visible} = this.props;
    return (
      <ThemeConsumer>
        {({theme}) => (
          <Modal animationType="none" transparent visible={visible}>
            <View style={[styles.viewLoading]}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          </Modal>
        )}
      </ThemeConsumer>
    );
  }
}

const styles = StyleSheet.create({
  viewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
