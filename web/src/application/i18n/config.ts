import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define supported languages
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  ar: 'العربية'
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// RTL languages
export const RTL_LANGUAGES: SupportedLanguage[] = ['ar'];

// Check if language is RTL
export const isRTL = (language: string): boolean => {
  return RTL_LANGUAGES.includes(language as SupportedLanguage);
};

// Get text direction for language
export const getDirection = (language: string): 'ltr' | 'rtl' => {
  return isRTL(language) ? 'rtl' : 'ltr';
};

// Initialize i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en', // Default language
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    react: {
      useSuspense: false,
    },
    
    // Default namespace
    defaultNS: 'common',
    ns: ['common'],
  });

export default i18n;