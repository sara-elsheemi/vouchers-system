import React, { useState, useEffect } from 'react';

// Simple translations object
const translations = {
  en: {
    language: 'English',
    direction: 'LTR',
    currentLanguage: 'Current language: EN',
    currentDirection: 'Direction: LTR',
    switchLanguage: 'Switch to Arabic',
    welcome: 'Welcome to 4Sale Design System',
    description: 'A comprehensive React design system with TypeScript and Tailwind CSS',
    testHeading: 'Test Heading',
    testParagraph: 'This is a test paragraph to demonstrate the localization system. It shows how text flows in left-to-right direction for English content.',
    buttonText: 'Click Me',
    inputPlaceholder: 'Enter your text here',
    directionTest: 'Direction Test:',
    directionTestDescription: 'This content automatically switches between LTR and RTL based on the selected language.',
    dataTableTest: 'Data Table Test',
    navigationMenuTest: 'Navigation Menu Test',
    primaryBadge: 'Primary Badge',
    secondaryBadge: 'Secondary Badge',
    successBadge: 'Success Badge',
    warningBadge: 'Warning Badge',
    errorBadge: 'Error Badge',
    secondaryAction: 'Secondary Action',
    outlineButton: 'Outline Button',
    testInputField: 'Test Input Field',
    home: 'Home',
    products: 'Products',
    services: 'Services',
    about: 'About',
    contact: 'Contact',
    card1Title: 'Card 1',
    card2Title: 'Card 2',
    card3Title: 'Card 3',
    card1Description: 'This card tests how content flows in different directions.',
    card2Description: 'Notice how buttons, text alignment, and spacing adapt automatically.',
    card3Description: 'The layout maintains visual consistency across both directions.',
    action: 'Action',
    primaryAction: 'Primary Action',
    tableHeaders: {
      name: 'Name',
      email: 'Email',
      role: 'Role',
      status: 'Status'
    },
    tableData: {
      john: 'John Doe',
      jane: 'Jane Smith',
      admin: 'Admin',
      user: 'User',
      active: 'Active',
      inactive: 'Inactive'
    }
  },
  ar: {
    language: 'العربية',
    direction: 'RTL',
    currentLanguage: 'اللغة الحالية: العربية',
    currentDirection: 'الاتجاه: من اليمين إلى اليسار',
    switchLanguage: 'التبديل إلى الإنجليزية',
    welcome: 'مرحباً بك في نظام تصميم فور سيل',
    description: 'نظام تصميم شامل مبني بـ React و TypeScript و Tailwind CSS',
    testHeading: 'عنوان تجريبي',
    testParagraph: 'هذه فقرة تجريبية لإظهار نظام الترجمة. تُظهر كيف يتدفق النص من اليمين إلى اليسار للمحتوى العربي.',
    buttonText: 'اضغط هنا',
    inputPlaceholder: 'أدخل النص هنا',
    directionTest: 'اختبار الاتجاه:',
    directionTestDescription: 'يتغير هذا المحتوى تلقائياً بين اليسار-إلى-اليمين واليمين-إلى-اليسار بناءً على اللغة المختارة.',
    dataTableTest: 'اختبار جدول البيانات',
    navigationMenuTest: 'اختبار قائمة التنقل',
    primaryBadge: 'شارة أساسية',
    secondaryBadge: 'شارة ثانوية',
    successBadge: 'شارة نجاح',
    warningBadge: 'شارة تحذير',
    errorBadge: 'شارة خطأ',
    secondaryAction: 'إجراء ثانوي',
    outlineButton: 'زر محدود',
    testInputField: 'حقل إدخال تجريبي',
    home: 'الرئيسية',
    products: 'المنتجات',
    services: 'الخدمات',
    about: 'حول',
    contact: 'اتصل بنا',
    card1Title: 'البطاقة الأولى',
    card2Title: 'البطاقة الثانية',
    card3Title: 'البطاقة الثالثة',
    card1Description: 'تختبر هذه البطاقة كيفية تدفق المحتوى في اتجاهات مختلفة.',
    card2Description: 'لاحظ كيف تتكيف الأزرار ومحاذاة النص والمسافات تلقائياً.',
    card3Description: 'يحافظ التخطيط على الاتساق البصري عبر كلا الاتجاهين.',
    action: 'إجراء',
    primaryAction: 'إجراء أساسي',
    tableHeaders: {
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      role: 'الدور',
      status: 'الحالة'
    },
    tableData: {
      john: 'جون دو',
      jane: 'جين سميث',
      admin: 'مدير',
      user: 'مستخدم',
      active: 'نشط',
      inactive: 'غير نشط'
    }
  }
};

type Language = 'en' | 'ar';

export const SimpleLocalizationDemo: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  const t = translations[language];

  // Update direction and HTML attributes when language changes
  useEffect(() => {
    const newDirection = language === 'ar' ? 'rtl' : 'ltr';
    setDirection(newDirection);
    
    // Update HTML attributes
    document.documentElement.setAttribute('dir', newDirection);
    document.documentElement.setAttribute('lang', language);
    
    // Update body classes
    document.body.className = document.body.className.replace(/\b(ltr|rtl)\b/g, '');
    document.body.classList.add(newDirection);
    
    // Add language-specific class
    document.body.className = document.body.className.replace(/\blang-\w+\b/g, '');
    document.body.classList.add(`lang-${language}`);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const tableData = [
    {
      name: t.tableData.john,
      email: 'john@example.com',
      role: t.tableData.admin,
      status: t.tableData.active
    },
    {
      name: t.tableData.jane,
      email: 'jane@example.com',
      role: t.tableData.user,
      status: t.tableData.inactive
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir={direction}>
      {/* Header with Language Info */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {t.currentLanguage}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {t.currentDirection}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                direction === 'rtl' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
              }`}>
                {t.language}: {t.direction}
              </span>
            </div>
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-[140px]"
            >
              {t.switchLanguage}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t.welcome}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {t.description}
          </p>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="text-sm text-blue-800">
              <strong>{t.directionTest}</strong> {t.directionTestDescription}
            </div>
          </div>
        </div>

        {/* Typography Test */}
        <div className="p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {t.testHeading}
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            {t.testParagraph}
          </p>
          
          {/* Buttons Test */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {t.buttonText}
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
              {t.secondaryAction}
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {t.outlineButton}
            </button>
          </div>

          {/* Input Test */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.testInputField}
            </label>
            <input
              type="text"
              placeholder={t.inputPlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Badge Test */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {t.primaryBadge}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {t.secondaryBadge}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {t.successBadge}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {t.warningBadge}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {t.errorBadge}
            </span>
          </div>
        </div>

        {/* Table Test */}
        <div className="p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {t.dataTableTest}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-start font-semibold">
                    {t.tableHeaders.name}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-start font-semibold">
                    {t.tableHeaders.email}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-start font-semibold">
                    {t.tableHeaders.role}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-start font-semibold">
                    {t.tableHeaders.status}
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{row.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.role}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.status === t.tableData.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Navigation Menu Test */}
        <div className="p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {t.navigationMenuTest}
          </h3>
          <nav className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg">
            <a href="#" className="px-4 py-2 rounded-md bg-white shadow-sm text-gray-900 font-medium">
              {t.home}
            </a>
            <a href="#" className="px-4 py-2 rounded-md text-gray-600 hover:bg-white hover:shadow-sm">
              {t.products}
            </a>
            <a href="#" className="px-4 py-2 rounded-md text-gray-600 hover:bg-white hover:shadow-sm">
              {t.services}
            </a>
            <a href="#" className="px-4 py-2 rounded-md text-gray-600 hover:bg-white hover:shadow-sm">
              {t.about}
            </a>
            <a href="#" className="px-4 py-2 rounded-md text-gray-600 hover:bg-white hover:shadow-sm">
              {t.contact}
            </a>
          </nav>
        </div>

        {/* Layout Test */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold mb-3">{t.card1Title}</h4>
            <p className="text-gray-600 mb-4">
              {t.card1Description}
            </p>
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {t.action}
            </button>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold mb-3">{t.card2Title}</h4>
            <p className="text-gray-600 mb-4">
              {t.card2Description}
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {t.primaryAction}
            </button>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold mb-3">{t.card3Title}</h4>
            <p className="text-gray-600 mb-4">
              {t.card3Description}
            </p>
            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
              {t.secondaryAction}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};