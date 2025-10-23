import mongoose from "mongoose";

const schema = new mongoose.Schema({
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, index: true },
  category: { type: String, index: true }
}, { timestamps: true });

export default mongoose.model("Menu", schema);