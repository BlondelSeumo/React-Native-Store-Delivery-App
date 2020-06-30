import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import languages from 'src/locales';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en',

  resources: languages,

  ns: ['common'],
  defaultNS: 'common',

  debug: false,
});

export default i18n;
