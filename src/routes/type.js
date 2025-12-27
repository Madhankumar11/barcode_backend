import express from "express";
import {
  createType,
  getTypeDropdown,
  updateType,
  listTypes,
  getTypeById,
  deleteType
} from "../controllers/master/typeMaster/index.js";

import { verifyToken } from "../middleware/authentication.js";

const router = express.Router();

router.post("/create", verifyToken, createType);

router.get("/dropdown", verifyToken, getTypeDropdown);

router.post("/update", verifyToken, updateType);

router.get("/list", verifyToken, listTypes);

router.get("/getByid", verifyToken, getTypeById);

router.delete("/delete", verifyToken, deleteType);

export default router;
