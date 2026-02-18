import jwtDecode from 'jwt-decode';

/**
 * Decode JWT token and extract payload
 */
export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    // exp is in seconds, convert to milliseconds
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    
    return currentTime >= expirationTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Get remaining time until token expires (in seconds)
 */
export const getTokenRemainingTime = (token) => {
  if (!token) return 0;
  
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return 0;
    
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const remainingTime = Math.floor((expirationTime - currentTime) / 1000);
    
    return Math.max(0, remainingTime);
  } catch (error) {
    console.error('Error getting remaining time:', error);
    return 0;
  }
};

/**
 * Clear auth data from localStorage
 */
export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

/**
 * Check if user is authenticated and token is valid
 */
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('token');
  return token && !isTokenExpired(token);
};
