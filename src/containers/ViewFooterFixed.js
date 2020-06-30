import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ThemedView} from 'src/components';
import {padding} from 'src/components/config/spacing';

const ViewFooterFixed = props => {
  const {footerStyle, footerElement, isShadow, contentStyle, ...rest} = props;
  const Component = isShadow ? ThemedView : View;
  return (
    <View style={styles.container}>
      <Component
        {...rest}
        style={[
          styles.content,
          isShadow && styles.shadowContent,
          contentStyle && contentStyle,
        ]}
      />
      <View style={[styles.footer, footerStyle && footerStyle]}>
        {footerElement}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  shadowContent: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 3,
    shadowOpacity: 0.08,
    elevation: 1,
  },
  footer: {
    padding: padding.large,
  },
});

ViewFooterFixed.defaultProps = {
  isShadow: true,
};

export default ViewFooterFixed;
