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
  listUsers
} from "../controllers/master/userMaster/index.js";


const router = express.Router();


router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/change/password", forgotPassword);

router.post("/auth/refresh-token", refreshAccessToken);

router.post("/register/update", updateUser);

router.get("/getById", getUserById);

router.delete("/delete",deleteUser);

router.get("/list", listUsers);


export default router;