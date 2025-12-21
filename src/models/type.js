
import mongoose from "mongoose";
export default mongoose.model("Type", new mongoose.Schema({
  type_id:String,
  type:String,
  isDeleted:Boolean
},{timestamps:true}));
