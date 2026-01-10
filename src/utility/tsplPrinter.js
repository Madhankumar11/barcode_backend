
export const buildLabelTSPL = ({
  part_name,
  part_number,
  minda_number,
  quantity,
  inspection_date, 
  qrData
}) => {
  return `
SIZE 100 mm,80 mm
GAP 2 mm,0 mm
DIRECTION 1
CLS

TEXT 20,20,"2",0,1,1,"UNO MINDA LTD"
TEXT 20,45,"2",0,1,1,"Lighting Division - Chennai"

TEXT 20,80,"2",0,1,1,"Part Name     : ${sanitize(part_name)}"
TEXT 20,110,"2",0,1,1,"Cus Part No   : ${sanitize(part_number)}"
TEXT 20,140,"2",0,1,1,"Minda Part No : ${sanitize(minda_number)}"
TEXT 20,170,"2",0,1,1,"Date of Insp  : ${inspection_date}"
TEXT 20,200,"2",0,1,1,"Qty / Box    : ${quantity}"

QRCODE 650,40,L,12,A,0,"${sanitize(qrData)}"

TEXT 420,340,"2",0,1,1,"Scan QR Code"

PRINT 1
`;
};


const sanitize = (value = "") =>
  value
    .toString()
    .replace(/"/g, "")
    .replace(/\n/g, " ")
    .trim();
