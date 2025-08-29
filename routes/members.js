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
