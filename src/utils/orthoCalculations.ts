import {
  ToothWidths,
  MaxillaryArchData,
  MandibularArchData,
  SpaceAnalysisArch,
  Sex,
  CompositeCephStage
} from '../types/ortho';

// Helper to sum a set of tooth widths safely
export function sumTeeth(widths: ToothWidths, start: number, end: number): number {
  let total = 0;
  for (let i = start; i <= end; i++) {
    const val = widths[i];
    if (typeof val === 'number' && !isNaN(val) && val > 0) {
      total += val;
    }
  }
  return Number(total.toFixed(2));
}

// Sum of both sides (Right + Left)
export function sumBilateralTeeth(
  right: ToothWidths,
  left: ToothWidths,
  start: number,
  end: number
): number {
  return Number((sumTeeth(right, start, end) + sumTeeth(left, start, end)).toFixed(2));
}

export interface MaxillaryCalculations {
  sumIncisors2to2: number;
  sumCanines3to3: number;
  toothMaterial5to5: number;
  toothMaterial6to6: number;
  toothMaterial7to7: number;
  premolarSymmetryDiff: number | null;
  molarSymmetryDiff: number | null;
  archPerimeterDiff: number | null; // Measured - 5to5
  pontCalculatedPremolar: number | null;
  pontCalculatedMolar: number | null;
  pontDiffPremolar: number | null;
  pontDiffMolar: number | null;
  linderHarthCalculatedPremolar: number | null;
  linderHarthCalculatedMolar: number | null;
  linderHarthDiffPremolar: number | null;
  linderHarthDiffMolar: number | null;
  chaddhaCalculatedPremolar: number | null;
  chaddhaCalculatedMolar: number | null;
  chaddhaDiffPremolar: number | null;
  chaddhaDiffMolar: number | null;
  ashleyHowePMBAWPercent: number | null;
}

export function calculateMaxillaryArch(data: MaxillaryArchData): MaxillaryCalculations {
  const sumIncisors2to2 = sumBilateralTeeth(data.toothWidthsRight, data.toothWidthsLeft, 1, 2);
  const sumCanines3to3 = sumBilateralTeeth(data.toothWidthsRight, data.toothWidthsLeft, 1, 3);
  const toothMaterial5to5 = sumBilateralTeeth(data.toothWidthsRight, data.toothWidthsLeft, 1, 5);
  const toothMaterial6to6 = sumBilateralTeeth(data.toothWidthsRight, data.toothWidthsLeft, 1, 6);
  const toothMaterial7to7 = sumBilateralTeeth(data.toothWidthsRight, data.toothWidthsLeft, 1, 7);

  // Symmetry
  const pRight = typeof data.archSymmetryPremolarRight === 'number' ? data.archSymmetryPremolarRight : null;
  const pLeft = typeof data.archSymmetryPremolarLeft === 'number' ? data.archSymmetryPremolarLeft : null;
  const premolarSymmetryDiff = pRight !== null && pLeft !== null ? Number(Math.abs(pRight - pLeft).toFixed(2)) : null;

  const mRight = typeof data.archSymmetryMolarRight === 'number' ? data.archSymmetryMolarRight : null;
  const mLeft = typeof data.archSymmetryMolarLeft === 'number' ? data.archSymmetryMolarLeft : null;
  const molarSymmetryDiff = mRight !== null && mLeft !== null ? Number(Math.abs(mRight - mLeft).toFixed(2)) : null;

  // Arch perimeter analysis (Measured - 5to5)
  const measuredPerimeter = typeof data.archPerimeterMeasured === 'number' ? data.archPerimeterMeasured : null;
  const archPerimeterDiff = measuredPerimeter !== null && toothMaterial5to5 > 0
    ? Number((measuredPerimeter - toothMaterial5to5).toFixed(2))
    : null;

  // Width indices (only when sum of incisors > 0)
  let pontCalculatedPremolar: number | null = null;
  let pontCalculatedMolar: number | null = null;
  let pontDiffPremolar: number | null = null;
  let pontDiffMolar: number | null = null;

  let linderHarthCalculatedPremolar: number | null = null;
  let linderHarthCalculatedMolar: number | null = null;
  let linderHarthDiffPremolar: number | null = null;
  let linderHarthDiffMolar: number | null = null;

  let chaddhaCalculatedPremolar: number | null = null;
  let chaddhaCalculatedMolar: number | null = null;
  let chaddhaDiffPremolar: number | null = null;
  let chaddhaDiffMolar: number | null = null;

  if (sumIncisors2to2 > 0) {
    // Pont: PM = SI*100/80; Molar = SI*100/64
    pontCalculatedPremolar = Number(((sumIncisors2to2 * 100) / 80).toFixed(2));
    pontCalculatedMolar = Number(((sumIncisors2to2 * 100) / 64).toFixed(2));
    if (typeof data.pontActualPremolar === 'number') {
      pontDiffPremolar = Number((data.pontActualPremolar - pontCalculatedPremolar).toFixed(2));
    }
    if (typeof data.pontActualMolar === 'number') {
      pontDiffMolar = Number((data.pontActualMolar - pontCalculatedMolar).toFixed(2));
    }

    // Linder-Harth: PM = SI*100/85; Molar = SI*100/64
    linderHarthCalculatedPremolar = Number(((sumIncisors2to2 * 100) / 85).toFixed(2));
    linderHarthCalculatedMolar = Number(((sumIncisors2to2 * 100) / 64).toFixed(2));
    if (typeof data.linderHarthActualPremolar === 'number') {
      linderHarthDiffPremolar = Number((data.linderHarthActualPremolar - linderHarthCalculatedPremolar).toFixed(2));
    }
    if (typeof data.linderHarthActualMolar === 'number') {
      linderHarthDiffMolar = Number((data.linderHarthActualMolar - linderHarthCalculatedMolar).toFixed(2));
    }

    // Chaddha: PM = SI*100/83.7; Molar = SI*100/63.7
    chaddhaCalculatedPremolar = Number(((sumIncisors2to2 * 100) / 83.7).toFixed(2));
    chaddhaCalculatedMolar = Number(((sumIncisors2to2 * 100) / 63.7).toFixed(2));
    if (typeof data.chaddhaActualPremolar === 'number') {
      chaddhaDiffPremolar = Number((data.chaddhaActualPremolar - chaddhaCalculatedPremolar).toFixed(2));
    }
    if (typeof data.chaddhaActualMolar === 'number') {
      chaddhaDiffMolar = Number((data.chaddhaActualMolar - chaddhaCalculatedMolar).toFixed(2));
    }
  }

  // Ashley Howe: PMBAW% = PMBAW * 100 / TTM 6-6
  let ashleyHowePMBAWPercent: number | null = null;
  if (typeof data.ashleyHowePMBAW === 'number' && toothMaterial6to6 > 0) {
    ashleyHowePMBAWPercent = Number(((data.ashleyHowePMBAW * 100) / toothMaterial6to6).toFixed(2));
  }

  return {
    sumIncisors2to2,
    sumCanines3to3,
    toothMaterial5to5,
    toothMaterial6to6,
    toothMaterial7to7,
    premolarSymmetryDiff,
    molarSymmetryDiff,
    archPerimeterDiff,
    pontCalculatedPremolar,
    pontCalculatedMolar,
    pontDiffPremolar,
    pontDiffMolar,
    linderHarthCalculatedPremolar,
    linderHarthCalculatedMolar,
    linderHarthDiffPremolar,
    linderHarthDiffMolar,
    chaddhaCalculatedPremolar,
    chaddhaCalculatedMolar,
    chaddhaDiffPremolar,
    chaddhaDiffMolar,
    ashleyHowePMBAWPercent
  };
}

export interface MandibularCalculations {
  sumIncisors2to2: number;
  sumCanines3to3: number;
  toothMaterial5to5: number;
  toothMaterial6to6: number;
  toothMaterial7to7: number;
  curveOfSpeeDepth: number | null; // [(R + L) / 2] + 0.5
  nanceCareyDiff: number | null; // Measured - 5to5
}

export function calculateMandibularArch(data: MandibularArchData): MandibularCalculations {
  const sumIncisors2to2 = sumBilateralTeeth(data.toothWidthsRight, data.toothWidthsLeft, 1, 2);
  const sumCanines3to3 = sumBilateralTeeth(data.toothWidthsRight, data.toothWidthsLeft, 1, 3);
  const toothMaterial5to5 = sumBilateralTeeth(data.toothWidthsRight, data.toothWidthsLeft, 1, 5);
  const toothMaterial6to6 = sumBilateralTeeth(data.toothWidthsRight, data.toothWidthsLeft, 1, 6);
  const toothMaterial7to7 = sumBilateralTeeth(data.toothWidthsRight, data.toothWidthsLeft, 1, 7);

  // Curve of Spee depth formula: [(Right + Left) / 2] + 0.5
  const rDepth = typeof data.curveOfSpeeRightDepth === 'number' ? data.curveOfSpeeRightDepth : null;
  const lDepth = typeof data.curveOfSpeeLeftDepth === 'number' ? data.curveOfSpeeLeftDepth : null;
  let curveOfSpeeDepth: number | null = null;
  if (rDepth !== null && lDepth !== null) {
    curveOfSpeeDepth = Number((((rDepth + lDepth) / 2) + 0.5).toFixed(2));
  }

  // Nance & Carey
  const measuredPerimeter = typeof data.archPerimeterMeasured === 'number' ? data.archPerimeterMeasured : null;
  const nanceCareyDiff = measuredPerimeter !== null && toothMaterial5to5 > 0
    ? Number((measuredPerimeter - toothMaterial5to5).toFixed(2))
    : null;

  return {
    sumIncisors2to2,
    sumCanines3to3,
    toothMaterial5to5,
    toothMaterial6to6,
    toothMaterial7to7,
    curveOfSpeeDepth,
    nanceCareyDiff
  };
}

export interface TomeCalculations {
  actualUpperSI: number | null;
  lowerSI: number | null;
  calculatedUpperSI: number | null; // (lower SI * 4)/3 + 0.5
  diff: number | null;
}

export function calculateTomeIndex(
  upperSI: number,
  lowerSI: number
): TomeCalculations {
  if (lowerSI <= 0) {
    return {
      actualUpperSI: upperSI > 0 ? upperSI : null,
      lowerSI: null,
      calculatedUpperSI: null,
      diff: null
    };
  }

  const calculatedUpperSI = Number((((lowerSI * 4) / 3) + 0.5).toFixed(2));
  const diff = upperSI > 0 ? Number((upperSI - calculatedUpperSI).toFixed(2)) : null;

  return {
    actualUpperSI: upperSI > 0 ? upperSI : null,
    lowerSI,
    calculatedUpperSI,
    diff
  };
}

export interface BoltonCalculations {
  mandibular12: number;
  maxillary12: number;
  overallRatio: number | null; // (mand12 / max12) * 100
  overallDiff: number | null; // overallRatio - 91.3
  mandibular6: number;
  maxillary6: number;
  anteriorRatio: number | null; // (mand6 / max6) * 100
  anteriorDiff: number | null; // anteriorRatio - 77.2
}

export function calculateBolton(
  maxillary: MaxillaryCalculations,
  mandibular: MandibularCalculations
): BoltonCalculations {
  const max12 = maxillary.toothMaterial6to6;
  const mand12 = mandibular.toothMaterial6to6;
  const max6 = maxillary.sumCanines3to3;
  const mand6 = mandibular.sumCanines3to3;

  let overallRatio: number | null = null;
  let overallDiff: number | null = null;
  if (max12 > 0 && mand12 > 0) {
    overallRatio = Number(((mand12 / max12) * 100).toFixed(2));
    overallDiff = Number((overallRatio - 91.3).toFixed(2));
  }

  let anteriorRatio: number | null = null;
  let anteriorDiff: number | null = null;
  if (max6 > 0 && mand6 > 0) {
    anteriorRatio = Number(((mand6 / max6) * 100).toFixed(2));
    anteriorDiff = Number((anteriorRatio - 77.2).toFixed(2));
  }

  return {
    mandibular12: mand12,
    maxillary12: max12,
    overallRatio,
    overallDiff,
    mandibular6: mand6,
    maxillary6: max6,
    anteriorRatio,
    anteriorDiff
  };
}

export interface SpaceArchCalculations {
  spaceRequired: number;
  spaceAvailable: number;
  discrepancy: number; // Available - Required
}

export function calculateSpaceArch(arch: SpaceAnalysisArch): SpaceArchCalculations {
  const reqProc = typeof arch.proclinationCorrection === 'number' ? arch.proclinationCorrection : 0;
  const reqRot = typeof arch.rotationCorrection === 'number' ? arch.rotationCorrection : 0;
  const reqCrowd = typeof arch.crowdingCorrection === 'number' ? arch.crowdingCorrection : 0;
  const reqSpee = typeof arch.curveOfSpeeCorrection === 'number' ? arch.curveOfSpeeCorrection : 0;

  const totalRequired = Number((reqProc + reqRot + reqCrowd + reqSpee).toFixed(2));

  const avSpace = typeof arch.interdentalSpacing === 'number' ? arch.interdentalSpacing : 0;
  const avExp = typeof arch.expansion === 'number' ? arch.expansion : 0;
  const avDist = typeof arch.distalization === 'number' ? arch.distalization : 0;
  const avLab = typeof arch.labialisationAnteriors === 'number' ? arch.labialisationAnteriors : 0;
  const avUpr = typeof arch.uprightingPosteriors === 'number' ? arch.uprightingPosteriors : 0;
  const avDerot = typeof arch.derotationPosteriors === 'number' ? arch.derotationPosteriors : 0;
  const avStrip = typeof arch.proximalStripping === 'number' ? arch.proximalStripping : 0;
  const avExt = typeof arch.extraction === 'number' ? arch.extraction : 0;

  const totalAvailable = Number((avSpace + avExp + avDist + avLab + avUpr + avDerot + avStrip + avExt).toFixed(2));
  const discrepancy = Number((totalAvailable - totalRequired).toFixed(2));

  return {
    spaceRequired: totalRequired,
    spaceAvailable: totalAvailable,
    discrepancy
  };
}

export interface WitsCalculations {
  diff: number | null; // BO - AO
  sexStandard: number;
  referenceDiff: number | null;
}

export function calculateWits(ao: number | '', bo: number | '', sex: Sex): WitsCalculations {
  const aoVal = typeof ao === 'number' ? ao : null;
  const boVal = typeof bo === 'number' ? bo : null;
  const sexStandard = sex === 'Female' ? 0 : -1; // Males: BO is 1mm behind AO (-1mm); Females: BO = AO (0mm)

  if (aoVal === null || boVal === null) {
    return {
      diff: null,
      sexStandard,
      referenceDiff: null
    };
  }

  const diff = Number((boVal - aoVal).toFixed(2));
  const referenceDiff = Number((diff - sexStandard).toFixed(2));

  return {
    diff,
    sexStandard,
    referenceDiff
  };
}

export interface TweedCalculations {
  sum: number | null; // FMPA + FMIA + IMPA
  fmpaDiff: number | null; // vs 25
  fmiaDiff: number | null; // vs 65
  impaDiff: number | null; // vs 90
}

export function calculateTweed(fmpa: number | '', fmia: number | '', impa: number | ''): TweedCalculations {
  const f = typeof fmpa === 'number' ? fmpa : null;
  const fm = typeof fmia === 'number' ? fmia : null;
  const im = typeof impa === 'number' ? impa : null;

  return {
    sum: f !== null && fm !== null && im !== null ? Number((f + fm + im).toFixed(1)) : null,
    fmpaDiff: f !== null ? Number((f - 25).toFixed(1)) : null,
    fmiaDiff: fm !== null ? Number((fm - 65).toFixed(1)) : null,
    impaDiff: im !== null ? Number((im - 90).toFixed(1)) : null
  };
}

export interface JarabakCalculations {
  sumOfPosteriorAngles: number | null; // Saddle + Articular + Gonial
  sumDiff: number | null; // vs 396
  jarabakRatio: number | null; // (S-Go / N-Me) * 100
  ratioDiff: number | null; // vs 63.5
}

export function calculateJarabak(
  saddle: number | '',
  articular: number | '',
  gonial: number | '',
  sGo: number | '',
  nMe: number | ''
): JarabakCalculations {
  const s = typeof saddle === 'number' ? saddle : null;
  const a = typeof articular === 'number' ? articular : null;
  const g = typeof gonial === 'number' ? gonial : null;

  const sum = s !== null && a !== null && g !== null ? Number((s + a + g).toFixed(1)) : null;
  const sumDiff = sum !== null ? Number((sum - 396).toFixed(1)) : null;

  const postHeight = typeof sGo === 'number' ? sGo : null;
  const antHeight = typeof nMe === 'number' ? nMe : null;
  let jarabakRatio: number | null = null;
  let ratioDiff: number | null = null;

  if (postHeight !== null && antHeight !== null && antHeight > 0) {
    jarabakRatio = Number(((postHeight / antHeight) * 100).toFixed(1));
    ratioDiff = Number((jarabakRatio - 63.5).toFixed(1));
  }

  return {
    sumOfPosteriorAngles: sum,
    sumDiff,
    jarabakRatio,
    ratioDiff
  };
}

export interface McNamaraCalculations {
  maxillomandibularDiff: number | null; // Eff Mand - Eff Max
}

export function calculateMcNamara(effMax: number | '', effMand: number | ''): McNamaraCalculations {
  const mx = typeof effMax === 'number' ? effMax : null;
  const md = typeof effMand === 'number' ? effMand : null;

  return {
    maxillomandibularDiff: mx !== null && md !== null ? Number((md - mx).toFixed(1)) : null
  };
}

// Stage comparison utility for composite ceph
export function calculateStageDelta(
  stageA: CompositeCephStage,
  stageB: CompositeCephStage
): Record<keyof CompositeCephStage, number | null> {
  const result = {} as Record<keyof CompositeCephStage, number | null>;
  const keys = Object.keys(stageA) as (keyof CompositeCephStage)[];

  for (const k of keys) {
    const valA = stageA[k];
    const valB = stageB[k];
    if (typeof valA === 'number' && typeof valB === 'number') {
      result[k] = Number((valB - valA).toFixed(2));
    } else {
      result[k] = null;
    }
  }

  return result;
}
