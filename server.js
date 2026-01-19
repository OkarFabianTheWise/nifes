import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";

import memberRoutes from "./routes/members.js";
import sessionRoutes from "./routes/sessions.js";
import attendanceRoutes from "./routes/attendance.js";
import attendeeRoutes from "./routes/attendeeRoutes.js";
import scanRoutes from "./routes/scan.js";


dotenv.config();
const app = express();
connectDB();

// ✅ CORS: allow requests from configured frontend and localhost during development
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000', 'https://fellowship-attendance.vercel.app'].filter(Boolean);
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Origin not allowed'));
  }
}));

// ✅ RATE LIMITING: Prevent abuse & handle spikes
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per IP
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for GET requests (adjust as needed)
  skip: (req) => req.method === 'GET' && req.path === '/',
});

const scanLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50, // Tighter limit for scan endpoint (duplicate scans)
  message: 'Too many scans, please wait',
  keyGenerator: (req) => req.body.phone || req.ip, // Limit by phone number
});

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Root route
app.get("/", (req, res) => res.send("✅ API is running"));

// Routes
app.use("/api/members", memberRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/attendees", attendeeRoutes);
app.use("/api/scan", scanLimiter, scanRoutes); // Stricter rate limit for scan

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)).close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// PORT setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
