import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from '../icons/Icon';
import {withTheme} from 'src/components/config';
import {padding, margin, borderRadius} from 'src/components/config/spacing';

const {height: heightWindow} = Dimensions.get('window');

const getHeightView = (heightFull = heightWindow, ratio = 0.5) => {
  const getRatio = ratio < 0.5 || ratio > 1 ? 0.5 : ratio;
  return heightFull * getRatio;
};

class ModalSelect extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: props.visible,
      opacity: new Animated.Value(0),
      height: getHeightView(heightWindow, props.ratio),
    };
  }

  animation = (type = 'open', cb = () => {}) => {
    const toValue = type === 'open' ? 0.5 : 0;
    const duration = 350;
    Animated.timing(this.state.opacity, {
      toValue,
      duration,
      useNativeDriver: false,
    }).start(cb);
  };

  onShow = () => {
    this.animation();
  };

  componentDidUpdate(preProps) {
    const {visible} = this.props;
    // Close
    if (!visible && preProps.visible !== visible) {
      this.animation('close', () => this.updateVisible(visible));
    }
    // Open
    if (visible && preProps.visible !== visible) {
      this.updateVisible(visible);
    }
  }
  updateVisible = visible => {
    this.setState({visible});
  };
  render() {
    const {
      topLeftElement,
      topCenterElement,
      topRightElement,
      underTopElement,
      ratioHeight,
      children,
      setModalVisible,
      backgroundColor,
      needHeader,
      style,
    } = this.props;
    const {opacity, visible, height} = this.state;

    const topLeft = topLeftElement ? (
      topLeftElement
    ) : (
      <TouchableOpacity
        onPress={() => setModalVisible(false)}
        style={styles.touchClose}>
        <Icon name="x" size={22} />
      </TouchableOpacity>
    );

    const topRight = topRightElement ? topRightElement : null;

    const bottom = opacity.interpolate({
      inputRange: [0, 0.5],
      outputRange: [-height, 0],
    });

    return (
      <Modal transparent visible={visible} onShow={this.onShow}>
        <View
          style={styles.container}
          onLayout={event => {
            let {height: heightFull} = event.nativeEvent.layout;
            this.setState({
              height: getHeightView(heightFull, ratioHeight),
            });
          }}>
          <Animated.View
            style={[
              styles.viewBg,
              {
                opacity: opacity,
              },
            ]}>
            <TouchableOpacity
              style={styles.touchBg}
              onPress={() => setModalVisible(false)}
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.modal,
              style && style,
              {
                height: height,
                backgroundColor: backgroundColor,
                bottom: bottom,
              },
            ]}>
            {needHeader ? (
              <View style={styles.header}>
                {topLeft}
                <View style={styles.viewCenterHeader}>{topCenterElement}</View>
                {topRight}
              </View>
            ) : null}

            {underTopElement}

            <View style={styles.content}>{children}</View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    borderTopLeftRadius: borderRadius.big,
    borderTopRightRadius: borderRadius.big,
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  touchClose: {
    padding: 2,
  },
  viewBg: {
    flex: 1,
    backgroundColor: '#000',
  },
  touchBg: {
    flex: 1,
  },
  header: {
    padding: padding.big - 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCenterHeader: {
    flex: 1,
    marginHorizontal: margin.small,
  },
  content: {
    flex: 1,
  },
});

ModalSelect.propTypes = {
  visible: PropTypes.bool,
  setModalVisible: PropTypes.func,
  ratioHeight: PropTypes.number,
  topRightElement: PropTypes.node,
  topCenterElement: PropTypes.node,
  style: PropTypes.object,
  needHeader: PropTypes.bool,
};

ModalSelect.defaultProps = {
  visible: false,
  ratioHeight: 0.5,
  style: {},
  needHeader: true,
};

export default withTheme(ModalSelect, 'Modal');
