import express from "express";
import Member from "../models/Member.js";

const router = express.Router();

// GET all members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add new member
router.post("/", async (req, res) => {
  try {
    const newMember = new Member(req.body);
    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add new member manually
router.post("/", async (req, res) => {
  try {
    const { name, phone, sessionId } = req.body;

    if (!phone || !name) {
      return res.status(400).json({ error: "Name and phone are required" });
    }

    // Create member
    const member = new Member({
      name,
      phone,
      memberCode: `M${Date.now()}`
    });
    await member.save();

    // Mark present immediately if sessionId is passed
    let attendance = null;
    if (sessionId) {
      attendance = new AttendanceRecord({
        memberId: member._id,
        sessionId,
        status: "present"
      });
      await attendance.save();
    }

    res.json({
      message: sessionId
        ? "Member added and marked present"
        : "Member added successfully",
      member,
      attendance
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete member by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
