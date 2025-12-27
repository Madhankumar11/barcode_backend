import mongoose from "mongoose";
import { type } from "os";

const transactionSchema = new mongoose.Schema(
  {
    transaction_id: {
      type: String,
      required: true,
      unique: true
    },

    part_id: {
      type: String,
      required: true,
      index: true
    },

    part_name: String,
    part_number: String,
    minda_number: String,

    serial_numbers: {
      type: [String],
      default: []
    },

    is_completed: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default:true
    },
    user_id:{
      type:String
    },
    isDeleted:{
      type:Boolean,
      default:false
    },

    createdBy: {
      type: String, // user_id
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("transaction", transactionSchema, "transaction");
