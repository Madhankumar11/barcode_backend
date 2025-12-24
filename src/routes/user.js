import express from "express";
import {
  registerManualUser,
  registerOrUpdateBiometric,
  loginUser,
  forgotPassword,
  changePassword,
  refreshAccessToken
} from "../controllers/master/userMaster/index.js";


const router = express.Router();


router.post("/register/manual", registerManualUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/change/password", forgotPassword);

router.post("/auth/refresh-token", refreshAccessToken);

router.post("/register/biometric", registerOrUpdateBiometric);

export default router;