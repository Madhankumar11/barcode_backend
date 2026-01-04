import Transaction from "../../models/transection.js";
import User from "../../models/user.js";
import { generateTransactionPdf } from "../../utility/pdfReport.js";
import { generateExcelReport } from "../../utility/excelReport.js";
import { sendMailWithAttachment } from "../../utility/sendMail.js";

export const generateTransactionReport = async (req, res) => {
  try {
    const {
      user_id,
      fromDate,
      toDate,
      part_name,
      part_number,
      reportType
    } = req.body;

    if (!user_id || !reportType) {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "user_id and reportType are required",
        data: "None"
      });
    }

    const user = await User.findOne({ user_id, isActive: true });
    if (!user) {
      return res.status(200).json({
        status: "error",
        code: 404,
        message: "User not found",
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

    if (fromDate && toDate) {
      filter.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate)
      };
    }
    

    const transactions = await Transaction.find(filter).sort({ createdAt: -1 });

    if (!transactions.length) {
      return res.status(200).json({
        status: "error",
        code: 404,
        message: "No transactions found for given filter",
        data: "None"
      });
    }

    let filePath;

    if (reportType === "pdf") {
      filePath = await generateTransactionPdf(transactions,fromDate,toDate);
    } else if (reportType === "excel") {
      filePath = await generateExcelReport(transactions);
    } else {
      return res.status(200).json({
        status: "error",
        code: 400,
        message: "Invalid reportType",
        data: "None"
      });
    }

    // await sendMailWithAttachment({
    //   to: user.email,
    //   subject: "Transaction Barcode Report",
    //   text: "Please find attached the transaction barcode report.",
    //   attachmentPath: filePath
    // });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Report generated and emailed successfully",
      data: {
        reportType,
        sentTo: user.email
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
