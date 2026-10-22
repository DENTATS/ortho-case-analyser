import React, { useState } from 'react';
import {
  DownsAnalysisData,
  SteinerAnalysisData,
  WitsAnalysisData,
  TweedAnalysisData,
  McNamaraAnalysisData,
  RakosiJarabakAnalysisData,
  RickettsAnalysisData,
  BurstoneHardAnalysisData,
  Sex
} from '../../types/ortho';
import {
  calculateWits,
  calculateTweed,
  calculateMcNamara,
  calculateJarabak
} from '../../utils/orthoCalculations';
import { CEPH_REFERENCES, BURSTONE_HARD_NORMS } from '../../data/orthoReferences';
import { Ruler, Info, HelpCircle, UserCheck } from 'lucide-react';

interface CephalometricsViewProps {
  downs: DownsAnalysisData;
  steiner: SteinerAnalysisData;
  wits: WitsAnalysisData;
  tweed: TweedAnalysisData;
  mcnamara: McNamaraAnalysisData;
  rakosiJarabak: RakosiJarabakAnalysisData;
  ricketts: RickettsAnalysisData;
  burstoneHard: BurstoneHardAnalysisData;
  patientSex: Sex;
  onChangeDowns: (data: DownsAnalysisData) => void;
  onChangeSteiner: (data: SteinerAnalysisData) => void;
  onChangeWits: (data: WitsAnalysisData) => void;
  onChangeTweed: (data: TweedAnalysisData) => void;
  onChangeMcNamara: (data: McNamaraAnalysisData) => void;
  onChangeJarabak: (data: RakosiJarabakAnalysisData) => void;
  onChangeRicketts: (data: RickettsAnalysisData) => void;
  onChangeBurstoneHard: (data: BurstoneHardAnalysisData) => void;
  isLearningMode: boolean;
  onOpenFormula: (paramId: string) => void;
}

type CephTab = 'downs' | 'steiner' | 'wits' | 'tweed' | 'mcnamara' | 'jarabak' | 'ricketts' | 'burstone';

export const CephalometricsView: React.FC<CephalometricsViewProps> = ({
  downs,
  steiner,
  wits,
  tweed,
  mcnamara,
  rakosiJarabak,
  ricketts,
  burstoneHard,
  patientSex,
  onChangeDowns,
  onChangeSteiner,
  onChangeWits,
  onChangeTweed,
  onChangeMcNamara,
  onChangeJarabak,
  onChangeRicketts,
  onChangeBurstoneHard,
  isLearningMode,
  onOpenFormula
}) => {
  const [activeTab, setActiveTab] = useState<CephTab>('downs');
  const [burstoneSex, setBurstoneSex] = useState<Sex>(patientSex);

  // Derived calculations
  const witsCalc = calculateWits(wits.aoValue, wits.boValue, patientSex);
  const tweedCalc = calculateTweed(tweed.fmpa, tweed.fmia, tweed.impa);
  const mcNamaraCalc = calculateMcNamara(mcnamara.effMaxillaryLength, mcnamara.effMandibularLength);
  const jarabakCalc = calculateJarabak(
    rakosiJarabak.saddleAngle,
    rakosiJarabak.articularAngle,
    rakosiJarabak.gonialAngle,
    rakosiJarabak.sGo,
    rakosiJarabak.nMe
  );

  // Helper row renderer for standard ceph parameters
  const renderParamRow = (
    paramKey: string,
    refId: string,
    currentValue: number | '',
    onValueChange: (val: number | '') => void,
    customDiff?: number | null,
    customInference?: string
  ) => {
    const ref = CEPH_REFERENCES[refId];
    if (!ref) return null;

    const val = typeof currentValue === 'number' ? currentValue : null;
    const meanNum = typeof ref.mean === 'number' ? ref.mean : null;
    const diff = customDiff !== undefined ? customDiff : (val !== null && meanNum !== null ? Number((val - meanNum).toFixed(1)) : null);

    return (
      <tr key={paramKey} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 text-xs">
        <td className="px-3 py-2.5 font-medium text-slate-900">
          <div className="flex items-center gap-1.5">
            <span>{ref.name}</span>
            <button
              onClick={() => onOpenFormula(refId)}
              title="View formula & educational standard"
              className="text-slate-400 hover:text-blue-600 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          {isLearningMode && (
            <div className="text-[11px] text-slate-500 font-normal mt-0.5 max-w-sm">
              {ref.whatIsIt}
            </div>
          )}
        </td>

        <td className="px-3 py-2.5 text-center">
          <div className="flex items-center justify-center gap-1">
            <input
              type="number"
              step="0.5"
              value={currentValue}
              onChange={(e) => onValueChange(e.target.value === '' ? '' : parseFloat(e.target.value))}
              className="w-20 px-2 py-1 bg-white border border-slate-200 rounded font-semibold text-center focus:ring-2 focus:ring-blue-500"
              placeholder="0.0"
            />
            <span className="text-[11px] text-slate-400">{ref.unit}</span>
          </div>
        </td>

        <td className="px-3 py-2.5 text-center text-slate-700 font-medium">
          {ref.mean} {ref.unit}
        </td>

        <td className="px-3 py-2.5 text-center text-slate-500 font-mono text-[11px]">
          {ref.range || '—'}
        </td>

        <td className="px-3 py-2.5 text-center">
          <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
            diff === null ? 'text-slate-400' :
            Math.abs(diff) <= 1.0 ? 'bg-slate-100 text-slate-700' :
            diff > 0 ? 'bg-blue-50 text-blue-800' : 'bg-purple-50 text-purple-800'
          }`}>
            {diff !== null ? (diff > 0 ? `+${diff}` : `${diff}`) : '—'}
          </span>
        </td>

        <td className="px-3 py-2.5 text-slate-600 text-[11px] max-w-xs">
          {customInference || (diff === null ? 'Enter value' :
            Math.abs(diff) <= 1.0 ? 'Within normative average.' :
            diff > 0 ? `Higher than standard mean (${diff > 0 ? `+${diff}` : diff} ${ref.unit}).` :
            `Lower than standard mean (${diff} ${ref.unit}).`
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Radiographic Cephalometric Analyses</h2>
              <p className="text-xs text-slate-500">
                Norms from primary case history format, Downs, Steiner, Wits, Tweed, McNamara, Jarabak, Ricketts, and Burstone.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl mb-6">
          {[
            { id: 'downs', label: "Down's Analysis" },
            { id: 'steiner', label: "Steiner's Analysis" },
            { id: 'wits', label: 'Wits Appraisal' },
            { id: 'tweed', label: "Tweed's Triangle" },
            { id: 'mcnamara', label: "McNamara's Analysis" },
            { id: 'jarabak', label: 'Rakosi-Jarabak' },
            { id: 'ricketts', label: "Ricketts' Analysis" },
            { id: 'burstone', label: 'Burstone Hard-Tissue' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CephTab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. DOWNS ANALYSIS */}
        {activeTab === 'downs' && (
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider">
                Skeletal Pattern (Downs WB 1948)
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-600 text-[11px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Parameter</th>
                    <th className="px-3 py-2 text-center">Patient Value</th>
                    <th className="px-3 py-2 text-center">Mean (Norm)</th>
                    <th className="px-3 py-2 text-center">Range</th>
                    <th className="px-3 py-2 text-center">Diff</th>
                    <th className="px-3 py-2">Educational Inference</th>
                  </tr>
                </thead>
                <tbody>
                  {renderParamRow('facialAngle', 'downs_facialAngle', downs.facialAngle, (v) => onChangeDowns({ ...downs, facialAngle: v }))}
                  {renderParamRow('angleOfConvexity', 'downs_angleOfConvexity', downs.angleOfConvexity, (v) => onChangeDowns({ ...downs, angleOfConvexity: v }))}
                  {renderParamRow('abPlane', 'downs_abPlane', downs.abPlane, (v) => onChangeDowns({ ...downs, abPlane: v }))}
                  {renderParamRow('mandibularPlaneAngle', 'downs_mandibularPlaneAngle', downs.mandibularPlaneAngle, (v) => onChangeDowns({ ...downs, mandibularPlaneAngle: v }))}
                  {renderParamRow('yAxis', 'downs_yAxis', downs.yAxis, (v) => onChangeDowns({ ...downs, yAxis: v }))}
                </tbody>
              </table>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider">
                Dental Pattern (Downs WB 1948)
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-600 text-[11px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Parameter</th>
                    <th className="px-3 py-2 text-center">Patient Value</th>
                    <th className="px-3 py-2 text-center">Mean (Norm)</th>
                    <th className="px-3 py-2 text-center">Range</th>
                    <th className="px-3 py-2 text-center">Diff</th>
                    <th className="px-3 py-2">Educational Inference</th>
                  </tr>
                </thead>
                <tbody>
                  {renderParamRow('cantOfOcclusalPlane', 'downs_cantOfOcclusalPlane', downs.cantOfOcclusalPlane, (v) => onChangeDowns({ ...downs, cantOfOcclusalPlane: v }))}
                  {renderParamRow('oneToOne', 'downs_oneToOne', downs.oneToOne, (v) => onChangeDowns({ ...downs, oneToOne: v }))}
                  {renderParamRow('oneToOcclusalPlane', 'downs_oneToOcclusalPlane', downs.oneToOcclusalPlane, (v) => onChangeDowns({ ...downs, oneToOcclusalPlane: v }))}
                  {renderParamRow('oneToMandibularPlane', 'downs_oneToMandibularPlane', downs.oneToMandibularPlane, (v) => onChangeDowns({ ...downs, oneToMandibularPlane: v }))}
                  {renderParamRow('oneToAPog', 'downs_oneToAPog', downs.oneToAPog, (v) => onChangeDowns({ ...downs, oneToAPog: v }))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. STEINER ANALYSIS */}
        {activeTab === 'steiner' && (
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider">
                Skeletal Parameters (Steiner CC 1953)
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-600 text-[11px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Parameter</th>
                    <th className="px-3 py-2 text-center">Patient Value</th>
                    <th className="px-3 py-2 text-center">Mean</th>
                    <th className="px-3 py-2 text-center">Range</th>
                    <th className="px-3 py-2 text-center">Diff</th>
                    <th className="px-3 py-2">Educational Inference</th>
                  </tr>
                </thead>
                <tbody>
                  {renderParamRow('sna', 'steiner_sna', steiner.sna, (v) => onChangeSteiner({ ...steiner, sna: v }))}
                  {renderParamRow('snb', 'steiner_snb', steiner.snb, (v) => onChangeSteiner({ ...steiner, snb: v }))}
                  {renderParamRow('snd', 'steiner_snd', steiner.snd, (v) => onChangeSteiner({ ...steiner, snd: v }))}
                  {renderParamRow('anb', 'steiner_anb', steiner.anb, (v) => onChangeSteiner({ ...steiner, anb: v }))}
                  {renderParamRow('goGnToSN', 'steiner_goGnToSN', steiner.goGnToSN, (v) => onChangeSteiner({ ...steiner, goGnToSN: v }))}
                </tbody>
              </table>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider">
                Dental & Soft-Tissue Parameters (Steiner CC 1953)
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-600 text-[11px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Parameter</th>
                    <th className="px-3 py-2 text-center">Patient Value</th>
                    <th className="px-3 py-2 text-center">Mean</th>
                    <th className="px-3 py-2 text-center">Range</th>
                    <th className="px-3 py-2 text-center">Diff</th>
                    <th className="px-3 py-2">Educational Inference</th>
                  </tr>
                </thead>
                <tbody>
                  {renderParamRow('u1ToNA_mm', 'steiner_u1ToNA_mm', steiner.u1ToNA_mm, (v) => onChangeSteiner({ ...steiner, u1ToNA_mm: v }))}
                  {renderParamRow('u1ToNA_deg', 'steiner_u1ToNA_deg', steiner.u1ToNA_deg, (v) => onChangeSteiner({ ...steiner, u1ToNA_deg: v }))}
                  {renderParamRow('l1ToNB_mm', 'steiner_l1ToNB_mm', steiner.l1ToNB_mm, (v) => onChangeSteiner({ ...steiner, l1ToNB_mm: v }))}
                  {renderParamRow('l1ToNB_deg', 'steiner_l1ToNB_deg', steiner.l1ToNB_deg, (v) => onChangeSteiner({ ...steiner, l1ToNB_deg: v }))}
                  {renderParamRow('pogToNB_mm', 'steiner_pogToNB_mm', steiner.pogToNB_mm, (v) => onChangeSteiner({ ...steiner, pogToNB_mm: v }))}
                  {renderParamRow('u1ToL1_deg', 'steiner_u1ToL1_deg', steiner.u1ToL1_deg, (v) => onChangeSteiner({ ...steiner, u1ToL1_deg: v }))}
                  {renderParamRow('occlusalToSN', 'steiner_occlusalToSN', steiner.occlusalToSN, (v) => onChangeSteiner({ ...steiner, occlusalToSN: v }))}
                  {renderParamRow('sLineUpperLip', 'soft_sLineUpperLip', steiner.sLineUpperLip, (v) => onChangeSteiner({ ...steiner, sLineUpperLip: v }))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. WITS APPRAISAL */}
        {activeTab === 'wits' && (
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">Wits Appraisal (Jacobson A 1975)</h3>
                <div className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-lg">
                  Patient Sex: <strong>{patientSex}</strong> (Standard: {patientSex === 'Male' ? '-1.0 mm' : '0.0 mm'})
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">AO Value (Point A perp)</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.5"
                      value={wits.aoValue}
                      onChange={(e) => onChangeWits({ ...wits, aoValue: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-center font-semibold"
                      placeholder="e.g. 15.0"
                    />
                    <span className="text-xs text-slate-400">mm</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">BO Value (Point B perp)</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.5"
                      value={wits.boValue}
                      onChange={(e) => onChangeWits({ ...wits, boValue: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-center font-semibold"
                      placeholder="e.g. 15.0"
                    />
                    <span className="text-xs text-slate-400">mm</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200">
                  <label className="block text-xs font-bold text-blue-900 mb-1">BO – AO Difference</label>
                  <div className="text-xl font-bold font-mono text-blue-950 py-0.5">
                    {witsCalc.diff !== null ? `${witsCalc.diff > 0 ? `+${witsCalc.diff}` : witsCalc.diff} mm` : '—'}
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                <span className="font-semibold text-slate-800 block mb-0.5">Educational Inference:</span>
                <p className="text-slate-600">
                  {witsCalc.diff === null
                    ? 'Enter AO and BO values to calculate Wits linear appraisal.'
                    : witsCalc.diff < witsCalc.sexStandard - 2
                    ? `BO is behind AO by ${Math.abs(witsCalc.diff)} mm (beyond normative standard of ${witsCalc.sexStandard} mm), indicating a tendency toward skeletal Class II relationship. Interpret with ANB, cranial base inclination, and clinical findings.`
                    : witsCalc.diff > witsCalc.sexStandard + 2
                    ? `BO is ahead of AO by ${witsCalc.diff} mm, indicating a tendency toward skeletal Class III relationship. Interpret with ANB and other skeletal parameters.`
                    : `Wits appraisal is within harmonious skeletal Class I range for ${patientSex.toLowerCase()} standard (${witsCalc.sexStandard} mm).`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. TWEED ANALYSIS */}
        {activeTab === 'tweed' && (
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">Tweed Diagnostic Triangle (Tweed CH 1954)</h3>
                <div className="text-xs font-mono bg-white px-3 py-1 rounded border border-slate-200">
                  FMPA + FMIA + IMPA = <strong>{tweedCalc.sum !== null ? `${tweedCalc.sum}°` : '180°'}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-semibold text-slate-800">FMPA</span>
                    <span className="text-slate-400">Norm: 25°</span>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    value={tweed.fmpa}
                    onChange={(e) => onChangeTweed({ ...tweed, fmpa: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-semibold text-center text-xs"
                    placeholder="25.0"
                  />
                  <div className="text-[11px] text-slate-500 mt-1">
                    Diff: {tweedCalc.fmpaDiff !== null ? `${tweedCalc.fmpaDiff > 0 ? `+${tweedCalc.fmpaDiff}` : tweedCalc.fmpaDiff}°` : '—'}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-semibold text-slate-800">FMIA</span>
                    <span className="text-slate-400">Norm: 65°</span>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    value={tweed.fmia}
                    onChange={(e) => onChangeTweed({ ...tweed, fmia: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-semibold text-center text-xs"
                    placeholder="65.0"
                  />
                  <div className="text-[11px] text-slate-500 mt-1">
                    Diff: {tweedCalc.fmiaDiff !== null ? `${tweedCalc.fmiaDiff > 0 ? `+${tweedCalc.fmiaDiff}` : tweedCalc.fmiaDiff}°` : '—'}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-semibold text-slate-800">IMPA</span>
                    <span className="text-slate-400">Norm: 90°</span>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    value={tweed.impa}
                    onChange={(e) => onChangeTweed({ ...tweed, impa: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-semibold text-center text-xs"
                    placeholder="90.0"
                  />
                  <div className="text-[11px] text-slate-500 mt-1">
                    Diff: {tweedCalc.impaDiff !== null ? `${tweedCalc.impaDiff > 0 ? `+${tweedCalc.impaDiff}` : tweedCalc.impaDiff}°` : '—'}
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
                <span className="font-semibold text-slate-800 block mb-0.5">Educational Inference:</span>
                {typeof tweed.impa === 'number' && typeof tweed.fmpa === 'number' ? (
                  <span>
                    {tweed.impa > 94 ? `IMPA of ${tweed.impa}° demonstrates lower incisor proclination beyond the Tweed ideal (90°). ` :
                     tweed.impa < 86 ? `IMPA of ${tweed.impa}° demonstrates lower incisor retroclination. ` :
                     `Lower incisors are well positioned over basal bone (IMPA ${tweed.impa}°). `}
                    {tweed.fmpa > 28 ? `FMPA of ${tweed.fmpa}° reflects a hyperdivergent vertical pattern with downward-backward mandibular rotation.` :
                     tweed.fmpa < 22 ? `FMPA of ${tweed.fmpa}° reflects a hypodivergent pattern.` :
                     `FMPA of ${tweed.fmpa}° indicates average facial divergence.`}
                  </span>
                ) : 'Enter Tweed triangle measurements.'}
              </div>
            </div>
          </div>
        )}

        {/* 5. MCNAMARA ANALYSIS */}
        {activeTab === 'mcnamara' && (
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider flex justify-between items-center">
                <span>McNamara Analysis (McNamara JA 1984)</span>
                {mcNamaraCalc.maxillomandibularDiff !== null && (
                  <span className="text-blue-800 font-mono lowercase">
                    Differential: {mcNamaraCalc.maxillomandibularDiff} mm (Eff Mand - Eff Max)
                  </span>
                )}
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-600 text-[11px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Parameter</th>
                    <th className="px-3 py-2 text-center">Patient Value</th>
                    <th className="px-3 py-2 text-center">Mean (Norm)</th>
                    <th className="px-3 py-2 text-center">Range</th>
                    <th className="px-3 py-2 text-center">Diff</th>
                    <th className="px-3 py-2">Educational Inference</th>
                  </tr>
                </thead>
                <tbody>
                  {renderParamRow('nPerpToA', 'mcnamara_nPerpToA', mcnamara.nPerpToA, (v) => onChangeMcNamara({ ...mcnamara, nPerpToA: v }))}
                  {renderParamRow('nPerpToPog', 'mcnamara_nPerpToPog', mcnamara.nPerpToPog, (v) => onChangeMcNamara({ ...mcnamara, nPerpToPog: v }))}
                  {renderParamRow('effMaxillaryLength', 'mcnamara_effMaxillaryLength', mcnamara.effMaxillaryLength, (v) => onChangeMcNamara({ ...mcnamara, effMaxillaryLength: v }))}
                  {renderParamRow('effMandibularLength', 'mcnamara_effMandibularLength', mcnamara.effMandibularLength, (v) => onChangeMcNamara({ ...mcnamara, effMandibularLength: v }))}
                  {renderParamRow('lafh', 'mcnamara_lafh', mcnamara.lafh, (v) => onChangeMcNamara({ ...mcnamara, lafh: v }))}
                  {renderParamRow('upperAirway', 'mcnamara_upperAirway', mcnamara.upperAirway, (v) => onChangeMcNamara({ ...mcnamara, upperAirway: v }))}
                  {renderParamRow('lowerAirway', 'mcnamara_lowerAirway', mcnamara.lowerAirway, (v) => onChangeMcNamara({ ...mcnamara, lowerAirway: v }))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. RAKOSI-JARABAK */}
        {activeTab === 'jarabak' && (
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider flex justify-between items-center">
                <span>Rakosi-Jarabak Analysis (Jarabak & Fizzell 1972)</span>
                {jarabakCalc.sumOfPosteriorAngles !== null && (
                  <span className="text-indigo-800 font-mono">
                    Sum Posterior: {jarabakCalc.sumOfPosteriorAngles}° (396° ± 6°)
                  </span>
                )}
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-600 text-[11px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Parameter</th>
                    <th className="px-3 py-2 text-center">Patient Value</th>
                    <th className="px-3 py-2 text-center">Mean (Norm)</th>
                    <th className="px-3 py-2 text-center">Range</th>
                    <th className="px-3 py-2 text-center">Diff</th>
                    <th className="px-3 py-2">Educational Inference</th>
                  </tr>
                </thead>
                <tbody>
                  {renderParamRow('saddleAngle', 'jarabak_saddleAngle', rakosiJarabak.saddleAngle, (v) => onChangeJarabak({ ...rakosiJarabak, saddleAngle: v }))}
                  {renderParamRow('articularAngle', 'jarabak_articularAngle', rakosiJarabak.articularAngle, (v) => onChangeJarabak({ ...rakosiJarabak, articularAngle: v }))}
                  {renderParamRow('gonialAngle', 'jarabak_gonialAngle', rakosiJarabak.gonialAngle, (v) => onChangeJarabak({ ...rakosiJarabak, gonialAngle: v }))}
                  {jarabakCalc.sumOfPosteriorAngles !== null && (
                    <tr className="bg-indigo-50/40 font-semibold border-b border-indigo-100 text-xs">
                      <td className="px-3 py-2 text-indigo-950">Sum of Posterior Angles (Calculated)</td>
                      <td className="px-3 py-2 text-center font-bold text-indigo-950">{jarabakCalc.sumOfPosteriorAngles}°</td>
                      <td className="px-3 py-2 text-center">396.0°</td>
                      <td className="px-3 py-2 text-center font-mono">390°–402°</td>
                      <td className="px-3 py-2 text-center">{jarabakCalc.sumDiff !== null ? `${jarabakCalc.sumDiff > 0 ? `+${jarabakCalc.sumDiff}` : jarabakCalc.sumDiff}°` : '—'}</td>
                      <td className="px-3 py-2 text-[11px] text-indigo-900">
                        {jarabakCalc.sumOfPosteriorAngles > 402 ? 'Clockwise growth vector / hyperdivergent tendency.' :
                         jarabakCalc.sumOfPosteriorAngles < 390 ? 'Counter-clockwise growth vector / hypodivergent tendency.' :
                         'Normodivergent growth vector.'}
                      </td>
                    </tr>
                  )}
                  {jarabakCalc.jarabakRatio !== null && (
                    <tr className="bg-indigo-50/40 font-semibold border-b border-indigo-100 text-xs">
                      <td className="px-3 py-2 text-indigo-950">Jarabak Ratio (S-Go / N-Me × 100)</td>
                      <td className="px-3 py-2 text-center font-bold text-indigo-950">{jarabakCalc.jarabakRatio}%</td>
                      <td className="px-3 py-2 text-center">63.5%</td>
                      <td className="px-3 py-2 text-center font-mono">62%–65%</td>
                      <td className="px-3 py-2 text-center">{jarabakCalc.ratioDiff !== null ? `${jarabakCalc.ratioDiff > 0 ? `+${jarabakCalc.ratioDiff}` : jarabakCalc.ratioDiff}%` : '—'}</td>
                      <td className="px-3 py-2 text-[11px] text-indigo-900">
                        {jarabakCalc.jarabakRatio > 65 ? '>65% hypodivergent (anterior growth rotation).' :
                         jarabakCalc.jarabakRatio < 62 ? '<62% hyperdivergent (posterior growth rotation).' :
                         'Balanced vertical facial height proportion.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. RICKETTS ANALYSIS */}
        {activeTab === 'ricketts' && (
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider">
                Ricketts Analysis (Ricketts RM 1960)
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-600 text-[11px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Parameter</th>
                    <th className="px-3 py-2 text-center">Patient Value</th>
                    <th className="px-3 py-2 text-center">Mean (Norm)</th>
                    <th className="px-3 py-2 text-center">Range</th>
                    <th className="px-3 py-2 text-center">Diff</th>
                    <th className="px-3 py-2">Educational Inference</th>
                  </tr>
                </thead>
                <tbody>
                  {renderParamRow('facialAxis', 'ricketts_facialAxis', ricketts.facialAxisAngle, (v) => onChangeRicketts({ ...ricketts, facialAxisAngle: v }))}
                  {renderParamRow('facialDepth', 'ricketts_facialDepth', ricketts.facialDepth, (v) => onChangeRicketts({ ...ricketts, facialDepth: v }))}
                  {renderParamRow('convexityPointA', 'ricketts_convexityPointA', ricketts.convexityPointA, (v) => onChangeRicketts({ ...ricketts, convexityPointA: v }))}
                  {renderParamRow('lowerLipToEPlane', 'ricketts_lowerLipToEPlane', ricketts.lowerLipToEPlane, (v) => onChangeRicketts({ ...ricketts, lowerLipToEPlane: v }))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. BURSTONE HARD-TISSUE */}
        {activeTab === 'burstone' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                Select Norm Standard Sex:
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setBurstoneSex('Male')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                    burstoneSex === 'Male' ? 'bg-blue-700 text-white' : 'bg-white border text-slate-700'
                  }`}
                >
                  Male Norms
                </button>
                <button
                  onClick={() => setBurstoneSex('Female')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                    burstoneSex === 'Female' ? 'bg-rose-700 text-white' : 'bg-white border text-slate-700'
                  }`}
                >
                  Female Norms
                </button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider">
                Burstone Hard-Tissue Analysis Table (Case History Format)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 text-slate-600 text-[11px] font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">Measurement</th>
                      <th className="px-3 py-2 text-center">Patient Value</th>
                      <th className="px-3 py-2 text-center">{burstoneSex} Mean</th>
                      <th className="px-3 py-2 text-center">Diff</th>
                      <th className="px-3 py-2">Anatomical Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(Object.keys(BURSTONE_HARD_NORMS) as (keyof BurstoneHardAnalysisData)[]).map((key) => {
                      const norm = BURSTONE_HARD_NORMS[key as string];
                      if (!norm) return null;

                      const val = typeof burstoneHard[key] === 'number' ? (burstoneHard[key] as number) : null;
                      const standardMean = burstoneSex === 'Male' ? norm.male : norm.female;
                      const diff = val !== null ? Number((val - standardMean).toFixed(1)) : null;

                      return (
                        <tr key={key} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-3 py-2 font-mono font-bold text-slate-900">{key}</td>
                          <td className="px-3 py-2 text-center">
                            <input
                              type="number"
                              step="0.5"
                              value={burstoneHard[key] ?? ''}
                              onChange={(e) => onChangeBurstoneHard({
                                ...burstoneHard,
                                [key]: e.target.value === '' ? '' : parseFloat(e.target.value)
                              })}
                              className="w-18 px-1.5 py-0.5 border border-slate-200 rounded text-center font-semibold bg-white text-xs"
                              placeholder="0.0"
                            />
                            <span className="text-[10px] text-slate-400 ml-1">{norm.unit}</span>
                          </td>
                          <td className="px-3 py-2 text-center text-slate-700">
                            {standardMean} {norm.unit}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className={`font-mono text-xs font-semibold ${
                              diff === null ? 'text-slate-400' :
                              Math.abs(diff) <= 1.0 ? 'text-slate-700' :
                              diff > 0 ? 'text-blue-700' : 'text-purple-700'
                            }`}>
                              {diff !== null ? (diff > 0 ? `+${diff}` : `${diff}`) : '—'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-slate-500 text-[11px]">{norm.description}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
