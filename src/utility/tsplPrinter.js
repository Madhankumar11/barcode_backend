
export const buildLabelTSPL = ({
  part_name,
  part_number,
  minda_number,
  required_quantity,
  inspection_date, 
  qrData
}) => {
  

return `SIZE 96 mm, 150.1 mm
GAP 3 mm, 0 mm
DIRECTION 0,0
REFERENCE 0,0
OFFSET 0 mm
SET PEEL OFF
SET CUTTER OFF
SET PARTIAL_CUTTER OFF
SET TEAR ON
CLS

BOX 4,25,772,1222,2
CODEPAGE 1252

TEXT 692,1190,"ROMAN.TTF",180,1,16,"UNO MINDA"
TEXT 430,1190,"ROMAN.TTF",180,1,14,"- Lighting Division Chennai"

BAR 5,1110,767,2
BAR 5,1030,767,2
BAR 5,950,767,2
BAR 5,870,767,2
BAR 5,790,767,2
BAR 5,710,767,2

BAR 388,710,2,400

TEXT 756,1070,"ROMAN.TTF",180,1,12,"Part Name"
TEXT 756,990,"ROMAN.TTF",180,1,12,"Cus' Part No"
TEXT 756,910,"ROMAN.TTF",180,1,12,"Minda Part No"
TEXT 756,830,"ROMAN.TTF",180,1,12,"Date of Insp * PKG"
TEXT 756,750,"ROMAN.TTF",180,1,12,"Box/Qty"

TEXT 373,1070,"ROMAN.TTF",180,1,12,"${sanitize(part_name)}"
TEXT 373,990,"ROMAN.TTF",180,1,12,"${sanitize(part_number)}"
TEXT 373,910,"ROMAN.TTF",180,1,12,"${sanitize(minda_number)}"
TEXT 373,830,"ROMAN.TTF",180,1,12,"${inspection_date}"
TEXT 373,750,"ROMAN.TTF",180,1,12,"${required_quantity}/81"

QRCODE 700,620,L,5,A,180,M2,S7,"${sanitize(qrData)}"

PRINT 1,1
`;



};


const sanitize = (value = "") =>
  value
    .toString()
    .replace(/"/g, "")
    .replace(/\n/g, " ")
    .trim();
