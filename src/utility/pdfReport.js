import fs from "fs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const generateTransactionPdf = async (transactions, fromDate, toDate) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); 

  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const UNO_BLUE = rgb(0.0, 0.45, 0.74);
  const UNO_RED = rgb(0.85, 0.1, 0.1);


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
    {
      x: 40,
      y: 750,
      size: 10,
      font: regularFont
    }
  );

  const logoBytes = fs.readFileSync("assets/logo.jpg");
  const logoImage = await pdfDoc.embedJpg(logoBytes);

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


  let y = 640;
  const rowHeight = 22;
  const tableX = 30;

  const columns = [
    { title: "S.No", width: 40 },
    { title: "Part Name", width: 110 },
    { title: "Part No", width: 80 },
    { title: "Minda No", width: 80 },
    { title: "Serial Numbers", width: 140 },
    { title: "Created At", width: 85 }
  ];

  const safeText = (value) => {
    if (!value) return "-";
    if (value instanceof Date)
      return value.toLocaleDateString("en-GB");
    if (!isNaN(Date.parse(value)))
      return new Date(value).toLocaleDateString("en-GB");
    return String(value);
  };

  const drawCell = (text, x, width, header = false) => {
    page.drawRectangle({
      x,
      y,
      width,
      height: rowHeight,
      borderWidth: 1,
      borderColor: UNO_BLUE
    });

    page.drawText(safeText(text), {
      x: x + 5,
      y: y + 7,
      size: 9,
      font: header ? boldFont : regularFont,
      color: header ? UNO_BLUE : rgb(0, 0, 0)
    });
  };


  let x = tableX;
  columns.forEach(col => {
    drawCell(col.title, x, col.width, true);
    x += col.width;
  });

  y -= rowHeight;


  transactions.forEach((t, i) => {
    x = tableX;
    const row = [
      i + 1,
      t.part_name,
      t.part_number,
      t.minda_number,
      t.serial_numbers.join(", "),
      t.createdAt
    ];

    row.forEach((cell, index) => {
      drawCell(cell, x, columns[index].width);
      x += columns[index].width;
    });

    y -= rowHeight;
  });


  page.drawRectangle({
    x: 30,
    y: 55,
    width: 535,
    height: 3,
    color: UNO_BLUE
  });

  page.drawRectangle({
    x: 30,
    y: 50,
    width: 535,
    height: 3,
    color: UNO_RED
  });

  page.drawText(
    "UNO Minda Limited (Corporate Office): Village Nawada Fatehpur, P.O. Sikanderpur Badda,",
    {
      x: 30,
      y: 35,
      size: 8,
      font: regularFont
    }
  );

  page.drawText(
    "Manesar, Distt. Gurugram, Haryana - 122004 | Email: info@unominda.com | www.unominda.com",
    {
      x: 30,
      y: 25,
      size: 8,
      font: regularFont
    }
  );


  fs.mkdirSync("reports", { recursive: true });
  const filePath = `reports/transaction_report_${Date.now()}.pdf`;
  fs.writeFileSync(filePath, await pdfDoc.save());

  return filePath;
};
