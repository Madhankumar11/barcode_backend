import express from "express";
import {
  startTransaction,
  listTransactions,
  getTransactionById,
  deleteTransaction,
  filterTransactions,
  searchTransactions,
  recordScan,
  getPendingTransaction,
  restartScan,
  printLabelByTransactionId,
  validateTransaction
} from "../controllers/transection/index.js";

import {generateTransactionReport} from "../controllers/report/index.js"

const router = express.Router();

router.post("/start", startTransaction);
router.post("/recordScan", recordScan);
router.get("/getPending", getPendingTransaction);
router.post("/restartScan", restartScan);
router.get("/list", listTransactions);
router.get("/filter", filterTransactions);
router.get("/search", searchTransactions);
router.get("/getByid", getTransactionById);
router.delete("/delete", deleteTransaction);
router.post("/report", generateTransactionReport)
router.post("/printLabel", printLabelByTransactionId);
router.post("/validate-transaction", validateTransaction);


export default router;
