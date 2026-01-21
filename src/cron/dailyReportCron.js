import cron from "node-cron";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Transaction from "../models/transection.js";   
import { generateExcelReport } from "../utility/excelReport.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "dispatch_light-4w_chennai@unominda.com",
    pass: "Iceage@321"
  }
});


cron.schedule("05 18 * * *", async () => {
  try {
    console.log("Daily Scanning Report Cron Started");
  
    const now = new Date();

    const toDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      19, 0, 0
    );

    const fromDate = new Date(toDate);
    fromDate.setDate(fromDate.getDate() - 1);

    console.log("Report From:", fromDate);
    console.log("Report To:", toDate);

    const transactions = await Transaction.find({
      createdAt: {
        $gte: fromDate,
        $lt: toDate
      }
    }).lean();

    if (!transactions.length) {
      console.log("No data found. Mail not sent.");
      return;
    }

    
    const excelPath = await generateExcelReport(transactions);


    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: [
        "user1@minda.com",
        "user2@minda.com",
        "user3@minda.com"
      ],
      subject: "Daily Full Scanning Report",
      text: `
Please find attached the daily scanning report.

Report Duration:
${fromDate.toLocaleString()} to ${toDate.toLocaleString()}
      `,
      attachments: [
        {
          filename: "Daily_Scanning_Report.xlsx",
          path: excelPath
        }
      ]
    });

    console.log("Daily report email sent successfully");

  } catch (error) {
    console.error("Cron Job Error:", error);
  }
});
