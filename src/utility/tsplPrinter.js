
export const buildLabelTSPL = ({
  part_name,
  part_number,
  minda_number,
  required_quantity,
  inspection_date, 
  qrData
}) => {
  

return `SIZE 96 mm, 100.1 mm
GAP 3 mm, 0 mm
DIRECTION 0,0
REFERENCE 0,0
OFFSET 0 mm
SET PEEL OFF
SET CUTTER OFF
SET PARTIAL_CUTTER OFF
SET TEAR ON
CLS
BOX 4,15,772,783,2
CODEPAGE 1252
TEXT 692,762,"ROMAN.TTF",180,1,14,"UNO MINDA"
TEXT 476,762,"ROMAN.TTF",180,1,14,"- Lighting Division Chennai"
BAR 5,711, 767, 2
BAR 5,655, 767, 2
BAR 5,599, 767, 2
BAR 5,535, 767, 2
BAR 5,471, 767, 2
BAR 5,407, 767, 2
BAR 388,407, 2, 304
TEXT 756,700,"ROMAN.TTF",180,1,12,"Part Name"
TEXT 756,644,"ROMAN.TTF",180,1,12,"Cus' Part No"
TEXT 756,588,"ROMAN.TTF",180,1,12,"Minda Part No"
TEXT 756,516,"ROMAN.TTF",180,1,12,"Data of Insp * PKG"
TEXT 756,452,"ROMAN.TTF",180,1,12,"Box/Qty"
TEXT 372,700,"ROMAN.TTF",180,1,12,"${sanitize(part_name)}"
TEXT 373,644,"ROMAN.TTF",180,1,12,"${sanitize(part_number)}"
TEXT 373,588,"ROMAN.TTF",180,1,12,"${sanitize(minda_number)}"
TEXT 373,516,"ROMAN.TTF",180,1,12,"${inspection_date}"
TEXT 373,452,"ROMAN.TTF",180,1,12,"${required_quantity}/81"
QRCODE 700,386,L,4,A,180,M2,S7,"${sanitize(qrData)}"
PRINT 1,1
`;



};


const sanitize = (value = "") =>
  value
    .toString()
    .replace(/"/g, "")
    .replace(/\n/g, " ")
    .trim();
