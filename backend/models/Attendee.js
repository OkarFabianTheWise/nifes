import mongoose from "mongoose";

const attendeeSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Attendee", attendeeSchema);
