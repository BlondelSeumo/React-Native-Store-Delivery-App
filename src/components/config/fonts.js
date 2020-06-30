// Font family
const light = 'Roboto-Light';
const regular = 'Roboto-Regular';
const medium = 'Roboto-Medium';
const bold = 'Roboto-Bold';

// Export font size
export const sizes = {
  base: 14,
  h1: 30,
  h2: 24,
  h3: 18,
  h4: 16,
  h5: 14,
  h6: 12,
};

// Export lineheights
export const lineHeights = {
  base: 20,
  h1: 43,
  h2: 33,
  h3: 28,
  h4: 23,
  h5: 20,
  h6: 17,
};

// Export font family
export default {
  light: {
    fontFamily: light,
  },
  regular: {
    fontFamily: regular,
  },

  medium: {
    fontFamily: medium,
  },

  bold: {
    fontFamily: bold,
    fontWeight: 'bold',
  },

  android: {
    regular: {
      fontFamily: 'sans-serif',
    },
    light: {
      fontFamily: 'sans-serif-light',
    },
    condensed: {
      fontFamily: 'sans-serif-condensed',
    },
    condensed_light: {
      fontFamily: 'sans-serif-condensed',
      fontWeight: 'light',
    },
    black: {
      // note(brentvatne): sans-serif-black is only supported on Android 5+,
      // we can detect that here and use it in that case at some point.
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
    },
    bold: {
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
    },
  },
  default: {},
};
