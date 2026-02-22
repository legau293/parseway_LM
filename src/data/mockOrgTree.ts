export interface InsuranceObject {
  id: string;
  name: string;
  objectType: string;
  description: string;
  completedPct: number;
  structurePct: number;
  verifiedPct: number;
  missingCount: number;
  fieldsTotal: number;
  fieldsVerified: number;
}

export interface CompanyNode {
  id: string;
  name: string;
  orgnr: string;
  parentId: string | null;
  childCompanyIds: string[];
  insuranceObjects: InsuranceObject[];
}

export type OrgTree = Record<string, CompanyNode>;

const buildInitialTree = (): OrgTree => ({
  'volvo-ab': {
    id: 'volvo-ab', name: 'Volvo AB', orgnr: '556012-5790', parentId: null,
    childCompanyIds: ['volvo-fastigheter', 'volvo-logistik', 'volvo-produktion'],
    insuranceObjects: [],
  },
  'volvo-fastigheter': {
    id: 'volvo-fastigheter', name: 'Volvo Fastigheter AB', orgnr: '556234-1122', parentId: 'volvo-ab',
    childCompanyIds: ['volvo-fastigheter-goteborg'],
    insuranceObjects: [
      { id: 'vf-1', name: 'Kontorshus Torslanda', objectType: 'Fastighet', description: 'Kontorskomplex med 4 våningar, byggd 1998', completedPct: 84, structurePct: 90, verifiedPct: 78, missingCount: 2, fieldsTotal: 24, fieldsVerified: 18 },
      { id: 'vf-2', name: 'Verkstad Skövde', objectType: 'Fastighet', description: 'Industrilokal för fordonsservice och underhåll', completedPct: 63, structurePct: 72, verifiedPct: 55, missingCount: 5, fieldsTotal: 20, fieldsVerified: 10 },
      { id: 'vf-3', name: 'Lagerlokal Göteborg', objectType: 'Fastighet', description: 'Lagerbyggnad 12 000 m², automatiserad', completedPct: 96, structurePct: 100, verifiedPct: 92, missingCount: 0, fieldsTotal: 18, fieldsVerified: 17 },
      { id: 'vf-4', name: 'P-hus Arendal', objectType: 'Fastighet', description: 'Flervåningsparkering med 800 platser', completedPct: 52, structurePct: 60, verifiedPct: 44, missingCount: 7, fieldsTotal: 16, fieldsVerified: 7 },
    ],
  },
  'volvo-fastigheter-goteborg': {
    id: 'volvo-fastigheter-goteborg', name: 'Volvo Fastigheter Göteborg AB', orgnr: '556345-2233', parentId: 'volvo-fastigheter',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'vfg-1', name: 'Hamnterminal Göteborg', objectType: 'Fastighet', description: 'Godshanteringsterminal vid Göteborgs hamn', completedPct: 100, structurePct: 100, verifiedPct: 100, missingCount: 0, fieldsTotal: 22, fieldsVerified: 22 },
      { id: 'vfg-2', name: 'Kontorshus Lindholmen', objectType: 'Fastighet', description: 'Modernt kontor i Göteborgs innovationsdistrikt', completedPct: 100, structurePct: 100, verifiedPct: 100, missingCount: 0, fieldsTotal: 20, fieldsVerified: 20 },
    ],
  },
  'volvo-logistik': {
    id: 'volvo-logistik', name: 'Volvo Logistik AB', orgnr: '556456-3344', parentId: 'volvo-ab',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'vl-1', name: 'Logistikcenter Göteborg', objectType: 'Fastighet', description: 'Regionalt distributionscenter, 35 000 m²', completedPct: 79, structurePct: 88, verifiedPct: 70, missingCount: 3, fieldsTotal: 26, fieldsVerified: 19 },
      { id: 'vl-2', name: 'Omlastningsstation Borås', objectType: 'Maskin', description: 'Automatiserad omlastningsutrustning, 2020 modell', completedPct: 47, structurePct: 55, verifiedPct: 38, missingCount: 9, fieldsTotal: 18, fieldsVerified: 7 },
      { id: 'vl-3', name: 'Terminalhall Landvetter', objectType: 'Fastighet', description: 'Terminalhall intill Landvetter flygplats', completedPct: 92, structurePct: 95, verifiedPct: 89, missingCount: 1, fieldsTotal: 14, fieldsVerified: 13 },
    ],
  },
  'volvo-produktion': {
    id: 'volvo-produktion', name: 'Volvo Produktion AB', orgnr: '556567-4455', parentId: 'volvo-ab',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'vp-1', name: 'Monteringsfabrik Olofström', objectType: 'Fastighet', description: 'Pressfabrik för karossdelar, grundad 1946', completedPct: 37, structurePct: 44, verifiedPct: 30, missingCount: 12, fieldsTotal: 28, fieldsVerified: 9 },
      { id: 'vp-2', name: 'Pressverkstad Floby', objectType: 'Maskin', description: 'Tyngre presslinjer för transmission', completedPct: 69, structurePct: 78, verifiedPct: 60, missingCount: 4, fieldsTotal: 20, fieldsVerified: 13 },
      { id: 'vp-3', name: 'Gjuteri Skövde', objectType: 'Maskin', description: 'Motorgjuteri, 300-tonspressen', completedPct: 57, structurePct: 65, verifiedPct: 50, missingCount: 6, fieldsTotal: 22, fieldsVerified: 11 },
      { id: 'vp-4', name: 'Motorverkstad Köping', objectType: 'Fastighet', description: 'Montering och testning av dieselmotorer', completedPct: 87, structurePct: 91, verifiedPct: 83, missingCount: 1, fieldsTotal: 16, fieldsVerified: 14 },
    ],
  },
  'atlas-copco': {
    id: 'atlas-copco', name: 'Atlas Copco', orgnr: '556014-2720', parentId: null,
    childCompanyIds: ['atlascopco-industri', 'atlascopco-fastigheter'],
    insuranceObjects: [],
  },
  'atlascopco-industri': {
    id: 'atlascopco-industri', name: 'Atlas Copco Industri AB', orgnr: '556123-7890', parentId: 'atlas-copco',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'aci-1', name: 'Industrifastighet Sickla', objectType: 'Fastighet', description: 'Industri- och lagerlokal vid Sickla köpkvarter', completedPct: 73, structurePct: 82, verifiedPct: 65, missingCount: 4, fieldsTotal: 24, fieldsVerified: 15 },
      { id: 'aci-2', name: 'Verkstadslokal Nacka', objectType: 'Fastighet', description: 'Mekanisk verkstad för tyngre utrustning', completedPct: 57, structurePct: 67, verifiedPct: 48, missingCount: 7, fieldsTotal: 18, fieldsVerified: 9 },
      { id: 'aci-3', name: 'Produktionsanläggning Märsta', objectType: 'Maskin', description: 'CNC-bearbetningslinje, 14 enheter', completedPct: 42, structurePct: 50, verifiedPct: 35, missingCount: 10, fieldsTotal: 20, fieldsVerified: 7 },
      { id: 'aci-4', name: 'Lagerbyggnad Järfälla', objectType: 'Fastighet', description: 'Helautomatiserat höglagersystem', completedPct: 93, structurePct: 96, verifiedPct: 91, missingCount: 0, fieldsTotal: 16, fieldsVerified: 15 },
    ],
  },
  'atlascopco-fastigheter': {
    id: 'atlascopco-fastigheter', name: 'Atlas Copco Fastigheter AB', orgnr: '556234-8901', parentId: 'atlas-copco',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'acf-1', name: 'Kontorshus Örebro', objectType: 'Fastighet', description: 'Regionalt huvudkontor, 6 våningar', completedPct: 78, structurePct: 85, verifiedPct: 72, missingCount: 2, fieldsTotal: 22, fieldsVerified: 16 },
      { id: 'acf-2', name: 'Handelslokal Västerås', objectType: 'Fastighet', description: 'Kommersiell butiksyta i centrumläge', completedPct: 31, structurePct: 40, verifiedPct: 22, missingCount: 11, fieldsTotal: 18, fieldsVerified: 4 },
      { id: 'acf-3', name: 'Lagerfastighet Uppsala', objectType: 'Fastighet', description: 'Kyllagerfastighet, ISO-certifierad', completedPct: 97, structurePct: 100, verifiedPct: 95, missingCount: 0, fieldsTotal: 14, fieldsVerified: 14 },
    ],
  },
  'assa-abloy': {
    id: 'assa-abloy', name: 'Assa Abloy', orgnr: '556059-3575', parentId: null,
    childCompanyIds: ['assaabloy-kommersiellt', 'assaabloy-bostader', 'assaabloy-lager'],
    insuranceObjects: [],
  },
  'assaabloy-kommersiellt': {
    id: 'assaabloy-kommersiellt', name: 'Assa Abloy Kommersiellt AB', orgnr: '556345-6789', parentId: 'assa-abloy',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'aak-1', name: 'Kontorshus Solna', objectType: 'Fastighet', description: 'Glasfasad kontorsbyggnad i Solna business park', completedPct: 68, structurePct: 77, verifiedPct: 60, missingCount: 4, fieldsTotal: 20, fieldsVerified: 12 },
      { id: 'aak-2', name: 'Handelsplats Lund', objectType: 'Fastighet', description: 'Handelsfastighet, fullt uthyrd', completedPct: 97, structurePct: 100, verifiedPct: 94, missingCount: 0, fieldsTotal: 16, fieldsVerified: 15 },
      { id: 'aak-3', name: 'Shoppinggalleria Helsingborg', objectType: 'Fastighet', description: 'Galleria med 60 butiker, byggd 2012', completedPct: 43, structurePct: 52, verifiedPct: 35, missingCount: 9, fieldsTotal: 22, fieldsVerified: 8 },
    ],
  },
  'assaabloy-bostader': {
    id: 'assaabloy-bostader', name: 'Assa Abloy Bostäder AB', orgnr: '556456-7890', parentId: 'assa-abloy',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'aab-1', name: 'Bostadskvarter Västerås', objectType: 'Fastighet', description: 'Flerfamiljshus, 120 lägenheter', completedPct: 60, structurePct: 68, verifiedPct: 52, missingCount: 5, fieldsTotal: 24, fieldsVerified: 13 },
      { id: 'aab-2', name: 'Hyresfastighet Örebro', objectType: 'Fastighet', description: 'Blandad hyresfastighet, kontor + bostad', completedPct: 76, structurePct: 83, verifiedPct: 70, missingCount: 2, fieldsTotal: 18, fieldsVerified: 13 },
      { id: 'aab-3', name: 'Bostadsrätter Linköping', objectType: 'Fastighet', description: 'Nyproduktion BRF, inflyttning 2023', completedPct: 36, structurePct: 45, verifiedPct: 28, missingCount: 11, fieldsTotal: 20, fieldsVerified: 6 },
    ],
  },
  'assaabloy-lager': {
    id: 'assaabloy-lager', name: 'Assa Abloy Lager AB', orgnr: '556567-8901', parentId: 'assa-abloy',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'aal-1', name: 'Centrallager Malmö', objectType: 'Fastighet', description: 'Nordiskt distributionscenter, 40 000 m²', completedPct: 91, structurePct: 95, verifiedPct: 88, missingCount: 1, fieldsTotal: 26, fieldsVerified: 23 },
      { id: 'aal-2', name: 'Kyllager Helsingborg', objectType: 'Maskin', description: 'Kylkedja för temperaturkänsliga produkter', completedPct: 52, structurePct: 60, verifiedPct: 44, missingCount: 7, fieldsTotal: 16, fieldsVerified: 7 },
    ],
  },
  'sandvik': {
    id: 'sandvik', name: 'Sandvik', orgnr: '556234-6948', parentId: null,
    childCompanyIds: ['sandvik-fastigheter', 'sandvik-industri', 'sandvik-logistik'],
    insuranceObjects: [],
  },
  'sandvik-fastigheter': {
    id: 'sandvik-fastigheter', name: 'Sandvik Fastigheter AB', orgnr: '556345-1234', parentId: 'sandvik',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'sf-1', name: 'Industrifastighet Sandviken', objectType: 'Fastighet', description: 'Tung industrifastighet intill stålverket', completedPct: 81, structurePct: 88, verifiedPct: 74, missingCount: 2, fieldsTotal: 22, fieldsVerified: 17 },
      { id: 'sf-2', name: 'Kontorskomplex Gävle', objectType: 'Fastighet', description: 'Huvudkontor för norra Sverige, 3 byggnader', completedPct: 54, structurePct: 62, verifiedPct: 47, missingCount: 6, fieldsTotal: 20, fieldsVerified: 10 },
      { id: 'sf-3', name: 'Lagerlokal Falun', objectType: 'Fastighet', description: 'Logistikfastighet med järnvägsanslutning', completedPct: 96, structurePct: 100, verifiedPct: 93, missingCount: 0, fieldsTotal: 14, fieldsVerified: 14 },
    ],
  },
  'sandvik-industri': {
    id: 'sandvik-industri', name: 'Sandvik Industri AB', orgnr: '556456-2345', parentId: 'sandvik',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'si-1', name: 'Stålverk Sandviken', objectType: 'Maskin', description: 'Ljusbågsugnar och valsningslinjer', completedPct: 46, structurePct: 55, verifiedPct: 38, missingCount: 10, fieldsTotal: 28, fieldsVerified: 11 },
      { id: 'si-2', name: 'Verktygsproduktion Gimo', objectType: 'Maskin', description: 'Hårdmetallverktyg, ISO-certifierad', completedPct: 71, structurePct: 79, verifiedPct: 63, missingCount: 4, fieldsTotal: 18, fieldsVerified: 12 },
      { id: 'si-3', name: 'Gruvanläggning Surahammar', objectType: 'Maskin', description: 'Gruvmaskiner för underjordsbrytning', completedPct: 33, structurePct: 41, verifiedPct: 25, missingCount: 13, fieldsTotal: 24, fieldsVerified: 7 },
    ],
  },
  'sandvik-logistik': {
    id: 'sandvik-logistik', name: 'Sandvik Logistik AB', orgnr: '556567-3456', parentId: 'sandvik',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'sl-1', name: 'Logistiknav Gävle', objectType: 'Fastighet', description: 'Centralt logistiknav för norra regionen', completedPct: 77, structurePct: 84, verifiedPct: 71, missingCount: 3, fieldsTotal: 20, fieldsVerified: 14 },
      { id: 'sl-2', name: 'Omlastningscentral Sundsvall', objectType: 'Maskin', description: 'Omlastningsutrustning för tunga gods', completedPct: 48, structurePct: 57, verifiedPct: 40, missingCount: 8, fieldsTotal: 16, fieldsVerified: 7 },
    ],
  },
  'hexagon': {
    id: 'hexagon', name: 'Hexagon', orgnr: '556190-4771', parentId: null,
    childCompanyIds: ['hexagon-teknik', 'hexagon-fastigheter'],
    insuranceObjects: [],
  },
  'hexagon-teknik': {
    id: 'hexagon-teknik', name: 'Hexagon Teknik AB', orgnr: '556678-4567', parentId: 'hexagon',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'ht-1', name: 'Teknikcenter Kista', objectType: 'Fastighet', description: 'FoU-center för sensorer och mätning', completedPct: 100, structurePct: 100, verifiedPct: 100, missingCount: 0, fieldsTotal: 22, fieldsVerified: 22 },
      { id: 'ht-2', name: 'FoU-anläggning Bromma', objectType: 'Fastighet', description: 'Laboratorier och prototypverkstad', completedPct: 100, structurePct: 100, verifiedPct: 100, missingCount: 0, fieldsTotal: 18, fieldsVerified: 18 },
      { id: 'ht-3', name: 'Datacenter Täby', objectType: 'Maskin', description: 'Primärt datacenter med redundant kylning', completedPct: 100, structurePct: 100, verifiedPct: 100, missingCount: 0, fieldsTotal: 16, fieldsVerified: 16 },
    ],
  },
  'hexagon-fastigheter': {
    id: 'hexagon-fastigheter', name: 'Hexagon Fastigheter AB', orgnr: '556789-5678', parentId: 'hexagon',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'hf-1', name: 'Kontorshus Stockholm', objectType: 'Fastighet', description: 'Centralt placerat kontor, 8 våningar', completedPct: 100, structurePct: 100, verifiedPct: 100, missingCount: 0, fieldsTotal: 20, fieldsVerified: 20 },
      { id: 'hf-2', name: 'Representationslokal Lidingö', objectType: 'Fastighet', description: 'Exklusiv representationsyta med sjöutsikt', completedPct: 100, structurePct: 100, verifiedPct: 100, missingCount: 0, fieldsTotal: 12, fieldsVerified: 12 },
    ],
  },
  'epiroc': {
    id: 'epiroc', name: 'Epiroc', orgnr: '559077-9206', parentId: null,
    childCompanyIds: ['epiroc-gruva', 'epiroc-service', 'epiroc-lager'],
    insuranceObjects: [],
  },
  'epiroc-gruva': {
    id: 'epiroc-gruva', name: 'Epiroc Gruva AB', orgnr: '559123-4567', parentId: 'epiroc',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'eg-1', name: 'Gruvutrustningsdepå Kiruna', objectType: 'Maskin', description: 'Depå för underjordsmaskiner och reservdelar', completedPct: 68, structurePct: 76, verifiedPct: 60, missingCount: 4, fieldsTotal: 22, fieldsVerified: 14 },
      { id: 'eg-2', name: 'Servicecenter Gällivare', objectType: 'Fastighet', description: 'Service och reparation av gruvfordon', completedPct: 44, structurePct: 53, verifiedPct: 36, missingCount: 9, fieldsTotal: 18, fieldsVerified: 7 },
      { id: 'eg-3', name: 'Borrteknikhall Luleå', objectType: 'Maskin', description: 'Borrmaskiner och tillbehör, 22 enheter', completedPct: 83, structurePct: 89, verifiedPct: 77, missingCount: 2, fieldsTotal: 16, fieldsVerified: 13 },
    ],
  },
  'epiroc-service': {
    id: 'epiroc-service', name: 'Epiroc Service AB', orgnr: '559234-5678', parentId: 'epiroc',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'es-1', name: 'Servicehall Örebro', objectType: 'Fastighet', description: 'Servicehall för gruvmaskiner, 5 000 m²', completedPct: 63, structurePct: 71, verifiedPct: 55, missingCount: 5, fieldsTotal: 20, fieldsVerified: 12 },
      { id: 'es-2', name: 'Reparationsverkstad Västerås', objectType: 'Maskin', description: 'Tyngre reparationsverkstad med lyftkran 30 ton', completedPct: 77, structurePct: 84, verifiedPct: 70, missingCount: 3, fieldsTotal: 18, fieldsVerified: 13 },
    ],
  },
  'epiroc-lager': {
    id: 'epiroc-lager', name: 'Epiroc Lager AB', orgnr: '559345-6789', parentId: 'epiroc',
    childCompanyIds: [],
    insuranceObjects: [
      { id: 'el-1', name: 'Centrallager Örebro', objectType: 'Fastighet', description: 'Nordeuropeiskt centrallager, fullautomation', completedPct: 94, structurePct: 97, verifiedPct: 92, missingCount: 0, fieldsTotal: 24, fieldsVerified: 23 },
      { id: 'el-2', name: 'Mellanlager Kumla', objectType: 'Fastighet', description: 'Mellanlager för reservdelsdistribution', completedPct: 50, structurePct: 58, verifiedPct: 42, missingCount: 8, fieldsTotal: 16, fieldsVerified: 7 },
      { id: 'el-3', name: 'Utleveranshall Hallsberg', objectType: 'Maskin', description: 'Automatiserad plock- och packrobot, 8 enheter', completedPct: 72, structurePct: 79, verifiedPct: 65, missingCount: 3, fieldsTotal: 18, fieldsVerified: 12 },
    ],
  },
});

export const ROOT_COMPANY_IDS = [
  'volvo-ab',
  'atlas-copco',
  'assa-abloy',
  'sandvik',
  'hexagon',
  'epiroc',
];

let _tree: OrgTree = buildInitialTree();

export function getTree(): OrgTree {
  return _tree;
}

export function resetTree(): void {
  _tree = buildInitialTree();
}

export function getRootCompanies(): CompanyNode[] {
  return ROOT_COMPANY_IDS.map((id) => _tree[id]).filter(Boolean);
}

export function getCompanyNodeById(id: string): CompanyNode | undefined {
  return _tree[id];
}

export function getChildCompanies(nodeId: string): CompanyNode[] {
  const node = _tree[nodeId];
  if (!node) return [];
  return node.childCompanyIds.map((id) => _tree[id]).filter(Boolean);
}

export function getInsuranceObjects(nodeId: string): InsuranceObject[] {
  return _tree[nodeId]?.insuranceObjects ?? [];
}

export function getPathToNode(nodeId: string): CompanyNode[] {
  const path: CompanyNode[] = [];
  let current: CompanyNode | undefined = _tree[nodeId];
  while (current) {
    path.unshift(current);
    current = current.parentId ? _tree[current.parentId] : undefined;
  }
  return path;
}

export function addChildNode(parentId: string, name: string): CompanyNode {
  const newId = `custom-${Date.now()}`;
  const parent = _tree[parentId];
  if (parent) {
    _tree = {
      ..._tree,
      [parentId]: { ...parent, childCompanyIds: [...parent.childCompanyIds, newId] },
    };
  }
  const newNode: CompanyNode = {
    id: newId,
    name,
    orgnr: '',
    parentId,
    childCompanyIds: [],
    insuranceObjects: [],
  };
  _tree = { ..._tree, [newId]: newNode };
  return newNode;
}

export function addInsuranceObject(nodeId: string, name: string, objectType = 'Fastighet', description = ''): InsuranceObject {
  const newObj: InsuranceObject = {
    id: `custom-obj-${Date.now()}`,
    name,
    objectType,
    description,
    completedPct: 0,
    structurePct: 0,
    verifiedPct: 0,
    missingCount: 0,
    fieldsTotal: 12,
    fieldsVerified: 0,
  };
  const node = _tree[nodeId];
  if (node) {
    _tree = {
      ..._tree,
      [nodeId]: { ...node, insuranceObjects: [...node.insuranceObjects, newObj] },
    };
  }
  return newObj;
}

export function incrementFieldVerified(nodeId: string, objectId: string): OrgTree {
  const node = _tree[nodeId];
  if (!node) return _tree;
  _tree = {
    ..._tree,
    [nodeId]: {
      ...node,
      insuranceObjects: node.insuranceObjects.map((o) => {
        if (o.id !== objectId) return o;
        const newVerified = Math.min(o.fieldsVerified + 1, o.fieldsTotal);
        const newPct = o.fieldsTotal === 0 ? 0 : Math.round((newVerified / o.fieldsTotal) * 100);
        return { ...o, fieldsVerified: newVerified, completedPct: newPct };
      }),
    },
  };
  return _tree;
}
