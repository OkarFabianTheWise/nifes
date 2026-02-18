import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { isTokenExpired, clearAuthData, getTokenRemainingTime } from '../utils/tokenUtils';

/**
 * Hook to check session expiration and handle logout
 * Can optionally show a warning when session is about to expire
 */
export const useSessionExpiration = (showWarningAt = 300) => {
  const router = useRouter();

  const handleSessionExpired = useCallback(() => {
    console.warn('Session expired, logging out...');
    clearAuthData();
    router.push('/login');
  }, [router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    if (!token) return;

    // Check immediately on mount
    if (isTokenExpired(token)) {
      handleSessionExpired();
      return;
    }

    // Set up interval to check expiration every minute
    const checkInterval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      if (!currentToken || isTokenExpired(currentToken)) {
        handleSessionExpired();
        clearInterval(checkInterval);
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [handleSessionExpired]);

  // Return remaining time in seconds
  const remainingTime = typeof window !== 'undefined' ? getTokenRemainingTime(localStorage.getItem('token')) : 0;

  return { handleSessionExpired, remainingTime };
};
