import * as colors from './colors';
import merge from 'lodash/merge';

export const colorsLight = {
  primary: colors.green,
  secondary: colors.grey6,

  bgColor: colors.white,
  bgColorSecondary: colors.grey1,
  bgColorThird: colors.grey2,

  textColor: colors.grey9,
  textColorSecondary: colors.grey5,
  textColorThird: colors.grey4,
  textColorFourth: colors.grey3,

  success: colors.green,
  error: colors.red,
  warning: colors.yellow,
  disabled: 'hsl(208, 8%, 90%)',
  // Darker color if hairlineWidth is not thin enough
  divider: colors.grey1,
  border: colors.grey1,
  borderSecondary: colors.grey1,
  borderThird: colors.grey10,
};

export const getThemeLight = (colorsNew = {}) => {
  const dataColors = merge(colorsLight, colorsNew);

  const support = {
    bgColor: dataColors.bgColor,
    bgColorSecondary: dataColors.bgColorSecondary,
    bgColorThird: dataColors.bgColor,
    bgColorThirdSecondary: dataColors.bgColorSecondary,
    colorThemeSecondary: dataColors.primary,
    colorThirdText: dataColors.textColorThird,
    borderThirdText: dataColors.borderThird,
  };
  return {
    key: 'light',
    colors: merge(dataColors, {support}),
    // Component text
    Text: {
      primary: {
        color: dataColors.textColor,
      },
      secondary: {
        color: dataColors.textColorSecondary,
      },
      third: {
        color: dataColors.textColorThird,
      },
      fourth: {
        color: dataColors.textColorFourth,
      },
    },

    // Component Icon
    Icon: {
      color: dataColors.textColor,
    },
    // Button
    Button: {
      color: colors.white,
      colorSecondary: dataColors.textColor,
    },
    // Modal
    Modal: {
      backgroundColor: support.bgColor,
    },

    // ButtonSwiper
    ButtonSwiper: {
      like: {
        backgroundColor: dataColors.bgColorSecondary,
        color: colors.black,
      },
      unlike: {
        backgroundColor: dataColors.bgColorSecondary,
        color: colors.black,
      },
      delete: {
        backgroundColor: colors.red,
        color: colors.white,
      },
      default: {
        backgroundColor: dataColors.bgColor,
        color: colors.white,
      },
    },
  };
};
// Export dark theme
export const darkColors = {
  key: 'dark',
  colors: {
    primary: colors.green,
    secondary: colors.grey6,

    bgColor: colors.grey9,
    bgColorSecondary: colors.grey8,
    bgColorThird: colors.grey11,

    textColor: colors.white,
    textColorSecondary: colors.grey5,
    textColorThird: colors.grey4,
    textColorFourth: colors.grey3,

    success: colors.green,
    error: colors.red,
    warning: colors.yellow,
    disabled: 'hsl(208, 8%, 90%)',
    // Darker color if hairlineWidth is not thin enough
    divider: colors.grey8,
    border: colors.grey8,
    borderSecondary: colors.grey12,
    borderThird: colors.grey10,
    support: {
      bgColor: colors.grey8,
      bgColorSecondary: colors.grey9,
      bgColorThird: colors.grey11,
      bgColorThirdSecondary: colors.grey8,
      colorThemeSecondary: colors.grey5,
      colorThirdText: colors.white,
      borderThirdText: colors.white,
    },
  },
  // Component text
  Text: {
    primary: {
      color: colors.white,
    },
    secondary: {
      color: colors.grey5,
    },
    third: {
      color: colors.grey4,
    },
    fourth: {
      color: colors.grey3,
    },
  },

  // Component Icon
  Icon: {
    color: colors.white,
  },

  // Button
  Button: {
    color: colors.white,
    colorSecondary: colors.white,
  },
  // Modal
  Modal: {
    backgroundColor: colors.grey8,
  },

  // ButtonSwiper
  ButtonSwiper: {
    like: {
      backgroundColor: colors.grey8,
      color: colors.black,
    },
    unlike: {
      backgroundColor: colors.grey8,
      color: colors.black,
    },
    delete: {
      backgroundColor: colors.red,
      color: colors.white,
    },
    default: {
      backgroundColor: colors.grey9,
      color: colors.white,
    },
  },
};

export default colors;
