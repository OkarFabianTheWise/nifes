import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isTokenExpired, clearAuthData } from '../../utils/tokenUtils';

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Check if token exists and is not expired
    if (!token || isTokenExpired(token)) {
      console.warn('Session expired or no token, redirecting to login...');
      clearAuthData();
      router.push('/login');
      return;
    }
    
    // Token is valid, redirect to dashboard
    router.push('/admin/dashboard');
  }, [router]);

  return <div>Redirecting to dashboard...</div>;
}
