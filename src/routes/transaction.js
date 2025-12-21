
import express from "express";
import {createTxn} from "../controllers/transection/index.js";

const r=express.Router();

r.post("/",createTxn);

export default r;
