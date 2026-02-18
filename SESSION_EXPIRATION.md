# Admin Session Expiration Implementation

## Overview

This document describes the automatic session expiration and logout feature implemented for the admin dashboard.

## Changes Made

### Backend (Server)

1. **Token Expiration Time**: Updated from 7 days to 24 hours
   - File: `routes/auth.js`
   - Set `expiresIn: "24h"` in JWT sign options
2. **Login Response**: Now includes expiration info

   - Returns `expiresAt` timestamp (in Unix seconds)
   - Returns `expiresIn` string ("24h")

3. **Token Validation**: Already validates in middleware
   - File: `middleware/authMiddleware.js`
   - Uses `jwt.verify()` to check expiration
   - Returns 403 error if token is expired or invalid

### Frontend (Client)

#### New Files Created:

1. **`frontend/utils/tokenUtils.js`**

   - `decodeToken(token)` - Decode JWT and extract payload
   - `isTokenExpired(token)` - Check if token is expired
   - `getTokenRemainingTime(token)` - Get seconds until expiration
   - `clearAuthData()` - Clear token and user from localStorage
   - `isAuthenticated()` - Check if user has valid token

2. **`frontend/utils/axiosInstance.js`**

   - Axios instance with request/response interceptors
   - Request: Checks token expiration before API calls
   - Response: Handles 401/403 errors (unauthorized)
   - Auto-redirects to login if token is expired

3. **`frontend/hooks/useSessionExpiration.js`**
   - Custom React hook for session monitoring
   - Checks token expiration on mount
   - Checks every minute while component is mounted
   - Auto-logout if token expires
   - Returns remaining time in seconds

#### Updated Files:

1. **`frontend/package.json`**

   - Added `jwt-decode` dependency version ^3.1.2

2. **`frontend/pages/login.jsx`**

   - Stores `tokenExpiresAt` in localStorage on login
   - Used by frontend for countdown/warning features

3. **`frontend/pages/admin/index.jsx`**

   - Checks token expiration on page load
   - Redirects expired sessions to login
   - Uses `isTokenExpired()` utility

4. **`frontend/pages/admin/dashboard.jsx`**
   - Imports and uses `useSessionExpiration` hook
   - Checks token on component mount
   - Shows error toast with "Session expired" message
   - Uses `clearAuthData()` for logout

## Security Flow

```
1. Admin logs in with email/password
   ↓
2. Backend validates credentials & creates JWT token (24hr expiration)
   ↓
3. Frontend stores token in localStorage
   ↓
4. Frontend makes API requests with axios interceptor
   ↓
5. Interceptor checks token expiration before each request
   ↓
   If token is expired:
   - Clear auth data from localStorage
   - Redirect to /login page
   - Show error message
   ↓
6. When admin visits admin pages:
   - Check token on mount
   - If expired, auto-logout and redirect
   - Periodically check (every minute) while on page
```

## How It Works

### On Page Load (Admin Dashboard)

1. Check if token exists in localStorage
2. Decode token using `jwt-decode`
3. Compare token's `exp` claim with current timestamp
4. If expired: clear localStorage and redirect to login
5. If valid: load dashboard

### On API Requests

1. Request interceptor checks token before sending
2. If expired: auto-logout and redirect
3. If valid: add token to Authorization header
4. Response interceptor handles 401/403 errors

### Continuous Monitoring

1. `useSessionExpiration` hook runs check every minute
2. If token expires while user is on dashboard
3. Automatically logs out and redirects to login

## Installation & Setup

1. **Install dependencies:**

   ```bash
   cd frontend
   npm install
   ```

   (jwt-decode will be installed as part of npm install)

2. **Verify changes:**
   - Token is now set to 24-hour expiration
   - Admin is logged out when session expires
   - Can't use expired tokens for API calls

## Testing

1. **Test token expiration:**

   - Login to admin panel
   - Wait for token to expire (or manually test by modifying the token)
   - Attempt to use the dashboard
   - Should be automatically logged out

2. **Test interceptor:**

   - Make an API request with an expired token
   - Should receive 403 error
   - Should be redirected to login

3. **Test page reload:**
   - Login and note the time
   - Reload page within 24 hours
   - Should load dashboard
   - After 24 hours, should redirect to login

## Future Enhancements

1. **Session Warning**: Show warning 5 minutes before expiration
2. **Session Refresh**: Implement refresh token flow to extend session
3. **Remember Me**: Option to stay logged in longer
4. **Activity Timeout**: Logout if inactive for X minutes
5. **Session Display**: Show remaining time in admin header
