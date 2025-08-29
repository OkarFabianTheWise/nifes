import express from "express";
import AttendanceRecord from "../models/AttendanceRecord.js";
import Member from "../models/member.js";
import Session from "../models/Session.js"; // Assuming you have a Session model

const router = express.Router();

// ✅ Mark attendance (handles new + returning members)
router.post("/scan", async (req, res) => {
  try {
    const { sessionId, email, name, phone } = req.body;

    if (!sessionId || !email) {
      return res.status(400).json({ error: "sessionId and email are required" });
    }

    // 1️⃣ Check if member already exists
    let member = await Member.findOne({ email });

    if (!member) {
      // 2️⃣ Register new member if not found
      member = new Member({ name, email, phone });
      await member.save();
    }

    // 3️⃣ Check if already marked present
    const existingRecord = await AttendanceRecord.findOne({
      sessionId,
      memberId: member._id,
    });

    if (existingRecord) {
      return res.json({ message: "Already marked present", member });
    }

    // 4️⃣ Mark attendance
    const attendance = new AttendanceRecord({
      sessionId,
      memberId: member._id,
    });
    await attendance.save();

    res.status(201).json({ message: "Attendance marked", member });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all current attendance (with members + sessions)
router.get("/current", async (req, res) => {
  try {
    const records = await AttendanceRecord.find()
      .populate("memberId")
      .populate("sessionId")
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
