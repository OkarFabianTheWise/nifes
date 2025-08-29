import express from "express";
import Member from "../models/Member.js";
import Attendance from "../models/Attendance.js";

const router = express.Router();

// 📌 Register a new member and mark as PRESENT in today's session
router.post("/", async (req, res) => {
  try {
    const { sessionId, name, email, phone } = req.body;

    if (!sessionId || !name) {
      return res.status(400).json({ error: "Session ID and name are required" });
    }

    // 1. Create the new member
    const newMember = await Member.create({
      name,
      email,
      phone,
    });

    // 2. Immediately mark as PRESENT in the attendance table
    const attendance = await Attendance.create({
      sessionId,
      memberId: newMember._id,
      status: "present",
    });

    res.status(201).json({
      message: "Member registered and marked present",
      member: newMember,
      attendance,
    });
  } catch (error) {
    console.error("Error registering member:", error);
    res.status(500).json({ error: "Error registering member" });
  }
});

// 📌 Delete member
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Member.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Optional: also remove their attendance records
    await Attendance.deleteMany({ memberId: id });

    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ error: "Error deleting member" });
  }
});

export default router;
