
import mongoose from "mongoose";
export default mongoose.model("Part", new mongoose.Schema({
  part_id:String,
  part_name:String,
  part_number:String,
  tag_quantity:Number,
  isDeleted:Boolean

},{timestamps:true}));
