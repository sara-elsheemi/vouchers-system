import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalization } from '../../application/i18n/LocalizationProvider';

export const FontDemoPage: React.FC = () => {
  const { language, changeLanguage } = useLocalization();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('fontDemo.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('fontDemo.subtitle')}
          </p>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-4 py-2 rounded-md transition-colors ${
                language === 'en'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => changeLanguage('ar')}
              className={`px-4 py-2 rounded-md transition-colors ${
                language === 'ar'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              العربية
            </button>
          </div>
        </div>

        {/* Font Weight Samples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* English Samples */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{t('fontDemo.englishSamples')}</h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500 block mb-1">{t('fontDemo.fontWeights.light')}</span>
                <p className="text-xl font-light text-gray-900">
                  {t('fontDemo.sampleText')}
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 block mb-1">{t('fontDemo.fontWeights.regular')}</span>
                <p className="text-xl font-normal text-gray-900">
                  {t('fontDemo.sampleText')}
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 block mb-1">{t('fontDemo.fontWeights.medium')}</span>
                <p className="text-xl font-medium text-gray-900">
                  {t('fontDemo.sampleText')}
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 block mb-1">{t('fontDemo.fontWeights.bold')}</span>
                <p className="text-xl font-bold text-gray-900">
                  {t('fontDemo.sampleText')}
                </p>
              </div>
            </div>
          </div>

          {/* Arabic Samples */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{t('fontDemo.arabicSamples')}</h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500 block mb-1">{t('fontDemo.arabicFontWeights.light')}</span>
                <p className="text-xl font-light text-gray-900 text-right" dir="rtl">
                  {t('fontDemo.arabicSampleText')}
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 block mb-1">{t('fontDemo.arabicFontWeights.regular')}</span>
                <p className="text-xl font-normal text-gray-900 text-right" dir="rtl">
                  {t('fontDemo.arabicSampleText')}
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 block mb-1">{t('fontDemo.arabicFontWeights.medium')}</span>
                <p className="text-xl font-medium text-gray-900 text-right" dir="rtl">
                  {t('fontDemo.arabicSampleText')}
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 block mb-1">{t('fontDemo.arabicFontWeights.bold')}</span>
                <p className="text-xl font-bold text-gray-900 text-right" dir="rtl">
                  {t('fontDemo.arabicSampleText')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Typography Scale */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">{t('fontDemo.typographyScale')}</h2>
          
          <div className="space-y-3">
            <p className="text-xs text-gray-700">{t('fontDemo.typographySizes.xs')}</p>
            <p className="text-sm text-gray-700">{t('fontDemo.typographySizes.sm')}</p>
            <p className="text-base text-gray-700">{t('fontDemo.typographySizes.base')}</p>
            <p className="text-lg text-gray-700">{t('fontDemo.typographySizes.lg')}</p>
            <p className="text-xl text-gray-700">{t('fontDemo.typographySizes.xl')}</p>
            <p className="text-2xl text-gray-700">{t('fontDemo.typographySizes.2xl')}</p>
            <p className="text-3xl text-gray-700">{t('fontDemo.typographySizes.3xl')}</p>
            <p className="text-4xl text-gray-700">{t('fontDemo.typographySizes.4xl')}</p>
          </div>
        </div>

        {/* UI Components Sample */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">{t('fontDemo.uiComponents')}</h2>
          
          <div className="space-y-6">
            {/* Buttons */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-900">{t('fontDemo.buttons')}</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                  {t('fontDemo.uiElements.primaryButton')}
                </button>
                <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
                  {t('fontDemo.uiElements.secondaryButton')}
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  {t('fontDemo.uiElements.outlineButton')}
                </button>
              </div>
            </div>

            {/* Form Elements */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-900">{t('fontDemo.formElements')}</h3>
              <div className="space-y-3 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('fontDemo.uiElements.textInput')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('fontDemo.uiElements.textInputPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('fontDemo.uiElements.textarea')}
                  </label>
                  <textarea
                    placeholder={t('fontDemo.uiElements.textareaPlaceholder')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('fontDemo.uiElements.selectDropdown')}
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>{t('fontDemo.uiElements.chooseOption')}</option>
                    <option>{t('fontDemo.uiElements.option1')}</option>
                    <option>{t('fontDemo.uiElements.option2')}</option>
                    <option>{t('fontDemo.uiElements.option3')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};