import express from "express";
import QRCode from "qrcode";
import Session from "../models/Session.js";
import { authenticateToken, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET active session
router.get("/active", async (req, res) => {
  try {
    const activeSession = await Session.findOne({ is_active: true }).sort({ createdAt: -1 });
    res.json(activeSession || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new session (admin only)
router.post("/", authenticateToken, authorize("superadmin", "admin"), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Session name is required" });
    }

    // Deactivate all previous sessions
    await Session.updateMany({}, { is_active: false });

    // Create new session
    const newSession = new Session({ name, is_active: true });
    await newSession.save();

    // Determine frontend URL from environment or fallback
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    // Generate QR code pointing to the frontend attendance page
    const qrData = `${frontendUrl}/attend/${newSession._id}`;
    const qrCodeImage = await QRCode.toDataURL(qrData);

    newSession.qrData = qrData;
    await newSession.save();

    res.status(201).json({ ...newSession.toObject(), qrCodeImage });
  } catch (err) {
    console.error("❌ Session creation error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// GET session stats (first timers, absentees, attendance for this session)
router.get("/:id/stats", async (req, res) => {
  try {
    const { id: sessionId } = req.params;

    // Import Attendance model
    const AttendanceRecord = (await import("../models/AttendanceRecord.js")).default;
    const Member = (await import("../models/Member.js")).default;

    // Get all attendance records for this session
    const sessionAttendance = await AttendanceRecord.find({ sessionId }).populate("memberId");
    const presentMemberIds = new Set(
      sessionAttendance.map(r => r.memberId._id.toString())
    );

    // Get all members
    const allMembers = await Member.find();

    // Count first timers: members with ONLY 1 attendance record ever (first time attending ANY session)
    const memberAttendanceCounts = {};
    const allAttendance = await AttendanceRecord.find();

    allAttendance.forEach(record => {
      const memberId = record.memberId.toString ? record.memberId.toString() : record.memberId;
      memberAttendanceCounts[memberId] = (memberAttendanceCounts[memberId] || 0) + 1;
    });

    // First timers are those with attendance count = 1 AND present in THIS session
    const firstTimers = sessionAttendance.filter(r => {
      const memberId = r.memberId._id.toString();
      return memberAttendanceCounts[memberId] === 1;
    }).length;

    // Absentees are previous attendees (attendance count > 0) who are absent from THIS session
    let absentCount = 0;
    allMembers.forEach(member => {
      const memberId = member._id.toString();
      const attendanceCount = memberAttendanceCounts[memberId] || 0;
      const isPresentThisSession = presentMemberIds.has(memberId);

      // Count as absent if: attended before (count > 0) AND not present this session
      if (attendanceCount > 0 && !isPresentThisSession) {
        absentCount++;
      }
    });

    res.json({
      total: sessionAttendance.length,
      firstTimers,
      absent: absentCount,
      allAttendanceCount: allAttendance.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET session by id
router.get("/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
