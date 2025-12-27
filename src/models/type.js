
import mongoose from "mongoose";
export default mongoose.model("Type", new mongoose.Schema({
  type_id:String,
  type:String,
  createdBy:String,
  isDeleted:Boolean
},{timestamps:true}));
