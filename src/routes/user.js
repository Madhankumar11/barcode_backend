import express from "express";
import {
  registerManualUser,
  registerOrUpdateBiometric,
  loginUser,
  forgotPassword,
  changePassword
} from "../controllers/master/userMaster/index.js";


const router = express.Router();


router.post("/register/manual", registerManualUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/change/password", forgotPassword);


router.post("/register/biometric", registerOrUpdateBiometric);

export default router;