import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from '../locales/en/common.json';
import heCommon from '../locales/he/common.json';

const resources = {
  en: {
    common: enCommon,
  },
  he: {
    common: heCommon,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },

    defaultNS: 'common',
    ns: ['common'],
  });

export default i18n;