import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  phone: String,
  first_scan_date: { type: Date, default: Date.now }
});

export default mongoose.model("Member", memberSchema);
