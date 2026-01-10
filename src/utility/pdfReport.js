import fs from "fs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const generateTransactionPdf = async (transactions, fromDate, toDate) => {

  const pdfDoc = await PDFDocument.create();
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const UNO_BLUE = rgb(0.0, 0.45, 0.74);
  const UNO_RED = rgb(0.85, 0.1, 0.1);

  const PAGE_WIDTH = 595;
  const PAGE_HEIGHT = 842;

  const ROW_HEIGHT = 22;
  const ROWS_PER_PAGE = 10;
  const TABLE_X = 30;
  const TABLE_START_Y = 640;

  const columns = [
    { title: "S.No", width: 40 },
    { title: "Part Name", width: 110 },
    { title: "Part No", width: 80 },
    { title: "Minda No", width: 80 },
    { title: "Serial Numbers", width: 140 },
    { title: "Created At", width: 85 }
  ];

  const safeText = (val) => {
  if (val === null || val === undefined || val === "") return "-";

  // Only format real Date objects
  if (val instanceof Date) {
    return val.toLocaleDateString("en-GB");
  }

  return String(val);
};


  const logoBytes = fs.readFileSync("assets/logo.jpg");
  const logoImage = await pdfDoc.embedJpg(logoBytes);

  const drawHeader = (page) => {
    page.drawText("UNO Minda Limited", {
      x: 40,
      y: 795,
      size: 16,
      font: boldFont,
      color: UNO_BLUE
    });

    page.drawText(`Created Date: ${new Date().toLocaleDateString("en-GB")}`, {
      x: 40,
      y: 770,
      size: 10,
      font: regularFont
    });

    page.drawText(
      `Report Period: ${fromDate || "-"} to ${toDate || "-"}`,
      { x: 40, y: 750, size: 10, font: regularFont }
    );

    page.drawImage(logoImage, {
      x: 420,
      y: 755,
      width: 120,
      height: 45
    });

    page.drawText("Barcode / Transaction Report", {
      x: 165,
      y: 680,
      size: 14,
      font: boldFont
    });
  };

  const drawTableHeader = (page, y) => {
    let x = TABLE_X;
    columns.forEach(col => {
      page.drawRectangle({
        x,
        y,
        width: col.width,
        height: ROW_HEIGHT,
        borderWidth: 1,
        borderColor: UNO_BLUE
      });

      page.drawText(col.title, {
        x: x + 5,
        y: y + 7,
        size: 9,
        font: boldFont,
        color: UNO_BLUE
      });

      x += col.width;
    });
  };

  const drawCell = (page, text, x, y, width) => {
    page.drawRectangle({
      x,
      y,
      width,
      height: ROW_HEIGHT,
      borderWidth: 1,
      borderColor: UNO_BLUE
    });

    page.drawText(safeText(text), {
      x: x + 5,
      y: y + 7,
      size: 9,
      font: regularFont
    });
  };

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  drawHeader(page);

  let y = TABLE_START_Y;
  drawTableHeader(page, y);
  y -= ROW_HEIGHT;

  let serialNo = 1; 
  for (const t of transactions) {

    if ((serialNo - 1) % ROWS_PER_PAGE === 0 && serialNo !== 1) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawHeader(page);
      y = TABLE_START_Y;
      drawTableHeader(page, y);
      y -= ROW_HEIGHT;
    }

    let x = TABLE_X;

    const rowData = [
      String(serialNo), 
      t.part_name || "-",
      t.part_number || "-",
      t.minda_number || "-",
      (t.serial_numbers || []).join(", "),
      safeText(t.createdAt)
    ];

    rowData.forEach((cell, idx) => {
      drawCell(page, cell, x, y, columns[idx].width);
      x += columns[idx].width;
    });

    serialNo++;
    y -= ROW_HEIGHT;
  }

  page.drawRectangle({ x: 30, y: 55, width: 535, height: 3, color: UNO_BLUE });
  page.drawRectangle({ x: 30, y: 50, width: 535, height: 3, color: UNO_RED });

  page.drawText(
    "UNO Minda Limited (Corporate Office): Village Nawada Fatehpur, P.O. Sikanderpur Badda,",
    { x: 30, y: 35, size: 8, font: regularFont }
  );

  page.drawText(
    "Manesar, Distt. Gurugram, Haryana - 122004 | Email: info@unominda.com | www.unominda.com",
    { x: 30, y: 25, size: 8, font: regularFont }
  );

  fs.mkdirSync("reports", { recursive: true });
  const filePath = `reports/transaction_report_${Date.now()}.pdf`;
  fs.writeFileSync(filePath, await pdfDoc.save());

  return filePath;
};
