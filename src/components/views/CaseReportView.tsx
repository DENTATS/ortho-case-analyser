import React from 'react';
import { CaseData } from '../../types/ortho';
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
} from '../../utils/orthoCalculations';
import { generateInference } from '../../utils/orthoInference';
import { TEXTBOOK_CITATIONS } from '../../data/orthoReferences';
import { Printer, Download, Share2, FileCheck, Shield } from 'lucide-react';

interface CaseReportViewProps {
  caseData: CaseData;
  onExportJson: () => void;
}

export const CaseReportView: React.FC<CaseReportViewProps> = ({ caseData, onExportJson }) => {
  const maxCalc = calculateMaxillaryArch(caseData.maxillary);
  const mandCalc = calculateMandibularArch(caseData.mandibular);
  const boltonCalc = calculateBolton(maxCalc, mandCalc);
  const tomeCalc = calculateTomeIndex(maxCalc.sumIncisors2to2, mandCalc.sumIncisors2to2);
  const upperSpace = calculateSpaceArch(caseData.spaceAnalysis.upper);
  const lowerSpace = calculateSpaceArch(caseData.spaceAnalysis.lower);
  const witsCalc = calculateWits(caseData.wits.aoValue, caseData.wits.boValue, caseData.patient.sex);
  const tweedCalc = calculateTweed(caseData.tweed.fmpa, caseData.tweed.fmia, caseData.tweed.impa);
  const mcNamaraCalc = calculateMcNamara(caseData.mcnamara.effMaxillaryLength, caseData.mcnamara.effMandibularLength);
  const jarabakCalc = calculateJarabak(
    caseData.rakosiJarabak.saddleAngle,
    caseData.rakosiJarabak.articularAngle,
    caseData.rakosiJarabak.gonialAngle,
    caseData.rakosiJarabak.sGo,
    caseData.rakosiJarabak.nMe
  );
  const inference = generateInference(caseData);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs print:hidden">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Case Analysis Report Ready</h3>
          <p className="text-xs text-slate-500">Comprehensive educational report formatted for review, case presentation, and portfolio documentation.</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={onExportJson}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export Case (.json)
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* PRINTABLE REPORT SHEET */}
      <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0 space-y-8 text-slate-800">
        {/* Institutional Header */}
        <div className="border-b-2 border-slate-900 pb-5 text-center">
          <div className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-1">
            Department of Orthodontics & Dentofacial Orthopedics
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            Orthodontic Postgraduate Case Analysis Report
          </h1>
          <div className="text-xs text-slate-600 mt-1 flex items-center justify-center gap-4">
            <span>MDS Curriculum Case Analysis Format</span>
            <span>•</span>
            <span>Case ID: <strong className="font-mono text-slate-900">{caseData.patient.id}</strong></span>
            <span>•</span>
            <span>Date: <strong>{caseData.patient.date}</strong></span>
          </div>
        </div>

        {/* Clinical Disclaimer Box */}
        <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg text-[11px] text-slate-600 flex items-start gap-2">
          <Shield className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <strong>Educational Diagnostic Tool Notice:</strong> This report is compiled by the Ortho Case Analyzer for MDS academic evaluation and diagnostic case discussion. It does not replace clinical orthodontic judgment. Final diagnosis and treatment plan remain the sole responsibility of the treating orthodontist.
          </div>
        </div>

        {/* 1. PATIENT DEMOGRAPHICS & HISTORY */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            1. Patient Demographics & Medical History
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
            <div><span className="text-slate-500">Name:</span> <strong className="text-slate-900">{caseData.patient.name || 'Anonymous (Optional)'}</strong></div>
            <div><span className="text-slate-500">Age:</span> <strong className="text-slate-900">{caseData.patient.age || '—'} yrs</strong></div>
            <div><span className="text-slate-500">Sex:</span> <strong className="text-slate-900">{caseData.patient.sex}</strong></div>
            <div><span className="text-slate-500">Growth Status:</span> <strong className="text-slate-900">{caseData.patient.growthStatus || 'Adolescent'}</strong></div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50/60 p-3 rounded-lg border border-slate-200">
            <div><strong>Chief Complaint:</strong> {caseData.patient.chiefComplaint || 'Not recorded'}</div>
            {caseData.patient.historyOfPresentIllness && <div><strong>History of Present Illness:</strong> {caseData.patient.historyOfPresentIllness}</div>}
            <div><strong>Medical History:</strong> {caseData.patient.medicalHistory}</div>
            <div><strong>Dental History:</strong> {caseData.patient.dentalHistory}</div>
            {caseData.patient.oralHabits && <div><strong>Oral Habits:</strong> {caseData.patient.oralHabits}</div>}
          </div>
        </section>

        {/* 2. CLINICAL & MODEL OCCLUSION */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            2. Clinical & Model Analysis
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Right Molar</span>
              <strong className="text-slate-900">{caseData.modelOcclusion.rightMolar}</strong>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Left Molar</span>
              <strong className="text-slate-900">{caseData.modelOcclusion.leftMolar}</strong>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Right Canine</span>
              <strong className="text-slate-900">{caseData.modelOcclusion.rightCanine}</strong>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Left Canine</span>
              <strong className="text-slate-900">{caseData.modelOcclusion.leftCanine}</strong>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs mb-3">
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Overjet:</span>
              <strong className="text-slate-900 text-sm">{caseData.modelOcclusion.overjet} mm</strong>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Overbite:</span>
              <strong className="text-slate-900 text-sm">{caseData.modelOcclusion.overbite} mm / %</strong>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Transverse:</span>
              <strong className="text-slate-900 text-sm">{caseData.modelOcclusion.transverseRelation}</strong>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs">
            <strong>Midline Status:</strong> Upper: {caseData.modelOcclusion.upperMidlineDirection} ({caseData.modelOcclusion.upperMidline || 0} mm); Lower: {caseData.modelOcclusion.lowerMidlineDirection} ({caseData.modelOcclusion.lowerMidline || 0} mm).
          </div>
        </section>

        {/* 3. ARCH INDICES & TOOTH MATERIAL */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            3. Arch Indices & Interarch Bolton Analysis
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-4">
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Maxillary Tooth Material (6–6):</span>
              <strong className="text-slate-900">{maxCalc.toothMaterial6to6} mm</strong>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Mandibular Tooth Material (6–6):</span>
              <strong className="text-slate-900">{mandCalc.toothMaterial6to6} mm</strong>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Curve of Spee Depth:</span>
              <strong className="text-slate-900">{mandCalc.curveOfSpeeDepth !== null ? `${mandCalc.curveOfSpeeDepth} mm` : '—'}</strong>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Nance & Carey Discrepancy:</span>
              <strong className="text-slate-900">{mandCalc.nanceCareyDiff !== null ? `${mandCalc.nanceCareyDiff} mm` : '—'}</strong>
            </div>
          </div>

          <div className="overflow-x-auto mb-3">
            <table className="w-full text-xs text-left border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-1.5">Arch Width Index</th>
                  <th className="px-3 py-1.5 text-center">Actual Value</th>
                  <th className="px-3 py-1.5 text-center">Calculated Index</th>
                  <th className="px-3 py-1.5 text-center">Difference</th>
                  <th className="px-3 py-1.5">Educational Inference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-3 py-1.5 font-medium">Pont's Premolar Index</td>
                  <td className="px-3 py-1.5 text-center font-mono">{caseData.maxillary.pontActualPremolar || '—'} mm</td>
                  <td className="px-3 py-1.5 text-center font-mono">{maxCalc.pontCalculatedPremolar || '—'} mm</td>
                  <td className="px-3 py-1.5 text-center font-mono">{maxCalc.pontDiffPremolar !== null ? `${maxCalc.pontDiffPremolar} mm` : '—'}</td>
                  <td className="px-3 py-1.5 text-[11px] text-slate-600">{maxCalc.pontDiffPremolar !== null ? (maxCalc.pontDiffPremolar < 0 ? 'Arch constriction' : 'Broad arch') : '—'}</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 font-medium">Pont's Molar Index</td>
                  <td className="px-3 py-1.5 text-center font-mono">{caseData.maxillary.pontActualMolar || '—'} mm</td>
                  <td className="px-3 py-1.5 text-center font-mono">{maxCalc.pontCalculatedMolar || '—'} mm</td>
                  <td className="px-3 py-1.5 text-center font-mono">{maxCalc.pontDiffMolar !== null ? `${maxCalc.pontDiffMolar} mm` : '—'}</td>
                  <td className="px-3 py-1.5 text-[11px] text-slate-600">{maxCalc.pontDiffMolar !== null ? (maxCalc.pontDiffMolar < 0 ? 'Arch constriction' : 'Broad arch') : '—'}</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 font-medium">Ashley Howe's (PMBAW%)</td>
                  <td className="px-3 py-1.5 text-center font-mono">PMBAW: {caseData.maxillary.ashleyHowePMBAW || '—'} mm</td>
                  <td className="px-3 py-1.5 text-center font-mono">Norm: &gt; 37%</td>
                  <td className="px-3 py-1.5 text-center font-mono">{maxCalc.ashleyHowePMBAWPercent !== null ? `${maxCalc.ashleyHowePMBAWPercent}%` : '—'}</td>
                  <td className="px-3 py-1.5 text-[11px] text-slate-600">{maxCalc.ashleyHowePMBAWPercent !== null ? (maxCalc.ashleyHowePMBAWPercent < 37 ? 'Basal arch deficiency' : 'Adequate basal bone') : '—'}</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 font-medium">Bolton Overall Ratio</td>
                  <td className="px-3 py-1.5 text-center font-mono">{boltonCalc.overallRatio !== null ? `${boltonCalc.overallRatio}%` : '—'}</td>
                  <td className="px-3 py-1.5 text-center font-mono">Norm: 91.3%</td>
                  <td className="px-3 py-1.5 text-center font-mono">{boltonCalc.overallDiff !== null ? `${boltonCalc.overallDiff}%` : '—'}</td>
                  <td className="px-3 py-1.5 text-[11px] text-slate-600">{boltonCalc.overallDiff !== null ? (boltonCalc.overallDiff < 0 ? 'Maxillary tooth excess' : 'Mandibular tooth excess') : '—'}</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 font-medium">Bolton Anterior Ratio</td>
                  <td className="px-3 py-1.5 text-center font-mono">{boltonCalc.anteriorRatio !== null ? `${boltonCalc.anteriorRatio}%` : '—'}</td>
                  <td className="px-3 py-1.5 text-center font-mono">Norm: 77.2%</td>
                  <td className="px-3 py-1.5 text-center font-mono">{boltonCalc.anteriorDiff !== null ? `${boltonCalc.anteriorDiff}%` : '—'}</td>
                  <td className="px-3 py-1.5 text-[11px] text-slate-600">{boltonCalc.anteriorDiff !== null ? (boltonCalc.anteriorDiff < 0 ? 'Maxillary anterior excess' : 'Mandibular anterior excess') : '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. TOTAL ARCH SPACE ANALYSIS */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            4. Total Arch Space Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">Maxillary Arch Space:</div>
              <div>Space Required: <strong>{upperSpace.spaceRequired} mm</strong></div>
              <div>Space Available: <strong>{upperSpace.spaceAvailable} mm</strong></div>
              <div className="mt-1 pt-1 border-t border-slate-200 font-bold">
                Net Discrepancy: {upperSpace.discrepancy >= 0 ? `+${upperSpace.discrepancy}` : upperSpace.discrepancy} mm
                <span className="font-normal text-slate-600 ml-1">({upperSpace.discrepancy < 0 ? 'Deficit' : 'Surplus'})</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">Mandibular Arch Space:</div>
              <div>Space Required: <strong>{lowerSpace.spaceRequired} mm</strong></div>
              <div>Space Available: <strong>{lowerSpace.spaceAvailable} mm</strong></div>
              <div className="mt-1 pt-1 border-t border-slate-200 font-bold">
                Net Discrepancy: {lowerSpace.discrepancy >= 0 ? `+${lowerSpace.discrepancy}` : lowerSpace.discrepancy} mm
                <span className="font-normal text-slate-600 ml-1">({lowerSpace.discrepancy < 0 ? 'Deficit' : 'Surplus'})</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. RADIOGRAPHIC CVM MATURATION */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            5. Biological Maturity & CVM Growth Status
          </h2>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
            <div><strong>CVM Stage:</strong> {inference.growth.stage}</div>
            <div><strong>Mandibular Peak Status:</strong> {inference.growth.status}</div>
            <div><strong>Remaining Adolescent Growth:</strong> {inference.growth.remainingGrowth}</div>
            <div><strong>Clinical Timing:</strong> {inference.growth.clinicalWindow}</div>
          </div>
        </section>

        {/* 6. KEY CEPHALOMETRIC FINDINGS TABLE */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            6. Key Cephalometric Findings Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-2 border border-slate-200 rounded">SNA: <strong>{caseData.steiner.sna || '—'}°</strong> (Norm 82°)</div>
            <div className="p-2 border border-slate-200 rounded">SNB: <strong>{caseData.steiner.snb || '—'}°</strong> (Norm 80°)</div>
            <div className="p-2 border border-slate-200 rounded">ANB: <strong>{caseData.steiner.anb || '—'}°</strong> (Norm 2°)</div>
            <div className="p-2 border border-slate-200 rounded">Wits (BO-AO): <strong>{witsCalc.diff !== null ? `${witsCalc.diff} mm` : '—'}</strong></div>
            <div className="p-2 border border-slate-200 rounded">FMPA: <strong>{caseData.tweed.fmpa || '—'}°</strong> (Norm 25°)</div>
            <div className="p-2 border border-slate-200 rounded">IMPA: <strong>{caseData.tweed.impa || '—'}°</strong> (Norm 90°)</div>
            <div className="p-2 border border-slate-200 rounded">U1 to NA (deg): <strong>{caseData.steiner.u1ToNA_deg || '—'}°</strong> (Norm 22°)</div>
            <div className="p-2 border border-slate-200 rounded">L1 to NB (deg): <strong>{caseData.steiner.l1ToNB_deg || '—'}°</strong> (Norm 25°)</div>
          </div>
        </section>

        {/* 7. CROSS-CHECKS & SYNTHESIS */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            7. Orthodontic Cross-Check Diagnostic Synthesis
          </h2>
          <div className="space-y-2 text-xs">
            {inference.crossChecks.map((cc, i) => (
              <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <strong>{cc.domain}:</strong> {cc.summary} ({cc.clinicalImplication})
              </div>
            ))}
          </div>
        </section>

        {/* 8. STUDENT DIAGNOSIS DRAFT */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            8. Final Case Diagnosis – Student Working Draft
          </h2>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 text-xs leading-relaxed text-slate-900 font-serif">
            {caseData.studentDiagnosisDraftOverride || inference.studentDiagnosisDraft}
          </div>
        </section>

        {/* 9. REFERENCES */}
        <section className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
          <div className="font-bold uppercase tracking-wider text-slate-700">Academic Textbook References:</div>
          <div>1. Fields H, Larson B, Sarver DM, Proffit WR. <em>Contemporary Orthodontics</em>. 7th ed. Elsevier; 2025.</div>
          <div>2. Graber LW, Vig KWL, Huang GJ, Fleming PS. <em>Orthodontics: Current Principles and Techniques</em>. 7th ed. Elsevier; 2022.</div>
          <div>3. Institutional Post-Graduate Case History Format Standard Specifications.</div>
        </section>

        {/* Signature Line for Academic Review */}
        <div className="pt-8 grid grid-cols-2 gap-8 text-xs text-slate-700">
          <div className="border-t border-slate-400 pt-2 text-center">
            <strong>Signature of MDS Student</strong>
          </div>
          <div className="border-t border-slate-400 pt-2 text-center">
            <strong>Signature of Supervising Faculty / Professor</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
