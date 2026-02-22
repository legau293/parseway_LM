export interface InsuranceObject {
  id: string;
  name: string;
  structurePct: number;
  verifiedPct: number;
  missingCount: number;
}

const BASE_OBJECTS: InsuranceObject[] = [
  { id: '1', name: 'Industrifastighet Göteborg', structurePct: 82, verifiedPct: 61, missingCount: 3 },
  { id: '2', name: 'Logistikcenter Malmö',       structurePct: 95, verifiedPct: 88, missingCount: 1 },
  { id: '3', name: 'Kontorshus Solna',           structurePct: 47, verifiedPct: 30, missingCount: 8 },
  { id: '4', name: 'Handelsplats Lund',          structurePct: 100, verifiedPct: 94, missingCount: 0 },
  { id: '5', name: 'Bostadskvarter Västerås',    structurePct: 68, verifiedPct: 52, missingCount: 5 },
  { id: '6', name: 'P-hus Stockholm',            structurePct: 55, verifiedPct: 40, missingCount: 6 },
  { id: '7', name: 'Lagerbyggnad Örebro',        structurePct: 73, verifiedPct: 65, missingCount: 2 },
  { id: '8', name: 'Produktionsanläggning Borås', structurePct: 38, verifiedPct: 20, missingCount: 11 },
];

export function getMockObjects(_companyName: string): InsuranceObject[] {
  return BASE_OBJECTS;
}
