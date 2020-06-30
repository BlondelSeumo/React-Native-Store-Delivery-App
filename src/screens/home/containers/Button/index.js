import React from 'react';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';

import {Button as ButtonCPN} from 'src/components';
import Container from 'src/containers/Container';
import {languageSelector} from 'src/modules/common/selectors';

import {black} from 'src/components/config/colors';

import action from 'src/utils/action';

const Button = props => {
  const {t} = useTranslation();
  const {fields, language} = props;
  if (!fields || typeof fields !== 'object' || Object.keys(fields).length < 1) {
    return null;
  }

  return (
    <Container disable={!fields.boxed ? 'all' : 'none'}>
      <ButtonCPN
        title={fields?.title?.text?.[language] ?? t('common:text_submit')}
        titleStyle={fields?.title?.style}
        buttonStyle={{
          backgroundColor: fields?.bg_color ?? black,
          borderColor: fields?.border_color ?? black,
        }}
        onPress={() => action(fields.action)}
      />
    </Container>
  );
};

const mapStateToProps = state => ({
  language: languageSelector(state),
});

export default connect(mapStateToProps)(Button);
