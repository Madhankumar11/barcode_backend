import mongoose from "mongoose";

const partSchema = new mongoose.Schema(
  {
    part_id: {
      type: String,
    },

    part_name: {
      type: String,
    },

    part_number: {
      type: String,
    },

    minda_number: {
      type: String,
    },

    tag_quantity: {
      type: Number,
      min: 0
    },

    createdBy: {
      type: String,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true
  }
);



export default mongoose.model("part", partSchema, "part");
