import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalization } from '../../../../application/i18n/LocalizationProvider';
import { Button } from '../core/Button/Button';
import { SupportedLanguage } from '../../../../application/i18n/config';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'button' | 'dropdown';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = '',
  variant = 'button'
}) => {
  const { t } = useTranslation();
  const { language, changeLanguage, availableLanguages } = useLocalization();

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    changeLanguage(newLanguage);
  };

  if (variant === 'dropdown') {
    return (
      <div className={`language-switcher ${className}`}>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.entries(availableLanguages).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Button variant - toggle between languages
  const getOtherLanguage = (): SupportedLanguage => {
    return language === 'en' ? 'ar' : 'en';
  };

  return (
    <div className={`language-switcher ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleLanguageChange(getOtherLanguage())}
        className="min-w-[120px]"
      >
        {t('switchLanguage')}
      </Button>
    </div>
  );
};