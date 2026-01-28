# Admin Roles Quick Reference

## 🎯 Quick Start

### 1. Setup Environment
```bash
# Copy to your .env file
JWT_SECRET=your_super_secret_key_here
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 2. Start Server
```bash
npm run dev
```

### 3. Login
- Navigate to: `http://localhost:3000/login`
- Use one of these superadmin accounts:
  - Email: `samuelpeteropeyemi@gmail.com`
  - Email: `nifesgkfut@gmail.com`
  - Password: (same as email for first login)

### 4. After Login
- You'll be redirected to `/admin/dashboard`
- Change your password immediately

## 👥 Role Comparison

| Feature | Superadmin | Admin |
|---------|-----------|-------|
| View Data | ✅ | ✅ |
| Create Sessions | ✅ | ✅ |
| Send Messages | ✅ | ✅ |
| Add Admin | ✅ | ❌ |
| Remove Admin | ✅ | ❌ |
| Change Roles | ✅ | ❌ |
| Access Dashboard | ✅ | ✅ |

## 🔑 Key Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/change-password
GET /api/auth/me
```

### Admin Only
```
GET /api/admin/stats
GET /api/admin/sessions
GET /api/admin/attendees
POST /api/admin/send-message
```

### Superadmin Only
```
GET /api/auth (list all users)
POST /api/auth/add-admin
DELETE /api/auth/remove-admin/:userId
PUT /api/auth/update-role/:userId
```

## 🚨 Default Passwords

New admin accounts created with **email as password**.

⚠️ **Important**: All users must change password on first login!

## 📝 Adding a New Admin (Superadmin Only)

1. Login to dashboard
2. Click "Admin Management" tab
3. Enter new admin's email
4. Click "Add Admin"
5. New admin logs in with email as password
6. New admin changes password

## 📤 Sending Messages

1. Go to "Attendees" tab
2. Search for attendee (optional)
3. Click "💬 Message"
4. Type message and confirm
5. Backend logs message (ready for SMS/Email integration)

## 🔐 Security Notes

- Tokens expire after 7 days
- Passwords stored with bcryptjs hashing
- Superadmin accounts cannot be deleted
- All admin actions are logged to console (add to database in future)

## 🐛 Common Issues

### "Invalid token" when accessing dashboard
→ Clear browser localStorage and login again

### Can't create session
→ User account doesn't have admin role. Contact superadmin.

### "CORS error" when calling API
→ Check `FRONTEND_URL` is set in backend .env
→ Check frontend `NEXT_PUBLIC_API_URL` matches API host

### Can't find attendee in search
→ Try searching with different field (name, email, phone)
→ Make sure attendee has scanned QR code

## 📚 Full Documentation
See `ADMIN_ROLES_GUIDE.md` for complete implementation details.

## 💾 Database Models

### User Document
```json
{
  "_id": "ObjectId",
  "email": "admin@example.com",
  "password": "bcrypt_hashed_password",
  "role": "superadmin|admin",
  "name": "Admin Name",
  "createdAt": "2026-01-28T00:00:00Z",
  "updatedAt": "2026-01-28T00:00:00Z"
}
```

## 🔄 Future Features Coming Soon

- Email notifications when messages sent
- SMS integration for attendee alerts
- Attendance report exports
- Advanced analytics dashboards
- Role-based rate limiting
- Account deactivation feature
