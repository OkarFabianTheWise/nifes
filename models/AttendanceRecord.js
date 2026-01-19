// models/Attendance.js
import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session", // assuming you have a Session model
    required: true,
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    default: "absent",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Add indexes for fast lookups under high concurrency
AttendanceSchema.index({ sessionId: 1, memberId: 1 }, { unique: true }); // Prevent duplicates efficiently
AttendanceSchema.index({ memberId: 1 });
AttendanceSchema.index({ sessionId: 1 });
AttendanceSchema.index({ timestamp: -1 });

const Attendance = mongoose.model("Attendance", AttendanceSchema);

export default Attendance;
