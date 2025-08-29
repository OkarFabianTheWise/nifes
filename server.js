import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import memberRoutes from "./routes/members.js";
import sessionRoutes from "./routes/sessions.js";
import attendanceRoutes from "./routes/attendance.js";
import attendeeRoutes from "./routes/attendeeRoutes.js";
import scanRoutes from "./routes/scan.js";


dotenv.config();
const app = express();
connectDB();

// ✅ CORS: allow requests only from your frontend
app.use(cors({
  origin: "https://fellowship-attendance.vercel.app" // frontend URL
}));

app.use(express.json());

// Root route
app.get("/", (req, res) => res.send("✅ API is running"));

// Routes
app.use("/api/members", memberRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/attendees", attendeeRoutes);
app.use("/scan", scanRoutes);

// PORT setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
