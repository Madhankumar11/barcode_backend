import { v4 as uuidv4 } from "uuid";
import Type from "../../../models/type.js";

export const createType = async (req, res) => {
  try {
    const { type } = req.body;

    if (!type || typeof type !== "string") {
      return res.status(400).json({
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
      return res.status(409).json({
        status: "error",
        code: 409,
        message: "Type already exists",
        data: "None"
      });
    }

    const created = await Type.create({
      type_id: uuidv4(),
      type: type.trim(),
      isDeleted: false
    });

    return res.status(201).json({
      status: "success",
      code: 201,
      message: "Type created successfully",
      data: created
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
