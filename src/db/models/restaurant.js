import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  address: { type: String, required: true, index: true },
  phone: { type: String },
  opening_hours: { type: String }
}, { timestamps: true });

export default mongoose.model("Restaurant", schema);