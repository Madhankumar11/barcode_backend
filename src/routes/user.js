import express from "express";
import {
  registerUser,
  updateUser,
  loginUser,
  forgotPassword,
  changePassword,
  refreshAccessToken
} from "../controllers/master/userMaster/index.js";


const router = express.Router();


router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/change/password", forgotPassword);

router.post("/auth/refresh-token", refreshAccessToken);

router.post("/register/update", updateUser);

export default router;