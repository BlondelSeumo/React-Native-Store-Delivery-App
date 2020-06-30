import React from 'react';
import HTMLView from 'react-native-htmlview';
import {withTheme} from 'src/components';

import merge from 'lodash/merge';

import fonts, {sizes, lineHeights} from 'src/components/config/fonts';

const TextHtml = ({value, theme, withThemeConfig = true, style, ...rest}) => {
  const valueHtml = `<div>${
    value && typeof value === 'string' ? value.replace(/[\n\r]+/g, '') : ''
  }</div>`;

  return (
    <HTMLView
      {...rest}
      value={valueHtml}
      stylesheet={withThemeConfig ? merge(styles(theme), style) : style}
    />
  );
};

const styles = theme => ({
  div: {
    ...fonts.regular,
    fontSize: sizes.base,
    color: theme.colors.primary,
    textAlign: 'left',
  },
  span: {
    ...fonts.regular,
    fontSize: sizes.base,
    lineHeight: lineHeights.base,
    color: theme.colors.primary,
    textAlign: 'left',
  },
  p: {
    ...fonts.regular,
    fontSize: sizes.base,
    lineHeight: lineHeights.base,
    color: theme.colors.primary,
    textAlign: 'left',
  },
  a: {
    ...fonts.regular,
    fontSize: sizes.base,
    lineHeight: lineHeights.base,
    color: '#96588a',
    textAlign: 'left',
  },
  b: {
    ...fonts.bold,
  },
  strong: {
    ...fonts.bold,
  },
});

TextHtml.defaultProps = {
  style: {},
};

export default withTheme(TextHtml);
