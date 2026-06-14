import ExcelJS from 'exceljs';

const getMethodTitles = (year: number): Record<string, string> => ({
  CONDOM: `TARGET  CLIENT  LIST FOR  FAMILY  PLANNING SERVICES - CONDOM ${year}`,
  DMPA: `TARGET  CLIENT  LIST FOR  FAMILY  PLANNING SERVICES - DMPA ${year}`,
  FP_BTL: `TARGET  CLIENT  LIST FOR  FAMILY  PLANNING SERVICES BTL - ${year}`,
  FP_SDM: `TARGET  CLIENT  LIST FOR  FAMILY  PLANNING SERVICES - SDM ${year}`,
  IMPLANT: `TARGET  CLIENT  LIST FOR  FAMILY  PLANNING SERVICES - IMPLANT ${year}`,
  IUD: `TARGET  CLIENT  LIST FOR  FAMILY  PLANNING SERVICES - IUD ${year}`,
  PILLS_BUYING: `TARGET  CLIENT  LIST FOR  FAMILY  PLANNING SERVICES -  BUYING ${year}`,
  PILLS_COC: `TARGET  CLIENT  LIST FOR  FAMILY  PLANNING SERVICES -  COC ${year}`,
  PILLS_POP: `TARGET  CLIENT  LIST FOR  FAMILY  PLANNING SERVICES -  POP ${year}`,
});

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('T')[0].split('-');
  const yyyy = parts[0];
  const mm = parts[1];
  const dd = parts[2];
  const yy = yyyy.slice(-2);
  return `${mm}/${dd}/${yy}`;
};

const thinBorder: Partial<ExcelJS.Borders> = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

const centerAlign: Partial<ExcelJS.Alignment> = {
  horizontal: 'center',
  vertical: 'middle',
  wrapText: true,
};

const leftAlign: Partial<ExcelJS.Alignment> = {
  horizontal: 'left',
  vertical: 'middle',
};

const addHeaderBlock = (ws: ExcelJS.Worksheet, startRow: number, title: string) => {
  const hdrFont = { name: 'Calibri', size: 8, bold: true };
  const tb = thinBorder;

  // Title rows (startRow to startRow+2)
  ws.mergeCells(`A${startRow}:J${startRow + 2}`);
  const titleCell = ws.getCell(`A${startRow}`);
  titleCell.value = title;
  titleCell.font = { name: 'Calibri', size: 24, bold: true };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(startRow).height = 40;

  const h1 = startRow + 3;
  const h2 = startRow + 4;
  const h3 = startRow + 5;
  const h4 = startRow + 6;
  const h5 = startRow + 7;

  // Apply borders to all header rows
  for (let r = h1; r <= h5; r++) {
    ['A','B','C','D','E','F','G','H','I','J'].forEach(c => {
      ws.getCell(`${c}${r}`).border = tb;
    });
  }

  const setHdr = (cell: string, value: string) => {
    const c = ws.getCell(cell);
    c.value = value;
    c.font = hdrFont;
    c.alignment = centerAlign;
    c.border = tb;
  };

  // Row h1
  setHdr(`A${h1}`, 'No.');
  setHdr(`B${h1}`, 'Date of');
  setHdr(`C${h1}`, 'Family Serial No.');
  setHdr(`D${h1}`, 'Complete Name');
  setHdr(`E${h1}`, 'Complte Address');
  setHdr(`F${h1}`, 'Age/ Date of Birth');
  setHdr(`G${h1}`, 'SE Status');
  setHdr(`H${h1}`, 'Type of Client*');
  setHdr(`I${h1}`, 'Sources**');

  // Row h2
  setHdr(`B${h2}`, 'Registration');
  setHdr(`G${h2}`, '1-NHTS');
  setHdr(`J${h2}`, 'Previous ');

  // Row h3
  setHdr(`B${h3}`, '(mm/dd/yy)');
  setHdr(`D${h3}`, '(FN, MI, LN)');
  setHdr(`G${h3}`, '2-Non- NHTS');
  setHdr(`J${h3}`, 'Method***');

  // Row h4 - empty with borders
  ['A','B','C','D','E','F','G','H','I','J'].forEach(c => {
    ws.getCell(`${c}${h4}`).border = tb;
  });

  // Row h5 - column numbers
  const nums: Record<string, string> = {
    B:'(1)', C:'(2)', D:'(3)', E:'(4)', F:'(5)',
    G:'(6)', H:'(7)', I:'(8)', J:'(9)'
  };
  Object.entries(nums).forEach(([col, val]) => {
    setHdr(`${col}${h5}`, val);
  });
  ws.getCell(`A${h5}`).border = tb;

  // Merges
  ws.mergeCells(`A${h1}:A${h5}`);
  ws.mergeCells(`C${h1}:C${h4}`);
  ws.mergeCells(`D${h1}:D${h2}`);
  ws.mergeCells(`E${h1}:E${h4}`);
  ws.mergeCells(`F${h1}:F${h3}`);
  ws.mergeCells(`H${h1}:H${h2}`);
  ws.mergeCells(`I${h1}:I${h3}`);

  // Return the row where data starts
  return h5 + 1;
};

const addLegend = (ws: ExcelJS.Worksheet, startRow: number) => {
  const sf = { name: 'Calibri', size: 8 };
  const sfb = { name: 'Calibri', size: 8, bold: true };
  const lr = startRow + 1;

  ws.getCell(`A${lr}`).value = '*Type of Client:';
  ws.getCell(`A${lr}`).font = sfb;
  ws.getCell(`D${lr}`).value = '**Source:';
  ws.getCell(`D${lr}`).font = sfb;
  ws.getCell(`G${lr}`).value = 'IUD = IUD interval';
  ws.getCell(`G${lr}`).font = sf;

  const legendRows = [
    ['NA = New Acceptors', 'Public', 'FSTR/BTL = Female Sterelizatio/ Bilateral tubal ligation', 'IUD - PP = IUD Postpartum'],
    ['CU =  Curent Users', 'Private', 'MSTR / NSV = Male Sterilization / No - Scalpel Vasectomy', 'NFP - LAM = Lactation Amenorrhea Method'],
    ['OA = Other Acceptors', '', 'CON = Condom', 'NFP - BBT = Basal Body Temperature'],
    ['CU - CM = Changing Method', '', 'Pills - POP = Progestin Only Pills', 'NFP - CMM = Cervical Mucus Method'],
    ['CU - CC = Chaging Clinic', '', 'Pills - COC = Combined Oral Contraceptives', 'NFP - STM = Symptothermal Method'],
    ['CU - RS = Restarter', '', 'INJ = DMPA or CIC', 'NFP - SDM = Standard Days Method'],
    ['', '', 'IMP = Single rod sub - thermal Implant', 'NONE or New Acceptor'],
  ];

  legendRows.forEach(([typeVal, srcVal, prevVal, rightVal], idx) => {
    const r = lr + 1 + idx;
    if (typeVal) { ws.getCell(`B${r}`).value = typeVal; ws.getCell(`B${r}`).font = sf; }
    if (srcVal) { ws.getCell(`D${r}`).value = srcVal; ws.getCell(`D${r}`).font = sf; }
    if (prevVal) { ws.getCell(`E${r}`).value = prevVal; ws.getCell(`E${r}`).font = sf; }
    if (rightVal) { ws.getCell(`G${r}`).value = rightVal; ws.getCell(`G${r}`).font = sf; }
  });
};

export const exportToExcel = async (clients: any[], method: string, year: number) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(method);
  const CLIENTS_PER_PAGE = 10;
  const dataFont = { name: 'Calibri', size: 13 };
  const tb = thinBorder;

  ws.columns = [
    { key: 'A', width: 3.57 },
    { key: 'B', width: 12.14 },
    { key: 'C', width: 9.43 },
    { key: 'D', width: 36.57 },
    { key: 'E', width: 28.71 },
    { key: 'F', width: 12.57 },
    { key: 'G', width: 10.14 },
    { key: 'H', width: 12.0 },
    { key: 'I', width: 11.86 },
    { key: 'J', width: 12.0 },
  ];

  const setData = (cell: string, value: any, align = centerAlign) => {
    const c = ws.getCell(cell);
    c.value = value;
    c.font = dataFont;
    c.alignment = align;
    c.border = tb;
  };

  // Group clients by year if "All"
  let yearGroups: { year: number; clients: any[] }[] = [];

  if (year === 0) {
    const currentYr = new Date().getFullYear();
    const grouped: Record<number, any[]> = {};
    clients.forEach(c => {
      const y = c.year || currentYr;
      if (!grouped[y]) grouped[y] = [];
      grouped[y].push(c);
    });
    const allClients = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b) // ascending — 2025 muna, tapos 2026
      .flatMap(y => 
        grouped[y].sort((a: any, b: any) => {
          // Sort by month of date_of_registration
          const dateA = new Date(a.date_of_registration || '');
          const dateB = new Date(b.date_of_registration || '');
          return dateA.getMonth() - dateB.getMonth();
        })
      );
    yearGroups = [{ year: currentYr, clients: allClients }];
  } else {
    yearGroups = [{ year, clients }];
  }

  let currentRow = 1;

  yearGroups.forEach((group, groupIndex) => {
    if (groupIndex > 0) currentRow += 1;

    const title = getMethodTitles(group.year)[method] || method;

    // Split into chunks of 10
    const chunks: any[][] = [];
    for (let i = 0; i < group.clients.length; i += CLIENTS_PER_PAGE) {
      chunks.push(group.clients.slice(i, i + CLIENTS_PER_PAGE));
    }
    if (chunks.length === 0) chunks.push([]);

    chunks.forEach((chunk, chunkIndex) => {
      if (chunkIndex > 0) currentRow += 1;

      let dataStartRow = addHeaderBlock(ws, currentRow, title);
      currentRow = dataStartRow;

      const globalStartIndex = chunkIndex * CLIENTS_PER_PAGE;
      chunk.forEach((client, index) => {
        const dr = currentRow;
        const dobR = currentRow + 1;

        const fn = client.first_name || '';
        const mi = client.middle_initial ? `${client.middle_initial}.` : '';
        const ln = client.last_name || '';
        const fullName = `${fn} ${mi} ${ln}`.replace(/\s+/g, ' ').trim();

        setData(`A${dr}`, globalStartIndex + index + 1);
        setData(`B${dr}`, formatDate(client.date_of_registration || ''));
        setData(`C${dr}`, client.family_serial_no || '');
        setData(`D${dr}`, fullName, leftAlign);
        setData(`E${dr}`, client.complete_address || '');
        setData(`F${dr}`, client.age || '');
        setData(`G${dr}`, client.se_status || '');
        setData(`H${dr}`, client.type_of_client || '');
        setData(`I${dr}`, client.source || '');
        setData(`J${dr}`, client.previous_method || '');

        setData(`F${dobR}`, formatDate(client.date_of_birth || ''));
        ['A','B','C','D','E','G','H','I','J'].forEach(c => {
          ws.getCell(`${c}${dobR}`).border = tb;
        });

        ws.mergeCells(`A${dr}:A${dobR}`);
        ws.mergeCells(`B${dr}:B${dobR}`);
        ws.mergeCells(`C${dr}:C${dobR}`);
        ws.mergeCells(`D${dr}:D${dobR}`);
        ws.mergeCells(`E${dr}:E${dobR}`);
        ws.mergeCells(`G${dr}:G${dobR}`);
        ws.mergeCells(`H${dr}:H${dobR}`);
        ws.mergeCells(`I${dr}:I${dobR}`);
        ws.mergeCells(`J${dr}:J${dobR}`);

        ws.getRow(dr).height = 15;
        ws.getRow(dobR).height = 15;
        currentRow += 2;
      });

      // Fill remaining empty rows
      const remaining = CLIENTS_PER_PAGE - chunk.length;
      for (let e = 0; e < remaining; e++) {
        const dr = currentRow;
        const dobR = currentRow + 1;
        ['A','B','C','D','E','F','G','H','I','J'].forEach(c => {
          ws.getCell(`${c}${dr}`).border = tb;
          ws.getCell(`${c}${dobR}`).border = tb;
        });
        ws.mergeCells(`A${dr}:A${dobR}`);
        ws.mergeCells(`B${dr}:B${dobR}`);
        ws.mergeCells(`C${dr}:C${dobR}`);
        ws.mergeCells(`D${dr}:D${dobR}`);
        ws.mergeCells(`E${dr}:E${dobR}`);
        ws.mergeCells(`G${dr}:G${dobR}`);
        ws.mergeCells(`H${dr}:H${dobR}`);
        ws.mergeCells(`I${dr}:I${dobR}`);
        ws.mergeCells(`J${dr}:J${dobR}`);
        ws.getRow(dr).height = 15;
        ws.getRow(dobR).height = 15;
        currentRow += 2;
      }

      // Add legend after every chunk
      addLegend(ws, currentRow);
      currentRow += 9;
    });
  });

  // Download
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = year === 0 ? `${method}_clients_ALL.xlsx` : `${method}_clients_${year}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};