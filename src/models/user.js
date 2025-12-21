import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    login_type: {
      type: String,
      enum: ["manual", "biometric"],
      required: true
    },
    biometric_id: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
