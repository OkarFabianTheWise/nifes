import express from "express";
import mongoose from "mongoose";
import Member from "../models/Member.js";
import AttendanceRecord from "../models/AttendanceRecord.js";

const router = express.Router();

// POST /scan → handle scan & attendance with optimized queries
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, address, sessionId } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: "Invalid Session ID" });
    }

    // 1. Find member (lean for read-only)
    let member = await Member.findOne({ phone }).lean();

    let isNew = false;
    if (!member) {
      isNew = true;
      const newMember = new Member({
        name: name || "New Member",
        phone,
        email,
        address,
        memberCode: `M${Date.now()}`
      });
      await newMember.save();
      member = newMember.toObject(); // Convert to plain object
    }

    // 2. Use upsert with indexes to avoid duplicate attendance efficiently
    try {
      await AttendanceRecord.updateOne(
        { memberId: member._id, sessionId },
        { $setOnInsert: { status: "present", timestamp: new Date() } },
        { upsert: true }
      );
    } catch (err) {
      // Handle duplicate key error gracefully
      if (err.code === 11000) {
        return res.json({
          message: "Attendance already recorded for this session",
          member
        });
      }
      throw err;
    }

    res.status(201).json({
      message: isNew
        ? "New member registered and marked present"
        : "Attendance recorded",
      member
    });
  } catch (err) {
    console.error('Error in /api/scan:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
