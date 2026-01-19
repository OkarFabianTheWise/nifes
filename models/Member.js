import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  address: { type: String }, // Hostel/Lodge Address
  memberCode: { type: String, unique: true }, // unique system ID
  first_scan_date: { type: Date, default: Date.now }
});

// ✅ Add index for date sorting (email, phone, memberCode are already indexed via unique constraint)
memberSchema.index({ first_scan_date: -1 });

export default mongoose.model("Member", memberSchema);
