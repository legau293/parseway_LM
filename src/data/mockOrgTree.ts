export interface InsuranceObject {
  id: string;
  name: string;
  objectType: string;
  description: string;
  fieldsTotal: number;
  fieldsVerified: number;
}

export interface Subsidiary {
  id: string;
  name: string;
  orgnr: string;
  insuranceObjects: InsuranceObject[];
}

export interface RootCompany {
  id: string;
  name: string;
  orgnr: string;
  subsidiaries: Subsidiary[];
  rootInsuranceObjects: InsuranceObject[];
}

export type OrgTree = Record<string, RootCompany>;

const buildInitialTree = (): OrgTree => ({
  'volvo-ab': {
    id: 'volvo-ab', name: 'Volvo AB', orgnr: '556012-5790',
    rootInsuranceObjects: [],
    subsidiaries: [
      {
        id: 'volvo-fastigheter', name: 'Volvo Fastigheter AB', orgnr: '556234-1122',
        insuranceObjects: [
          { id: 'vf-1', name: 'Kontorshus Torslanda', objectType: 'Fastighet', description: 'Kontorskomplex med 4 våningar, byggd 1998', fieldsTotal: 24, fieldsVerified: 18 },
          { id: 'vf-2', name: 'Verkstad Skövde', objectType: 'Fastighet', description: 'Industrilokal för fordonsservice och underhåll', fieldsTotal: 20, fieldsVerified: 10 },
          { id: 'vf-3', name: 'Lagerlokal Göteborg', objectType: 'Fastighet', description: 'Lagerbyggnad 12 000 m², automatiserad', fieldsTotal: 18, fieldsVerified: 17 },
          { id: 'vf-4', name: 'P-hus Arendal', objectType: 'Fastighet', description: 'Flervåningsparkering med 800 platser', fieldsTotal: 16, fieldsVerified: 7 },
        ],
      },
      {
        id: 'volvo-logistik', name: 'Volvo Logistik AB', orgnr: '556456-3344',
        insuranceObjects: [
          { id: 'vl-1', name: 'Logistikcenter Göteborg', objectType: 'Fastighet', description: 'Regionalt distributionscenter, 35 000 m²', fieldsTotal: 26, fieldsVerified: 19 },
          { id: 'vl-2', name: 'Omlastningsstation Borås', objectType: 'Maskin', description: 'Automatiserad omlastningsutrustning, 2020 modell', fieldsTotal: 18, fieldsVerified: 7 },
          { id: 'vl-3', name: 'Terminalhall Landvetter', objectType: 'Fastighet', description: 'Terminalhall intill Landvetter flygplats', fieldsTotal: 14, fieldsVerified: 13 },
        ],
      },
      {
        id: 'volvo-produktion', name: 'Volvo Produktion AB', orgnr: '556567-4455',
        insuranceObjects: [
          { id: 'vp-1', name: 'Monteringsfabrik Olofström', objectType: 'Fastighet', description: 'Pressfabrik för karossdelar, grundad 1946', fieldsTotal: 28, fieldsVerified: 9 },
          { id: 'vp-2', name: 'Pressverkstad Floby', objectType: 'Maskin', description: 'Tyngre presslinjer för transmission', fieldsTotal: 20, fieldsVerified: 13 },
          { id: 'vp-3', name: 'Gjuteri Skövde', objectType: 'Maskin', description: 'Motorgjuteri, 300-tonspressen', fieldsTotal: 22, fieldsVerified: 11 },
          { id: 'vp-4', name: 'Motorverkstad Köping', objectType: 'Fastighet', description: 'Montering och testning av dieselmotorer', fieldsTotal: 16, fieldsVerified: 14 },
        ],
      },
    ],
  },
  'atlas-copco': {
    id: 'atlas-copco', name: 'Atlas Copco', orgnr: '556014-2720',
    rootInsuranceObjects: [],
    subsidiaries: [
      {
        id: 'atlascopco-industri', name: 'Atlas Copco Industri AB', orgnr: '556123-7890',
        insuranceObjects: [
          { id: 'aci-1', name: 'Industrifastighet Sickla', objectType: 'Fastighet', description: 'Industri- och lagerlokal vid Sickla köpkvarter', fieldsTotal: 24, fieldsVerified: 15 },
          { id: 'aci-2', name: 'Verkstadslokal Nacka', objectType: 'Fastighet', description: 'Mekanisk verkstad för tyngre utrustning', fieldsTotal: 18, fieldsVerified: 9 },
          { id: 'aci-3', name: 'Produktionsanläggning Märsta', objectType: 'Maskin', description: 'CNC-bearbetningslinje, 14 enheter', fieldsTotal: 20, fieldsVerified: 7 },
          { id: 'aci-4', name: 'Lagerbyggnad Järfälla', objectType: 'Fastighet', description: 'Helautomatiserat höglagersystem', fieldsTotal: 16, fieldsVerified: 15 },
        ],
      },
      {
        id: 'atlascopco-fastigheter', name: 'Atlas Copco Fastigheter AB', orgnr: '556234-8901',
        insuranceObjects: [
          { id: 'acf-1', name: 'Kontorshus Örebro', objectType: 'Fastighet', description: 'Regionalt huvudkontor, 6 våningar', fieldsTotal: 22, fieldsVerified: 16 },
          { id: 'acf-2', name: 'Handelslokal Västerås', objectType: 'Fastighet', description: 'Kommersiell butiksyta i centrumläge', fieldsTotal: 18, fieldsVerified: 4 },
          { id: 'acf-3', name: 'Lagerfastighet Uppsala', objectType: 'Fastighet', description: 'Kyllagerfastighet, ISO-certifierad', fieldsTotal: 14, fieldsVerified: 14 },
        ],
      },
    ],
  },
  'assa-abloy': {
    id: 'assa-abloy', name: 'Assa Abloy', orgnr: '556059-3575',
    rootInsuranceObjects: [],
    subsidiaries: [
      {
        id: 'assaabloy-kommersiellt', name: 'Assa Abloy Kommersiellt AB', orgnr: '556345-6789',
        insuranceObjects: [
          { id: 'aak-1', name: 'Kontorshus Solna', objectType: 'Fastighet', description: 'Glasfasad kontorsbyggnad i Solna business park', fieldsTotal: 20, fieldsVerified: 12 },
          { id: 'aak-2', name: 'Handelsplats Lund', objectType: 'Fastighet', description: 'Handelsfastighet, fullt uthyrd', fieldsTotal: 16, fieldsVerified: 15 },
          { id: 'aak-3', name: 'Shoppinggalleria Helsingborg', objectType: 'Fastighet', description: 'Galleria med 60 butiker, byggd 2012', fieldsTotal: 22, fieldsVerified: 8 },
        ],
      },
      {
        id: 'assaabloy-bostader', name: 'Assa Abloy Bostäder AB', orgnr: '556456-7890',
        insuranceObjects: [
          { id: 'aab-1', name: 'Bostadskvarter Västerås', objectType: 'Fastighet', description: 'Flerfamiljshus, 120 lägenheter', fieldsTotal: 24, fieldsVerified: 13 },
          { id: 'aab-2', name: 'Hyresfastighet Örebro', objectType: 'Fastighet', description: 'Blandad hyresfastighet, kontor + bostad', fieldsTotal: 18, fieldsVerified: 13 },
          { id: 'aab-3', name: 'Bostadsrätter Linköping', objectType: 'Fastighet', description: 'Nyproduktion BRF, inflyttning 2023', fieldsTotal: 20, fieldsVerified: 6 },
        ],
      },
      {
        id: 'assaabloy-lager', name: 'Assa Abloy Lager AB', orgnr: '556567-8901',
        insuranceObjects: [
          { id: 'aal-1', name: 'Centrallager Malmö', objectType: 'Fastighet', description: 'Nordiskt distributionscenter, 40 000 m²', fieldsTotal: 26, fieldsVerified: 23 },
          { id: 'aal-2', name: 'Kyllager Helsingborg', objectType: 'Maskin', description: 'Kylkedja för temperaturkänsliga produkter', fieldsTotal: 16, fieldsVerified: 7 },
        ],
      },
    ],
  },
  'sandvik': {
    id: 'sandvik', name: 'Sandvik', orgnr: '556234-6948',
    rootInsuranceObjects: [],
    subsidiaries: [
      {
        id: 'sandvik-fastigheter', name: 'Sandvik Fastigheter AB', orgnr: '556345-1234',
        insuranceObjects: [
          { id: 'sf-1', name: 'Industrifastighet Sandviken', objectType: 'Fastighet', description: 'Tung industrifastighet intill stålverket', fieldsTotal: 22, fieldsVerified: 17 },
          { id: 'sf-2', name: 'Kontorskomplex Gävle', objectType: 'Fastighet', description: 'Huvudkontor för norra Sverige, 3 byggnader', fieldsTotal: 20, fieldsVerified: 10 },
          { id: 'sf-3', name: 'Lagerlokal Falun', objectType: 'Fastighet', description: 'Logistikfastighet med järnvägsanslutning', fieldsTotal: 14, fieldsVerified: 14 },
        ],
      },
      {
        id: 'sandvik-industri', name: 'Sandvik Industri AB', orgnr: '556456-2345',
        insuranceObjects: [
          { id: 'si-1', name: 'Stålverk Sandviken', objectType: 'Maskin', description: 'Ljusbågsugnar och valsningslinjer', fieldsTotal: 28, fieldsVerified: 11 },
          { id: 'si-2', name: 'Verktygsproduktion Gimo', objectType: 'Maskin', description: 'Hårdmetallverktyg, ISO-certifierad', fieldsTotal: 18, fieldsVerified: 12 },
          { id: 'si-3', name: 'Gruvanläggning Surahammar', objectType: 'Maskin', description: 'Gruvmaskiner för underjordsbrytning', fieldsTotal: 24, fieldsVerified: 7 },
        ],
      },
      {
        id: 'sandvik-logistik', name: 'Sandvik Logistik AB', orgnr: '556567-3456',
        insuranceObjects: [
          { id: 'sl-1', name: 'Logistiknav Gävle', objectType: 'Fastighet', description: 'Centralt logistiknav för norra regionen', fieldsTotal: 20, fieldsVerified: 14 },
          { id: 'sl-2', name: 'Omlastningscentral Sundsvall', objectType: 'Maskin', description: 'Omlastningsutrustning för tunga gods', fieldsTotal: 16, fieldsVerified: 7 },
        ],
      },
    ],
  },
  'hexagon': {
    id: 'hexagon', name: 'Hexagon', orgnr: '556190-4771',
    rootInsuranceObjects: [],
    subsidiaries: [
      {
        id: 'hexagon-teknik', name: 'Hexagon Teknik AB', orgnr: '556678-4567',
        insuranceObjects: [
          { id: 'ht-1', name: 'Teknikcenter Kista', objectType: 'Fastighet', description: 'FoU-center för sensorer och mätning', fieldsTotal: 22, fieldsVerified: 22 },
          { id: 'ht-2', name: 'FoU-anläggning Bromma', objectType: 'Fastighet', description: 'Laboratorier och prototypverkstad', fieldsTotal: 18, fieldsVerified: 18 },
          { id: 'ht-3', name: 'Datacenter Täby', objectType: 'Maskin', description: 'Primärt datacenter med redundant kylning', fieldsTotal: 16, fieldsVerified: 16 },
        ],
      },
      {
        id: 'hexagon-fastigheter', name: 'Hexagon Fastigheter AB', orgnr: '556789-5678',
        insuranceObjects: [
          { id: 'hf-1', name: 'Kontorshus Stockholm', objectType: 'Fastighet', description: 'Centralt placerat kontor, 8 våningar', fieldsTotal: 20, fieldsVerified: 20 },
          { id: 'hf-2', name: 'Representationslokal Lidingö', objectType: 'Fastighet', description: 'Exklusiv representationsyta med sjöutsikt', fieldsTotal: 12, fieldsVerified: 12 },
        ],
      },
    ],
  },
  'epiroc': {
    id: 'epiroc', name: 'Epiroc', orgnr: '559077-9206',
    rootInsuranceObjects: [],
    subsidiaries: [
      {
        id: 'epiroc-gruva', name: 'Epiroc Gruva AB', orgnr: '559123-4567',
        insuranceObjects: [
          { id: 'eg-1', name: 'Gruvutrustningsdepå Kiruna', objectType: 'Maskin', description: 'Depå för underjordsmaskiner och reservdelar', fieldsTotal: 22, fieldsVerified: 14 },
          { id: 'eg-2', name: 'Servicecenter Gällivare', objectType: 'Fastighet', description: 'Service och reparation av gruvfordon', fieldsTotal: 18, fieldsVerified: 7 },
          { id: 'eg-3', name: 'Borrteknikhall Luleå', objectType: 'Maskin', description: 'Borrmaskiner och tillbehör, 22 enheter', fieldsTotal: 16, fieldsVerified: 13 },
        ],
      },
      {
        id: 'epiroc-service', name: 'Epiroc Service AB', orgnr: '559234-5678',
        insuranceObjects: [
          { id: 'es-1', name: 'Servicehall Örebro', objectType: 'Fastighet', description: 'Servicehall för gruvmaskiner, 5 000 m²', fieldsTotal: 20, fieldsVerified: 12 },
          { id: 'es-2', name: 'Reparationsverkstad Västerås', objectType: 'Maskin', description: 'Tyngre reparationsverkstad med lyftkran 30 ton', fieldsTotal: 18, fieldsVerified: 13 },
        ],
      },
      {
        id: 'epiroc-lager', name: 'Epiroc Lager AB', orgnr: '559345-6789',
        insuranceObjects: [
          { id: 'el-1', name: 'Centrallager Örebro', objectType: 'Fastighet', description: 'Nordeuropeiskt centrallager, fullautomation', fieldsTotal: 24, fieldsVerified: 23 },
          { id: 'el-2', name: 'Mellanlager Kumla', objectType: 'Fastighet', description: 'Mellanlager för reservdelsdistribution', fieldsTotal: 16, fieldsVerified: 7 },
        ],
      },
    ],
  },
});

let _tree: OrgTree = buildInitialTree();

export const ROOT_COMPANY_IDS = Object.keys(buildInitialTree());

export function getTree(): OrgTree {
  return _tree;
}

export function addRootCompany(name: string): RootCompany {
  const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
  const newCompany: RootCompany = {
    id,
    name,
    orgnr: '',
    subsidiaries: [],
    rootInsuranceObjects: [],
  };
  _tree = { ..._tree, [id]: newCompany };
  return newCompany;
}

export function addSubsidiary(rootId: string, name: string): Subsidiary | null {
  const root = _tree[rootId];
  if (!root) return null;
  const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
  const newSub: Subsidiary = { id, name, orgnr: '', insuranceObjects: [] };
  _tree = {
    ..._tree,
    [rootId]: { ...root, subsidiaries: [...root.subsidiaries, newSub] },
  };
  return newSub;
}

export function deleteSubsidiaries(rootId: string, subsidiaryIds: string[]): void {
  const root = _tree[rootId];
  if (!root) return;
  const idSet = new Set(subsidiaryIds);
  _tree = {
    ..._tree,
    [rootId]: {
      ...root,
      subsidiaries: root.subsidiaries.filter((s) => !idSet.has(s.id)),
    },
  };
}

export function addInsuranceObject(
  rootId: string,
  subsidiaryId: string | null,
  obj: Omit<InsuranceObject, 'id'>
): InsuranceObject {
  const root = _tree[rootId];
  if (!root) throw new Error('Root not found');
  const newObj: InsuranceObject = { ...obj, id: obj.name + '-' + Date.now() };
  if (subsidiaryId === null) {
    _tree = {
      ..._tree,
      [rootId]: { ...root, rootInsuranceObjects: [...root.rootInsuranceObjects, newObj] },
    };
  } else {
    _tree = {
      ..._tree,
      [rootId]: {
        ...root,
        subsidiaries: root.subsidiaries.map((s) =>
          s.id === subsidiaryId
            ? { ...s, insuranceObjects: [...s.insuranceObjects, newObj] }
            : s
        ),
      },
    };
  }
  return newObj;
}

export function updateInsuranceObject(
  rootId: string,
  subsidiaryId: string | null,
  objId: string,
  patch: Partial<Pick<InsuranceObject, 'name' | 'objectType' | 'description'>>
): void {
  const root = _tree[rootId];
  if (!root) return;
  const applyPatch = (objs: InsuranceObject[]) =>
    objs.map((o) => (o.id === objId ? { ...o, ...patch } : o));
  if (subsidiaryId === null) {
    _tree = {
      ..._tree,
      [rootId]: { ...root, rootInsuranceObjects: applyPatch(root.rootInsuranceObjects) },
    };
  } else {
    _tree = {
      ..._tree,
      [rootId]: {
        ...root,
        subsidiaries: root.subsidiaries.map((s) =>
          s.id === subsidiaryId
            ? { ...s, insuranceObjects: applyPatch(s.insuranceObjects) }
            : s
        ),
      },
    };
  }
}

export function incrementFieldVerified(
  rootId: string,
  subsidiaryId: string | null,
  objId: string
): void {
  const root = _tree[rootId];
  if (!root) return;
  const bump = (objs: InsuranceObject[]) =>
    objs.map((o) =>
      o.id === objId && o.fieldsVerified < o.fieldsTotal
        ? { ...o, fieldsVerified: o.fieldsVerified + 1 }
        : o
    );
  if (subsidiaryId === null) {
    _tree = {
      ..._tree,
      [rootId]: { ...root, rootInsuranceObjects: bump(root.rootInsuranceObjects) },
    };
  } else {
    _tree = {
      ..._tree,
      [rootId]: {
        ...root,
        subsidiaries: root.subsidiaries.map((s) =>
          s.id === subsidiaryId ? { ...s, insuranceObjects: bump(s.insuranceObjects) } : s
        ),
      },
    };
  }
}
