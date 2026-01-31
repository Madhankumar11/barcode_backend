import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import User from "../../models/user.js";
import Part from "../../models/part.js";
import Transaction from "../../models/transection.js"
import { createCanvas, loadImage } from "canvas";
import { log } from "console";
import { buildLabelTSPL } from "../../utility/tsplPrinter.js";
import user from "../../models/user.js";
import transection from "../../models/transection.js";

const normalize = (str = "") =>
  str.replace(/\s+/g, " ").trim().toUpperCase();


export const startTransaction = async (req, res) => {
  try {
    const { user_id, part_id, part_number } = req.body;

    if (!user_id || !part_id || !part_number) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "user_id, part_id and part_number are required",
        data: "None"
      });
    }

    const user = await User.findOne({ user_id, isActive: true });
    if (!user || !user.permissions?.createTransaction) {
      return res.status(200).json({
        status: "error",
        code: 403,
        message: "User does not have permission to start transaction",
        data: "None"
      });
    }

    const user_code = user.user_code;

    const part = await Part.findOne({ part_id, part_number, isDeleted: false });
    if (!part) {
      return res.status(200).json({
        status: "error",
        code: 404,
        message: "Part not found",
        data: "None"
      });
    }

    const existingTransaction = await Transaction.findOne({
      part_id,
      is_completed: false
    });

    if (existingTransaction) {
      await Transaction.deleteOne({ _id: existingTransaction._id });
    }

    const transaction = await Transaction.create({
      transaction_id: uuidv4(),
      part_id,
      part_name: part.part_name,
      part_number: part.part_number,
      minda_number: part.minda_number,
      required_quantity: part.tag_quantity,
      type: part.type,
      user_id,
      user_code,
      scanned_quantity: 0,
      scanned_barcodes: [],
      serial_numbers: [],
      is_completed: false,
      createdBy: user_id
    });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Transaction started successfully",
      data: {
        transaction_id: transaction.transaction_id,
        part_number: part.part_number,
        part_name: part.part_name,
        minda_number: part.minda_number,
        type: part.type,
        required_quantity: part.tag_quantity,
        scanned: 0,
        scanned_barcodes: [],
        created_at: transaction.createdAt
      }
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



export const recordScan = async (req, res) => {
  try {
    const { transaction_id, barcode, user_id } = req.body;

    if (!transaction_id || !barcode || !user_id) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "transaction_id, barcode and user_id are required",
        data: "None"
      });
    }

    const transaction = await Transaction.findOne({
      transaction_id,
      isDeleted: false
    });

    if (!transaction || transaction.is_completed) {
      return res.status(200).json({
        status: "error",
        code: 404,
        message: "Active transaction not found",
        data: "None"
      });
    }

    const part = await Part.findOne({ part_id: transaction.part_id });
    if (!part) {
      return res.status(200).json({
        status: "error",
        code: 404,
        message: "Part not found",
        data: "None"
      });
    }

     const user = await User.findOne({ user_id: user_id });
    if (!user) {
      return res.status(200).json({
        status: "error",
        code: 404,
        message: "User not found",
        data: "None"
      });
    }

    const scannedText = normalize(barcode);

    const validations = {
      part_name: normalize(part.part_name),
      part_number: normalize(part.part_number),
      minda_number: normalize(part.minda_number),
      type: normalize(part.type)
    };

    const mismatchedFields = [];

    for (const [key, value] of Object.entries(validations)) {
      if (!scannedText.includes(value)) {
        mismatchedFields.push({
          field: key,
          expected: part[key],
          scanned: barcode
        });
      }
    }

    if (mismatchedFields.length > 0) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "Wrong part scanned",
        data: null
      });
    }

    let serialNumber = null;

  //  const match = scannedText.match(/(\d{6}).*?(\d{4})\s*$/);

    // if (match) {
    //   const datePart = match[1];    
    //   const serialPart = match[2];  

    //   serialNumber = `${serialPart}-${datePart}`;
    // }

    const match = barcode.match(/(\d{6})\s+([A-Z])\s+(\d{4})$/);

    if (match) {
      const dateRaw = match[1];   
      const grade = match[2];    
      const serial = match[3];   

      serialNumber = `${serial}-${grade}-${dateRaw}`

}


    if (!serialNumber) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "Unable to extract serial number from barcode",
        data: "None"
      });
    }

    if (transaction.serial_numbers.includes(serialNumber)) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "Duplicate barcode",
        data: {
          scan_result: "duplicate",
          error_type: "duplicate_barcode",
          serial_number: serialNumber
        }
      });
    }

    transaction.serial_numbers.push(serialNumber);

    transaction.scan_logs.push({
      barcode,
      serial_number: serialNumber,
      user_code: user.user_code,
      user_name:user.user_name,
      scanned_at: new Date()
    });


    transaction.scanned_quantity = transaction.serial_numbers.length;
    transaction.is_completed = transaction.scanned_quantity === part.tag_quantity;
    transaction.remaining_count = part.tag_quantity - transaction.scanned_quantity;

    await transaction.save();

    console.log("Scanned:", transaction.scanned_quantity);
    console.log("Remaining:", transaction.remaining_count);


    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Scan recorded successfully",
      data: {
        scan_result: "valid",
        serial_number: serialNumber,
        scanned_count: transaction.scanned_quantity,
        remaining: transaction.remaining_count,
        progress_percentage: Number(
          ((transaction.scanned_count / part.tag_quantity) * 100).toFixed(2)
        ),
        is_mindascan:transaction.is_mindascan || false,
        is_complete: transaction.scanned_quantity === part.tag_quantity
      }
    });

  } catch (error) {
    console.log(error,"error");
    
    return res.status(200).json({
      status: "error",
      code: 500,
      message: error.message,
      data: "None"
    });
  }
};


export const getPendingTransaction = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      is_mindascan: false,
      isDeleted: false
    });

    if (!transactions.length) {
      return res.status(200).json({
        status: "success",
        code: 200,
        message: "No active transactions",
        data: []
      });
    }

    const partIds = transactions.map(t => t.part_id);

    const parts = await Part.find({ part_id: { $in: partIds } });

    const partMap = {};
    parts.forEach(p => {
      partMap[p.part_id] = p;
    });

    const responseData = transactions.map(transaction => {
      const part = partMap[transaction.part_id];

      
      return {
        transaction_id: transaction.transaction_id,
        part_number: transaction.part_number,
        part_name: transaction.part_name,
        type: part?.type || null,
        required_quantity: part?.tag_quantity || 0,
        scanned: transaction.serial_numbers.length,
        scanned_barcodes: transaction.serial_numbers,
        is_completed:transaction.is_completed,
        is_mindascan:transaction.is_mindascan,
        created_at: transaction.createdAt
      };
    });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Active transactions found",
      data: responseData
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

export const restartScan = async (req, res) => {
  try {
    const { transaction_id, user_id, scanned_at } = req.body;

    if (!transaction_id || !user_id) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "transaction_id and user_id are required",
        data: "None"
      });
    }

    const transaction = await Transaction.findOne({
      transaction_id,
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

    if (transaction.is_completed) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "Completed transaction cannot be restarted",
        data: "None"
      });
    }

    const part = await Part.findOne({ part_id: transaction.part_id });
    if (!part) {
      return res.status(200).json({
        status: "error",
        code: 404,
        message: "Part not found",
        data: "None"
      });
    }

    transaction.serial_numbers = [];
    transaction.last_restarted_by = user_id;
    transaction.last_restarted_at = scanned_at
      ? new Date(scanned_at)
      : new Date();

    await transaction.save();

    const scannedCount = transaction.serial_numbers.length;
    const remaining = part.tag_quantity;

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Scan restarted successfully",
      data: {
        scan_result: "valid",
        scanned_count: scannedCount,
        remaining,
        progress_percentage: 0,
        is_complete: false
      }
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

export const printLabelByTransactionId = async (req, res) => {
  try {
    const { transaction_id } = req.body;
    const txn = await Transaction.findOne({ transaction_id });
    if (!txn) {
      return res.status(200).json({
        status: "error",
        code: 404,
        message: "Transaction not found",
        data: "None"
      });
    }

    const {
      minda_number,
      part_number,
      part_name,
      required_quantity,
      serial_numbers,
      part_id
    } = txn;
   
    const partData = await Part.findOne(
      { part_id: part_id },
      { type: 1, _id: 0 }   
    );

    const type = partData?.type;

    const getTodayDate = () => {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };


    const inspection_date = getTodayDate();

    const qrData = JSON.stringify({

      minda: minda_number,
      part: part_number,
      qty: required_quantity,
      serials: serial_numbers
    });

    const tspl = buildLabelTSPL({
      minda_number,
      part_number,
      part_name,
      required_quantity,
      inspection_date,
      qrData
    });

    fs.writeFileSync("\\\\localhost\\TSC TE210", tspl);

    console.log("Label sent to printer");
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Label printed successfully",
      data: { transaction_id }
    });

  } catch (err) {
    console.log(err, "err");

    return res.status(200).json({
      status: "error",
      code: 500,
      message: err.message,
      data: "None"
    });
  }
};


export const printTransactionLabel = async (req, res) => {
  try {
    const {
      part_name,
      part_number,
      minda_number,
      qty,
      date,
      serial_numbers
    } = req.body;

    if (
      !part_name ||
      !part_number ||
      !minda_number ||
      !qty ||
      !Array.isArray(serial_numbers)
    ) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "Missing required label data",
        data: "None"
      });
    }

    const qrData = JSON.stringify({
      part_name,
      part_number,
      minda_number,
      serial_numbers
    });

    const tspl = `
SIZE 100 mm,80 mm
GAP 2 mm,0
DENSITY 8
SPEED 4
DIRECTION 1
CLS

TEXT 40,40,"0",0,2,2,"UNO MINDA LTD - Lighting Division"
TEXT 40,90,"0",0,2,2,"Chennai"

TEXT 40,160,"0",0,2,2,"Part Name"
TEXT 320,160,"0",0,2,2,"${part_name}"

TEXT 40,220,"0",0,2,2,"Cus' Part No"
TEXT 320,220,"0",0,2,2,"${part_number}"

TEXT 40,280,"0",0,2,2,"Minda Part No"
TEXT 320,280,"0",0,2,2,"${minda_number}"

TEXT 40,340,"0",0,2,2,"Date of Insp + PKG"
TEXT 320,340,"0",0,2,2,"${date}"

TEXT 40,400,"0",0,2,2,"Qty/BOX"
TEXT 320,400,"0",0,2,2,"${qty}"

QRCODE 720,170,L,6,A,0,"${qrData}"

TEXT 720,520,"0",0,1,1,"Scan QR Code for part details."

PRINT 1,1
`;

    printer.printDirect({
      data: tspl,
      type: "RAW",
      printer: "TSC TE210",
      success: jobID => {
        return res.status(200).json({
          status: "success",
          code: 200,
          message: "Label sent to printer successfully",
          data: { jobID }
        });
      },
      error: err => {
        return res.status(200).json({
          status: "error",
          code: 500,
          message: "Printer error",
          data: err.message
        });
      }
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

    const user = await User.findOne({ user_id, isActive: true, is_completed:true , is_mindascan:true });
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


export const validateTransaction = async (req, res) => {
  try {
    const { transaction_id, barcode, user_id } = req.body;

    // 1️⃣ Basic validation
    if (!transaction_id || !barcode || !user_id) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Missing required fields",
        data: {
          scan_result: "invalid",
          reason: "Required payload missing"
        }
      });
    }

    // 2️⃣ Parse barcode STRING → OBJECT
    const parsedBarcode = parseBarcodeSafe(barcode);
    if (!parsedBarcode) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Invalid barcode format",
        data: {
          scan_result: "invalid",
          reason: "Barcode parsing failed"
        }
      });
    }

    const { minda, part, qty, serials } = parsedBarcode;

    // 3️⃣ Validate user
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Minda Part Scan Validation failed",
        data: {
          scan_result: "invalid",
          reason: "User not found"
        }
      });
    }

    // 4️⃣ Fetch transaction
    const transaction = await Transaction.findOne({ transaction_id });
    if (!transaction) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Minda Part Scan Validation failed",
        data: {
          scan_result: "invalid",
          reason: "Transaction not found"
        }
      });
    }

    // 5️⃣ Field validation
    if (transaction.minda_number !== minda) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Validation failed",
        data: {
          scan_result: "invalid",
          reason: "Minda number mismatch"
        }
      });
    }

    if (transaction.part_number !== part) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Validation failed",
        data: {
          scan_result: "invalid",
          reason: "Part number mismatch"
        }
      });
    }

    if (transaction.required_quantity !== qty) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Validation failed",
        data: {
          scan_result: "invalid",
          reason: "Quantity mismatch"
        }
      });
    }

    if (!Array.isArray(serials)) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Validation failed",
        data: {
          scan_result: "invalid",
          reason: "Invalid serials format"
        }
      });
    }

    

    // ✅ SUCCESS
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Minda Part Scan Validated successfully",
      data: {
        scan_result: "valid",
        total_serials: serials.length
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error",
      data: {
        scan_result: "invalid",
        reason: "Server error"
      }
    });
  }
};


const parseBarcodeSafe = (barcodeStr) => {
  try {
    if (typeof barcodeStr !== "string") return null;

    const mindaMatch = barcodeStr.match(/minda:([^,}]+)/);
    const partMatch = barcodeStr.match(/part:([^,}]+)/);
    const qtyMatch = barcodeStr.match(/qty:(\d+)/);
    const serialsMatch = barcodeStr.match(/serials:\[([^\]]*)\]/);

    if (!mindaMatch || !partMatch || !qtyMatch) return null;

    const serials = serialsMatch
      ? serialsMatch[1]
          .split(",")
          .map(s => s.trim())
          .filter(Boolean)
      : [];

    return {
      minda: mindaMatch[1].trim(),
      part: partMatch[1].trim(),
      qty: Number(qtyMatch[1]),
      serials
    };
  } catch (err) {
    console.error("Barcode parse error:", err);
    return null;
  }
};


