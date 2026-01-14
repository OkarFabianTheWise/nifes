# Nifes Frontend (Next.js)

This is a lightweight Next.js frontend for the Fellowship Attendance app. It expects your backend to run at `http://localhost:5000` by default.

Quick start:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

Notes:
- The UI stores the API base URL in localStorage. Change it at the top of the page if needed.
- Endpoints used: `/api/sessions`, `/api/sessions/active`, `/api/members`, `/api/attendance`, `/api/scan`.
