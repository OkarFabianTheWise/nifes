// routes/session.js
import express from "express";
import QRCode from "qrcode";
import Session from "../models/Session.js";
import os from "os";

const router = express.Router();

// 🔹 Helper: Get local LAN IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === "IPv4" && !config.internal) {
        return config.address; // Example: 192.168.1.45
      }
    }
  }
  return "localhost";
}

// ✅ GET active session
router.get("/active", async (req, res) => {
  try {
    const activeSession = await Session.findOne({ is_active: true }).sort({ createdAt: -1 });
    res.json(activeSession || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST create new session
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Session name is required" });
    }

    // detect LAN IP
    const frontendUrl = process.env.FRONTEND_URL;

    // deactivate old sessions
    await Session.updateMany({}, { is_active: false });

    // create new session
    const newSession = new Session({ name, is_active: true });
    await newSession.save();

    // build QR code data with LAN IP
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

// ✅ GET session stats
router.get("/:id/stats", async (req, res) => {
  try {
    // Later: compute attendance count, first-timers, etc.
    res.json({ total: 0, firstTimers: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
