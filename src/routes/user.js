import express from "express";
import {
  registerUser,
  updateUser,
  loginUser,
  forgotPassword,
  changePassword,
  refreshAccessToken,
  getUserById,
  deleteUser,
  listUsers,
  startRegister,
  startLogin,
  getStatus,
  deleteBiometric
} from "../controllers/master/userMaster/index.js";


const router = express.Router();


router.post("/create", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/change/password", forgotPassword);

router.post("/auth/refresh-token", refreshAccessToken);

router.put("/update", updateUser);

router.get("/getById", getUserById);

router.delete("/delete",deleteUser);

router.get("/list", listUsers);

router.post("/biometric/register/start", startRegister);

router.post("/biometric/login/start", startLogin);

router.get("/biometric/status", getStatus);

router.delete("/biometric/delete", deleteBiometric);

export default router;
