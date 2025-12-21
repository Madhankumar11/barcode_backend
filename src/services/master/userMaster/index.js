import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import User from "../../../models/user.js";


export const registerManualUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "email and password are required",
        data: "None"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      user_id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      login_type: "manual"
    });

    return res.status(201).json({
      status: "success",
      code: 201,
      message: "Manual user registered successfully",
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      code: 500,
      message: error.message,
      data: "None"
    });
  }
};

export const registerOrUpdateBiometric = async (req, res) => {
  try {
    const { email, biometric_id } = req.body;

    if (!email || !biometric_id) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "email and biometric_id are required",
        data: "None"
      });
    }

    const user = await User.findOneAndUpdate(
      { email },
      {
        biometric_id,
        login_type: "biometric"
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Biometric login updated successfully",
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      code: 500,
      message: error.message,
      data: "None"
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { login_type, email, password, biometric_id } = req.body;

    let user;

    if (login_type === "manual") {
      user = await User.findOne({ email, isActive: true });

      if (!user || !user.password) {
        return res.status(401).json({
          status: "error",
          code: 401,
          message: "Invalid credentials",
          data: "None"
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({
          status: "error",
          code: 401,
          message: "Invalid credentials",
          data: "None"
        });
      }
    }

    if (login_type === "biometric") {
      user = await User.findOne({
        email,
        biometric_id,
        isActive: true
      });

      if (!user) {
        return res.status(401).json({
          status: "error",
          code: 401,
          message: "Invalid biometric credentials",
          data: "None"
        });
      }
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Login successful",
      data: { token }
    });
  } catch (e) {
    return res.status(500).json({
      status: "error",
      code: 500,
      message: e.message,
      data: "None"
    });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "email and newPassword are required",
        data: "None"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findOneAndUpdate(
      { email, login_type: "manual" },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User not found",
        data: "None"
      });
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Password reset successfully",
      data: "None"
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      code: 500,
      message: error.message,
      data: "None"
    });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const user = await User.findOne({ email, login_type: "manual" });

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User not found",
        data: "None"
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Old password is incorrect",
        data: "None"
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Password changed successfully",
      data: "None"
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      code: 500,
      message: error.message,
      data: "None"
    });
  }
};
