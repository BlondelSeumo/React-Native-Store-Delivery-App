import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View} from 'react-native';
import {Text, ThemeConsumer} from 'src/components';

import {languageSelector} from 'src/modules/common/selectors';
import {padding} from 'src/components/config/spacing';

const TextInfo = ({fields, language}) => {
  if (!fields || typeof fields !== 'object' || Object.keys(fields).length < 1) {
    return null;
  }
  return (
    <ThemeConsumer>
      {({theme}) => (
        <View
          style={[
            {
              paddingVertical: padding.large + 3,
              paddingHorizontal: padding.large,
              backgroundColor:
                fields?.bg_color ?? theme.colors.bgColorSecondary,
            },
          ]}>
          {fields?.title?.text?.[language] ? (
            <Text medium style={[styles.text, fields?.title?.style]}>
              {fields.title.text[language]}
            </Text>
          ) : null}
        </View>
      )}
    </ThemeConsumer>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});

const mapStateToProps = state => ({
  language: languageSelector(state),
});

export default connect(mapStateToProps)(TextInfo);
