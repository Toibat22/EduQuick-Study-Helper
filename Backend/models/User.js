// Backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscription: { type: String, default: "Free plan" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
