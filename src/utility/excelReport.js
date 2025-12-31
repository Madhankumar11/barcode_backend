import ExcelJS from "exceljs";
import fs from "fs";

export const generateExcelReport = async (transactions) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Transactions");

  sheet.columns = [
    { header: "Part Name", key: "part_name" },
    { header: "Part Number", key: "part_number" },
    { header: "Minda Number", key: "minda_number" },
    { header: "Serial Numbers", key: "serial_numbers" },
    { header: "Created By", key: "createdBy" },
    { header: "Created Date", key: "createdAt" }
  ];

  transactions.forEach(t => {
    sheet.addRow({
      part_name: t.part_name,
      part_number: t.part_number,
      minda_number: t.minda_number,
      serial_numbers: t.serial_numbers.join(", "),
      createdBy: t.createdBy,
      createdAt: t.createdAt
    });
  });

  const filePath = `reports/transaction_report_${Date.now()}.xlsx`;
  fs.mkdirSync("reports", { recursive: true });
  await workbook.xlsx.writeFile(filePath);

  return filePath;
};
