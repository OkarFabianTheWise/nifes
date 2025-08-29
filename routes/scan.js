import express from "express";
import Member from "../models/Member.js";
import AttendanceRecord from "../models/AttendanceRecord.js";

const router = express.Router();

// POST /scan → handle scan & attendance
router.post("/", async (req, res) => {
  try {
    const { name, phone, sessionId } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    // 1. Check if member already exists by phone
    let member = await Member.findOne({ phone });

    // 2. If not, create new member
    if (!member) {
      member = new Member({
        name: name || "New Member", // fallback if name wasn’t sent
        phone,
        memberCode: `M${Date.now()}` // system-generated unique code
      });
      await member.save();
    }

    // 3. Check if attendance already recorded for this session
    const alreadyMarked = await AttendanceRecord.findOne({
      memberId: member._id,
      sessionId
    });

    if (alreadyMarked) {
      return res.json({
        message: "Attendance already recorded for this session",
        member
      });
    }

    // 4. Create attendance record
    const attendance = new AttendanceRecord({
      memberId: member._id,
      sessionId
    });
    await attendance.save();

    res.json({
      message: member ? "Attendance recorded" : "New member registered and attendance recorded",
      member,
      attendance
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
