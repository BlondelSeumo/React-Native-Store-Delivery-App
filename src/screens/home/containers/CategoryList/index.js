import React from 'react';

import {connect} from 'react-redux';
import split from 'lodash/split';
import compact from 'lodash/compact';

import {Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {categorySelector} from 'src/modules/category/selectors';

import Container from 'src/containers/Container';
import Heading from 'src/containers/Heading';

import Gird from './Gird';
import Row from './Row';

import {homeTabs} from 'src/config/navigator';
import {languageSelector} from 'src/modules/common/selectors';
import {padding} from 'src/components/config/spacing';
import {typeShowCategory} from 'src/config/category';
import {excludeCategory} from 'src/utils/category';

const initHeader = {
  style: {},
};

const {width} = Dimensions.get('window');

const CategoryList = props => {
  const {
    category: {data},
    fields,
    layout,
    widthComponent,
    language,
  } = props;
  const {t} = useTranslation();
  const navigation = useNavigation();
  if (!fields || typeof fields !== 'object' || Object.keys(fields).length < 1) {
    return null;
  }
  const heading = fields?.text_heading ?? initHeader;
  const exclude = fields?.exclude ?? '';

  let widthImage =
    fields.width && parseInt(fields.width, 0) ? parseInt(fields.width, 0) : 109;
  let heightImage =
    fields.height && parseInt(fields.height, 0)
      ? parseInt(fields.height, 0)
      : 109;

  const exclude_array = split(exclude, ',');
  const exclude_categories = compact(
    exclude_array.map(value => parseInt(value, 0)),
  );

  const categories = excludeCategory(data, exclude_categories);
  const limit =
    fields.limit && parseInt(fields.limit, 0)
      ? parseInt(fields.limit, 0)
      : categories.length;
  const dataShow = categories.filter((_, index) => index < limit);

  const widthView = fields.boxed
    ? widthComponent - 2 * padding.large
    : widthComponent;

  const headerDisable = !fields.boxed ? 'all' : 'none';
  const categoryDisable = fields.boxed
    ? typeShowCategory[layout] === 'grid'
      ? 'none'
      : 'right'
    : 'all';

  const Component = typeShowCategory[layout] === 'grid' ? Gird : Row;
  const styleHeader = {
    paddingTop: 0,
  };

  return (
    <>
      {fields.disable_heading && (
        <Container disable={headerDisable}>
          <Heading
            title={heading?.text?.[language] ?? t('common:text_category')}
            style={heading?.style}
            containerStyle={styleHeader}
            subTitle={t('common:text_show_all')}
            onPress={() => navigation.navigate(homeTabs.shop)}
          />
        </Container>
      )}
      <Container disable={categoryDisable}>
        <Component
          data={dataShow}
          width={widthImage}
          height={heightImage}
          widthView={widthView}
          box={fields.boxed}
          round={fields.round_image}
          border={fields.border}
          disableName={fields.disable_text}
        />
      </Container>
    </>
  );
};

const mapStateToProps = state => ({
  category: categorySelector(state),
  language: languageSelector(state),
});

CategoryList.defaultProps = {
  widthComponent: width,
};

export default connect(mapStateToProps)(CategoryList);
