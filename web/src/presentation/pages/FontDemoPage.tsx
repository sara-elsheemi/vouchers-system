import React from 'react';
import { useLocalization } from '../../application/i18n/LocalizationProvider';

export const FontDemoPage: React.FC = () => {
  const { language, changeLanguage } = useLocalization();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Font in use: SakrPro
          </h1>
          <p className="text-lg text-gray-600">
            Custom SakrPro font integration across the entire system
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
            <h2 className="text-2xl font-bold mb-6 text-gray-900">English Text Samples</h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500 block mb-1">Light (300)</span>
                <p className="text-xl font-light text-gray-900">
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 block mb-1">Regular (400)</span>
                <p className="text-xl font-normal text-gray-900">
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 block mb-1">Medium (500)</span>
                <p className="text-xl font-medium text-gray-900">
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 block mb-1">Bold (700)</span>
                <p className="text-xl font-bold text-gray-900">
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            </div>
          </div>

          {/* Arabic Samples */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Arabic Text Samples</h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500 block mb-1">خفيف (300)</span>
                <p className="text-xl font-light text-gray-900 text-right" dir="rtl">
                  نص تجريبي باللغة العربية لاختبار خط سكر برو
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 block mb-1">عادي (400)</span>
                <p className="text-xl font-normal text-gray-900 text-right" dir="rtl">
                  نص تجريبي باللغة العربية لاختبار خط سكر برو
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 block mb-1">متوسط (500)</span>
                <p className="text-xl font-medium text-gray-900 text-right" dir="rtl">
                  نص تجريبي باللغة العربية لاختبار خط سكر برو
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 block mb-1">عريض (700)</span>
                <p className="text-xl font-bold text-gray-900 text-right" dir="rtl">
                  نص تجريبي باللغة العربية لاختبار خط سكر برو
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Typography Scale */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Typography Scale</h2>
          
          <div className="space-y-3">
            <p className="text-xs text-gray-700">Extra Small (12px) - SakrPro Font</p>
            <p className="text-sm text-gray-700">Small (14px) - SakrPro Font</p>
            <p className="text-base text-gray-700">Base (16px) - SakrPro Font</p>
            <p className="text-lg text-gray-700">Large (18px) - SakrPro Font</p>
            <p className="text-xl text-gray-700">Extra Large (20px) - SakrPro Font</p>
            <p className="text-2xl text-gray-700">2X Large (24px) - SakrPro Font</p>
            <p className="text-3xl text-gray-700">3X Large (30px) - SakrPro Font</p>
            <p className="text-4xl text-gray-700">4X Large (36px) - SakrPro Font</p>
          </div>
        </div>

        {/* UI Components Sample */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">UI Components with SakrPro</h2>
          
          <div className="space-y-6">
            {/* Buttons */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-900">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                  Primary Button
                </button>
                <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
                  Secondary Button
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Outline Button
                </button>
              </div>
            </div>

            {/* Form Elements */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-900">Form Elements</h3>
              <div className="space-y-3 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Text Input
                  </label>
                  <input
                    type="text"
                    placeholder="Enter text here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Textarea
                  </label>
                  <textarea
                    placeholder="Enter longer text here..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Dropdown
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Choose an option</option>
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
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