import React from 'react';
import { LocalizationProvider } from '../application/i18n/LocalizationProvider';
import { VoucherListPage } from '../presentation/pages/voucher/VoucherListPage';
import { getUserId } from '../application/utils/getUserId';

function App() {
  const userId = getUserId();

  if (!userId) {
    return (
      <LocalizationProvider>
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-neutral-900 mb-2">
              Authentication Required
            </h1>
            <p className="text-neutral-600">
              Please access this page through the 4Sale mobile app.
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