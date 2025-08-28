import express from "express";
import Attendee from "../models/Attendee.js";

const router = express.Router();

// ✅ Add attendee with flexible duplicate-check
router.post("/", async (req, res) => {
  try {
    const { sessionId, name, email, phone } = req.body;

    if (!sessionId || !name) {
      return res.status(400).json({ message: "Session ID and Name are required" });
    }

    // Build duplicate-check query
    let query = { sessionId, $or: [] };

    if (email) query.$or.push({ email });
    if (phone) query.$or.push({ phone });
    if (!email && !phone) query.$or.push({ name }); // fallback to name

    const existingAttendee = await Attendee.findOne(query);

    if (existingAttendee) {
      return res
        .status(400)
        .json({ message: "You have already registered for this session" });
    }

    const attendee = new Attendee({ sessionId, name, email, phone });
    await attendee.save();

    res.status(201).json({ message: "Attendance recorded", attendee });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Get all attendees for a session
router.get("/:sessionId", async (req, res) => {
  try {
    const attendees = await Attendee.find({ sessionId: req.params.sessionId });
    res.json(attendees);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
