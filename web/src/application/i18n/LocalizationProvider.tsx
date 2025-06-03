import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDirection, isRTL, SupportedLanguage, SUPPORTED_LANGUAGES } from './config';

interface LocalizationContextType {
  language: SupportedLanguage;
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
  changeLanguage: (lang: SupportedLanguage) => void;
  availableLanguages: typeof SUPPORTED_LANGUAGES;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

interface LocalizationProviderProps {
  children: React.ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<SupportedLanguage>(i18n.language as SupportedLanguage || 'en');
  const [direction, setDirection] = useState<'ltr' | 'rtl'>(getDirection(language));

  // Update HTML attributes when language or direction changes
  useEffect(() => {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Set HTML direction and language attributes
    htmlElement.setAttribute('dir', direction);
    htmlElement.setAttribute('lang', language);
    
    // Add CSS classes for styling purposes
    bodyElement.className = bodyElement.className.replace(/\b(ltr|rtl)\b/g, '');
    bodyElement.classList.add(direction);
    
    // Add language-specific class
    bodyElement.className = bodyElement.className.replace(/\blang-\w+\b/g, '');
    bodyElement.classList.add(`lang-${language}`);
    
    // Update document title direction for better browser support
    document.title = document.title; // Trigger browser re-evaluation
  }, [language, direction]);

  // Listen to i18n language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      const newLang = lng as SupportedLanguage;
      setLanguage(newLang);
      setDirection(getDirection(newLang));
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    // Set initial state
    handleLanguageChange(i18n.language);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const changeLanguage = async (lang: SupportedLanguage) => {
    try {
      await i18n.changeLanguage(lang);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const contextValue: LocalizationContextType = {
    language,
    direction,
    isRTL: isRTL(language),
    changeLanguage,
    availableLanguages: SUPPORTED_LANGUAGES,
  };

  return (
    <LocalizationContext.Provider value={contextValue}>
      <div className={`localization-wrapper ${direction}`} dir={direction}>
        {children}
      </div>
    </LocalizationContext.Provider>
  );
};