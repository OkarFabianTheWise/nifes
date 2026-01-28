# Admin Roles System - Test Cases

## Manual Testing Guide

### Prerequisites
- Server running on http://localhost:5000
- Frontend running on http://localhost:3000
- MongoDB connected and accessible
- JWT_SECRET set in .env

---

## Test Suite 1: Authentication

### Test 1.1: Superadmin Auto-Initialization ✅
**Expected**: Superadmin accounts created on server startup

**Steps**:
1. Start server: `npm run dev`
2. Check console output

**Expected Output**:
```
✅ MongoDB Connected
✅ Superadmin created: samuelpeteropeyemi@gmail.com
✅ Superadmin created: nifesgkfut@gmail.com
```

### Test 1.2: Valid Login
**Endpoint**: `POST /api/auth/login`

**Test Data**:
```json
{
  "email": "samuelpeteropeyemi@gmail.com",
  "password": "samuelpeteropeyemi@gmail.com"
}
```

**Expected Response**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id_here",
    "email": "samuelpeteropeyemi@gmail.com",
    "role": "superadmin",
    "name": "samuelpeteropeyemi"
  }
}
```

**Test Command**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"samuelpeteropeyemi@gmail.com",
    "password":"samuelpeteropeyemi@gmail.com"
  }'
```

### Test 1.3: Invalid Password
**Test Data**:
```json
{
  "email": "samuelpeteropeyemi@gmail.com",
  "password": "wrong_password"
}
```

**Expected Response** (401):
```json
{
  "error": "Invalid email or password"
}
```

### Test 1.4: Non-Existent User
**Test Data**:
```json
{
  "email": "nonexistent@example.com",
  "password": "anypassword"
}
```

**Expected Response** (401):
```json
{
  "error": "Invalid email or password"
}
```

### Test 1.5: Missing Required Fields
**Test Data**:
```json
{
  "email": "samuelpeteropeyemi@gmail.com"
}
```

**Expected Response** (400):
```json
{
  "error": "Email and password are required"
}
```

---

## Test Suite 2: Protected Routes

### Test 2.1: Access Admin Stats Without Token
**Endpoint**: `GET /api/admin/stats`

**Test Command**:
```bash
curl -X GET http://localhost:5000/api/admin/stats
```

**Expected Response** (401):
```json
{
  "error": "Access token required"
}
```

### Test 2.2: Access Admin Stats With Invalid Token
**Test Command**:
```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer invalid_token"
```

**Expected Response** (403):
```json
{
  "error": "Invalid or expired token"
}
```

### Test 2.3: Access Admin Stats With Valid Token
**Prerequisites**: Get token from Test 1.2

**Test Command**:
```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer <TOKEN_FROM_TEST_1.2>"
```

**Expected Response** (200):
```json
{
  "totalSessions": 0,
  "activeSessions": 0,
  "totalMembers": 0,
  "totalAttendance": 0
}
```

---

## Test Suite 3: Admin Management (Superadmin Only)

### Test 3.1: List All Users
**Endpoint**: `GET /api/auth`

**Prerequisites**: Valid superadmin token

**Test Command**:
```bash
curl -X GET http://localhost:5000/api/auth \
  -H "Authorization: Bearer <SUPERADMIN_TOKEN>"
```

**Expected Response** (200):
```json
[
  {
    "_id": "user_id",
    "email": "samuelpeteropeyemi@gmail.com",
    "role": "superadmin",
    "name": "samuelpeteropeyemi",
    "createdAt": "2026-01-28T...",
    "updatedAt": "2026-01-28T..."
  }
]
```

### Test 3.2: Add New Admin (By Superadmin)
**Endpoint**: `POST /api/auth/add-admin`

**Prerequisites**: Valid superadmin token

**Test Data**:
```json
{
  "email": "newidmin@example.com",
  "name": "New Admin"
}
```

**Test Command**:
```bash
curl -X POST http://localhost:5000/api/auth/add-admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SUPERADMIN_TOKEN>" \
  -d '{
    "email":"newadmin@example.com",
    "name":"New Admin"
  }'
```

**Expected Response** (200):
```json
{
  "message": "Admin added successfully",
  "user": {
    "id": "new_user_id",
    "email": "newadmin@example.com",
    "role": "admin",
    "name": "New Admin"
  }
}
```

### Test 3.3: Add Admin With Duplicate Email
**Test Data**:
```json
{
  "email": "samuelpeteropeyemi@gmail.com"
}
```

**Expected Response** (400):
```json
{
  "error": "User already exists"
}
```

### Test 3.4: Admin Cannot Add New Admin
**Prerequisites**: Login as regular admin, get their token

**Test Command**:
```bash
curl -X POST http://localhost:5000/api/auth/add-admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"email":"another@example.com"}'
```

**Expected Response** (403):
```json
{
  "error": "Insufficient permissions"
}
```

### Test 3.5: Remove Admin
**Endpoint**: `DELETE /api/auth/remove-admin/:userId`

**Prerequisites**: Superadmin token, user ID from Test 3.2

**Test Command**:
```bash
curl -X DELETE http://localhost:5000/api/auth/remove-admin/<USER_ID> \
  -H "Authorization: Bearer <SUPERADMIN_TOKEN>"
```

**Expected Response** (200):
```json
{
  "message": "Admin removed successfully"
}
```

### Test 3.6: Cannot Remove Superadmin
**Prerequisites**: Superadmin token, superadmin user ID

**Expected Response** (403):
```json
{
  "error": "Cannot remove superadmin"
}
```

---

## Test Suite 4: Session Creation

### Test 4.1: Create Session Without Auth
**Endpoint**: `POST /api/sessions`

**Test Data**:
```json
{
  "name": "Test Session"
}
```

**Expected Response** (401):
```json
{
  "error": "Access token required"
}
```

### Test 4.2: Create Session As Admin
**Prerequisites**: Valid admin token

**Test Command**:
```bash
curl -X POST http://localhost:5000/api/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"name":"Test Session"}'
```

**Expected Response** (201):
```json
{
  "_id": "session_id",
  "name": "Test Session",
  "date": "2026-01-28T...",
  "qrData": "http://localhost:3000/attend/session_id",
  "is_active": true,
  "qrCodeImage": "data:image/png;base64,..."
}
```

---

## Test Suite 5: Frontend Testing

### Test 5.1: Login Page Loads
1. Navigate to http://localhost:3000/login
2. Verify page shows email and password inputs
3. Verify "Login" button is present

### Test 5.2: Successful Login Flow
1. Enter superadmin email: `samuelpeteropeyemi@gmail.com`
2. Enter password: `samuelpeteropeyemi@gmail.com`
3. Click "Login"
4. Verify redirect to `/admin/dashboard`
5. Verify localStorage contains:
   - `token` (non-empty)
   - `user` (JSON with email, role, etc.)

**Check localStorage in browser console**:
```javascript
console.log(localStorage.getItem('token'));
console.log(JSON.parse(localStorage.getItem('user')));
```

### Test 5.3: Failed Login Shows Error
1. Enter wrong password
2. Click "Login"
3. Verify error toast appears

### Test 5.4: Dashboard Loads After Login
1. Login successfully
2. Verify dashboard shows user email in header
3. Verify "🔐 Superadmin" badge shows if superadmin
4. Verify tabs appear: Overview, Sessions, Attendees, Admin Management

### Test 5.5: Tab Navigation Works
1. Click "Sessions" tab
2. Verify sessions list displays
3. Click "Attendees" tab
4. Verify attendees list displays
5. Click "Overview" tab
6. Verify stats cards display

### Test 5.6: Logout Works
1. Click "Logout" button
2. Verify redirect to `/login`
3. Verify localStorage cleared

### Test 5.7: Protected Routes Redirect
1. Clear localStorage manually
2. Navigate to http://localhost:3000/admin/dashboard
3. Verify redirect to `/login`

---

## Test Suite 6: Data Viewing (Privacy)

### Test 6.1: Admin Can View Member Details
1. Login as admin
2. Go to "Attendees" tab
3. Verify attendee list visible (if attendees exist)
4. Verify can see names, emails, phone numbers

### Test 6.2: Admin Can View Session Details
1. Go to "Sessions" tab
2. Click "View" on any session
3. Verify attendees list shows
4. Verify attendance count displays

### Test 6.3: Admin Can Search Attendees
1. Go to "Attendees" tab
2. Type search query
3. Verify list filters by name/email/phone
4. Verify "Showing X of Y attendees"

---

## Test Suite 7: Admin Management

### Test 7.1: Superadmin Can Add Admin
1. Login as superadmin
2. Click "Admin Management" tab
3. Enter email: `test@example.com`
4. Enter name: `Test Admin`
5. Click "Add Admin"
6. Verify success toast
7. Verify admin appears in list

### Test 7.2: New Admin Can Login
1. Logout as superadmin
2. Go to login page
3. Enter: `test@example.com` / `test@example.com`
4. Verify login succeeds
5. Verify dashboard shows "👤 Admin" badge

### Test 7.3: Superadmin Can Remove Admin
1. Login as superadmin
2. Go to "Admin Management"
3. Find the test admin created above
4. Click "Remove"
5. Verify confirmation dialog
6. Verify admin removed from list

### Test 7.4: Admin Cannot Access Admin Management Tab
1. Login as regular admin
2. Verify "Admin Management" tab does NOT appear
3. Verify can only see: Overview, Sessions, Attendees, Messaging

---

## Test Suite 8: Message Sending

### Test 8.1: Admin Can Send Message
1. Login as admin
2. Go to "Attendees" tab
3. Click "💬 Message" on any attendee
4. Enter message: "Test message"
5. Click OK
6. Verify success toast
7. Check backend logs for message output

### Test 8.2: Backend Logs Message
Check server logs when sending message:
```
Message sent to attendee@example.com: Test message
```

---

## Test Suite 9: Token Expiration

### Test 9.1: Expired Token Triggers Relogin
1. Login successfully
2. Wait for token to expire (or manually set token to expired JWT)
3. Try any admin action
4. Verify error: "Token expired"
5. Verify redirect to login

---

## Test Suite 10: Error Scenarios

### Test 10.1: Database Connection Lost
1. Disconnect MongoDB
2. Try any admin action
3. Verify error: "Internal Server Error" or "Failed to fetch"

### Test 10.2: CORS Error
1. Set wrong FRONTEND_URL in backend .env
2. Try login from frontend
3. Verify CORS error in console

### Test 10.3: Rate Limiting
1. Send 51 POST requests to /api/auth/login in 1 minute
2. 51st request should return error: "Too many requests"

---

## Performance Tests

### Test P1: Dashboard Loads Quickly
1. Login
2. Check Network tab in browser DevTools
3. Verify all requests complete within 2 seconds

### Test P2: Search Performs Well
1. Go to Attendees tab
2. Type search query
3. Verify results show within 500ms

### Test P3: Session Expansion Is Quick
1. Click "View" on session
2. Verify attendees list shows within 1 second

---

## Security Tests

### Test S1: Password Not Returned in API
1. Login and get user response
2. Verify "password" field NOT in response
3. Verify only: id, email, role, name

### Test S2: Superadmin Cannot Be Deleted
1. Try to delete superadmin via API
2. Verify error: "Cannot remove superadmin"

### Test S3: Non-Admin Cannot View Admin Routes
1. Create regular user (non-admin)
2. Try to access `/api/admin/stats`
3. Verify error: "Insufficient permissions"

### Test S4: Tokens Cannot Be Used Multiple Times
1. Get token from login
2. Use token twice rapidly
3. Verify both requests succeed (normal behavior)
4. Wait for token expiration
5. Use expired token
6. Verify error: "Invalid or expired token"

---

## Test Results Template

```
Test Suite: _______________
Date: _______________
Tester: _______________

| Test ID | Test Name | Expected | Actual | Status |
|---------|-----------|----------|--------|--------|
| 1.1 | Superadmin Init | Created | ✅/❌ | ✅/❌ |
| 1.2 | Valid Login | Token | ✅/❌ | ✅/❌ |
| ... | ... | ... | ... | ... |

Notes:
_________________________________
_________________________________

Sign Off: _______________
```

---

## Quick Test Command Set

```bash
# Test 1: Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"samuelpeteropeyemi@gmail.com","password":"samuelpeteropeyemi@gmail.com"}'

# Test 2: Get Stats (use token from Test 1)
TOKEN="<paste_token_here>"
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer $TOKEN"

# Test 3: Add Admin
curl -X POST http://localhost:5000/api/auth/add-admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"email":"test@example.com","name":"Test Admin"}'

# Test 4: Get All Users
curl -X GET http://localhost:5000/api/auth \
  -H "Authorization: Bearer $TOKEN"

# Test 5: Create Session
curl -X POST http://localhost:5000/api/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Test Session"}'
```

---

All tests should pass for production deployment ✅
