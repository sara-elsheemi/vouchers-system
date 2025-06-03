import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './application/i18n/config';
import './application/i18n/rtl-styles.css';
import './presentation/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 