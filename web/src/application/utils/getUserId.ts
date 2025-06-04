// Utility to extract user ID from URL params or token
export const getUserId = (): string | null => {
  // Try to get user ID from URL search params
  const urlParams = new URLSearchParams(window.location.search);
  const userIdFromParams = urlParams.get('user_id');
  
  if (userIdFromParams) {
    return userIdFromParams;
  }

  // Try to get from hash params (for mobile WebView)
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const userIdFromHash = hashParams.get('user_id');
  
  if (userIdFromHash) {
    return userIdFromHash;
  }

  // For demo purposes, return a default user ID
  // In production, this would extract from JWT token or session
  return '98765';
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