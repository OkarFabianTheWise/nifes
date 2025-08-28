import express from "express";
import AttendanceRecord from "../models/AttendanceRecord.js";

const router = express.Router();

// GET current attendance
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
