import {
  CaseData,
  CVMStage
} from '../types/ortho';
import {
  calculateMaxillaryArch,
  calculateMandibularArch,
  calculateTomeIndex,
  calculateBolton,
  calculateSpaceArch,
  calculateWits,
  calculateTweed,
  calculateJarabak,
  calculateMcNamara
} from './orthoCalculations';
import { CVM_STAGES_INFO } from '../data/orthoReferences';

export interface CrossCheckFinding {
  domain: 'Skeletal Sagittal' | 'Skeletal Vertical' | 'Transverse Arch' | 'Dental / Bolton' | 'Growth Timing' | 'Soft Tissue Profile';
  type: 'consistent' | 'discrepant' | 'observation';
  summary: string;
  parametersInvolved: string[];
  clinicalImplication: string;
}

export interface OrthoCaseAnalysisSummary {
  skeletal: {
    sagittal: string;
    vertical: string;
    transverse: string;
  };
  dental: {
    crowdingSpacing: string;
    incisorInclination: string;
    overjetOverbite: string;
    midlines: string;
    molarCanine: string;
    bolton: string;
  };
  softTissue: {
    profile: string;
    lipCompetence: string;
    nasolabialAngle: string;
    chinContour: string;
  };
  growth: {
    stage: string;
    status: string;
    remainingGrowth: string;
    clinicalWindow: string;
  };
  space: {
    upperRequired: number;
    upperAvailable: number;
    upperDiscrepancy: number;
    upperInference: string;
    lowerRequired: number;
    lowerAvailable: number;
    lowerDiscrepancy: number;
    lowerInference: string;
  };
  crossChecks: CrossCheckFinding[];
  studentDiagnosisDraft: string;
  treatmentConsiderations: string[];
}

export function generateInference(caseData: CaseData): OrthoCaseAnalysisSummary {
  const maxCalc = calculateMaxillaryArch(caseData.maxillary);
  const mandCalc = calculateMandibularArch(caseData.mandibular);
  const tomeCalc = calculateTomeIndex(maxCalc.sumIncisors2to2, mandCalc.sumIncisors2to2);
  const boltonCalc = calculateBolton(maxCalc, mandCalc);
  const upperSpace = calculateSpaceArch(caseData.spaceAnalysis.upper);
  const lowerSpace = calculateSpaceArch(caseData.spaceAnalysis.lower);
  const witsCalc = calculateWits(caseData.wits.aoValue, caseData.wits.boValue, caseData.patient.sex);
  const tweedCalc = calculateTweed(caseData.tweed.fmpa, caseData.tweed.fmia, caseData.tweed.impa);
  const jarabakCalc = calculateJarabak(
    caseData.rakosiJarabak.saddleAngle,
    caseData.rakosiJarabak.articularAngle,
    caseData.rakosiJarabak.gonialAngle,
    caseData.rakosiJarabak.sGo,
    caseData.rakosiJarabak.nMe
  );
  const mcNamaraCalc = calculateMcNamara(caseData.mcnamara.effMaxillaryLength, caseData.mcnamara.effMandibularLength);

  // 1. SKELETAL SAGITTAL SYNTHESIS
  const sagittalIndicators: { name: string; indicates: 'Class I' | 'Class II' | 'Class III' }[] = [];
  
  // ANB
  const anb = typeof caseData.steiner.anb === 'number' ? caseData.steiner.anb : null;
  if (anb !== null) {
    if (anb > 4.0) sagittalIndicators.push({ name: `ANB (${anb}°)`, indicates: 'Class II' });
    else if (anb < 0.0) sagittalIndicators.push({ name: `ANB (${anb}°)`, indicates: 'Class III' });
    else sagittalIndicators.push({ name: `ANB (${anb}°)`, indicates: 'Class I' });
  }

  // Wits
  if (witsCalc.diff !== null) {
    const witsNorm = witsCalc.sexStandard;
    if (witsCalc.diff > witsNorm + 2) sagittalIndicators.push({ name: `Wits (${witsCalc.diff} mm)`, indicates: 'Class III' });
    else if (witsCalc.diff < witsNorm - 2) sagittalIndicators.push({ name: `Wits (${witsCalc.diff} mm)`, indicates: 'Class II' });
    else sagittalIndicators.push({ name: `Wits (${witsCalc.diff} mm)`, indicates: 'Class I' });
  }

  // Downs Angle of Convexity
  const convexity = typeof caseData.downs.angleOfConvexity === 'number' ? caseData.downs.angleOfConvexity : null;
  if (convexity !== null) {
    if (convexity > 5.0) sagittalIndicators.push({ name: `Angle of Convexity (${convexity}°)`, indicates: 'Class II' });
    else if (convexity < -5.0) sagittalIndicators.push({ name: `Angle of Convexity (${convexity}°)`, indicates: 'Class III' });
    else sagittalIndicators.push({ name: `Angle of Convexity (${convexity}°)`, indicates: 'Class I' });
  }

  // McNamara N-perp to Pog
  const nPerpPog = typeof caseData.mcnamara.nPerpToPog === 'number' ? caseData.mcnamara.nPerpToPog : null;
  if (nPerpPog !== null) {
    if (nPerpPog < -4.0) sagittalIndicators.push({ name: `N perp to Pog (${nPerpPog} mm)`, indicates: 'Class II' });
    else if (nPerpPog > 2.0) sagittalIndicators.push({ name: `N perp to Pog (${nPerpPog} mm)`, indicates: 'Class III' });
  }

  const class2Count = sagittalIndicators.filter(i => i.indicates === 'Class II').length;
  const class3Count = sagittalIndicators.filter(i => i.indicates === 'Class III').length;
  const class1Count = sagittalIndicators.filter(i => i.indicates === 'Class I').length;

  let skeletalSagittalSummary = 'Sagittal parameters within normative Class I range.';
  if (class2Count >= 2 || (class2Count > 0 && class3Count === 0 && class1Count <= 1)) {
    skeletalSagittalSummary = `Multiple sagittal parameters (${sagittalIndicators.filter(i => i.indicates === 'Class II').map(i => i.name).join(', ')}) suggest a skeletal Class II pattern/tendency. Correlate with clinical profile and cranial base anatomy.`;
  } else if (class3Count >= 2 || (class3Count > 0 && class2Count === 0 && class1Count <= 1)) {
    skeletalSagittalSummary = `Multiple sagittal parameters (${sagittalIndicators.filter(i => i.indicates === 'Class III').map(i => i.name).join(', ')}) suggest a skeletal Class III pattern/tendency. Correlate with mandibular length and maxillary position.`;
  } else if (sagittalIndicators.length > 0) {
    skeletalSagittalSummary = `Sagittal findings show balanced or mild transitional parameters (${sagittalIndicators.map(i => i.name).join(', ')}). Correlate with soft-tissue profile and dental occlusion.`;
  }

  // 2. SKELETAL VERTICAL SYNTHESIS
  const verticalIndicators: { name: string; indicates: 'Hyperdivergent' | 'Normodivergent' | 'Hypodivergent' }[] = [];
  
  // FMPA
  const fmpa = typeof caseData.tweed.fmpa === 'number' ? caseData.tweed.fmpa : (typeof caseData.downs.mandibularPlaneAngle === 'number' ? caseData.downs.mandibularPlaneAngle : null);
  if (fmpa !== null) {
    if (fmpa > 28) verticalIndicators.push({ name: `FMA/FMPA (${fmpa}°)`, indicates: 'Hyperdivergent' });
    else if (fmpa < 20) verticalIndicators.push({ name: `FMA/FMPA (${fmpa}°)`, indicates: 'Hypodivergent' });
    else verticalIndicators.push({ name: `FMA/FMPA (${fmpa}°)`, indicates: 'Normodivergent' });
  }

  // GoGn-SN
  const goGnSn = typeof caseData.steiner.goGnToSN === 'number' ? caseData.steiner.goGnToSN : null;
  if (goGnSn !== null) {
    if (goGnSn > 36) verticalIndicators.push({ name: `GoGn-SN (${goGnSn}°)`, indicates: 'Hyperdivergent' });
    else if (goGnSn < 28) verticalIndicators.push({ name: `GoGn-SN (${goGnSn}°)`, indicates: 'Hypodivergent' });
    else verticalIndicators.push({ name: `GoGn-SN (${goGnSn}°)`, indicates: 'Normodivergent' });
  }

  // Jarabak Ratio
  if (jarabakCalc.jarabakRatio !== null) {
    if (jarabakCalc.jarabakRatio < 62.0) verticalIndicators.push({ name: `Jarabak Ratio (${jarabakCalc.jarabakRatio}%)`, indicates: 'Hyperdivergent' });
    else if (jarabakCalc.jarabakRatio > 65.0) verticalIndicators.push({ name: `Jarabak Ratio (${jarabakCalc.jarabakRatio}%)`, indicates: 'Hypodivergent' });
    else verticalIndicators.push({ name: `Jarabak Ratio (${jarabakCalc.jarabakRatio}%)`, indicates: 'Normodivergent' });
  }

  // Jarabak Sum of Angles
  if (jarabakCalc.sumOfPosteriorAngles !== null) {
    if (jarabakCalc.sumOfPosteriorAngles > 402) verticalIndicators.push({ name: `Sum of Posterior Angles (${jarabakCalc.sumOfPosteriorAngles}°)`, indicates: 'Hyperdivergent' });
    else if (jarabakCalc.sumOfPosteriorAngles < 390) verticalIndicators.push({ name: `Sum of Posterior Angles (${jarabakCalc.sumOfPosteriorAngles}°)`, indicates: 'Hypodivergent' });
  }

  const hyperCount = verticalIndicators.filter(v => v.indicates === 'Hyperdivergent').length;
  const hypoCount = verticalIndicators.filter(v => v.indicates === 'Hypodivergent').length;

  let skeletalVerticalSummary = 'Vertical parameters are consistent with an average/normodivergent facial pattern.';
  if (hyperCount >= 2 || (hyperCount > 0 && hypoCount === 0)) {
    skeletalVerticalSummary = `Multiple parameters (${verticalIndicators.filter(v => v.indicates === 'Hyperdivergent').map(v => v.name).join(', ')}) indicate a high-angle / hyperdivergent / clockwise growth tendency. Caution advised with posterior extrusion mechanics.`;
  } else if (hypoCount >= 2 || (hypoCount > 0 && hyperCount === 0)) {
    skeletalVerticalSummary = `Multiple parameters (${verticalIndicators.filter(v => v.indicates === 'Hypodivergent').map(v => v.name).join(', ')}) indicate a low-angle / hypodivergent / counter-clockwise growth tendency. Favorable for deep-bite opening and anchor support.`;
  }

  // 3. TRANSVERSE SYNTHESIS
  const transverseRelation = caseData.modelOcclusion.transverseRelation;
  let transverseSummary = 'Transverse relationship appears harmonious in occlusion.';
  if (transverseRelation !== 'None') {
    transverseSummary = `Transverse discrepancy noted: ${transverseRelation}${caseData.modelOcclusion.crossbiteNotes ? ` (${caseData.modelOcclusion.crossbiteNotes})` : ''}. Correlate arch widths with Pont and Ashley Howe index findings.`;
  } else if (maxCalc.pontDiffPremolar !== null && maxCalc.pontDiffPremolar < -3.0) {
    transverseSummary = `Pont's index shows maxillary premolar arch width deficiency (${maxCalc.pontDiffPremolar} mm narrower than calculated ideal), suggesting arch narrowness without apparent frank crossbite.`;
  }

  // 4. DENTAL SYNTHESIS
  // Incisors
  const u1NA_deg = typeof caseData.steiner.u1ToNA_deg === 'number' ? caseData.steiner.u1ToNA_deg : null;
  const l1NB_deg = typeof caseData.steiner.l1ToNB_deg === 'number' ? caseData.steiner.l1ToNB_deg : null;
  const impa = typeof caseData.tweed.impa === 'number' ? caseData.tweed.impa : null;

  let incisorSummary = 'Incisor inclination within typical reference ranges.';
  const incisorNotes: string[] = [];
  if (u1NA_deg !== null) {
    if (u1NA_deg > 26) incisorNotes.push(`Upper incisors proclined (U1-NA: ${u1NA_deg}°)`);
    else if (u1NA_deg < 18) incisorNotes.push(`Upper incisors retroclined (U1-NA: ${u1NA_deg}°)`);
  }
  if (l1NB_deg !== null || impa !== null) {
    const lDeg = l1NB_deg ?? 0;
    const imVal = impa ?? 0;
    if (lDeg > 30 || imVal > 95) incisorNotes.push(`Lower incisors proclined (L1-NB: ${lDeg}°, IMPA: ${imVal}°)`);
    else if ((lDeg > 0 && lDeg < 20) || (imVal > 0 && imVal < 85)) incisorNotes.push(`Lower incisors retroclined (L1-NB: ${lDeg}°, IMPA: ${imVal}°)`);
  }
  if (incisorNotes.length > 0) incisorSummary = incisorNotes.join('; ') + '.';

  // Overjet & Overbite
  const oj = typeof caseData.modelOcclusion.overjet === 'number' ? caseData.modelOcclusion.overjet : null;
  const ob = typeof caseData.modelOcclusion.overbite === 'number' ? caseData.modelOcclusion.overbite : null;
  let ojObSummary = 'Overjet and overbite not fully specified.';
  if (oj !== null && ob !== null) {
    ojObSummary = `Overjet: ${oj} mm (${oj > 3.5 ? 'increased / excessive' : oj < 1 ? 'reduced / anterior edge-to-edge/crossbite' : 'normal'}). Overbite: ${ob} mm or % (${ob > 3.5 ? 'increased / deep bite' : ob < 1 ? 'reduced / open bite tendency' : 'normal'}).`;
  }

  // Midlines
  const upMid = caseData.modelOcclusion.upperMidline;
  const lowMid = caseData.modelOcclusion.lowerMidline;
  const upDir = caseData.modelOcclusion.upperMidlineDirection;
  const lowDir = caseData.modelOcclusion.lowerMidlineDirection;
  let midlineSummary = 'Midlines coincident with facial and dental references.';
  if (upDir !== 'Coincident' || lowDir !== 'Coincident' || (typeof upMid === 'number' && upMid > 0) || (typeof lowMid === 'number' && lowMid > 0)) {
    midlineSummary = `Upper midline: ${upDir} (${typeof upMid === 'number' ? upMid : 0} mm). Lower midline: ${lowDir} (${typeof lowMid === 'number' ? lowMid : 0} mm). Midline discrepancy present.`;
  }

  // Bolton
  let boltonSummary = 'Tooth widths insufficient to calculate complete Bolton ratio.';
  if (boltonCalc.overallRatio !== null) {
    if (boltonCalc.overallRatio < 89.5) {
      boltonSummary = `Bolton overall ratio is ${boltonCalc.overallRatio}% (reference: 91.3%), suggesting maxillary tooth material excess.`;
    } else if (boltonCalc.overallRatio > 93.0) {
      boltonSummary = `Bolton overall ratio is ${boltonCalc.overallRatio}% (reference: 91.3%), suggesting mandibular tooth material excess.`;
    } else {
      boltonSummary = `Bolton overall ratio is ${boltonCalc.overallRatio}% (within normal balanced harmony range around 91.3%).`;
    }

    if (boltonCalc.anteriorRatio !== null) {
      if (boltonCalc.anteriorRatio < 75.5) {
        boltonSummary += ` Anterior ratio is ${boltonCalc.anteriorRatio}% (reference: 77.2%), confirming maxillary anterior tooth material excess.`;
      } else if (boltonCalc.anteriorRatio > 79.0) {
        boltonSummary += ` Anterior ratio is ${boltonCalc.anteriorRatio}% (reference: 77.2%), confirming mandibular anterior tooth material excess.`;
      } else {
        boltonSummary += ` Anterior ratio is ${boltonCalc.anteriorRatio}% (balanced anterior ratio around 77.2%).`;
      }
    }
  }

  // 5. SOFT TISSUE SYNTHESIS
  const nasolabial = typeof caseData.softTissue.nasolabialAngle === 'number' ? caseData.softTissue.nasolabialAngle : null;
  const eUpper = typeof caseData.softTissue.eLineUpperLip === 'number' ? caseData.softTissue.eLineUpperLip : null;
  const eLower = typeof caseData.softTissue.eLineLowerLip === 'number' ? caseData.softTissue.eLineLowerLip : null;
  const merrifieldZ = typeof caseData.softTissue.merrifieldZAngle === 'number' ? caseData.softTissue.merrifieldZAngle : null;

  let profileSummary = 'Soft tissue profile assessment pending measurements.';
  const stNotes: string[] = [];
  if (nasolabial !== null) {
    if (nasolabial < 90) stNotes.push(`Acute nasolabial angle (${nasolabial}°), suggesting upper lip fullness or proclination`);
    else if (nasolabial > 112) stNotes.push(`Obtuse nasolabial angle (${nasolabial}°), caution with retracting maxillary incisors`);
    else stNotes.push(`Normative nasolabial angle (${nasolabial}°)`);
  }
  if (eLower !== null) {
    if (eLower > 1.0) stNotes.push(`Lower lip prominent relative to E-line (${eLower} mm)`);
    else if (eLower < -3.0) stNotes.push(`Lower lip retrusive relative to E-line (${eLower} mm)`);
    else stNotes.push(`Lower lip balanced to E-line (${eLower} mm)`);
  }
  if (merrifieldZ !== null) {
    if (merrifieldZ < 74) stNotes.push(`Merrifield Z angle (${merrifieldZ}°) suggests lip protrusion`);
  }
  if (stNotes.length > 0) profileSummary = stNotes.join('; ') + '.';

  // 6. CVM GROWTH SYNTHESIS
  const cvmStage = caseData.cvmStage;
  const cvmInfo = cvmStage && cvmStage >= 1 && cvmStage <= 6 ? CVM_STAGES_INFO[cvmStage as 1 | 2 | 3 | 4 | 5 | 6] : null;
  const growthSynthesis = cvmInfo
    ? {
        stage: cvmInfo.name,
        status: cvmInfo.growthStatus,
        remainingGrowth: cvmInfo.remainingGrowth,
        clinicalWindow: cvmInfo.clinicalCorrelation
      }
    : {
        stage: 'Not recorded / Pending evaluation',
        status: 'Assess lateral cephalogram for C2-C4 cervical vertebral maturation morphology.',
        remainingGrowth: 'Educational estimate; clinical correlation required.',
        clinicalWindow: 'Correlate with chronologic age, hand-wrist if available, and secondary sexual characteristics.'
      };

  // 7. CROSS-CHECK SYSTEM FINDINGS
  const crossChecks: CrossCheckFinding[] = [];

  // Sagittal cross check
  if (class2Count >= 2) {
    crossChecks.push({
      domain: 'Skeletal Sagittal',
      type: 'consistent',
      summary: 'Multiple sagittal parameters concordantly indicate a skeletal Class II relationship.',
      parametersInvolved: sagittalIndicators.filter(i => i.indicates === 'Class II').map(i => i.name),
      clinicalImplication: 'Consistent with mandibular retrognathia or maxillary sagittal excess; evaluate whether functional orthopedics or dental camouflage is suited to the patient’s growth status.'
    });
  } else if (class3Count >= 2) {
    crossChecks.push({
      domain: 'Skeletal Sagittal',
      type: 'consistent',
      summary: 'Multiple sagittal parameters concordantly indicate a skeletal Class III relationship.',
      parametersInvolved: sagittalIndicators.filter(i => i.indicates === 'Class III').map(i => i.name),
      clinicalImplication: 'Consistent with maxillary retrognathia or mandibular prognathism; correlate with family history and growth pattern.'
    });
  } else if (class2Count > 0 && class3Count > 0) {
    crossChecks.push({
      domain: 'Skeletal Sagittal',
      type: 'discrepant',
      summary: 'Mixed sagittal indicators detected between cranial base and occlusal plane references.',
      parametersInvolved: sagittalIndicators.map(i => i.name),
      clinicalImplication: 'Discrepancy may arise from nasion position, steep occlusal plane cant, or cranial base angle variations. Cross-reference Wits with ANB.'
    });
  }

  // Vertical cross check
  if (hyperCount >= 2) {
    crossChecks.push({
      domain: 'Skeletal Vertical',
      type: 'consistent',
      summary: 'Multiple parameters concordantly indicate a hyperdivergent / high mandibular plane angle pattern.',
      parametersInvolved: verticalIndicators.filter(v => v.indicates === 'Hyperdivergent').map(v => v.name),
      clinicalImplication: 'Increased anterior facial height tendency; mechanics should preserve vertical control and avoid molar extrusion.'
    });
  } else if (hypoCount >= 2) {
    crossChecks.push({
      domain: 'Skeletal Vertical',
      type: 'consistent',
      summary: 'Multiple parameters concordantly indicate a hypodivergent / low mandibular plane angle pattern.',
      parametersInvolved: verticalIndicators.filter(v => v.indicates === 'Hypodivergent').map(v => v.name),
      clinicalImplication: 'Strong musculature and horizontal growth vector; favorable for space closure and deep bite correction by posterior extrusion.'
    });
  }

  // Bolton vs Clinical Overjet Cross Check
  if (boltonCalc.overallRatio !== null && boltonCalc.overallRatio < 89.5 && oj !== null && oj > 4.0) {
    crossChecks.push({
      domain: 'Dental / Bolton',
      type: 'observation',
      summary: 'Maxillary tooth material excess coincides with increased clinical overjet.',
      parametersInvolved: [`Bolton Overall Ratio (${boltonCalc.overallRatio}%)`, `Overjet (${oj} mm)`],
      clinicalImplication: 'A portion of the increased clinical overjet is attributable to tooth size discrepancy; full overjet normalization will require interproximal reduction (IPR) or space redistribution.'
    });
  } else if (boltonCalc.overallRatio !== null && boltonCalc.overallRatio > 93.0 && oj !== null && oj < 2.0) {
    crossChecks.push({
      domain: 'Dental / Bolton',
      type: 'observation',
      summary: 'Mandibular tooth material excess coincides with reduced clinical overjet / edge-to-edge tendency.',
      parametersInvolved: [`Bolton Overall Ratio (${boltonCalc.overallRatio}%)`, `Overjet (${oj} mm)`],
      clinicalImplication: 'Relative mandibular tooth material excess may prevent Class I canine seating without lower arch stripping or upper spacing.'
    });
  }

  // Transverse cross check
  if (maxCalc.pontDiffPremolar !== null && maxCalc.pontDiffPremolar < -3.0 && maxCalc.ashleyHowePMBAWPercent !== null && maxCalc.ashleyHowePMBAWPercent < 37.0) {
    crossChecks.push({
      domain: 'Transverse Arch',
      type: 'consistent',
      summary: 'Pont’s index and Ashley Howe’s index concordantly indicate maxillary arch width deficiency and basal bone insufficiency.',
      parametersInvolved: [`Pont PM diff (${maxCalc.pontDiffPremolar} mm)`, `Ashley Howe PMBAW (${maxCalc.ashleyHowePMBAWPercent}%)`],
      clinicalImplication: 'Basal arch width is constricted relative to tooth mass; orthopedic or surgical maxillary skeletal expansion may be needed if dental expansion would cause tipping outside the cortical plate.'
    });
  }

  // Growth timing cross check
  if (cvmStage === 3 && class2Count >= 1) {
    crossChecks.push({
      domain: 'Growth Timing',
      type: 'consistent',
      summary: 'CVM Stage 3 (Transition) aligns with peak mandibular adolescent growth opportunity.',
      parametersInvolved: ['CVM Stage 3', 'Skeletal Class II tendency'],
      clinicalImplication: 'Optimal orthopedic timing for functional appliance treatment (e.g., Twin Block, Forsus, MARA) to correct mandibular skeletal retrusion before growth ceases.'
    });
  }

  // 8. STUDENT DIAGNOSIS DRAFT
  const studentDiagnosisDraft = caseData.studentDiagnosisDraftOverride || 
    `A ${caseData.patient.age || 'adolescent'}-year-old ${caseData.patient.sex.toLowerCase()} patient presenting with ${caseData.patient.chiefComplaint || 'malocclusion'}. ` +
    `Skeletally: ${skeletalSagittalSummary.replace(/\. Correlate with.*/, '')}, with ${skeletalVerticalSummary.toLowerCase().replace(/\. Caution.*/, '').replace(/\. Favorable.*/, '')}. ` +
    `Dentally: ${caseData.modelOcclusion.rightMolar} molar relationship on right and ${caseData.modelOcclusion.leftMolar} on left; canine relations are ${caseData.modelOcclusion.rightCanine} (R) and ${caseData.modelOcclusion.leftCanine} (L). ` +
    `Overjet is ${oj !== null ? `${oj} mm` : 'recorded'} and overbite is ${ob !== null ? `${ob} mm/%` : 'recorded'}. ` +
    `Space analysis indicates an upper arch discrepancy of ${upperSpace.discrepancy >= 0 ? `+${upperSpace.discrepancy}` : upperSpace.discrepancy} mm and lower arch discrepancy of ${lowerSpace.discrepancy >= 0 ? `+${lowerSpace.discrepancy}` : lowerSpace.discrepancy} mm. ` +
    `Soft-tissue profile: ${profileSummary}. Growth status: ${growthSynthesis.stage} (${growthSynthesis.status}).`;

  // 9. TREATMENT CONSIDERATIONS
  const treatmentConsiderations: string[] = [];
  if (cvmStage === 3 || cvmStage === 2) {
    treatmentConsiderations.push('Favorable adolescent growth window present: evaluate candidate status for functional or orthopedic skeletal modification.');
  } else if (cvmStage >= 5) {
    treatmentConsiderations.push('Adolescent growth has mostly concluded: treatment must rely on orthodontic tooth movement (camouflage) or orthognathic surgical planning if skeletal discrepancy is severe.');
  }

  if (lowerSpace.discrepancy < -4.0) {
    treatmentConsiderations.push(`Significant lower arch space deficit (${lowerSpace.discrepancy} mm): consider evaluation of therapeutic extraction, proximal enamel reduction, or arch expansion depending on soft-tissue profile and cortical limits.`);
  } else if (lowerSpace.discrepancy < 0) {
    treatmentConsiderations.push(`Mild lower arch space deficit (${lowerSpace.discrepancy} mm): non-extraction space gaining strategies (IPR, derotation, mild expansion) may be considered.`);
  } else {
    treatmentConsiderations.push('No severe lower arch space deficiency detected: focus on alignment, leveling, and arch coordination.');
  }

  if (boltonCalc.overallRatio !== null && Math.abs(boltonCalc.overallDiff || 0) > 1.5) {
    treatmentConsiderations.push(`Tooth-size discrepancy (${boltonCalc.overallRatio}% vs 91.3%): plan for diagnostic wax-up and interproximal reduction (IPR) to achieve ideal Class I canine seating and finish.`);
  }

  if (transverseRelation !== 'None' || (maxCalc.pontDiffPremolar !== null && maxCalc.pontDiffPremolar < -3.0)) {
    treatmentConsiderations.push('Transverse coordination recommended prior to or concurrent with sagittal correction (evaluate RPE / MARPE / slow maxillary expansion).');
  }

  return {
    skeletal: {
      sagittal: skeletalSagittalSummary,
      vertical: skeletalVerticalSummary,
      transverse: transverseSummary
    },
    dental: {
      crowdingSpacing: `Upper space discrepancy: ${upperSpace.discrepancy >= 0 ? `+${upperSpace.discrepancy}` : upperSpace.discrepancy} mm. Lower space discrepancy: ${lowerSpace.discrepancy >= 0 ? `+${lowerSpace.discrepancy}` : lowerSpace.discrepancy} mm.`,
      incisorInclination: incisorSummary,
      overjetOverbite: ojObSummary,
      midlines: midlineSummary,
      molarCanine: `Molar: R-${caseData.modelOcclusion.rightMolar}, L-${caseData.modelOcclusion.leftMolar}. Canine: R-${caseData.modelOcclusion.rightCanine}, L-${caseData.modelOcclusion.leftCanine}.`,
      bolton: boltonSummary
    },
    softTissue: {
      profile: profileSummary,
      lipCompetence: caseData.softTissue.merrifieldZAngle ? `Merrifield Z: ${caseData.softTissue.merrifieldZAngle}°` : 'Lip competence to be assessed clinically.',
      nasolabialAngle: nasolabial !== null ? `${nasolabial}° (reference: 90°–110°)` : 'Not recorded',
      chinContour: caseData.softTissue.chinProminence ? `Chin prominence: ${caseData.softTissue.chinProminence} mm` : 'Soft tissue chin contour within evaluation.'
    },
    growth: growthSynthesis,
    space: {
      upperRequired: upperSpace.spaceRequired,
      upperAvailable: upperSpace.spaceAvailable,
      upperDiscrepancy: upperSpace.discrepancy,
      upperInference: upperSpace.discrepancy < 0 ? `Space deficit of ${Math.abs(upperSpace.discrepancy)} mm` : upperSpace.discrepancy > 0 ? `Space surplus of ${upperSpace.discrepancy} mm` : 'Arch space in equilibrium',
      lowerRequired: lowerSpace.spaceRequired,
      lowerAvailable: lowerSpace.spaceAvailable,
      lowerDiscrepancy: lowerSpace.discrepancy,
      lowerInference: lowerSpace.discrepancy < 0 ? `Space deficit of ${Math.abs(lowerSpace.discrepancy)} mm` : lowerSpace.discrepancy > 0 ? `Space surplus of ${lowerSpace.discrepancy} mm` : 'Arch space in equilibrium'
    },
    crossChecks,
    studentDiagnosisDraft,
    treatmentConsiderations
  };
}
