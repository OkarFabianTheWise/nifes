# Admin Roles System - Implementation Guide

## Overview
A complete role-based access control system has been implemented for the Fellowship Attendance application with two admin roles: **Superadmin** and **Admin**.

## Roles & Permissions

### 🔐 Superadmin
**Emails:**
- `samuelpeteropeyemi@gmail.com`
- `nifesgkfut@gmail.com`

**Permissions:**
- ✅ View all data (sessions, attendees, attendance records)
- ✅ Create sessions
- ✅ Send messages to attendees
- ✅ Add new admins
- ✅ Remove admins
- ✅ Update admin roles
- ✅ View admin dashboard with full analytics

### 👤 Admin
**Permissions:**
- ✅ View all data (sessions, attendees, attendance records)
- ✅ Create sessions
- ✅ Send messages to attendees
- ✅ View admin dashboard with analytics
- ❌ Cannot add/remove other admins
- ❌ Cannot modify admin roles

## Backend Implementation

### New Models

#### User Model (`models/User.js`)
```javascript
{
  email: String (unique, required, lowercase),
  password: String (hashed with bcryptjs),
  role: 'superadmin' | 'admin',
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### New Middleware

#### Auth Middleware (`middleware/authMiddleware.js`)
- `authenticateToken()` - Verifies JWT tokens from Authorization header
- `authorize(...roles)` - Checks if user has required role(s)

### New Routes

#### Authentication Routes (`routes/auth.js`)
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | ❌ | Login with email/password |
| `/api/auth/me` | GET | ✅ | Get current user info |
| `/api/auth/change-password` | POST | ✅ | Change own password |
| `/api/auth` | GET | ✅ (superadmin) | List all users |
| `/api/auth/add-admin` | POST | ✅ (superadmin) | Create new admin |
| `/api/auth/remove-admin/:userId` | DELETE | ✅ (superadmin) | Remove admin |
| `/api/auth/update-role/:userId` | PUT | ✅ (superadmin) | Update user role |

#### Admin Dashboard Routes (`routes/admin.js`)
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/admin/stats` | GET | ✅ (admin+) | Dashboard statistics |
| `/api/admin/sessions` | GET | ✅ (admin+) | All sessions with attendance |
| `/api/admin/attendees` | GET | ✅ (admin+) | All attendees directory |
| `/api/admin/sessions/:id` | GET | ✅ (admin+) | Session details & attendees |
| `/api/admin/sessions/:id/attendance` | GET | ✅ (admin+) | Attendance stats for session |
| `/api/admin/send-message` | POST | ✅ (admin+) | Send message to attendee |
| `/api/admin/search/attendee` | GET | ✅ (admin+) | Search attendees |

### Protected Routes

The following routes now require admin authentication:
- `POST /api/sessions` - Create session (superadmin/admin only)
- `GET /api/members` - View members list (superadmin/admin only)
- `GET /api/attendees` - View attendees (superadmin/admin only)

## Frontend Implementation

### New Pages

#### Login Page (`frontend/pages/login.jsx`)
- Email and password input
- JWT token storage in localStorage
- Redirect to dashboard on successful login
- Default password = email address

#### Admin Dashboard (`frontend/pages/admin/dashboard.jsx`)
- Tab-based navigation:
  - **Overview** - Dashboard stats (sessions, members, attendance)
  - **Sessions** - Previous sessions with expandable attendee lists
  - **Attendees** - Searchable attendee directory with messaging
  - **Messaging** - Send messages to attendees (placeholder)
  - **Admin Management** - Add/remove admins (superadmin only)
- User profile display with role badge
- Logout button

### New Components

#### Dashboard Stats (`frontend/components/admin/DashboardStats.jsx`)
- Display key metrics:
  - Total Sessions
  - Active Sessions
  - Total Members
  - Total Attendance Records

#### Session Table (`frontend/components/admin/SessionTable.jsx`)
- List all sessions with dates and attendance counts
- Expandable rows showing attendees per session
- Sort by date

#### Attendee Table (`frontend/components/admin/AttendeeTable.jsx`)
- Searchable attendee directory
- Filter by name, email, or phone
- Send message to individual attendees
- Show first scan date

#### Admin Management (`frontend/components/admin/AdminManagement.jsx`)
- Add new admin (superadmin only)
  - Email required
  - Optional name field
  - Default password is email
- List all admins with creation date
- Remove admin button (only for non-superadmin accounts)
- Role badge display

## How to Use

### First Time Setup (Automatic)
1. Superadmin accounts are automatically created on server startup
2. Both superadmin emails get default password = email address

### Admin Login Flow
1. Navigate to `/login`
2. Enter email and password
3. Click "Login"
4. Redirected to `/admin/dashboard`
5. Token stored in `localStorage` under key `token`
6. User info stored in `localStorage` under key `user`

### Add New Admin (Superadmin Only)
1. Go to Admin Dashboard → Admin Management tab
2. Fill in new admin email and optional name
3. Click "Add Admin"
4. New admin can login with email as password
5. New admin should change password immediately

### Send Message to Attendee
1. Go to Admin Dashboard → Attendees tab
2. Search for attendee (optional)
3. Click "💬 Message" button
4. Enter message and confirm
5. Message logs to backend (ready for SMS/Email integration)

### View Session Details
1. Go to Admin Dashboard → Sessions tab
2. Click "View" on any session
3. See all attendees for that session
4. Click "Hide" to collapse

## Security Considerations

### Password Hashing
- All passwords hashed with bcryptjs (10 rounds)
- Default admin passwords should be changed on first login

### JWT Tokens
- Tokens expire after 7 days
- Tokens stored in localStorage (could be moved to httpOnly cookies)
- Token includes: `id`, `email`, `role`

### Authorization
- All admin endpoints check role via middleware
- Superadmin emails hardcoded to prevent removal
- Rate limiting still applies to all routes

## API Response Examples

### Login Response
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "admin@example.com",
    "role": "superadmin",
    "name": "Admin Name"
  }
}
```

### Dashboard Stats Response
```json
{
  "totalSessions": 15,
  "activeSessions": 1,
  "totalMembers": 234,
  "totalAttendance": 1200
}
```

## Environment Variables Required

Ensure `.env` file includes:
```
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## File Structure

```
Backend:
├── models/
│   └── User.js (NEW)
├── middleware/
│   └── authMiddleware.js (NEW)
├── routes/
│   ├── auth.js (NEW)
│   ├── admin.js (NEW)
│   └── sessions.js (MODIFIED)
└── server.js (MODIFIED)

Frontend:
├── pages/
│   ├── login.jsx (NEW)
│   └── admin/
│       └── dashboard.jsx (NEW)
└── components/
    └── admin/
        ├── DashboardStats.jsx (NEW)
        ├── SessionTable.jsx (NEW)
        ├── AttendeeTable.jsx (NEW)
        └── AdminManagement.jsx (NEW)
```

## Testing

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"samuelpeteropeyemi@gmail.com", "password":"samuelpeteropeyemi@gmail.com"}'
```

### Test Protected Route
```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer <your_jwt_token>"
```

### Test Unauthorized Access
```bash
# This should fail with 401/403
curl -X GET http://localhost:5000/api/admin/stats
```

## Future Enhancements

- [ ] Email/SMS message integration
- [ ] Two-factor authentication
- [ ] Audit logs for admin actions
- [ ] Bulk message sending
- [ ] Export attendance reports
- [ ] Session analytics graphs
- [ ] Member notes/comments
- [ ] Role-based session creation limits
- [ ] Account deactivation instead of deletion
- [ ] Password reset via email

## Troubleshooting

### "Token expired" error
- User needs to login again
- Token expires after 7 days

### "Insufficient permissions" error
- User's role doesn't have permission for that action
- Contact superadmin to upgrade role

### "User already exists" when adding admin
- Email is already registered
- Use different email or have superadmin remove existing admin first

### Server won't start
- Check `JWT_SECRET` is set in `.env`
- Ensure MongoDB connection string is valid
- Check port 5000 is not in use

## Contact & Support
For issues or questions about the admin system, contact superadmin email.
