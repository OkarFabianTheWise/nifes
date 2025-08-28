import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import memberRoutes from "./routes/members.js";
import sessionRoutes from "./routes/sessions.js";
import attendanceRoutes from "./routes/attendance.js";
import attendeeRoutes from "./routes/attendeeRoutes.js";

dotenv.config();
const app = express();

// ✅ Connect to MongoDB once
connectDB();

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => res.send("✅ API is running"));

// Routes
app.use("/api/members", memberRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/attendees", attendeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
