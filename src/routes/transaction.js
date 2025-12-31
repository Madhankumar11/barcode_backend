import express from "express";
import {
  createOrUpdateTransaction,
  listTransactions,
  getTransactionById,
  deleteTransaction,
  filterTransactions,
  searchTransactions,
  
} from "../controllers/transection/index.js";

import {generateTransactionReport} from "../controllers/report/index.js"

const router = express.Router();

router.post("/create", createOrUpdateTransaction);
router.get("/list", listTransactions);
router.get("/filter", filterTransactions);
router.get("/search", searchTransactions);
router.get("/getByid", getTransactionById);
router.delete("/delete", deleteTransaction);
router.post("/report", generateTransactionReport)

export default router;
