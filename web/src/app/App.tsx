import React from 'react';
import { LocalizationProvider } from '../application/i18n/LocalizationProvider';
import { LocalizationTestPage } from '../presentation/pages/LocalizationTestPage';
import '../presentation/styles/globals.css';

function App() {
  return (
    <LocalizationProvider>
      <div className="App">
        <LocalizationTestPage />
      </div>
    </LocalizationProvider>
  );
}

export default App;