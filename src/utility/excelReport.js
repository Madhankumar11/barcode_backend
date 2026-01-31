import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

export const generateExcelReport = async (transactions) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Daily Scanning Report");

  sheet.columns = [
    { header: "Sr No.", key: "srNo", width: 8 },
    { header: "Customer part number", key: "customerPartNumber", width: 40 },
    { header: "Minda partnumber", key: "mindaPartNumber", width: 20 },
    { header: "Scanning Date", key: "scanningDate", width: 15 },
    { header: "Scanning Time", key: "scanningTime", width: 15 },
    { header: "Scanning QTY", key: "scanningQty", width: 15 },
    { header: "UserCode", key: "user_code", width: 20 },
    { header: "UserName", key: "user_name", width: 20 }

  ];

  // 🔹 Header styling
  sheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }
    };
  });

  let srNo = 1;

  transactions.forEach(transaction => {
    let runningQty = 0;

    transaction.scan_logs.forEach(scan => {
      runningQty += 1;

      const scannedAt = new Date(scan.scanned_at);

      sheet.addRow({
        srNo: srNo++,
        customerPartNumber: scan.barcode,         
        mindaPartNumber: transaction.minda_number, 
        scanningDate: scannedAt.toISOString().split("T")[0],
        scanningTime: scannedAt.toTimeString().split(" ")[0],
        scanningQty: runningQty,                    
        user_code: scan.user_code,
        user_name: scan.user_name                      
      });
    });
  });

  // 🔹 Cell styling
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      row.eachCell(cell => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });
    }
  });

  fs.mkdirSync("reports", { recursive: true });

  const filePath = `reports/Daily_Full_Scanning_Report_${Date.now()}.xlsx`;
  await workbook.xlsx.writeFile(filePath);

  return filePath;
};
