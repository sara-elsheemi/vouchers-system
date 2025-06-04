import { LocalizationProvider } from '../application/i18n/LocalizationProvider';
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
        <div className="min-h-screen bg-neutral-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mr-3">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">My Vouchers</h1>
                <p className="text-neutral-600 text-sm">Loading vouchers for user {userId}...</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <p className="text-neutral-600">Voucher system loading...</p>
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default App;