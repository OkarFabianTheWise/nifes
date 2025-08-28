import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
  scan_time: { type: Date, default: Date.now },
  is_first_time: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("AttendanceRecord", attendanceSchema);
