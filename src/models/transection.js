
import mongoose from "mongoose";
export default mongoose.model("Transaction", new mongoose.Schema({
  part_number:String,
  part_name:String,
  type:String,
  tag_quantity:Number,
  scanned_serial_last4:String
},{timestamps:true}));
