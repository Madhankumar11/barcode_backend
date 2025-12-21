
import Transaction from "../../models/transection.js";
import Part from "../../models/part.js";

export async function createTransaction(data){
  const exists = await Part.findOne({
    part_number:data.part_number,
    part_name:data.part_name
  });
  if(!exists) throw new Error("Invalid part combination");
  return Transaction.create(data);
}
