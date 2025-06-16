import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocalizationProvider } from '../application/i18n/LocalizationProvider';
import { AppRouter } from '../application/router/AppRouter';
import { LoginPage } from '../presentation/pages/auth/LoginPage';
import { getAppParams, getAuthToken } from '../application/utils/getUserId';
import { getDirection } from '../application/i18n/config';
import { authService, User } from '../domain/services/authService';

function App() {
  const { i18n } = useTranslation();

  const appParams = getAppParams();
  const [user, setUser] = useState<User | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

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

  // Token validation effect
  useEffect(() => {
    const validateUserToken = async () => {
      const token = getAuthToken();
      const currentPath = window.location.pathname;
      
      // Allow QR scanner access without token
      if (!token && (currentPath === '/scan-qr' || currentPath === '/scan-qr-code')) {
        setAuthError(null);
        setIsValidating(false);
        return;
      }
      
      if (!token) {
        setAuthError('no_token');
        setIsValidating(false);
        return;
      }

      try {
        const validatedUser = await authService.validateToken(token);
        if (validatedUser) {
          setUser(validatedUser);
          authService.saveUserData(validatedUser);
          setAuthError(null);
        } else {
          setAuthError('invalid_token');
          authService.clearAuthData();
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setAuthError('validation_error');
        authService.clearAuthData();
      } finally {
        setIsValidating(false);
      }
    };

    // Always validate token - never trust cached data without validation
    // Clear any potentially stale cached data on app start
    authService.clearAuthData();
    validateUserToken();
  }, []);

  // Show loading state while validating
  if (isValidating) {
    return (
      <LocalizationProvider>
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Validating session...</p>
          </div>
        </div>
      </LocalizationProvider>
    );
  }

  // Check if we're on QR scanner page without authentication
  const currentPath = window.location.pathname;
  const isQRScannerPage = currentPath === '/scan-qr' || currentPath === '/scan-qr-code';
  
  // Show login page if authentication failed (but not for QR scanner)
  if ((authError || !user) && !isQRScannerPage) {
    return (
      <LocalizationProvider>
        <LoginPage />
      </LocalizationProvider>
    );
  }

  // Use user_id from validated token response, or allow QR scanner without auth
  return (
    <LocalizationProvider>
      <div className="App">
        <AppRouter 
          userId={user?.user_id?.toString() || undefined} 
          isAuthenticated={!!user} 
        />
      </div>
    </LocalizationProvider>
  );
}

export default App;