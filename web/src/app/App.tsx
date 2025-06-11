import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LocalizationProvider } from '../application/i18n/LocalizationProvider';
import { VoucherListPage } from '../presentation/pages/voucher/VoucherListPage';
import { getUserId, getAppParams } from '../application/utils/getUserId';
import { getDirection } from '../application/i18n/config';

function App() {
  const { t, i18n } = useTranslation();
  const userId = getUserId();
  const appParams = getAppParams();

  // Initialize language from URL parameter
  useEffect(() => {
    const initializeLanguage = async () => {
      const { language } = appParams;
      
      // Validate language is supported
      const supportedLanguages = ['en', 'ar'];
      const targetLanguage = supportedLanguages.includes(language) ? language : 'en';
      
      // Change language if different from current
      if (i18n.language !== targetLanguage) {
        await i18n.changeLanguage(targetLanguage);
      }
      
      // Set document direction based on language
      const direction = getDirection(targetLanguage);
      document.documentElement.dir = direction;
      document.documentElement.lang = targetLanguage;
    };

    initializeLanguage();
  }, [appParams.language, i18n]);

  if (!userId) {
    return (
      <LocalizationProvider>
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-neutral-900 mb-2">
              {t('auth.authRequired')}
            </h1>
            <p className="text-neutral-600">
              {t('auth.accessThroughApp')}
            </p>
          </div>
        </div>
      </LocalizationProvider>
    );
  }

  return (
    <LocalizationProvider>
      <div className="App">
        <VoucherListPage userId={userId} />
      </div>
    </LocalizationProvider>
  );
}

export default App;