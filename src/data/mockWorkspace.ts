export interface Subsidiary {
  id: string;
  name: string;
}

export interface InsuranceObject {
  id: string;
  name: string;
  structurePct: number;
  verifiedPct: number;
  missingCount: number;
}

const SUBSIDIARIES: Record<string, Subsidiary[]> = {
  'Volvo AB': [
    { id: 'volvo-fastigheter', name: 'Volvo Fastigheter AB' },
    { id: 'volvo-logistik', name: 'Volvo Logistik AB' },
    { id: 'volvo-produktion', name: 'Volvo Produktion AB' },
  ],
  'Atlas Copco': [
    { id: 'atlascopco-industri', name: 'Atlas Copco Industri AB' },
    { id: 'atlascopco-fastigheter', name: 'Atlas Copco Fastigheter AB' },
  ],
  'Assa Abloy': [
    { id: 'assaabloy-kommersiellt', name: 'Assa Abloy Kommersiellt AB' },
    { id: 'assaabloy-bostader', name: 'Assa Abloy Bostäder AB' },
    { id: 'assaabloy-lager', name: 'Assa Abloy Lager AB' },
  ],
  'Sandvik': [
    { id: 'sandvik-fastigheter', name: 'Sandvik Fastigheter AB' },
    { id: 'sandvik-industri', name: 'Sandvik Industri AB' },
    { id: 'sandvik-logistik', name: 'Sandvik Logistik AB' },
    { id: 'sandvik-handel', name: 'Sandvik Handel AB' },
  ],
  'Hexagon': [
    { id: 'hexagon-teknik', name: 'Hexagon Teknik AB' },
    { id: 'hexagon-fastigheter', name: 'Hexagon Fastigheter AB' },
  ],
  'Epiroc': [
    { id: 'epiroc-gruva', name: 'Epiroc Gruva AB' },
    { id: 'epiroc-service', name: 'Epiroc Service AB' },
    { id: 'epiroc-lager', name: 'Epiroc Lager AB' },
  ],
};

const OBJECTS: Record<string, InsuranceObject[]> = {
  'volvo-fastigheter': [
    { id: 'vf-1', name: 'Kontorshus Torslanda', structurePct: 90, verifiedPct: 78, missingCount: 2 },
    { id: 'vf-2', name: 'Verkstad Skövde', structurePct: 72, verifiedPct: 55, missingCount: 5 },
    { id: 'vf-3', name: 'Lagerlokal Göteborg', structurePct: 100, verifiedPct: 92, missingCount: 0 },
    { id: 'vf-4', name: 'P-hus Arendal', structurePct: 60, verifiedPct: 44, missingCount: 7 },
  ],
  'volvo-logistik': [
    { id: 'vl-1', name: 'Logistikcenter Göteborg', structurePct: 88, verifiedPct: 70, missingCount: 3 },
    { id: 'vl-2', name: 'Omlastningsstation Borås', structurePct: 55, verifiedPct: 38, missingCount: 9 },
    { id: 'vl-3', name: 'Terminalhall Landvetter', structurePct: 95, verifiedPct: 89, missingCount: 1 },
  ],
  'volvo-produktion': [
    { id: 'vp-1', name: 'Monteringsfabrik Olofström', structurePct: 44, verifiedPct: 30, missingCount: 12 },
    { id: 'vp-2', name: 'Pressverkstad Floby', structurePct: 78, verifiedPct: 60, missingCount: 4 },
    { id: 'vp-3', name: 'Gjuteri Skövde', structurePct: 65, verifiedPct: 50, missingCount: 6 },
    { id: 'vp-4', name: 'Motorverkstad Köping', structurePct: 91, verifiedPct: 83, missingCount: 1 },
  ],
  'atlascopco-industri': [
    { id: 'aci-1', name: 'Industrifastighet Sickla', structurePct: 82, verifiedPct: 65, missingCount: 4 },
    { id: 'aci-2', name: 'Verkstadslokal Nacka', structurePct: 67, verifiedPct: 48, missingCount: 7 },
    { id: 'aci-3', name: 'Produktionsanläggning Märsta', structurePct: 50, verifiedPct: 35, missingCount: 10 },
    { id: 'aci-4', name: 'Lagerbyggnad Järfälla', structurePct: 96, verifiedPct: 91, missingCount: 0 },
    { id: 'aci-5', name: 'Kontorskomplex Täby', structurePct: 73, verifiedPct: 60, missingCount: 3 },
  ],
  'atlascopco-fastigheter': [
    { id: 'acf-1', name: 'Kontorshus Örebro', structurePct: 85, verifiedPct: 72, missingCount: 2 },
    { id: 'acf-2', name: 'Handelslokal Västerås', structurePct: 40, verifiedPct: 22, missingCount: 11 },
    { id: 'acf-3', name: 'Lagerfastighet Uppsala', structurePct: 100, verifiedPct: 95, missingCount: 0 },
    { id: 'acf-4', name: 'Teknikhus Eskilstuna', structurePct: 58, verifiedPct: 43, missingCount: 8 },
  ],
  'assaabloy-kommersiellt': [
    { id: 'aak-1', name: 'Kontorshus Solna', structurePct: 77, verifiedPct: 60, missingCount: 4 },
    { id: 'aak-2', name: 'Handelsplats Lund', structurePct: 100, verifiedPct: 94, missingCount: 0 },
    { id: 'aak-3', name: 'Shoppinggalleria Helsingborg', structurePct: 52, verifiedPct: 35, missingCount: 9 },
  ],
  'assaabloy-bostader': [
    { id: 'aab-1', name: 'Bostadskvarter Västerås', structurePct: 68, verifiedPct: 52, missingCount: 5 },
    { id: 'aab-2', name: 'Hyresfastighet Örebro', structurePct: 83, verifiedPct: 70, missingCount: 2 },
    { id: 'aab-3', name: 'Bostadsrätter Linköping', structurePct: 45, verifiedPct: 28, missingCount: 11 },
    { id: 'aab-4', name: 'Studentbostäder Norrköping', structurePct: 90, verifiedPct: 82, missingCount: 1 },
  ],
  'assaabloy-lager': [
    { id: 'aal-1', name: 'Centrallager Malmö', structurePct: 95, verifiedPct: 88, missingCount: 1 },
    { id: 'aal-2', name: 'Kyllager Helsingborg', structurePct: 60, verifiedPct: 44, missingCount: 7 },
    { id: 'aal-3', name: 'Frizonslager Trelleborg', structurePct: 75, verifiedPct: 62, missingCount: 3 },
  ],
  'sandvik-fastigheter': [
    { id: 'sf-1', name: 'Industrifastighet Sandviken', structurePct: 88, verifiedPct: 74, missingCount: 2 },
    { id: 'sf-2', name: 'Kontorskomplex Gävle', structurePct: 62, verifiedPct: 47, missingCount: 6 },
    { id: 'sf-3', name: 'Lagerlokal Falun', structurePct: 100, verifiedPct: 93, missingCount: 0 },
  ],
  'sandvik-industri': [
    { id: 'si-1', name: 'Stålverk Sandviken', structurePct: 55, verifiedPct: 38, missingCount: 10 },
    { id: 'si-2', name: 'Verktygsproduktion Gimo', structurePct: 79, verifiedPct: 63, missingCount: 4 },
    { id: 'si-3', name: 'Gruvanläggning Surahammar', structurePct: 41, verifiedPct: 25, missingCount: 13 },
    { id: 'si-4', name: 'Metallbearbetning Köping', structurePct: 92, verifiedPct: 85, missingCount: 1 },
    { id: 'si-5', name: 'Gjuteri Hallstahammar', structurePct: 68, verifiedPct: 52, missingCount: 5 },
  ],
  'sandvik-logistik': [
    { id: 'sl-1', name: 'Logistiknav Gävle', structurePct: 84, verifiedPct: 71, missingCount: 3 },
    { id: 'sl-2', name: 'Omlastningscentral Sundsvall', structurePct: 57, verifiedPct: 40, missingCount: 8 },
    { id: 'sl-3', name: 'Terminalhall Borlänge', structurePct: 96, verifiedPct: 90, missingCount: 0 },
    { id: 'sl-4', name: 'Frihamnen Gävle', structurePct: 70, verifiedPct: 55, missingCount: 5 },
  ],
  'sandvik-handel': [
    { id: 'sh-1', name: 'Handelsplats Sandviken', structurePct: 73, verifiedPct: 58, missingCount: 4 },
    { id: 'sh-2', name: 'Butiksfastighet Gävle', structurePct: 48, verifiedPct: 30, missingCount: 9 },
    { id: 'sh-3', name: 'Showroom Falun', structurePct: 100, verifiedPct: 96, missingCount: 0 },
  ],
  'hexagon-teknik': [
    { id: 'ht-1', name: 'Teknikcenter Kista', structurePct: 87, verifiedPct: 75, missingCount: 2 },
    { id: 'ht-2', name: 'FoU-anläggning Bromma', structurePct: 65, verifiedPct: 50, missingCount: 6 },
    { id: 'ht-3', name: 'Datacenter Täby', structurePct: 93, verifiedPct: 88, missingCount: 1 },
    { id: 'ht-4', name: 'Laboratorium Uppsala', structurePct: 50, verifiedPct: 33, missingCount: 10 },
  ],
  'hexagon-fastigheter': [
    { id: 'hf-1', name: 'Kontorshus Stockholm', structurePct: 80, verifiedPct: 66, missingCount: 3 },
    { id: 'hf-2', name: 'Representationslokal Lidingö', structurePct: 100, verifiedPct: 97, missingCount: 0 },
    { id: 'hf-3', name: 'Konferenscenter Danderyd', structurePct: 43, verifiedPct: 27, missingCount: 12 },
  ],
  'epiroc-gruva': [
    { id: 'eg-1', name: 'Gruvutrustningsdepå Kiruna', structurePct: 76, verifiedPct: 60, missingCount: 4 },
    { id: 'eg-2', name: 'Servicecenter Gällivare', structurePct: 53, verifiedPct: 36, missingCount: 9 },
    { id: 'eg-3', name: 'Borrteknikhall Luleå', structurePct: 89, verifiedPct: 77, missingCount: 2 },
    { id: 'eg-4', name: 'Underjordsverkstad Boliden', structurePct: 38, verifiedPct: 20, missingCount: 14 },
    { id: 'eg-5', name: 'Komponentlager Skellefteå', structurePct: 94, verifiedPct: 87, missingCount: 1 },
  ],
  'epiroc-service': [
    { id: 'es-1', name: 'Servicehall Örebro', structurePct: 71, verifiedPct: 55, missingCount: 5 },
    { id: 'es-2', name: 'Reparationsverkstad Västerås', structurePct: 84, verifiedPct: 70, missingCount: 3 },
    { id: 'es-3', name: 'Reservdelslager Eskilstuna', structurePct: 60, verifiedPct: 44, missingCount: 7 },
  ],
  'epiroc-lager': [
    { id: 'el-1', name: 'Centrallager Örebro', structurePct: 97, verifiedPct: 92, missingCount: 0 },
    { id: 'el-2', name: 'Mellanlager Kumla', structurePct: 58, verifiedPct: 42, missingCount: 8 },
    { id: 'el-3', name: 'Utleveranshall Hallsberg', structurePct: 79, verifiedPct: 65, missingCount: 3 },
    { id: 'el-4', name: 'Kyllager Arboga', structurePct: 45, verifiedPct: 28, missingCount: 11 },
  ],
};

export function getMockSubsidiaries(companyName: string): Subsidiary[] {
  return SUBSIDIARIES[companyName] ?? [];
}

export function getMockObjects(subsidiaryId: string): InsuranceObject[] {
  return OBJECTS[subsidiaryId] ?? [];
}
