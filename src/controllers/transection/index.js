
import {createTransaction} from "../../services/transection/index.js";

export const createTxn = async(req,res)=>{
  try{
    const data = await createTransaction(req.body);
    res.json(data);
  }catch(e){
    res.status(400).json({error:e.message});
  }
};
