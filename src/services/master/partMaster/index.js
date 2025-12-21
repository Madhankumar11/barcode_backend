import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import Part from "../../../models/part.js";

export const createPart = async (req, res) => {
  try {
    const { part_name, part_number, tag_quantity } = req.body;

    if (!part_name || typeof part_name !== "string") {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "part_name is required and must be a string",
        data: "None"
      });
    }

    if (!part_number || typeof part_number !== "string") {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "part_number is required and must be a string",
        data: "None"
      });
    }

    if (
      tag_quantity === undefined ||
      tag_quantity === null ||
      isNaN(tag_quantity) ||
      Number(tag_quantity) < 0
    ) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "tag_quantity must be a valid non-negative number",
        data: "None"
      });
    }

    const exists = await Part.findOne({
      part_name: part_name.trim(),
      part_number: part_number.trim(),
      isDeleted: false
    });

    if (exists) {
      return res.status(409).json({
        status: "error",
        code: 409,
        message: "Part already exists",
        data: "None"
      });
    }

    const part = await Part.create({
      part_id: uuidv4(),
      part_name: part_name.trim(),
      part_number: part_number.trim(),
      tag_quantity: Number(tag_quantity),
      isDeleted: false
    });

    return res.status(201).json({
      status: "success",
      code: 201,
      message: "Part created successfully",
      data: part
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

export const getParts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    const filter = {
      isDeleted: false,
      ...(search && {
        $or: [
          { part_name: { $regex: search, $options: "i" } },
          { part_number: { $regex: search, $options: "i" } }
        ]
      })
    };

    const [records, total] = await Promise.all([
      Part.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Part.countDocuments(filter)
    ]);

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Parts fetched successfully",
      data: {
        total,
        page,
        limit,
        records
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

export const updatePart = async (req, res) => {
  try {
    const { id } = req.params;
    const { part_name, part_number, tag_quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Invalid part id",
        data: "None"
      });
    }

    if (
      tag_quantity !== undefined &&
      (isNaN(tag_quantity) || Number(tag_quantity) < 0)
    ) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "tag_quantity must be a valid non-negative number",
        data: "None"
      });
    }

    if (part_name || part_number) {
      const duplicate = await Part.findOne({
        _id: { $ne: id },
        part_name: part_name?.trim(),
        part_number: part_number?.trim(),
        isDeleted: false
      });

      if (duplicate) {
        return res.status(409).json({
          status: "error",
          code: 409,
          message: "Another part already exists with same name and number",
          data: "None"
        });
      }
    }

    const updated = await Part.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        ...(part_name && { part_name: part_name.trim() }),
        ...(part_number && { part_number: part_number.trim() }),
        ...(tag_quantity !== undefined && {
          tag_quantity: Number(tag_quantity)
        })
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Part not found",
        data: "None"
      });
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Part updated successfully",
      data: updated
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

export const deletePart = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Invalid part id",
        data: "None"
      });
    }

    const deleted = await Part.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Part not found",
        data: "None"
      });
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Part deleted successfully",
      data: deleted
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

export const getPartIdDropdown = async (req, res) => {
  try {
    const data = await Part.distinct("part_number", { isDeleted: false });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Part ID dropdown fetched successfully",
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

export const getPartNameDropdown = async (req, res) => {
  try {
    const data = await Part.distinct("part_name", { isDeleted: false });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Part name dropdown fetched successfully",
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
