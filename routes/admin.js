import express from "express";
import { authenticateToken, authorize } from "../middleware/authMiddleware.js";
import Session from "../models/Session.js";
import AttendanceRecord from "../models/AttendanceRecord.js";
import Member from "../models/Member.js";

const router = express.Router();

// 📊 Dashboard Stats (admin only)
router.get("/stats", authenticateToken, authorize("superadmin", "admin"), async (req, res) => {
    try {
        const totalSessions = await Session.countDocuments();
        const activeSessions = await Session.countDocuments({ is_active: true });
        const totalMembers = await Member.countDocuments();
        const totalAttendance = await AttendanceRecord.countDocuments();

        res.json({
            totalSessions,
            activeSessions,
            totalMembers,
            totalAttendance
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

// 📋 Get all previous sessions with attendance data
router.get("/sessions", authenticateToken, authorize("superadmin", "admin"), async (req, res) => {
    try {
        const sessions = await Session.find().sort({ createdAt: -1 });

        const sessionsWithData = await Promise.all(
            sessions.map(async (session) => {
                const attendanceCount = await AttendanceRecord.countDocuments({
                    sessionId: session._id
                });
                return {
                    ...session.toObject(),
                    attendanceCount
                };
            })
        );

        res.json(sessionsWithData);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({ error: "Failed to fetch sessions" });
    }
});

// 👥 Get all attendees (admin only)
router.get("/attendees", authenticateToken, authorize("superadmin", "admin"), async (req, res) => {
    try {
        const members = await Member.find().sort({ first_scan_date: -1 });
        res.json(members);
    } catch (error) {
        console.error("Error fetching attendees:", error);
        res.status(500).json({ error: "Failed to fetch attendees" });
    }
});

// 📊 Get session details with attendees
router.get("/sessions/:sessionId", authenticateToken, authorize("superadmin", "admin"), async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        const attendanceRecords = await AttendanceRecord.find({ sessionId }).populate('memberId');

        res.json({
            ...session.toObject(),
            attendees: attendanceRecords,
            attendanceCount: attendanceRecords.length
        });
    } catch (error) {
        console.error("Error fetching session details:", error);
        res.status(500).json({ error: "Failed to fetch session details" });
    }
});

// 💬 Send message to attendee (admin/superadmin only) - placeholder
router.post("/send-message", authenticateToken, authorize("superadmin", "admin"), async (req, res) => {
    try {
        const { attendeeId, message } = req.body;

        if (!attendeeId || !message) {
            return res.status(400).json({ error: "Attendee ID and message are required" });
        }

        const attendee = await Member.findById(attendeeId);
        if (!attendee) {
            return res.status(404).json({ error: "Attendee not found" });
        }

        // TODO: Implement actual messaging system (SMS/Email)
        console.log(`Message sent to ${attendee.email}: ${message}`);

        res.json({
            message: "Message sent successfully",
            recipient: attendee.email
        });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
});

// 📊 Get attendance data for a session
router.get("/sessions/:sessionId/attendance", authenticateToken, authorize("superadmin", "admin"), async (req, res) => {
    try {
        const { sessionId } = req.params;

        const attendanceRecords = await AttendanceRecord.find({ sessionId }).populate('memberId');

        const stats = {
            total: attendanceRecords.length,
            present: attendanceRecords.filter(r => r.status === 'present').length,
            absent: attendanceRecords.filter(r => r.status === 'absent').length,
            records: attendanceRecords
        };

        res.json(stats);
    } catch (error) {
        console.error("Error fetching attendance data:", error);
        res.status(500).json({ error: "Failed to fetch attendance data" });
    }
});

// 🔍 Search attendee (admin only)
router.get("/search/attendee", authenticateToken, authorize("superadmin", "admin"), async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }

        const attendees = await Member.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } }
            ]
        });

        res.json(attendees);
    } catch (error) {
        console.error("Error searching attendees:", error);
        res.status(500).json({ error: "Failed to search attendees" });
    }
});

export default router;
