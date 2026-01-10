import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

export const generateExcelReport = async (transactions) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Daily Scanning Report");

 
  sheet.columns = [
    { header: "Sr No.", key: "srNo", width: 8 },
    { header: "Customer part number", key: "customerPartNumber", width: 35 },
    { header: "Minda partnumber", key: "mindaPartNumber", width: 20 },
    { header: "Scanning Date", key: "scanningDate", width: 15 },
    { header: "Scanning Time", key: "scanningTime", width: 15 },
    { header: "Scanning QTY", key: "scanningQty", width: 15 },
    { header: "User ID", key: "userId", width: 20 }
  ];

  // Header Styling
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

  transactions.forEach((t, index) => {
    const createdDate = new Date(t.createdAt);

    sheet.addRow({
      srNo: index + 1,
      customerPartNumber: t.part_number,
      mindaPartNumber: t.minda_number,
      scanningDate: createdDate.toISOString().split("T")[0],
      scanningTime: createdDate.toTimeString().split(" ")[0],
      scanningQty: t.required_quantity || 1,
      userId: t.user_code        // ✅ UPDATED FIELD
    });
  });

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
