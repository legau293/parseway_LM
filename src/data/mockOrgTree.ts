export interface InsuranceObject {
  id: string;
  name: string;
  structurePct: number;
  verifiedPct: number;
  missingCount: number;
}

export interface CompanyNode {
  id: string;
  name: string;
  parentId: string | null;
  childCompanyIds: string[];
  insuranceObjects: InsuranceObject[];
}

const NODES: Record<string, CompanyNode> = {
  'volvo-ab': {
    id: 'volvo-ab', name: 'Volvo AB', parentId: null,
    childCompanyIds: ['volvo-fastigheter', 'volvo-logistik', 'volvo-produktion'],
    insuranceObjects: [],
  },
  'volvo-fastigheter': {
    id: 'volvo-fastigheter', name: 'Volvo Fastigheter AB', parentId: 'volvo-ab',
    childCompanyIds: ['volvo-fastigheter-goteborg'],
    insuranceObjects: [
      { id: 'vf-1', name: 'Kontorshus Torslanda', structurePct: 90, verifiedPct: 78, missingCount: 2 },
      { id: 'vf-2', name: 'Verkstad Skövde', structurePct: 72, verifiedPct: 55, missingCount: 5 },
      { id: 'vf-3', name: 'Lagerlokal Göteborg', structurePct: 100, verifiedPct: 92, missingCount: 0 },
      { id: 'vf-4', name: 'P-hus Arendal', structurePct: 60, verifiedPct: 44, missingCount: 7 },
    ],
  },
  'volvo-fastigheter-goteborg': {
    id: 'volvo-fastigheter-goteborg', name: 'Volvo Fastigheter Göteborg AB', parentId: 'volvo-fastigheter',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'vfg-1', name: 'Hamnterminal Göteborg', structurePct: 83, verifiedPct: 70, missingCount: 3 },
      { id: 'vfg-2', name: 'Kontorshus Lindholmen', structurePct: 91, verifiedPct: 85, missingCount: 1 },
    ],
  },
  'volvo-logistik': {
    id: 'volvo-logistik', name: 'Volvo Logistik AB', parentId: 'volvo-ab',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'vl-1', name: 'Logistikcenter Göteborg', structurePct: 88, verifiedPct: 70, missingCount: 3 },
      { id: 'vl-2', name: 'Omlastningsstation Borås', structurePct: 55, verifiedPct: 38, missingCount: 9 },
      { id: 'vl-3', name: 'Terminalhall Landvetter', structurePct: 95, verifiedPct: 89, missingCount: 1 },
    ],
  },
  'volvo-produktion': {
    id: 'volvo-produktion', name: 'Volvo Produktion AB', parentId: 'volvo-ab',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'vp-1', name: 'Monteringsfabrik Olofström', structurePct: 44, verifiedPct: 30, missingCount: 12 },
      { id: 'vp-2', name: 'Pressverkstad Floby', structurePct: 78, verifiedPct: 60, missingCount: 4 },
      { id: 'vp-3', name: 'Gjuteri Skövde', structurePct: 65, verifiedPct: 50, missingCount: 6 },
      { id: 'vp-4', name: 'Motorverkstad Köping', structurePct: 91, verifiedPct: 83, missingCount: 1 },
    ],
  },
  'atlas-copco': {
    id: 'atlas-copco', name: 'Atlas Copco', parentId: null,
    childCompanyIds: ['atlascopco-industri', 'atlascopco-fastigheter'],
    insuranceObjects: [],
  },
  'atlascopco-industri': {
    id: 'atlascopco-industri', name: 'Atlas Copco Industri AB', parentId: 'atlas-copco',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'aci-1', name: 'Industrifastighet Sickla', structurePct: 82, verifiedPct: 65, missingCount: 4 },
      { id: 'aci-2', name: 'Verkstadslokal Nacka', structurePct: 67, verifiedPct: 48, missingCount: 7 },
      { id: 'aci-3', name: 'Produktionsanläggning Märsta', structurePct: 50, verifiedPct: 35, missingCount: 10 },
      { id: 'aci-4', name: 'Lagerbyggnad Järfälla', structurePct: 96, verifiedPct: 91, missingCount: 0 },
    ],
  },
  'atlascopco-fastigheter': {
    id: 'atlascopco-fastigheter', name: 'Atlas Copco Fastigheter AB', parentId: 'atlas-copco',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'acf-1', name: 'Kontorshus Örebro', structurePct: 85, verifiedPct: 72, missingCount: 2 },
      { id: 'acf-2', name: 'Handelslokal Västerås', structurePct: 40, verifiedPct: 22, missingCount: 11 },
      { id: 'acf-3', name: 'Lagerfastighet Uppsala', structurePct: 100, verifiedPct: 95, missingCount: 0 },
    ],
  },
  'assa-abloy': {
    id: 'assa-abloy', name: 'Assa Abloy', parentId: null,
    childCompanyIds: ['assaabloy-kommersiellt', 'assaabloy-bostader', 'assaabloy-lager'],
    insuranceObjects: [],
  },
  'assaabloy-kommersiellt': {
    id: 'assaabloy-kommersiellt', name: 'Assa Abloy Kommersiellt AB', parentId: 'assa-abloy',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'aak-1', name: 'Kontorshus Solna', structurePct: 77, verifiedPct: 60, missingCount: 4 },
      { id: 'aak-2', name: 'Handelsplats Lund', structurePct: 100, verifiedPct: 94, missingCount: 0 },
      { id: 'aak-3', name: 'Shoppinggalleria Helsingborg', structurePct: 52, verifiedPct: 35, missingCount: 9 },
    ],
  },
  'assaabloy-bostader': {
    id: 'assaabloy-bostader', name: 'Assa Abloy Bostäder AB', parentId: 'assa-abloy',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'aab-1', name: 'Bostadskvarter Västerås', structurePct: 68, verifiedPct: 52, missingCount: 5 },
      { id: 'aab-2', name: 'Hyresfastighet Örebro', structurePct: 83, verifiedPct: 70, missingCount: 2 },
      { id: 'aab-3', name: 'Bostadsrätter Linköping', structurePct: 45, verifiedPct: 28, missingCount: 11 },
    ],
  },
  'assaabloy-lager': {
    id: 'assaabloy-lager', name: 'Assa Abloy Lager AB', parentId: 'assa-abloy',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'aal-1', name: 'Centrallager Malmö', structurePct: 95, verifiedPct: 88, missingCount: 1 },
      { id: 'aal-2', name: 'Kyllager Helsingborg', structurePct: 60, verifiedPct: 44, missingCount: 7 },
    ],
  },
  'sandvik': {
    id: 'sandvik', name: 'Sandvik', parentId: null,
    childCompanyIds: ['sandvik-fastigheter', 'sandvik-industri', 'sandvik-logistik'],
    insuranceObjects: [],
  },
  'sandvik-fastigheter': {
    id: 'sandvik-fastigheter', name: 'Sandvik Fastigheter AB', parentId: 'sandvik',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'sf-1', name: 'Industrifastighet Sandviken', structurePct: 88, verifiedPct: 74, missingCount: 2 },
      { id: 'sf-2', name: 'Kontorskomplex Gävle', structurePct: 62, verifiedPct: 47, missingCount: 6 },
      { id: 'sf-3', name: 'Lagerlokal Falun', structurePct: 100, verifiedPct: 93, missingCount: 0 },
    ],
  },
  'sandvik-industri': {
    id: 'sandvik-industri', name: 'Sandvik Industri AB', parentId: 'sandvik',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'si-1', name: 'Stålverk Sandviken', structurePct: 55, verifiedPct: 38, missingCount: 10 },
      { id: 'si-2', name: 'Verktygsproduktion Gimo', structurePct: 79, verifiedPct: 63, missingCount: 4 },
      { id: 'si-3', name: 'Gruvanläggning Surahammar', structurePct: 41, verifiedPct: 25, missingCount: 13 },
    ],
  },
  'sandvik-logistik': {
    id: 'sandvik-logistik', name: 'Sandvik Logistik AB', parentId: 'sandvik',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'sl-1', name: 'Logistiknav Gävle', structurePct: 84, verifiedPct: 71, missingCount: 3 },
      { id: 'sl-2', name: 'Omlastningscentral Sundsvall', structurePct: 57, verifiedPct: 40, missingCount: 8 },
    ],
  },
  'hexagon': {
    id: 'hexagon', name: 'Hexagon', parentId: null,
    childCompanyIds: ['hexagon-teknik', 'hexagon-fastigheter'],
    insuranceObjects: [],
  },
  'hexagon-teknik': {
    id: 'hexagon-teknik', name: 'Hexagon Teknik AB', parentId: 'hexagon',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'ht-1', name: 'Teknikcenter Kista', structurePct: 87, verifiedPct: 75, missingCount: 2 },
      { id: 'ht-2', name: 'FoU-anläggning Bromma', structurePct: 65, verifiedPct: 50, missingCount: 6 },
      { id: 'ht-3', name: 'Datacenter Täby', structurePct: 93, verifiedPct: 88, missingCount: 1 },
    ],
  },
  'hexagon-fastigheter': {
    id: 'hexagon-fastigheter', name: 'Hexagon Fastigheter AB', parentId: 'hexagon',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'hf-1', name: 'Kontorshus Stockholm', structurePct: 80, verifiedPct: 66, missingCount: 3 },
      { id: 'hf-2', name: 'Representationslokal Lidingö', structurePct: 100, verifiedPct: 97, missingCount: 0 },
    ],
  },
  'epiroc': {
    id: 'epiroc', name: 'Epiroc', parentId: null,
    childCompanyIds: ['epiroc-gruva', 'epiroc-service', 'epiroc-lager'],
    insuranceObjects: [],
  },
  'epiroc-gruva': {
    id: 'epiroc-gruva', name: 'Epiroc Gruva AB', parentId: 'epiroc',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'eg-1', name: 'Gruvutrustningsdepå Kiruna', structurePct: 76, verifiedPct: 60, missingCount: 4 },
      { id: 'eg-2', name: 'Servicecenter Gällivare', structurePct: 53, verifiedPct: 36, missingCount: 9 },
      { id: 'eg-3', name: 'Borrteknikhall Luleå', structurePct: 89, verifiedPct: 77, missingCount: 2 },
    ],
  },
  'epiroc-service': {
    id: 'epiroc-service', name: 'Epiroc Service AB', parentId: 'epiroc',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'es-1', name: 'Servicehall Örebro', structurePct: 71, verifiedPct: 55, missingCount: 5 },
      { id: 'es-2', name: 'Reparationsverkstad Västerås', structurePct: 84, verifiedPct: 70, missingCount: 3 },
    ],
  },
  'epiroc-lager': {
    id: 'epiroc-lager', name: 'Epiroc Lager AB', parentId: 'epiroc',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'el-1', name: 'Centrallager Örebro', structurePct: 97, verifiedPct: 92, missingCount: 0 },
      { id: 'el-2', name: 'Mellanlager Kumla', structurePct: 58, verifiedPct: 42, missingCount: 8 },
      { id: 'el-3', name: 'Utleveranshall Hallsberg', structurePct: 79, verifiedPct: 65, missingCount: 3 },
    ],
  },
};

export const ROOT_COMPANY_IDS = [
  'volvo-ab',
  'atlas-copco',
  'assa-abloy',
  'sandvik',
  'hexagon',
  'epiroc',
];

export function getRootCompanies(): CompanyNode[] {
  return ROOT_COMPANY_IDS.map((id) => NODES[id]).filter(Boolean);
}

export function getCompanyNodeById(id: string): CompanyNode | undefined {
  return NODES[id];
}

export function getChildCompanies(nodeId: string): CompanyNode[] {
  const node = NODES[nodeId];
  if (!node) return [];
  return node.childCompanyIds.map((id) => NODES[id]).filter(Boolean);
}

export function getInsuranceObjects(nodeId: string): InsuranceObject[] {
  return NODES[nodeId]?.insuranceObjects ?? [];
}

export function getPathToNode(nodeId: string): CompanyNode[] {
  const path: CompanyNode[] = [];
  let current: CompanyNode | undefined = NODES[nodeId];
  while (current) {
    path.unshift(current);
    current = current.parentId ? NODES[current.parentId] : undefined;
  }
  return path;
}

export function addChildNode(parentId: string, name: string): CompanyNode {
  const newId = `custom-${Date.now()}`;
  const parent = NODES[parentId];
  if (parent) {
    parent.childCompanyIds = [...parent.childCompanyIds, newId];
  }
  const newNode: CompanyNode = {
    id: newId,
    name,
    parentId,
    childCompanyIds: [],
    insuranceObjects: [],
  };
  NODES[newId] = newNode;
  return newNode;
}

export function addInsuranceObject(nodeId: string, name: string): InsuranceObject {
  const newObj: InsuranceObject = {
    id: `custom-obj-${Date.now()}`,
    name,
    structurePct: 0,
    verifiedPct: 0,
    missingCount: 0,
  };
  const node = NODES[nodeId];
  if (node) {
    node.insuranceObjects = [...node.insuranceObjects, newObj];
  }
  return newObj;
}
