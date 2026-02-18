import axios from 'axios';
import { isTokenExpired, clearAuthData } from './tokenUtils';

const apiUrl = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') : '';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: apiUrl,
});

// Request interceptor: Add token to headers and check expiration
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      
      // Check if token is expired
      if (token && isTokenExpired(token)) {
        console.warn('Token expired, logging out...');
        clearAuthData();
        
        // Redirect to login
        if (typeof window !== 'undefined' && window.location) {
          window.location.href = '/login';
        }
        
        return Promise.reject(new Error('Token expired'));
      }
      
      // Add token to headers if it exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 and 403 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Unauthorized access, logging out...');
      clearAuthData();
      
      // Redirect to login
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
