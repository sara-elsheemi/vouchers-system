// Utility to extract user ID from URL params or token
export const getUserId = (): string | null => {
  // Try to get user ID from URL search params
  const urlParams = new URLSearchParams(window.location.search);
  const userIdFromParams = urlParams.get('user_id');
  
  if (userIdFromParams && isValidUserId(userIdFromParams)) {
    return userIdFromParams;
  }

  // Try to get from hash params (for mobile WebView)
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const userIdFromHash = hashParams.get('user_id');
  
  if (userIdFromHash && isValidUserId(userIdFromHash)) {
    return userIdFromHash;
  }

  // No valid user_id found - return null to show authentication required screen
  console.warn('No valid user_id found in URL parameters.');
  return null;
};

// Validate user ID format
const isValidUserId = (userId: string): boolean => {
  // Accept numeric strings (can be customized based on your ID format)
  return /^[0-9]+$/.test(userId) && userId.length > 0;
};

// Utility to extract auth token if provided
export const getAuthToken = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    // Store in sessionStorage for API calls
    sessionStorage.setItem('auth_token', token);
    return token;
  }

  // Check if token is already stored
  return sessionStorage.getItem('auth_token');
};

// Utility to extract additional params that Android might send
export const getAppParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  
  return {
    userId: getUserId(),
    token: getAuthToken(),
    language: urlParams.get('lang') || hashParams.get('lang') || 'en',
    theme: urlParams.get('theme') || hashParams.get('theme') || 'light',
    returnUrl: urlParams.get('return_url') || hashParams.get('return_url'),
    // Add more params as needed
  };
};