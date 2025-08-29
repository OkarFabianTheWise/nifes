import express from "express";
import Member from "../models/Member.js";
import AttendanceRecord from "../models/AttendanceRecord.js";

const router = express.Router();

// POST /scan → handle scan & attendance
// scan.js
router.post("/", async (req, res) => {
  try {
    const { name, phone, sessionId } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    // 1. Find member
    let member = await Member.findOne({ phone });

    let isNew = false;
    if (!member) {
      isNew = true;
      member = new Member({
        name: name || "New Member",
        phone,
        memberCode: `M${Date.now()}`
      });
      await member.save();
    }

    // 2. Check if attendance already marked
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

    // 3. Create attendance record automatically (whether new or old member)
    const attendance = new AttendanceRecord({
      memberId: member._id,
      sessionId,
      status: "present"   // 👈 explicitly set status
    });
    await attendance.save();

    res.json({
      message: isNew
        ? "New member registered and marked present"
        : "Attendance recorded",
      member,
      attendance
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
