import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import User from "../../models/user.js";
import Part from "../../models/part.js";
import Transaction from "../../models/transection.js"
import { createCanvas, loadImage } from "canvas";
// import printer from "printer";



export const createOrUpdateTransaction = async (req, res) => {
  try {
    const { user_id, part_id, scanned_values = [], is_completed } = req.body;

    if (!user_id || !part_id || !Array.isArray(scanned_values)) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "user_id, part_id and scanned_values are required",
        data: "None"
      });
    }

    const user = await User.findOne({ user_id, isActive: true });
    if (!user || !user.permissions?.createTransaction) {
      return res.status(200).json({
        status: "error",
        code: 403,
        message: "User does not have permission to create transaction",
        data: "None"
      });
    }

    const part = await Part.findOne({ part_id, isDeleted: false });
    if (!part) {
      return res.status(200).json({
        status: "error",
        code: 404,
        message: "Part not found",
        data: "None"
      });
    }

    for (const item of scanned_values) {
      if (
        item.part_name !== part.part_name ||
        item.part_number !== part.part_number ||
        item.minda_number !== part.minda_number
      ) {
        return res.status(200).json({
          status: "error",
          code: 400,
          message: "Scanned values do not match part master",
          data: item
        });
      }
    }

    let transaction = await Transaction.findOne({ part_id });

    const scannedSerials = scanned_values
      .map(v => v.serial_number)
      .filter(Boolean);

    if (!transaction) {
      transaction = await Transaction.create({
        transaction_id: uuidv4(),
        part_id,
        part_name: part.part_name,
        part_number: part.part_number,
        minda_number: part.minda_number,
        serial_numbers: scannedSerials,
        is_completed: false,
        createdBy: user_id
      });
    } else {
      const merged = new Set([
        ...transaction.serial_numbers,
        ...scannedSerials
      ]);
      transaction.serial_numbers = [...merged];
    }

    if (is_completed === true) {
      if (transaction.serial_numbers.length !== part.tag_quantity) {
        return res.status(200).json({
          status: "error",
          code: 400,
          message: "Serial number count does not match tag quantity",
          data: {
            expected: part.tag_quantity,
            actual: transaction.serial_numbers.length
          }
        });
      }


      transaction.is_completed = true;
    }

    await transaction.save();

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Transaction processed successfully",
      data: transaction
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

// export const printTransactionLabel = async (req, res) => {
//   try {
//     const {
//       part_name,
//       part_number,
//       minda_number,
//       qty,
//       date,
//       serial_numbers
//     } = req.body;

//     if (
//       !part_name ||
//       !part_number ||
//       !minda_number ||
//       !qty ||
//       !Array.isArray(serial_numbers)
//     ) {
//       return res.status(200).json({
//         status: "error",
//         code: 400,
//         message: "Missing required label data",
//         data: "None"
//       });
//     }

//     const qrData = JSON.stringify({
//       part_name,
//       part_number,
//       minda_number,
//       serial_numbers
//     });

//     const tspl = `
// SIZE 100 mm,80 mm
// GAP 2 mm,0
// DENSITY 8
// SPEED 4
// DIRECTION 1
// CLS

// TEXT 40,40,"0",0,2,2,"UNO MINDA LTD - Lighting Division"
// TEXT 40,90,"0",0,2,2,"Chennai"

// TEXT 40,160,"0",0,2,2,"Part Name"
// TEXT 320,160,"0",0,2,2,"${part_name}"

// TEXT 40,220,"0",0,2,2,"Cus' Part No"
// TEXT 320,220,"0",0,2,2,"${part_number}"

// TEXT 40,280,"0",0,2,2,"Minda Part No"
// TEXT 320,280,"0",0,2,2,"${minda_number}"

// TEXT 40,340,"0",0,2,2,"Date of Insp + PKG"
// TEXT 320,340,"0",0,2,2,"${date}"

// TEXT 40,400,"0",0,2,2,"Qty/BOX"
// TEXT 320,400,"0",0,2,2,"${qty}"

// QRCODE 720,170,L,6,A,0,"${qrData}"

// TEXT 720,520,"0",0,1,1,"Scan QR Code for part details."

// PRINT 1,1
// `;

//     printer.printDirect({
//       data: tspl,
//       type: "RAW",
//       printer: "TSC TE244",
//       success: jobID => {
//         return res.status(200).json({
//           status: "success",
//           code: 200,
//           message: "Label sent to printer successfully",
//           data: { jobID }
//         });
//       },
//       error: err => {
//         return res.status(200).json({
//           status: "error",
//           code: 500,
//           message: "Printer error",
//           data: err.message
//         });
//       }
//     });

//   } catch (error) {
//     return res.status(200).json({
//       status: "error",
//       code: 500,
//       message: error.message,
//       data: "None"
//     });
//   }
// };

export const listTransactions = async (req, res) => {
  try {
    const { user_id, page = 1, limit = 10 } = req.query;

    if (!user_id) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "user_id is required",
        data: "None"
      });
    }

    const user = await User.findOne({ user_id, isActive: true });
    if (!user || !user.permissions?.createTransaction) {
      return res.status(200).json({
        status: "error",
        code: 403,
        message: "Permission denied",
        data: "None"
      });
    }

    const transactions = await Transaction.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Transaction list fetched successfully",
      data: transactions
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

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.query;
    const { user_id } = req.query;

    if (!user_id || !id) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "user_id and transaction id are required",
        data: "None"
      });
    }

    const user = await User.findOne({ user_id, isActive: true });
    if (!user || !user.permissions?.createTransaction) {
      return res.status(200).json({
        status: "error",
        code: 403,
        message: "Permission denied",
        data: "None"
      });
    }

    const transaction = await Transaction.findOne({
      transaction_id: id,
      isDeleted: false
    });

    if (!transaction) {
      return res.status(200).json({
        status: "error",
        code: 404,
        message: "Transaction not found",
        data: "None"
      });
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Transaction fetched successfully",
      data: transaction
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

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.query;
    const { user_id } = req.query;

    if (!user_id || !id) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "user_id and transaction id are required",
        data: "None"
      });
    }

    const user = await User.findOne({ user_id, isActive: true });
    if (!user || !user.permissions?.createTransaction) {
      return res.status(200).json({
        status: "error",
        code: 403,
        message: "Permission denied",
        data: "None"
      });
    }

    const deleted = await Transaction.findOneAndUpdate(
      { transaction_id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!deleted) {
      return res.status(200).json({
        status: "error",
        code: 404,
        message: "Transaction not found",
        data: "None"
      });
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Transaction deleted successfully",
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

export const filterTransactions = async (req, res) => {
  try {
    const {
      user_id,
      part_name,
      part_number,
      minda_number,
      page = 1,
      limit = 10
    } = req.query;

    if (!user_id) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "user_id is required",
        data: "None"
      });
    }

    const user = await User.findOne({ user_id, isActive: true });
    if (!user || !user.permissions?.createTransaction) {
      return res.status(200).json({
        status: "error",
        code: 403,
        message: "Permission denied",
        data: "None"
      });
    }

    const filter = { isDeleted: false };

    if (part_name) {
      filter.part_name = { $regex: part_name, $options: "i" };
    }

    if (part_number) {
      filter.part_number = { $regex: part_number, $options: "i" };
    }

    if (minda_number) {
      filter.minda_number = { $regex: minda_number, $options: "i" };
    }

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Transactions filtered successfully",
      data: transactions
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


export const searchTransactions = async (req, res) => {
  try {
    const { user_id, search, page = 1, limit = 10 } = req.query;

    if (!user_id || !search) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "user_id and search are required",
        data: "None"
      });
    }

    const user = await User.findOne({ user_id, isActive: true });
    if (!user || !user.permissions?.createTransaction) {
      return res.status(200).json({
        status: "error",
        code: 403,
        message: "Permission denied",
        data: "None"
      });
    }

    const query = {
      isDeleted: false,
      $or: [
        { part_name: { $regex: search, $options: "i" } },
        { part_number: { $regex: search, $options: "i" } },
        { minda_number: { $regex: search, $options: "i" } },
        { transaction_id: { $regex: search, $options: "i" } }
      ]
    };

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Search results fetched successfully",
      data: transactions
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

