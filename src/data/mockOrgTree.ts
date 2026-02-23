export type ParameterStatus = 'missing' | 'ai' | 'verified';

export interface ParameterReference {
  filename: string;
  section: string;
  excerpt: string;
  pageHint?: number;
}

export interface ObjectParameter {
  id: string;
  label: string;
  value: string;
  status: ParameterStatus;
  reference?: ParameterReference;
  section?: string;
  helpText?: string;
}

export interface InsuranceObject {
  id: string;
  name: string;
  objectType: string;
  description: string;
  fieldsTotal: number;
  fieldsVerified: number;
  parameters?: ObjectParameter[];
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

const byggnadParams = (): ObjectParameter[] => [
  { id: 'bolagsnamn', label: 'Bolagsnamn', value: '', status: 'missing', section: 'Fastighetslista' },
  { id: 'org-nr', label: 'Org nr', value: '', status: 'missing', section: 'Fastighetslista' },
  { id: 'hyresintakter-foregaende-ar', label: 'Hyresintäkter förgående år:', value: '', status: 'missing', section: 'Fastighetslista' },
  { id: 'fastighetens-adress', label: 'Fastighetens adress', value: '', status: 'missing', section: 'Fastighetslista' },
  { id: 'fastighetsbeteckning', label: 'Fastighetsbeteckning', value: '', status: 'missing', section: 'Fastighetslista' },
  { id: 'hustyp-typkod', label: 'Hustyp/Typkod', value: '', status: 'missing', section: 'Fastighetslista' },
  { id: 'antal-byggnader', label: 'Antal byggnader', value: '', status: 'missing', section: 'Fastighetslista' },

  { id: 'antal-brf-lagenheter', label: 'Antal brf-lägenheter', value: '', status: 'missing', section: 'Fastighet' },
  { id: 'antal-hyreslägenheter', label: 'Antal hyreslägenheter', value: '', status: 'missing', section: 'Fastighet' },
  { id: 'antal-kommersiella-hyresgaster', label: 'Antal kommersiella hyresgäster', value: '', status: 'missing', section: 'Fastighet' },
  { id: 'byggnadsår', label: 'Byggnadsår', value: '', status: 'missing', section: 'Fastighet' },
  { id: 'stambyte-el', label: 'Stambyte av EL, år:', value: '', status: 'missing', section: 'Fastighet' },
  { id: 'stambyte-va', label: 'Stambyte av VA (ej relining), år:', value: '', status: 'missing', section: 'Fastighet' },
  { id: 'vaningar-ovan-mark', label: 'Våningar ovan mark (ink markplan)', value: '', status: 'missing', section: 'Fastighet' },
  { id: 'entresol-kvm', label: 'Entresol kvm', value: '', status: 'missing', section: 'Fastighet' },
  { id: 'vaningar-under-mark', label: 'Våningar under mark', value: '', status: 'missing', section: 'Fastighet' },

  { id: 'fasad', label: 'Fasad', value: '', status: 'missing', section: 'Material' },
  { id: 'stomme', label: 'Stomme', value: '', status: 'missing', section: 'Material' },
  { id: 'tak', label: 'Tak', value: '', status: 'missing', section: 'Material' },
  { id: 'bjalklag', label: 'Bjälklag (mellanbotten)', value: '', status: 'missing', section: 'Material' },
  { id: 'grund', label: 'Grund', value: '', status: 'missing', section: 'Material' },
  { id: 'isolering', label: 'Isolering (ex. cellplast)', value: '', status: 'missing', section: 'Material' },
  { id: 'bkl', label: 'BKL', value: '', status: 'missing', section: 'Material' },

  { id: 'loa', label: 'LOA, lokalyta', value: '', status: 'missing', section: 'Ytor' },
  { id: 'varav-kontor', label: 'Varav Kontor m2', value: '', status: 'missing', section: 'Ytor' },
  { id: 'varav-lager', label: 'Varav Lager m2', value: '', status: 'missing', section: 'Ytor' },
  { id: 'varav-industri', label: 'Varav industri m2', value: '', status: 'missing', section: 'Ytor' },
  { id: 'varav-restaurang', label: 'Varav Restaurang m2', value: '', status: 'missing', section: 'Ytor' },
  { id: 'källaryta', label: 'Källaryta', value: '', status: 'missing', section: 'Ytor' },
  { id: 'källaryta-garage', label: 'Källaryta varav garage', value: '', status: 'missing', section: 'Ytor' },
  { id: 'komplementbyggnad', label: 'Komplementbyggnad', value: '', status: 'missing', section: 'Ytor', helpText: 'Tex. Miljöhus, 45 kvm & träbyggnad.' },
  { id: 'bta', label: 'BTA, bruttoarea', value: '', status: 'missing', section: 'Ytor' },
  { id: 'bya', label: 'BYA, byggnadsarea', value: '', status: 'missing', section: 'Ytor' },

  { id: 'inbrottslarm', label: 'Inbrottslarm direktkoppling SOS', value: '', status: 'missing', section: 'Övrigt' },
  { id: 'brandlarm', label: 'Brandlarm direktkoppling SOS', value: '', status: 'missing', section: 'Övrigt' },
  { id: 'sprinkler', label: 'Sprinkler', value: '', status: 'missing', section: 'Övrigt' },
  { id: 'värde-sprinklertank', label: 'Värde sprinklertank & system', value: '', status: 'missing', section: 'Övrigt' },
  { id: 'momspliktig', label: 'Momspliktig %', value: '', status: 'missing', section: 'Övrigt', helpText: 'Vid kommersiella lokaler' },
  { id: 'solceller', label: 'Solceller', value: '', status: 'missing', section: 'Övrigt', helpText: 'Värde installation + egendom' },
  { id: 'värde-batteri-system', label: 'Värde Batteri & System', value: '', status: 'missing', section: 'Övrigt', helpText: '(el-lagring fr solceller)' },
  { id: 'laddstolpar', label: 'Laddstolpar', value: '', status: 'missing', section: 'Övrigt', helpText: 'Värde installation + egendom' },

  { id: 'bilaga-trepartsbesiktning', label: 'Bilaga - Trepartsbesiktning intyg', value: '', status: 'missing', section: 'Dokument', helpText: 'Vid solceller' },
  { id: 'bilaga-brandskyddsdokumentation', label: 'Bilaga - Brandskyddsdokumentation', value: '', status: 'missing', section: 'Dokument' },
  { id: 'bilaga-revisionsintyg', label: 'Bilaga - Revisionsintyg', value: '', status: 'missing', section: 'Dokument' },
  { id: 'bilaga-anlaggningsintyg', label: 'Bilaga - Anläggningsintyg', value: '', status: 'missing', section: 'Dokument', helpText: 'Vid direktkopplade larm eller sprinkler' },
  { id: 'bilaga-brandcellsindelning', label: 'Bilaga - Brandcellsindelning', value: '', status: 'missing', section: 'Dokument' },
  { id: 'ovrig-kommentar', label: 'Övrig kommentar / upplysning:', value: '', status: 'missing', section: 'Dokument' },
];

const fastighetParams = (overrides: Partial<ObjectParameter>[] = []): ObjectParameter[] => {
  const base = byggnadParams();
  overrides.forEach((o, i) => {
    if (base[i]) Object.assign(base[i], o);
  });
  return base;
};

const maskinParams = (): ObjectParameter[] => [
  { id: 'tillverkningsår', label: 'Tillverkningsår', value: '2020', status: 'verified', reference: { filename: 'Maskinspecifikation.pdf', section: 'Tekniska data', excerpt: 'Tillverkningsår: 2020. Leverantör: ABB Industrial.', pageHint: 1 } },
  { id: 'modell', label: 'Modell', value: 'AX-2000', status: 'verified', reference: { filename: 'Maskinspecifikation.pdf', section: 'Identifikation', excerpt: 'Modellbeteckning AX-2000, serienr 44821-B.', pageHint: 1 } },
  { id: 'effekt', label: 'Effekt (kW)', value: '250', status: 'ai', reference: { filename: 'Maskinspecifikation.pdf', section: 'Tekniska data', excerpt: 'Nominell motoreffekt: 250 kW vid 1 500 rpm.', pageHint: 2 } },
  { id: 'placering', label: 'Placering', value: 'Hall 3, rad B', status: 'verified', reference: { filename: 'Planlösning_2023.pdf', section: 'Maskinlayout', excerpt: 'Maskin placerad i hall 3, rad B, position 14.', pageHint: 5 } },
  { id: 'inköpspris', label: 'Inköpspris (kr)', value: '3 200 000', status: 'ai', reference: { filename: 'Inköpsorder_2020.pdf', section: 'Orderbekräftelse', excerpt: 'Godkänt inköpspris: 3 200 000 kr exkl. moms.', pageHint: 1 } },
  { id: 'underhållsintervall', label: 'Underhållsintervall', value: '6 månader', status: 'verified', reference: { filename: 'Maskinspecifikation.pdf', section: 'Underhåll', excerpt: 'Rekommenderat underhållsintervall: var 6:e månad.', pageHint: 3 } },
  { id: 'försäkringsvärde', label: 'Försäkringsvärde (kr)', value: '', status: 'missing' },
  { id: 'leverantör', label: 'Leverantör', value: 'ABB Industrial', status: 'verified', reference: { filename: 'Maskinspecifikation.pdf', section: 'Identifikation', excerpt: 'Tillverkare och leverantör: ABB Industrial, Sverige.', pageHint: 1 } },
];

const bilParams = (): ObjectParameter[] => [
  { id: 'registreringsnr', label: 'Registreringsnr', value: 'ABC 123', status: 'verified', reference: { filename: 'Fordonsregister_2024.pdf', section: 'Registreringsuppgifter', excerpt: 'Registreringsnummer: ABC 123, registrerat i Transportstyrelens fordonsregister.', pageHint: 1 } },
  { id: 'årsmodell', label: 'Årsmodell', value: '2021', status: 'verified', reference: { filename: 'Fordonsregister_2024.pdf', section: 'Tekniska uppgifter', excerpt: 'Årsmodell 2021, första registreringsdatum 2021-03-15.', pageHint: 1 } },
  { id: 'märke-modell', label: 'Märke / Modell', value: 'Volvo FH 500', status: 'ai', reference: { filename: 'Fordonsregister_2024.pdf', section: 'Fordonsbeskrivning', excerpt: 'Märke: Volvo, modell: FH 500, kategori: tung lastbil.', pageHint: 2 } },
  { id: 'mätarställning', label: 'Mätarställning (km)', value: '148 000', status: 'ai', reference: { filename: 'Servicerapport_2024.pdf', section: 'Körsträcka', excerpt: 'Avläst mätarställning vid senaste service: 148 000 km.', pageHint: 1 } },
  { id: 'bränsle', label: 'Bränsle', value: 'Diesel', status: 'verified', reference: { filename: 'Fordonsregister_2024.pdf', section: 'Tekniska uppgifter', excerpt: 'Drivmedel: Diesel, euro 6-klassad motor.', pageHint: 2 } },
  { id: 'ägare', label: 'Ägare', value: '', status: 'missing' },
  { id: 'inköpspris', label: 'Inköpspris (kr)', value: '1 850 000', status: 'ai', reference: { filename: 'Inköpsorder_2021.pdf', section: 'Orderbekräftelse', excerpt: 'Godkänt inköpspris: 1 850 000 kr exkl. moms.', pageHint: 1 } },
  { id: 'försäkringsvärde', label: 'Försäkringsvärde (kr)', value: '', status: 'missing' },
];

function ensureParameters(obj: InsuranceObject): InsuranceObject {
  if (obj.parameters && obj.parameters.length > 0) return obj;
  let parameters: ObjectParameter[];
  if (obj.objectType === 'Maskin') {
    parameters = maskinParams();
  } else if (obj.objectType === 'Bil') {
    parameters = bilParams();
  } else {
    parameters = fastighetParams();
  }
  const verifiedCount = parameters.filter((p) => p.status === 'verified').length;
  return { ...obj, parameters, fieldsTotal: parameters.length, fieldsVerified: verifiedCount };
}

const buildInitialTree = (): OrgTree => ({
  'volvo-ab': {
    id: 'volvo-ab', name: 'Volvo AB', orgnr: '556012-5790',
    rootInsuranceObjects: [],
    subsidiaries: [
      {
        id: 'volvo-fastigheter', name: 'Volvo Fastigheter AB', orgnr: '556234-1122',
        insuranceObjects: [
          { id: 'vf-1', name: 'Kontorshus Torslanda', objectType: 'Fastighet', description: 'Kontorskomplex med 4 våningar, byggd 1998', fieldsTotal: 24, fieldsVerified: 18, parameters: fastighetParams() },
          { id: 'vf-2', name: 'Verkstad Skövde', objectType: 'Fastighet', description: 'Industrilokal för fordonsservice och underhåll', fieldsTotal: 20, fieldsVerified: 10, parameters: fastighetParams([{},{},{status:'missing',value:''},{},{status:'missing',value:''},{status:'missing',value:''}]) },
          { id: 'vf-3', name: 'Lagerlokal Göteborg', objectType: 'Fastighet', description: 'Lagerbyggnad 12 000 m², automatiserad', fieldsTotal: 18, fieldsVerified: 17, parameters: fastighetParams([{},{},{status:'verified'},{},{status:'verified'},{},{status:'verified'},{status:'verified'}]) },
          { id: 'vf-4', name: 'P-hus Arendal', objectType: 'Fastighet', description: 'Flervåningsparkering med 800 platser', fieldsTotal: 16, fieldsVerified: 7, parameters: fastighetParams([{status:'missing',value:''},{status:'ai'},{status:'missing',value:''},{status:'ai'},{status:'missing',value:''},{status:'missing',value:''}]) },
        ],
      },
      {
        id: 'volvo-logistik', name: 'Volvo Logistik AB', orgnr: '556456-3344',
        insuranceObjects: [
          { id: 'vl-1', name: 'Logistikcenter Göteborg', objectType: 'Fastighet', description: 'Regionalt distributionscenter, 35 000 m²', fieldsTotal: 26, fieldsVerified: 19, parameters: fastighetParams([{},{value:'35 000'},{value:'Arendalsvägen 4, 418 34 Göteborg',status:'verified'},{value:'Arendal 1:5',status:'verified'},{value:'22 000 000',status:'verified'},{value:'Lager/logistik klass A',status:'verified'},{value:'Volvo Logistik AB',status:'verified'},{value:'145 000 000',status:'ai'}]) },
          { id: 'vl-2', name: 'Omlastningsstation Borås', objectType: 'Maskin', description: 'Automatiserad omlastningsutrustning, 2020 modell', fieldsTotal: 18, fieldsVerified: 7, parameters: maskinParams() },
          { id: 'vl-3', name: 'Terminalhall Landvetter', objectType: 'Fastighet', description: 'Terminalhall intill Landvetter flygplats', fieldsTotal: 14, fieldsVerified: 13, parameters: fastighetParams([{value:'2008'},{value:'12 600'},{value:'Flygplatsvägen 1, 438 80 Landvetter',status:'verified'},{value:'Härryda 2:18',status:'verified'},{value:'9 800 000',status:'ai'},{value:'Terminalhall klass A',status:'verified'},{status:'missing',value:''},{value:'96 000 000',status:'verified'}]) },
        ],
      },
      {
        id: 'volvo-produktion', name: 'Volvo Produktion AB', orgnr: '556567-4455',
        insuranceObjects: [
          { id: 'vp-1', name: 'Monteringsfabrik Olofström', objectType: 'Fastighet', description: 'Pressfabrik för karossdelar, grundad 1946', fieldsTotal: 28, fieldsVerified: 9, parameters: fastighetParams([{value:'1946'},{value:'42 000'},{status:'missing',value:''},{status:'ai',value:'Olofström 5:4'},{status:'missing',value:''},{value:'Industrifastighet klass A',status:'verified'},{status:'missing',value:''},{status:'ai',value:'230 000 000'}]) },
          { id: 'vp-2', name: 'Pressverkstad Floby', objectType: 'Maskin', description: 'Tyngre presslinjer för transmission', fieldsTotal: 20, fieldsVerified: 13, parameters: maskinParams() },
          { id: 'vp-3', name: 'Gjuteri Skövde', objectType: 'Maskin', description: 'Motorgjuteri, 300-tonspressen', fieldsTotal: 22, fieldsVerified: 11, parameters: maskinParams() },
          { id: 'vp-4', name: 'Motorverkstad Köping', objectType: 'Fastighet', description: 'Montering och testning av dieselmotorer', fieldsTotal: 16, fieldsVerified: 14, parameters: fastighetParams([{value:'1978'},{value:'18 000'},{value:'Köpingsvägen 44, 731 60 Köping',status:'verified'},{value:'Köping 3:7',status:'verified'},{value:'14 200 000',status:'verified'},{value:'Industrifastighet klass B',status:'verified'},{value:'Volvo Produktion AB',status:'verified'},{status:'missing',value:''}]) },
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

function applyEnsureParameters(tree: OrgTree): OrgTree {
  const result: OrgTree = {};
  for (const [id, company] of Object.entries(tree)) {
    result[id] = {
      ...company,
      rootInsuranceObjects: company.rootInsuranceObjects.map(ensureParameters),
      subsidiaries: company.subsidiaries.map((s) => ({
        ...s,
        insuranceObjects: s.insuranceObjects.map(ensureParameters),
      })),
    };
  }
  return result;
}

let _tree: OrgTree = applyEnsureParameters(buildInitialTree());

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
  const newObj: InsuranceObject = ensureParameters({ ...obj, id: obj.name + '-' + Date.now() });
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

export function deleteInsuranceObjects(
  rootId: string,
  subsidiaryId: string | null,
  objIds: string[]
): void {
  const root = _tree[rootId];
  if (!root) return;
  const idSet = new Set(objIds);
  if (subsidiaryId === null) {
    _tree = {
      ..._tree,
      [rootId]: {
        ...root,
        rootInsuranceObjects: root.rootInsuranceObjects.filter((o) => !idSet.has(o.id)),
      },
    };
  } else {
    _tree = {
      ..._tree,
      [rootId]: {
        ...root,
        subsidiaries: root.subsidiaries.map((s) =>
          s.id === subsidiaryId
            ? { ...s, insuranceObjects: s.insuranceObjects.filter((o) => !idSet.has(o.id)) }
            : s
        ),
      },
    };
  }
}

export function updateObjectParameter(
  rootId: string,
  subsidiaryId: string | null,
  objId: string,
  paramId: string,
  patch: Partial<Pick<ObjectParameter, 'value' | 'status'>>
): void {
  const root = _tree[rootId];
  if (!root) return;
  const applyPatch = (objs: InsuranceObject[]) =>
    objs.map((o) => {
      if (o.id !== objId) return o;
      const params = (o.parameters ?? []).map((p) =>
        p.id === paramId ? { ...p, ...patch } : p
      );
      const verifiedCount = params.filter((p) => p.status === 'verified').length;
      return { ...o, parameters: params, fieldsVerified: verifiedCount, fieldsTotal: params.length };
    });
  if (subsidiaryId === null) {
    _tree = { ..._tree, [rootId]: { ...root, rootInsuranceObjects: applyPatch(root.rootInsuranceObjects) } };
  } else {
    _tree = {
      ..._tree,
      [rootId]: {
        ...root,
        subsidiaries: root.subsidiaries.map((s) =>
          s.id === subsidiaryId ? { ...s, insuranceObjects: applyPatch(s.insuranceObjects) } : s
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
