import React from 'react';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';

import {Dimensions} from 'react-native';
import Container from 'src/containers/Container';
import Heading from 'src/containers/Heading';
import Gird from './Gird';
import Scroll from './Scroll';
import Empty from './Empty';

import {languageSelector} from 'src/modules/common/selectors';

import {padding} from 'src/components/config/spacing';

import {colBanner, typeViewBanner} from './config';

import action from 'src/utils/action';

const {width} = Dimensions.get('window');

const initHeader = {
  style: {},
};

const Banners = props => {
  const {t} = useTranslation();
  const {layout, fields, widthComponent, language} = props;
  if (!fields || typeof fields !== 'object' || Object.keys(fields).length < 1) {
    return null;
  }
  const heading = fields?.text_heading ?? initHeader;
  const valueBox = fields?.boxed ?? false;

  const widthValue =
    fields.width && parseInt(fields.width, 0) ? parseInt(fields.width, 0) : 370;
  const heightValue =
    fields.height && parseInt(fields.height, 0)
      ? parseInt(fields.height, 0)
      : 395;
  const radius =
    fields.radius && parseInt(fields.radius, 0)
      ? parseInt(fields.radius, 0)
      : 0;
  const pad =
    fields.pad && parseInt(fields.pad, 0) ? parseInt(fields.pad, 0) : 0;

  const images = fields.images || [];

  const widthView = valueBox
    ? widthComponent - 2 * padding.large
    : widthComponent;

  const headingDisable = !valueBox ? 'all' : 'none';
  const contentDisable = !valueBox
    ? 'all'
    : typeViewBanner[layout] === 'scroll'
    ? 'right'
    : 'none';

  const Component = typeViewBanner[layout] === 'scroll' ? Scroll : Gird;
  const styleHeader = {
    paddingTop: 0,
  };
  return (
    <>
      {fields.disable_heading && (
        <Container disable={headingDisable}>
          <Heading
            title={
              heading.text && heading.text[language]
                ? heading.text[language]
                : t('common:text_blogs')
            }
            style={heading.style}
            containerStyle={styleHeader}
          />
        </Container>
      )}
      <Container disable={contentDisable}>
        {images.length < 1 ? (
          <Empty
            widthView={widthView}
            width={widthValue}
            height={heightValue}
            radius={radius}
          />
        ) : (
          <Component
            images={images}
            col={colBanner(layout, images.length)}
            widthImage={widthValue}
            heightImage={heightValue}
            widthView={widthView}
            radius={radius}
            box={valueBox}
            pad={pad}
            clickBanner={data => action(data)}
            language={language}
          />
        )}
      </Container>
    </>
  );
};

const mapStateToProps = state => ({
  language: languageSelector(state),
});

Banners.defaultProps = {
  widthComponent: width,
};

export default connect(
  mapStateToProps,
  null,
)(Banners);
