import * as XLSX from 'xlsx';
import { InsuranceObject } from '@/data/mockOrgTree';

const TYPE_ORDER = ['Byggnad', 'Fastighet', 'Bil', 'Maskin'];

function sortByTypeOrder(objects: InsuranceObject[]): InsuranceObject[] {
  return [...objects].sort((a, b) => {
    const ai = TYPE_ORDER.indexOf(a.objectType);
    const bi = TYPE_ORDER.indexOf(b.objectType);
    const ao = ai === -1 ? 999 : ai;
    const bo = bi === -1 ? 999 : bi;
    if (ao !== bo) return ao - bo;
    return a.name.localeCompare(b.name, 'sv');
  });
}

function groupByType(objects: InsuranceObject[]): Map<string, InsuranceObject[]> {
  const map = new Map<string, InsuranceObject[]>();
  const sorted = sortByTypeOrder(objects);
  for (const obj of sorted) {
    if (!map.has(obj.objectType)) map.set(obj.objectType, []);
    map.get(obj.objectType)!.push(obj);
  }
  return map;
}

function getSelectedObjects(
  allObjects: InsuranceObject[],
  selectedIds: Set<string>
): InsuranceObject[] {
  return allObjects.filter((o) => selectedIds.has(o.id));
}

export function exportXLSX(
  allObjects: InsuranceObject[],
  selectedIds: Set<string>,
  filename = 'forsäkringsobjekt.xlsx'
) {
  const selected = getSelectedObjects(allObjects, selectedIds);
  const grouped = groupByType(selected);
  const wb = XLSX.utils.book_new();

  for (const [type, objects] of grouped) {
    const allParamIds = new Map<string, string>();
    for (const obj of objects) {
      for (const p of obj.parameters ?? []) {
        if (!allParamIds.has(p.id)) allParamIds.set(p.id, p.label);
      }
    }

    const isByggnadsType = type === 'Byggnad' || type === 'Fastighet';
    const getColHeader = (obj: InsuranceObject) => {
      if (isByggnadsType) {
        const fb = obj.parameters?.find((p) => p.id === 'fastighetsbeteckning');
        if (fb?.value) return fb.value;
      }
      return obj.name;
    };

    const paramEntries = Array.from(allParamIds.entries());
    const headerRow = ['Parameter', ...objects.map((o) => getColHeader(o))];
    const rows: (string | number)[][] = [headerRow];

    for (const [paramId, paramLabel] of paramEntries) {
      const row: (string | number)[] = [paramLabel];
      for (const obj of objects) {
        const param = obj.parameters?.find((p) => p.id === paramId);
        row.push(param?.value ?? '');
      }
      rows.push(row);
    }

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, ...objects.map(() => ({ wch: 22 }))];
    XLSX.utils.book_append_sheet(wb, ws, type.substring(0, 31));
  }

  XLSX.writeFile(wb, filename);
}

export function exportPDF(
  allObjects: InsuranceObject[],
  selectedIds: Set<string>,
  contextName = ''
) {
  const selected = getSelectedObjects(allObjects, selectedIds);
  const grouped = groupByType(selected);

  let sectionsHtml = '';

  for (const [type, objects] of grouped) {
    const allParamIds = new Map<string, string>();
    for (const obj of objects) {
      for (const p of obj.parameters ?? []) {
        if (!allParamIds.has(p.id)) allParamIds.set(p.id, p.label);
      }
    }

    let objectsHtml = '';
    for (const obj of objects) {
      let paramsHtml = '';
      for (const [paramId, paramLabel] of allParamIds) {
        const param = obj.parameters?.find((p) => p.id === paramId);
        const value = param?.value || '–';
        paramsHtml += `
          <tr>
            <td class="param-label">${escHtml(paramLabel)}</td>
            <td class="param-value">${escHtml(value)}</td>
          </tr>`;
      }
      objectsHtml += `
        <div class="object-block">
          <h3 class="object-name">${escHtml(obj.name)}</h3>
          ${obj.description ? `<p class="object-desc">${escHtml(obj.description)}</p>` : ''}
          <table class="param-table">
            <tbody>${paramsHtml}</tbody>
          </table>
        </div>`;
    }

    sectionsHtml += `
      <section class="type-section">
        <h2 class="type-heading">${escHtml(type)}</h2>
        ${objectsHtml}
      </section>`;
  }

  const titleLine = contextName
    ? `Försäkringsobjekt – ${escHtml(contextName)}`
    : 'Försäkringsobjekt';

  const html = `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <title>${titleLine}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 11pt;
      color: #1a1a1a;
      background: #fff;
      padding: 32px 40px;
    }
    .doc-title {
      font-size: 18pt;
      font-weight: 600;
      margin-bottom: 6px;
      color: #111;
    }
    .doc-meta {
      font-size: 9pt;
      color: #888;
      margin-bottom: 36px;
    }
    .type-section {
      margin-bottom: 32px;
      page-break-inside: avoid;
    }
    .type-heading {
      font-size: 13pt;
      font-weight: 600;
      color: #111;
      border-bottom: 1.5px solid #e0e0e0;
      padding-bottom: 6px;
      margin-bottom: 16px;
    }
    .object-block {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .object-name {
      font-size: 11pt;
      font-weight: 600;
      color: #222;
      margin-bottom: 2px;
    }
    .object-desc {
      font-size: 9pt;
      color: #666;
      margin-bottom: 8px;
    }
    .param-table {
      width: 100%;
      border-collapse: collapse;
    }
    .param-table tr:nth-child(even) td {
      background: #f8f8f8;
    }
    .param-label {
      width: 38%;
      padding: 4px 8px 4px 0;
      font-size: 9pt;
      color: #555;
      vertical-align: top;
    }
    .param-value {
      padding: 4px 0;
      font-size: 9.5pt;
      color: #111;
      vertical-align: top;
    }
    @media print {
      body { padding: 0; }
      .type-section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="doc-title">${titleLine}</div>
  <div class="doc-meta">Exportdatum: ${new Date().toLocaleDateString('sv-SE')}</div>
  ${sectionsHtml}
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
  }, 400);
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
