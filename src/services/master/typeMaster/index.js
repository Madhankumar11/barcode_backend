import { v4 as uuidv4 } from "uuid";
import Type from "../../../models/type.js";
import User from "../../../models/user.js";

export const createType = async (req, res) => {
  try {
    const { type, user_id } = req.body;

    if (!user_id) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "user_id is required",
        data: "None"
      });
    }

    const user = await User.findOne({
      user_id,
      isActive: true
    });

    if (!user) {
      return res.status(200).json({
        status: "error",
        code: 403,
        message: "User not found or inactive",
        data: "None"
      });
    }

    if (!user.permissions?.createType) {
      return res.status(200).json({
        status: "error",
        code: 403,
        message: "You do not have permission to create type",
        data: "None"
      });
    }

    if (!type || typeof type !== "string") {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "type is required and must be a string",
        data: "None"
      });
    }

    const exists = await Type.findOne({
      type: type.trim(),
      isDeleted: false
    });

    if (exists) {
      return res.status(200).json({
        status: "error",
        code: 409,
        message: "Type already exists",
        data: "None"
      });
    }

    const created = await Type.create({
      type_id: uuidv4(),
      type: type.trim(),
      isDeleted: false,
      createdBy: user_id
    });

    return res.status(200).json({
      status: "success",
      code: 201,
      message: "Type created successfully",
      data: created
    });

  } catch (error) {
    return res.status(200).json({
      status: "error",
      code: 500,
      message: error.message,
      data: "None"
    });
  }
};


export const getTypeDropdown = async (req, res) => {
  try {
    const data = await Type.distinct("type", { isDeleted: false });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Type dropdown fetched successfully",
      data
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

export const updateType = async (req, res) => {
  try {
    const { id } = req.query;
    const { type, user_id } = req.body;

    if (!user_id || !id) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "id and user_id are required",
        data: "None"
      });
    }

    const user = await User.findOne({ user_id, isActive: true });
    if (!user || !user.permissions?.createType) {
      return res.status(200).json({
        status: "error",
        code: 403,
        message: "You do not have permission to update type",
        data: "None"
      });
    }

    if (!type || typeof type !== "string") {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "type must be a valid string",
        data: "None"
      });
    }

    const duplicate = await Type.findOne({
      type_id: { $ne: id },
      type: type.trim(),
      isDeleted: false
    });

    if (duplicate) {
      return res.status(200).json({
        status: "error",
        code: 409,
        message: "Another type already exists",
        data: "None"
      });
    }

    const updated = await Type.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { type: type.trim(), updatedBy: user_id },
      { new: true }
    );

    if (!updated) {
      return res.status(200).json({
        status: "error",
        code: 404,
        message: "Type not found",
        data: "None"
      });
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Type updated successfully",
      data: updated
    });
  } catch (error) {
    return res.status(200).json({
      status: "error",
      code: 500,
      message: error.message,
      data: "None"
    });
  }
};

export const listTypes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const types = await Type.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Type list fetched successfully",
      data: types
    });
  } catch (error) {
    return res.status(200).json({
      status: "error",
      code: 500,
      message: error.message,
      data: "None"
    });
  }
};

export const getTypeById = async (req, res) => {
  try {
    const { id } = req.query;

    const type = await Type.findOne({ type_id: id, isDeleted: false });

    if (!type) {
      return res.status(200).json({
        status: "error",
        code: 404,
        message: "Type not found",
        data: "None"
      });
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Type fetched successfully",
      data: type
    });
  } catch (error) {
    return res.status(200).json({
      status: "error",
      code: 500,
      message: error.message,
      data: "None"
    });
  }
};

export const deleteType = async (req, res) => {
  try {
    const { id } = req.query;
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "user_id is required",
        data: "None"
      });
    }

    const user = await User.findOne({ user_id, isActive: true });
    if (!user || !user.permissions?.createType) {
      return res.status(200).json({
        status: "error",
        code: 403,
        message: "You do not have permission to delete type",
        data: "None"
      });
    }

    const deleted = await Type.findOneAndUpdate(
      { type_id: id, isDeleted: false },
      { isDeleted: true, updatedBy: user_id },
      { new: true }
    );

    if (!deleted) {
      return res.status(200).json({
        status: "error",
        code: 404,
        message: "Type not found",
        data: "None"
      });
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Type deleted successfully",
      data: deleted
    });
  } catch (error) {
    return res.status(200).json({
      status: "error",
      code: 500,
      message: error.message,
      data: "None"
    });
  }
};
