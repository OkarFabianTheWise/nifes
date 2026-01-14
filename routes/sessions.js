import express from "express";
import QRCode from "qrcode";
import Session from "../models/Session.js";

const router = express.Router();

// GET active session
router.get("/active", async (req, res) => {
  try {
    const activeSession = await Session.findOne({ is_active: true }).sort({ createdAt: -1 });
    res.json(activeSession || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new session
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Session name is required" });
    }

    // Deactivate all previous sessions
    await Session.updateMany({}, { is_active: false });

    // Create new session
    const newSession = new Session({ name, is_active: true });
    await newSession.save();

    // Determine frontend URL from environment or fallback
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    // Generate QR code pointing to the frontend attendance page
    const qrData = `${frontendUrl}/attend/${newSession._id}`;
    const qrCodeImage = await QRCode.toDataURL(qrData);

    newSession.qrData = qrData;
    await newSession.save();

    res.status(201).json({ ...newSession.toObject(), qrCodeImage });
  } catch (err) {
    console.error("❌ Session creation error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// GET session stats (example placeholder)
router.get("/:id/stats", async (req, res) => {
  try {
    // TODO: compute attendance count, first-timers, etc.
    res.json({ total: 0, firstTimers: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET session by id
router.get("/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
