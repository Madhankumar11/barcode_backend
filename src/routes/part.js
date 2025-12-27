import express from "express";
import {
  createPart,
  getParts,
  updatePart,
  deletePart,
  getPartIdDropdown,
  getPartNameDropdown,
  getByIdPart,
  filterPart
} from "../controllers/master/partMaster/index.js";

import { verifyToken } from "../middleware/authentication.js";

const router = express.Router();

router.post("/create", verifyToken, createPart);

router.get("/list", verifyToken, getParts);

router.put("/update", verifyToken, updatePart);

router.delete("/delete", verifyToken, deletePart);

router.get("/dropdown/part-number", verifyToken, getPartIdDropdown);

router.get("/dropdown/part-name", verifyToken, getPartNameDropdown);

router.get("/getByid", verifyToken, getByIdPart);

router.get("/filter", verifyToken, filterPart);



export default router;
