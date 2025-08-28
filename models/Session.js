import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
  qrData: { type: String }, // text embedded in QR
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Session", sessionSchema);