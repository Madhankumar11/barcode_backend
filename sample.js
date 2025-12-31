import fs from "fs";

const printerPath = "\\\\localhost\\TSC TE210";

const tspl = `
SIZE 60 mm,40 mm
GAP 2 mm,0 mm
CLS
TEXT 100,100,"3",0,1,1,"Hello USB"
PRINT 1
`;

fs.writeFile(printerPath, tspl, err => {
  if (err) {
    console.error("❌ Print failed:", err.message);
  } else {
    console.log("✅ Label printed successfully");
  }
});
