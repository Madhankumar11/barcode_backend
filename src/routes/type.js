import express from "express";
import {
  createType,
  getTypeDropdown
} from "../controllers/master/typeMaster/index.js";

import { verifyToken } from "../middleware/authentication.js";

const router = express.Router();

router.post("/create", verifyToken, createType);

router.get("/dropdown", verifyToken, getTypeDropdown);

export default router;
