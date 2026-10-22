export type Sex = 'Male' | 'Female';

export type AngleClass = 'Class I' | 'Class II div 1' | 'Class II div 2' | 'Class III' | 'End-on' | 'Not Recorded';
export type CanineClass = 'Class I' | 'Class II' | 'Class III' | 'Not Recorded';
export type CrossbiteType = 'None' | 'Unilateral Right' | 'Unilateral Left' | 'Bilateral' | 'Anterior Crossbite';

export interface ToothWidths {
  [tooth: number]: number; // 1 to 7
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number | '';
  sex: Sex;
  date: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  medicalHistory: string;
  dentalHistory: string;
  familyHistory: string;
  oralHabits: string;
  growthStatus: string;
  previousOrthoTreatment: string;
  notes: string;
}

export interface ModelOcclusion {
  teethPresentUpper: string;
  teethPresentLower: string;
  rightCanine: CanineClass;
  leftCanine: CanineClass;
  rightMolar: AngleClass;
  leftMolar: AngleClass;
  overjet: number | ''; // mm
  overbite: number | ''; // mm or %
  transverseRelation: CrossbiteType;
  crossbiteNotes: string;
  upperMidline: number | ''; // mm (+ to right, - to left, 0 coincident)
  lowerMidline: number | ''; // mm
  upperMidlineDirection: 'Coincident' | 'Shifted Right' | 'Shifted Left';
  lowerMidlineDirection: 'Coincident' | 'Shifted Right' | 'Shifted Left';
}

export interface MaxillaryArchData {
  toothWidthsRight: ToothWidths; // 1-7
  toothWidthsLeft: ToothWidths; // 1-7
  proclinationNotes: string;
  archSymmetryPremolarRight: number | '';
  archSymmetryPremolarLeft: number | '';
  archSymmetryMolarRight: number | '';
  archSymmetryMolarLeft: number | '';
  archPerimeterMeasured: number | '';
  // Width indices inputs
  pontActualPremolar: number | '';
  pontActualMolar: number | '';
  linderHarthActualPremolar: number | '';
  linderHarthActualMolar: number | '';
  chaddhaActualPremolar: number | '';
  chaddhaActualMolar: number | '';
  ashleyHowePMD: number | ''; // Premolar dimension
  ashleyHowePMBAW: number | ''; // Premolar basal arch width
}

export interface MandibularArchData {
  toothWidthsRight: ToothWidths; // 1-7
  toothWidthsLeft: ToothWidths; // 1-7
  proclinationNotes: string;
  curveOfSpeeRightDepth: number | '';
  curveOfSpeeLeftDepth: number | '';
  archPerimeterMeasured: number | ''; // Nance & Carey
}

export interface SpaceAnalysisArch {
  // Required
  proclinationCorrection: number | '';
  rotationCorrection: number | '';
  crowdingCorrection: number | '';
  curveOfSpeeCorrection?: number | ''; // lower only
  // Available
  interdentalSpacing: number | '';
  expansion: number | '';
  distalization: number | '';
  labialisationAnteriors: number | '';
  uprightingPosteriors: number | '';
  derotationPosteriors: number | '';
  proximalStripping: number | '';
  extraction: number | '';
}

export interface SpaceAnalysisData {
  upper: SpaceAnalysisArch;
  lower: SpaceAnalysisArch;
}

export interface RadiographicChecklist {
  teethPresent: string;
  teethAbsent: string;
  rootResorption: string;
  rootFormation: string;
  eruptionLevel: string;
  characterOfRestoration: string;
  laminaDura: string;
  heightOfInterdentalCrest: string;
  supernumeraryTeeth: string;
  thirdMolars: string;
  pathologicalCondition: string;
  otherInvestigations: string;
  iopaFindings: string;
}

export type CVMStage = 1 | 2 | 3 | 4 | 5 | 6 | 0;

export interface DownsAnalysisData {
  facialAngle: number | '';
  angleOfConvexity: number | '';
  abPlane: number | '';
  mandibularPlaneAngle: number | '';
  yAxis: number | '';
  cantOfOcclusalPlane: number | '';
  oneToOne: number | '';
  oneToOcclusalPlane: number | '';
  oneToMandibularPlane: number | '';
  oneToAPog: number | '';
}

export interface SteinerAnalysisData {
  sna: number | '';
  snb: number | '';
  snd: number | '';
  anb: number | '';
  goGnToSN: number | '';
  u1ToNA_mm: number | '';
  u1ToNA_deg: number | '';
  l1ToNB_mm: number | '';
  l1ToNB_deg: number | '';
  pogToNB_mm: number | '';
  u1ToL1_deg: number | '';
  occlusalToSN: number | '';
  sLineUpperLip: number | '';
  sLineLowerLip: number | '';
}

export interface WitsAnalysisData {
  aoValue: number | '';
  boValue: number | '';
}

export interface TweedAnalysisData {
  fmpa: number | '';
  fmia: number | '';
  impa: number | '';
}

export interface SoftTissueAnalysisData {
  nasomentalAngle: number | '';
  nasolabialAngle: number | '';
  upperLipProminence: number | '';
  lowerLipProminence: number | '';
  chinProminence: number | '';
  eLineUpperLip: number | '';
  eLineLowerLip: number | '';
  sLineUpperLip: number | '';
  sLineLowerLip: number | '';
  bLineUpperLip: number | '';
  merrifieldZAngle: number | '';
  softTissueChinThickness: number | '';
}

export interface McNamaraAnalysisData {
  nPerpToA: number | '';
  nPerpToPog: number | '';
  facialAxisAngle: number | '';
  mandibularPlaneAngle: number | '';
  effMaxillaryLength: number | ''; // Co - A
  effMandibularLength: number | ''; // Co - Gn
  lafh: number | ''; // ANS - Me
  oneToPointA: number | '';
  oneToAPog: number | '';
  upperAirway: number | '';
  lowerAirway: number | '';
}

export interface RakosiJarabakAnalysisData {
  saddleAngle: number | '';
  articularAngle: number | '';
  gonialAngle: number | '';
  upperGonialAngle: number | '';
  lowerGonialAngle: number | '';
  mandibularAngle: number | '';
  angleOfInclination: number | '';
  pnToOcclusalPlane: number | '';
  pnToMandibularPlane: number | '';
  basalPlaneAngle: number | '';
  palatalToOcclusalPlane: number | '';
  occlusalToMandibularPlane: number | '';
  sGo: number | ''; // Posterior face height
  nMe: number | ''; // Anterior face height
  yAxis: number | '';
  interincisalAngle: number | '';
  oneToSN: number | '';
  oneToPalatalPlane: number | '';
  oneToMandibularPlane: number | '';
}

export interface RickettsAnalysisData {
  facialAxisAngle: number | '';
  facialDepth: number | '';
  mandibularPlaneAngle: number | '';
  convexityPointA: number | '';
  oneToApoAngle: number | '';
  oneToApoMm: number | '';
  u6ToPtV: number | '';
  lowerLipToEPlane: number | '';
}

export interface BurstoneHardAnalysisData {
  // Cranial Base
  arPtm: number | '';
  ptmN: number | '';
  // Horizontal
  nAPgAngle: number | '';
  nA: number | '';
  nB: number | '';
  nPg: number | '';
  aB: number | '';
  // Vertical
  nAns: number | '';
  ansGn: number | '';
  pnsN: number | '';
  mpHp: number | '';
  u1Nf: number | '';
  l1Mp: number | '';
  u6Nf: number | '';
  l6Mp: number | '';
  // Maxilla-Mandible
  pnsAns: number | '';
  arGo: number | '';
  goPg: number | '';
  bPg: number | '';
  arGoGn: number | '';
  // Dental
  opHp: number | '';
  u1NfAngle: number | '';
}

export interface BurstoneSoftAnalysisData {
  facialConvexityAngle: number | '';
  maxillaryPrognathism: number | '';
  mandibularPrognathism: number | '';
  verticalHeightRatio: number | '';
  lowerFaceThroatAngle: number | '';
  lowerVerticalHeightDepthRatio: number | '';
  nasolabialAngle: number | '';
  upperLipProtrusion: number | '';
  lowerLipProtrusion: number | '';
  mentolabialSulcus: number | '';
  verticalLipChinRatio: number | '';
  maxillaryIncisorExposure: number | '';
  interlabialGap: number | '';
}

export interface CompositeCephStage {
  // Maxilla to Cranium
  sna: number | '';
  nPerpToA: number | '';
  effMaxillaryLength: number | '';
  convexityOfPointA: number | '';
  // Mandible to Cranium
  snb: number | '';
  facialAngle: number | '';
  effMandibularLength: number | '';
  nPerpToPog: number | '';
  // Maxilla to Mandible
  anb: number | '';
  abPlaneAngle: number | '';
  wits: number | '';
  angleOfConvexity: number | '';
  maxilloMandibularDiff: number | '';
  // Vertical Relationship
  goGnToSN: number | '';
  fhToMandibularPlane: number | '';
  fmpa: number | '';
  facialAxisAngle: number | '';
  yAxis: number | '';
  jarabakRatio: number | '';
  snToOcclusalPlane: number | '';
  palatalToOcclusalPlane: number | '';
  lafh: number | '';
  sumOfPosteriorAngles: number | '';
  // Dental Parameters
  u1ToNAAngle: number | '';
  u1ToNAMm: number | '';
  u1ToSN: number | '';
  l1ToNBAngle: number | '';
  l1ToNBMm: number | '';
  impa: number | '';
  interincisalAngle: number | '';
  holdawayRatio: number | '';
  // Soft Tissue
  upperLipToELine: number | '';
  lowerLipToELine: number | '';
  nasolabialAngle: number | '';
  merrifieldZAngle: number | '';
  sLine: number | '';
  mentolabialSulcusDepth: number | '';
}

export interface SavedCaseItem {
  id: string;
  name: string;
  date: string;
  lastModified: string;
  isDemoCase?: boolean;
  data: CaseData;
}

export interface CaseData {
  version: string;
  lastModified: string;
  isDemoCase?: boolean;
  studentNotes?: string;
  studentDiagnosisDraftOverride?: string;
  studentTreatmentPlanOverride?: string;
  
  patient: PatientProfile;
  modelOcclusion: ModelOcclusion;
  maxillary: MaxillaryArchData;
  mandibular: MandibularArchData;
  spaceAnalysis: SpaceAnalysisData;
  radiographic: RadiographicChecklist;
  cvmStage: CVMStage;
  
  downs: DownsAnalysisData;
  steiner: SteinerAnalysisData;
  wits: WitsAnalysisData;
  tweed: TweedAnalysisData;
  softTissue: SoftTissueAnalysisData;
  mcnamara: McNamaraAnalysisData;
  rakosiJarabak: RakosiJarabakAnalysisData;
  ricketts: RickettsAnalysisData;
  burstoneHard: BurstoneHardAnalysisData;
  burstoneSoft: BurstoneSoftAnalysisData;
  
  composite: {
    preTreatment: CompositeCephStage;
    midTreatment: CompositeCephStage;
    postTreatment: CompositeCephStage;
  };
}
