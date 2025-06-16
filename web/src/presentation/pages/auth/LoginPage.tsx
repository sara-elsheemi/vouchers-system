import React from 'react';
import { useTranslation } from 'react-i18next';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              {t('auth.loginRequired')}
            </h1>
            <p className="text-neutral-600 mb-6">
              {t('auth.sessionExpired')}
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                {t('auth.pleaseLoginThroughApp')}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-neutral-500 mb-4">
                {t('auth.redirectInstructions')}
              </p>
              
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('auth.retry')}
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-200">
            <p className="text-xs text-neutral-400">
              {t('auth.contactSupport')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 