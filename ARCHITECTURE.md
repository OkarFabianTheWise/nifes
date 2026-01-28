# System Architecture Diagram

## Authentication Flow

```
┌─────────────────┐
│   Login Page    │
│   /login        │
└────────┬────────┘
         │
         │ POST /api/auth/login
         │ {email, password}
         ▼
┌─────────────────────┐
│  Backend Auth API   │
│  routes/auth.js     │
│                     │
│ 1. Find user by email
│ 2. Verify password
│ 3. Generate JWT
└────────┬────────────┘
         │
         │ Return JWT token
         │
         ▼
┌──────────────────────────┐
│  Store in localStorage   │
│  - token                 │
│  - user (role, email)    │
└────────┬─────────────────┘
         │
         │ Redirect
         ▼
┌──────────────────────────┐
│  Admin Dashboard         │
│  /admin/dashboard        │
│                          │
│ All API requests include │
│ Authorization: Bearer... │
└──────────────────────────┘
```

## Role-Based Access Control

```
                    ┌──────────────────┐
                    │     User Login   │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Check JWT Token │
                    └────────┬─────────┘
                             │
                    ┌────────▼──────────┐
                    │ Extract Role      │
                    │ from Token        │
                    └────────┬──────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
        ┌───────────────┐        ┌──────────────┐
        │ Superadmin    │        │ Admin        │
        │ 🔐            │        │ 👤           │
        └───────────────┘        └──────────────┘
             │                         │
    ┌────────┴─────────┐    ┌─────────┴────────┐
    │                  │    │                  │
    ▼                  ▼    ▼                  ▼
  Admin            Add/Remove  View Data    Create
  Manage           Admins      Only         Sessions
  (Full)           (Full)      (Yes)        (Yes)
   Yes             Yes         Yes          Yes
    │
    ├─ Can remove other admins
    ├─ Can change admin roles
    ├─ Can view all admin activity
    └─ Cannot be deleted

       Admin can:
       ├─ View data
       ├─ Create sessions
       ├─ Send messages
       └─ Search attendees
```

## Backend Endpoint Protection

```
┌─────────────────────────────────────────────────────────┐
│                   Backend Routes                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PUBLIC (No Auth Required)                              │
│  ├─ POST /api/auth/login                               │
│  ├─ POST /api/attendance (QR attendance)               │
│  └─ POST /api/scan (QR scanning)                        │
│                                                         │
│  PROTECTED (Admin+ Required)                            │
│  ├─ GET /api/members                                   │
│  ├─ POST /api/sessions (create)                         │
│  ├─ GET /api/attendees                                 │
│  ├─ GET /api/admin/*                                   │
│  └─ POST /api/admin/send-message                        │
│                                                         │
│  SUPERADMIN ONLY                                        │
│  ├─ GET /api/auth (list users)                          │
│  ├─ POST /api/auth/add-admin                            │
│  ├─ DELETE /api/auth/remove-admin/:id                  │
│  └─ PUT /api/auth/update-role/:id                       │
│                                                         │
└─────────────────────────────────────────────────────────┘

Each protected request:
┌────────────────────────────────┐
│ Request Headers               │
│ Authorization: Bearer <JWT>   │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│ authenticateToken()            │
│ (Verify JWT is valid)          │
└────────────┬───────────────────┘
             │ Success
             ▼
┌────────────────────────────────┐
│ authorize("admin", "superadmin")
│ (Check user role)              │
└────────────┬───────────────────┘
             │ Has role
             ▼
┌────────────────────────────────┐
│ Route Handler Executes         │
│ (Perform requested action)     │
└────────────────────────────────┘
```

## Frontend Navigation Structure

```
┌─────────────────────────────────────────────────────────┐
│             Admin Dashboard                             │
│             /admin/dashboard                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Header Bar: User Profile | Logout Button              │
│                                                         │
│  Navigation Tabs:                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Overview | Sessions | Attendees | Messaging... │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Tab Content                                     │   │
│  │                                                 │   │
│  │ [Overview Tab]                                  │   │
│  │ ├─ DashboardStats Component                    │   │
│  │ │  ├─ Total Sessions Card                      │   │
│  │ │  ├─ Active Sessions Card                     │   │
│  │ │  ├─ Total Members Card                       │   │
│  │ │  └─ Total Attendance Card                    │   │
│  │                                                 │   │
│  │ [Sessions Tab]                                  │   │
│  │ ├─ SessionTable Component                      │   │
│  │ │  ├─ Session Name, Date, Count                │   │
│  │ │  └─ Expandable: Show attendees               │   │
│  │                                                 │   │
│  │ [Attendees Tab]                                 │   │
│  │ ├─ Search Bar                                  │   │
│  │ └─ AttendeeTable Component                     │   │
│  │    ├─ Name, Email, Phone, Date                 │   │
│  │    └─ Message Button                           │   │
│  │                                                 │   │
│  │ [Admin Management Tab] (Superadmin Only)       │   │
│  │ ├─ Add Admin Form                              │   │
│  │ │  ├─ Email Input                              │   │
│  │ │  └─ Name Input (Optional)                    │   │
│  │ └─ AdminManagement Component                   │   │
│  │    ├─ List all admins                          │   │
│  │    └─ Remove admin button                      │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
USER LOGIN
    │
    ├─→ Sends credentials to /api/auth/login
    │
    ├─→ Backend validates:
    │   ├─ User exists?
    │   ├─ Password correct?
    │   └─ Generate JWT
    │
    ├─→ Frontend receives token
    │
    ├─→ Stores in localStorage
    │
    └─→ Redirects to /admin/dashboard

DASHBOARD LOAD
    │
    ├─→ Check localStorage for token
    │
    ├─→ Fetch /api/admin/stats (with token)
    │   └─→ Get stats counts
    │
    ├─→ Fetch /api/admin/sessions (with token)
    │   └─→ Get all sessions with attendance
    │
    ├─→ Fetch /api/admin/attendees (with token)
    │   └─→ Get all member records
    │
    └─→ Render Dashboard with all data

USER ACTION
    │
    ├─→ Click "Send Message"
    │
    ├─→ Frontend POSTs to /api/admin/send-message
    │   ├─ Includes JWT token
    │   └─ Includes message
    │
    ├─→ Backend validates token
    │
    ├─→ Backend checks role (admin+)
    │
    ├─→ Backend logs message (ready for integration)
    │
    └─→ Frontend shows success toast
```

## User Authentication Lifecycle

```
┌──────────────┐
│ Fresh Load   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ Check localStorage       │
│ for token & user data    │
└──────┬───────────────────┘
       │
       ├─ No token found
       │  └─→ Redirect to /login
       │
       └─ Token found
          │
          ▼
       ┌──────────────────┐
       │ Try API request  │
       │ with token       │
       └──────┬───────────┘
              │
              ├─ 401 Unauthorized
              │  └─→ Clear localStorage
              │      └─→ Redirect to /login
              │
              ├─ 403 Forbidden
              │  └─→ User doesn't have role
              │      └─→ Redirect to home
              │
              └─ 200 Success
                 └─→ Load dashboard
                     └─→ Render user content

LOGOUT
    │
    ├─→ User clicks logout
    │
    ├─→ Clear localStorage
    │   ├─ token
    │   └─ user
    │
    └─→ Redirect to /login
```

## File Organization

```
nifes/
├── Backend Files
│   ├── models/
│   │   ├── User.js ........................ User model with roles
│   │   ├── Member.js ..................... Existing member model
│   │   ├── Session.js ................... Existing session model
│   │   └── AttendanceRecord.js ......... Existing attendance model
│   │
│   ├── middleware/
│   │   └── authMiddleware.js ............ JWT & authorization
│   │
│   ├── routes/
│   │   ├── auth.js ...................... Authentication API
│   │   ├── admin.js ..................... Admin dashboard API
│   │   ├── sessions.js (modified) ...... Add auth to POST
│   │   ├── members.js (protected) ...... Now requires admin auth
│   │   ├── attendance.js ............... Public (QR attendance)
│   │   └── scan.js ..................... Public (QR scan)
│   │
│   ├── server.js (modified) ............ Add auth routes
│   │
│   └── config/
│       └── db.js ........................ MongoDB connection
│
├── Frontend Files
│   ├── pages/
│   │   ├── login.jsx ................... Login page (NEW)
│   │   ├── admin/
│   │   │   └── dashboard.jsx .......... Admin dashboard (NEW)
│   │   └── [other pages]
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── DashboardStats.jsx ..... Stats component (NEW)
│   │   │   ├── SessionTable.jsx ....... Sessions list (NEW)
│   │   │   ├── AttendeeTable.jsx ...... Attendees (NEW)
│   │   │   └── AdminManagement.jsx ... Admin controls (NEW)
│   │   │
│   │   ├── Toast.jsx .................. Existing toast component
│   │   └── [other components]
│   │
│   ├── hooks/ .......................... Existing hooks
│   └── styles/ ......................... Existing styles
│
├── Documentation Files
│   ├── ADMIN_ROLES_GUIDE.md ............ Complete guide
│   ├── ADMIN_QUICK_START.md ........... Quick reference
│   ├── IMPLEMENTATION_SUMMARY.md ..... What was built
│   └── FINAL_CHECKLIST.md ............ Setup & testing
│
├── Configuration Files
│   ├── nifes-attendance.env ........... Environment variables
│   ├── package.json ................... Dependencies
│   └── .env ........................... Local variables (git ignored)
│
└── Root Files
    ├── server.js ...................... Main server file
    ├── ecosystem.config.js ........... PM2 config
    └── [other config files]
```

This architecture ensures:
✅ Security through JWT & role-based access
✅ Clear separation of concerns
✅ Protected admin routes
✅ Public QR scanning endpoints
✅ User-friendly dashboard interface
✅ Scalable design for future features
