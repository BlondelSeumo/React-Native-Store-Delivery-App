import React from 'react';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Icon, Text, ThemeConsumer, withTheme} from 'src/components';
import Container from 'src/containers/Container';

import {languageSelector} from 'src/modules/common/selectors';
import {mainStack} from 'src/config/navigator';
import {borderRadius, margin, padding} from 'src/components/config/spacing';

const Search = props => {
  const navigation = useNavigation();
  const {fields, language} = props;
  if (!fields || typeof fields !== 'object' || Object.keys(fields).length < 1) {
    return null;
  }
  const title = fields?.placeholder ?? null;

  return (
    <ThemeConsumer>
      {({theme}) => (
        <Container disable={!fields.boxed ? 'all' : 'none'}>
          <TouchableOpacity
            style={[
              styles.container,
              {
                backgroundColor: theme.colors.bgColorSecondary,
              },
            ]}
            onPress={() => navigation.navigate(mainStack.search)}>
            <Icon name="search" size={20} />
            {title?.text?.[language] ? (
              <Text
                colorSecondary
                numberOfLines={1}
                style={[styles.text, title?.style ?? {}]}>
                {title.text[language]}
              </Text>
            ) : null}
          </TouchableOpacity>
        </Container>
      )}
    </ThemeConsumer>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 46,
    borderRadius: borderRadius.base,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: padding.large - 1,
    overflow: 'hidden',
  },
  text: {
    flex: 1,
    marginLeft: margin.small,
    marginVertical: margin.base,
  },
});

const mapStateToProps = state => ({
  language: languageSelector(state),
});

export default connect(mapStateToProps)(withTheme(Search));
