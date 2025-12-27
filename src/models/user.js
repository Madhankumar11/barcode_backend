import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    createUser: { type: Boolean, default: false },
    createType: { type: Boolean, default: false },
    createTransaction: { type: Boolean, default: true },
    createPart: { type: Boolean, default: false }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
    },

    user_name: {
      type: String,
    },

    email: {
      type: String,
    },

    password: {
      type: String
    },

    login_type: {
      type: String,
      enum: ["manual", "biometric"],
    },

    biometric_id: {
      type: String
    },

    role: {
      type: String,
    },

    department: {
      type: String
    },

    phoneNumber: {
      type: String
    },

    permissions: {
      type: permissionSchema,
      default: {}
    },

    createdBy: {
      type: String, 
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("user", userSchema,"user");
