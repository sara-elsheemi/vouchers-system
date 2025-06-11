// Application configuration for different environments
export interface AppConfig {
  apiBaseUrl: string;
  isDevelopment: boolean;
  allowDemoUser: boolean;
  supportedLanguages: string[];
  defaultLanguage: string;
}

// Environment detection
const isDevelopment = process.env['NODE_ENV'] === 'development';
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Configuration based on environment
export const appConfig: AppConfig = {
  // API Base URL - automatically detects environment
  apiBaseUrl: isDevelopment || isLocalhost 
    ? '/api'  // Development: use proxy
    : '/api', // Production: use same origin
  
  isDevelopment,
  
  // Allow demo user ID when no user_id is provided
  allowDemoUser: isDevelopment || isLocalhost,
  
  // Supported languages for Android app integration
  supportedLanguages: ['en', 'ar'],
  defaultLanguage: 'en',
};

// API endpoints
export const apiEndpoints = {
  health: '/health',
  vouchers: (userId: string) => `/vouchers/${userId}`,
  // Add more endpoints as needed
};

// Android WebView specific configurations
export const webViewConfig = {
  // Headers that Android app might send
  expectedHeaders: [
    'X-App-Version',
    'X-User-Agent',
    'X-Device-ID',
  ],
  
  // URL parameters that Android app can send
  supportedParams: [
    'user_id',
    'token',
    'lang',
    'theme',
    'return_url',
    'app_version',
    'device_id',
  ],
};

export default appConfig; 