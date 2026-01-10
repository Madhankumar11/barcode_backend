import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import User from "../../../models/user.js";
import axios from "axios";

const JAVA_BASE_URL = "http://localhost:8080";

export const registerUser = async (req, res) => {
  try {
    const {
      user_name,
      user_code,
      password,
      biometric_id,
      role,
      department,
      phoneNumber,
      createdBy,
      permissions
    } = req.body;

    if (!user_code || !role || !department || !phoneNumber || !createdBy || !user_name) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message:
          "user_code, role, department, user_name, phoneNumber and createdBy are required",
        data: "None"
      });
    }

    if (!password && !biometric_id) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "Either password or biometric_id is required",
        data: "None"
      });
    }

    const creator = await User.findOne({
      user_code: createdBy,
      isActive: true
    });

    if (!creator || !creator.permissions?.createUser) {
      return res.status(200).json({
        status: "error",
        code: 403,
        message: "You do not have permission to create users",
        data: "None"
      });
    }

    const existingUser = await User.findOne({ user_code, isDeleted: false });
    if (existingUser) {
      return res.status(200).json({
        status: "error",
        code: 409,
        message: "User already exists with this user_code",
        data: "None"
      });
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    let login_type = "manual";
    if (password && biometric_id) login_type = "manual_biometric";
    else if (biometric_id) login_type = "biometric";

    const finalPermissions = {
      createUser:
         !!permissions?.createUser && !!creator.permissions?.createUser,

      createType:
        !!permissions?.createType && !!creator.permissions?.createType,

      createTransaction:
        !!permissions?.createTransaction && !!creator.permissions?.createTransaction,

      createPart:
        !!permissions?.createPart && !!creator.permissions?.createPart
    };

    const user = await User.create({
      user_id: `user_${uuidv4()}`,
      user_name,
      user_code,
      password: hashedPassword,
      biometric_id,
      login_type,
      role,
      department,
      phoneNumber,
      permissions: finalPermissions,
      createdBy,
      isActive: true
    });

    return res.status(201).json({
      status: "success",
      code: 201,
      message: "User registered successfully",
      data: {
        user_id: user.user_id,
        name: user.user_name,
        user_code: user.user_code,
        login_type: user.login_type,
        role: user.role,
        department: user.department,
        phoneNumber: user.phoneNumber,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.log(error,"error");
    
    return res.status(500).json({
      status: "error",
      code: 500,
      message: error.message,
      data: "None"
    });
  }
};


export const updateUser = async (req, res) => {
  try {
    const {
      user_name,
      password,
      biometric_id,
      role,
      department,
      phoneNumber,
      permissions,
      updatedBy
    } = req.body;

    const {id} = req.query;

    if (!id || !updatedBy) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "user_id and updatedBy are required",
        data: "None"
      });
    }

    const user = await User.findOne({ user_id: id , isActive: true });
    if (!user) {
      return res.status(200).json({
        status: "error",
        code: 404,
        message: "User not found or inactive",
        data: "None"
      });
    }

    const updater = await User.findOne({ user_code: updatedBy, isActive: true });
    if (!updater) {
      return res.status(200).json({
        status: "error",
        code: 403,
        message: "Updater not found or inactive",
        data: "None"
      });
    }

    const isSelf = user.user_id === updater.user_id;
    const isAdmin = updater.permissions?.createUser;

    if (!isSelf && !isAdmin) {
      return res.status(200).json({
        status: "error",
        code: 403,
        message: "Not authorized to update user",
        data: "None"
      });
    }

    if (user_name !== undefined) user.user_name = user_name;
    if (department !== undefined) user.department = department;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (biometric_id !== undefined) {
      user.biometric_id = biometric_id;
    }

    if (user.password && user.biometric_id) user.login_type = "manual_biometric";
    else if (user.biometric_id) user.login_type = "biometric";
    else user.login_type = "manual";

    if ((role || permissions) && !isAdmin) {
      return res.status(200).json({
        status: "error",
        code: 403,
        message: "Only admin can update role or permissions",
        data: "None"
      });
    }

    if (role) user.role = role;

    if (permissions) {
      user.permissions = {
        createUser:
          !!permissions.createUser && !!updater.permissions?.createUser,
        createType:
          !!permissions.createType && !!updater.permissions?.createType,
        createTransaction:
          !!permissions.createTransaction &&
          !!updater.permissions?.createTransaction,
        createPart:
          !!permissions.createPart && !!updater.permissions?.createPart
      };
    }

    await user.save();

    const finger_id = user.biometric_id;
    console.log("TestFinger",finger_id);
    

    if (finger_id || finger_id !== biometric_id ) {
      console.log(finger_id,"finger_id");
      
      try {
        const fid = finger_id.replace("BIO_", "");
        const resp = await axios.get(
          `${JAVA_BASE_URL}/delete?id=${fid}`,
          { timeout: 50000 }
        );

        console.log("Biometric delete response:", resp.data);

        if (resp.data?.status !== "success") {
          console.warn(
            `Biometric delete failed for user ${id}, fid ${fid}`
          );
        }

      } catch (bioErr) {
        console.error(
          `Java biometric service error for user ${id}:`,
          bioErr.message
        );
      }
    }


    return res.status(200).json({
      status: "success",
      code: 200,
      message: "User updated successfully",
      data: {
        user_id: user.user_id,
        name: user.user_name,
        user_code: user.user_code,
        login_type: user.login_type,
        role: user.role,
        department: user.department,
        phoneNumber: user.phoneNumber,
        permissions: user.permissions
      }
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
    const { login_type, user_code, password, biometric_id } = req.body;

    let user;

    if (login_type === "manual") {
      if (!user_code || !password) {
        return res.status(200).json({



          status: "error",
          code: 400,
          message: "user_code and password are required for manual login",
          data: "None"
        });
      }

      user = await User.findOne({ user_code, isActive: true });

      if (!user || !user.password) {
        return res.status(200).json({
          status: "error",
          code: 401,
          message: "Invalid credentials",
          data: "None"
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(200).json({
          status: "error",
          code: 401,
          message: "Invalid credentials",
          data: "None"
        });
      }
    }

    else if (login_type === "biometric") {
      if (!biometric_id) {
        return res.status(200).json({
          status: "error",
          code: 400,
          message: "biometric_id is required for biometric login",
          data: "None"
        });
      }

      user = await User.findOne({
        biometric_id,
        isActive: true
      });

      if (!user) {
        return res.status(200).json({
          status: "error",
          code: 401,
          message: "Invalid biometric credentials",
          data: "None"
        });
      }
    }

    else {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "Invalid login_type. Use manual or biometric",
        data: "None"
      });
    }

    const accessToken = jwt.sign(
      {
        user_id: user.user_id,
        user_code: user.user_code,
        name: user.name,
        department: user.department,
        role: user.role,
        permissions: user.permissions
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        user_id: user.user_id
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1y" }
    );

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken
      }
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


export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(200).json({
        status: "error",
        code: 401,
        message: "Refresh token is required",
        data: "None"
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findOne({
      user_id: decoded.user_id,
      isActive: true
    });

    if (!user) {
      return res.status(200).json({
        status: "error",
        code: 401,
        message: "User not found or inactive",
        data: "None"
      });
    }

    const newAccessToken = jwt.sign(
      { user_id: user.user_id, user_code: user.user_code, user_name:user.user_name, department:user.department  },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Access token refreshed successfully",
      data: {
        accessToken: newAccessToken
      }
    });

  } catch (error) {
    return res.status(200).json({
      status: "error",
      code: 401,
      message: "Invalid or expired refresh token",
      data: "None"
    });
  }
};



export const forgotPassword = async (req, res) => {
  try {
    const { user_code, newPassword } = req.body;

    if (!user_code || !newPassword) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "user_code and newPassword are required",
        data: "None"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findOneAndUpdate(
      { user_code, login_type: "manual" },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(200).json({
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
    const { user_code, oldPassword, newPassword } = req.body;

    const user = await User.findOne({ user_code, login_type: "manual" });

    if (!user) {
      return res.status(200).json({
        status: "error",
        code: 404,
        message: "User not found",
        data: "None"
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(200).json({
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

export const getUserById = async (req, res) => {
  try {
    const { id } = req.query;

    const user = await User.findOne(
      { user_id: id, isActive: true ,isDeleted: false},
      { password: 0 }
    );

    if (!user) {
      return res.status(200).json({
        status: "error",
        code: 404,
        message: "User not found",
        data: "None"
      });
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "User fetched successfully",
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



export const listUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);

    const skip = (page - 1) * limit;

    const filter = {
      isActive: true,
      isDeleted: false
    };

    const [users, total] = await Promise.all([
      User.find(filter, { password: 0 })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      User.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Users fetched successfully",
      data: {
        users,
        pagination: {
          totalRecords: total,
          totalPages,
          currentPage: page,
          pageSize: limit
        }
      }
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

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "User id is required",
        data: "None"
      });
    }

    const user = await User.findOneAndUpdate(
      { user_id: id, isActive: true, isDeleted: false },
      {
        isActive: false,
        isDeleted: true
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User not found or already deleted",
        data: "None"
      });
    }

    const { biometric_id } = user;

    if (biometric_id) {
      try {
        const fid = biometric_id.replace("BIO_", "");

        const resp = await axios.get(
          `${JAVA_BASE_URL}/delete?id=${fid}`,
          { timeout: 50000 }
        );

        console.log("Biometric delete response:", resp.data);

        if (resp.data?.status !== "success") {
          console.warn(
            `Biometric delete failed for user ${id}, fid ${fid}`
          );
        }

      } catch (bioErr) {
        console.error(
          `Java biometric service error for user ${id}:`,
          bioErr.message
        );
      }
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "User deleted successfully",
      data: "None"
    });

  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      status: "error",
      code: 500,
      message: error.message,
      data: "None"
    });
  }
};


export const startRegister = async (req,res) => {
  console.log("start");
  
  const resp = await axios.post(`${JAVA_BASE_URL}/register/start`);
  
   return res.status(200).json({
      status: "success",
      code: 200,
      message: "Registration started successfully",
      data: resp.data
    });
};

export const startLogin = async (req,res) => {
  const resp = await axios.post(`${JAVA_BASE_URL}/login/start`);
  return res.status(200).json({
      status: "success",
      code: 200,
      message: "Login started successfully",
      data: resp.data
    });
};

export const getStatus = async (req, res) => {
  try {
    const resp = await axios.get(`${JAVA_BASE_URL}/status`);
    const data = resp.data;

    if (data.status === "waiting") {
      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Waiting for biometric input",
        data: "None"
      });
    }

    const user = await User.findOne({ biometric_id: data.biometric_id, isActive: true });

    if (data.status === "success") {
      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Biometric verification successful",
        data: {
          biometric_id: data.biometric_id,
          user_code: user ? user.user_code : null
        }
      });
    }

    if (data.status === "duplicate") {
      return res.status(200).json({
        status: "error",
        code: 409,
        message: "Fingerprint already registered",
        data: {
          biometric_id: data.biometric_id
        }
      });
    }

    if (data.status === "error") {
      return res.status(200).json({
        status: "error",
        code: 401,
        message: "Biometric verification failed",
        data: "None"
      });
    }

    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Unknown biometric status",
      data: data
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      code: 500,
      message: err.message,
      data: "None"
    });
  }
};

