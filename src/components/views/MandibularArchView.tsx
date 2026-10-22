import React from 'react';
import { MandibularArchData, MaxillaryArchData } from '../../types/ortho';
import {
  calculateMandibularArch,
  calculateMaxillaryArch,
  calculateTomeIndex,
  calculateBolton
} from '../../utils/orthoCalculations';
import { Calculator, Info, SplitSquareVertical, Sparkles, Activity } from 'lucide-react';

interface MandibularArchViewProps {
  mandibular: MandibularArchData;
  maxillary: MaxillaryArchData;
  onChangeMandibular: (updated: MandibularArchData) => void;
  isLearningMode: boolean;
  onOpenFormula: (custom: { title: string; formula: string; description: string; reference: string; variables?: { name: string; desc: string }[] }) => void;
}

export const MandibularArchView: React.FC<MandibularArchViewProps> = ({
  mandibular,
  maxillary,
  onChangeMandibular,
  isLearningMode,
  onOpenFormula
}) => {
  const mandCalc = calculateMandibularArch(mandibular);
  const maxCalc = calculateMaxillaryArch(maxillary);
  const tomeCalc = calculateTomeIndex(maxCalc.sumIncisors2to2, mandCalc.sumIncisors2to2);
  const boltonCalc = calculateBolton(maxCalc, mandCalc);

  const updateTooth = (side: 'Right' | 'Left', toothNum: number, value: number | '') => {
    const target = side === 'Right' ? 'toothWidthsRight' : 'toothWidthsLeft';
    const current = { ...mandibular[target] };
    if (value === '') {
      delete current[toothNum];
    } else {
      current[toothNum] = Math.max(0, value);
    }
    onChangeMandibular({
      ...mandibular,
      [target]: current
    });
  };

  const updateField = <K extends keyof MandibularArchData>(field: K, value: MandibularArchData[K]) => {
    onChangeMandibular({
      ...mandibular,
      [field]: value
    });
  };

  const toothNames: { [num: number]: string } = {
    1: 'Central Incisor (41 / 31)',
    2: 'Lateral Incisor (42 / 32)',
    3: 'Canine (43 / 33)',
    4: 'First Premolar (44 / 34)',
    5: 'Second Premolar (45 / 35)',
    6: 'First Molar (46 / 36)',
    7: 'Second Molar (47 / 37)'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Mandibular Arch & Interarch Analyses</h2>
              <p className="text-xs text-slate-500">
                Tooth material, Curve of Spee, Nance & Carey, Tome's Index, and Bolton Tooth-Size Ratios.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenFormula({
              title: 'Mandibular Arch Calculations',
              formula: 'Curve of Spee = [(R + L) / 2] + 0.5 | Nance-Carey = Measured Perimeter - Tooth Material 5-5',
              description: 'Evaluates mandibular arch perimeter space sufficiency and levelling requirements.',
              reference: 'Contemporary Orthodontics (Proffit 7th ed.) / MDS Case History Format'
            })}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
          >
            <Info className="w-3.5 h-3.5" /> Formula
          </button>
        </div>

        {/* Mesiodistal Tooth Width Table */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Mandibular Mesiodistal Tooth Widths (mm)
            </h3>
            <span className="text-xs text-slate-500">Teeth 1 through 7 bilateral</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">Tooth</th>
                  <th className="px-3 py-2.5">Tooth Name</th>
                  <th className="px-3 py-2.5 text-center bg-emerald-50/50">Right Quadrant (mm)</th>
                  <th className="px-3 py-2.5 text-center bg-teal-50/50">Left Quadrant (mm)</th>
                  <th className="px-3 py-2.5 text-center font-bold">Total Pair (mm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                  const rVal = mandibular.toothWidthsRight[num] ?? '';
                  const lVal = mandibular.toothWidthsLeft[num] ?? '';
                  const pairTotal = (typeof rVal === 'number' ? rVal : 0) + (typeof lVal === 'number' ? lVal : 0);

                  return (
                    <tr key={num} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-3 py-2 font-mono font-bold text-slate-900">Tooth {num}</td>
                      <td className="px-3 py-2 text-slate-600">{toothNames[num]}</td>
                      <td className="px-3 py-2 text-center bg-emerald-50/30">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={rVal}
                          onChange={(e) => updateTooth('Right', num, e.target.value === '' ? '' : parseFloat(e.target.value))}
                          className="w-20 px-2 py-1 text-center bg-white border border-slate-200 rounded font-semibold focus:ring-2 focus:ring-emerald-500"
                          placeholder="0.0"
                        />
                      </td>
                      <td className="px-3 py-2 text-center bg-teal-50/30">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={lVal}
                          onChange={(e) => updateTooth('Left', num, e.target.value === '' ? '' : parseFloat(e.target.value))}
                          className="w-20 px-2 py-1 text-center bg-white border border-slate-200 rounded font-semibold focus:ring-2 focus:ring-emerald-500"
                          placeholder="0.0"
                        />
                      </td>
                      <td className="px-3 py-2 text-center font-bold text-slate-800">
                        {pairTotal > 0 ? `${pairTotal.toFixed(1)} mm` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 text-xs block font-medium">Lower Sum Incisors (2–2):</span>
            <span className="text-xl font-bold text-slate-900">{mandCalc.sumIncisors2to2} mm</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Used in Tome's conversion</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 text-xs block font-medium">Lower Canines (3–3):</span>
            <span className="text-xl font-bold text-slate-900">{mandCalc.sumCanines3to3} mm</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Anterior Bolton numerator</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 text-xs block font-medium">Tooth Material 5–5:</span>
            <span className="text-xl font-bold text-slate-900">{mandCalc.toothMaterial5to5} mm</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Nance-Carey requirement</span>
          </div>

          <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
            <span className="text-emerald-800 text-xs block font-bold">Total Tooth Material 6–6:</span>
            <span className="text-xl font-extrabold text-emerald-950">{mandCalc.toothMaterial6to6} mm</span>
            <span className="text-[11px] text-emerald-600 block mt-0.5">Overall Bolton numerator</span>
          </div>
        </div>

        {/* Proclination Notes */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-700 mb-1">Mandibular Incisor Proclination / Alignment Notes</label>
          <input
            type="text"
            value={mandibular.proclinationNotes}
            onChange={(e) => updateField('proclinationNotes', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g. Lower incisors upright over basal bone, mild imbrication..."
          />
        </div>

        {/* Curve of Spee & Nance-Carey */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Curve of Spee */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" /> Curve of Spee
              </h3>
              <button
                onClick={() => onOpenFormula({
                  title: 'Curve of Spee Depth & Space Requirement',
                  formula: 'Calculated Depth = [(Right + Left) / 2] + 0.5 mm',
                  description: 'The Curve of Spee is measured from the deepest cusp tip (usually second premolar) to a flat plane resting on incisal edges and distobuccal cusps of the second molars. Formula in case history format adds 0.5 mm to the bilateral average to approximate levelling space needed.',
                  reference: 'MDS Case History Format Standard'
                })}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5" /> Formula
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">Right Depth (mm)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={mandibular.curveOfSpeeRightDepth}
                  onChange={(e) => updateField('curveOfSpeeRightDepth', e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-center font-semibold"
                  placeholder="2.0"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Left Depth (mm)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={mandibular.curveOfSpeeLeftDepth}
                  onChange={(e) => updateField('curveOfSpeeLeftDepth', e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-center font-semibold"
                  placeholder="2.0"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Calculated Formula</label>
                <div className="py-1.5 bg-emerald-100/70 text-emerald-900 rounded font-bold text-center">
                  {mandCalc.curveOfSpeeDepth !== null ? `${mandCalc.curveOfSpeeDepth} mm` : '—'}
                </div>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Normal reference:</span> Flat to mild (&le; 1.5 mm).
              {mandCalc.curveOfSpeeDepth !== null && (
                <span className="block mt-1 font-medium text-slate-700">
                  {mandCalc.curveOfSpeeDepth > 2.0
                    ? `Deep curve of Spee (${mandCalc.curveOfSpeeDepth} mm); approximately ${mandCalc.curveOfSpeeDepth} mm of arch length needed for levelling.`
                    : `Mild or normal curve of Spee (${mandCalc.curveOfSpeeDepth} mm).`}
                </span>
              )}
            </div>
          </div>

          {/* Nance and Carey's Index */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <SplitSquareVertical className="w-4 h-4 text-emerald-600" /> Nance & Carey's Index
              </h3>
              <button
                onClick={() => onOpenFormula({
                  title: "Nance & Carey's Arch Length Analysis",
                  formula: 'Discrepancy = Actual Measured Arch Perimeter - Tooth Material 5–5',
                  description: 'Measures mandibular arch length discrepancy using brass wire contoured over the contact points from mesial of first permanent molar around to mesial of contralateral first molar.',
                  reference: 'Nance HN (1947) / Carey CW (1949)'
                })}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5" /> Formula
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">Measured Perimeter</label>
                <input
                  type="number"
                  step="0.5"
                  value={mandibular.archPerimeterMeasured}
                  onChange={(e) => updateField('archPerimeterMeasured', e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-center font-semibold"
                  placeholder="e.g. 62.0"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Tooth Material 5–5</label>
                <div className="py-1.5 bg-slate-100 rounded text-slate-800 font-bold text-center">
                  {mandCalc.toothMaterial5to5 > 0 ? `${mandCalc.toothMaterial5to5} mm` : '—'}
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Discrepancy</label>
                <div className={`py-1.5 rounded font-bold text-center ${
                  mandCalc.nanceCareyDiff === null ? 'bg-slate-100 text-slate-400' :
                  mandCalc.nanceCareyDiff >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {mandCalc.nanceCareyDiff !== null
                    ? `${mandCalc.nanceCareyDiff > 0 ? `+${mandCalc.nanceCareyDiff}` : mandCalc.nanceCareyDiff} mm`
                    : '—'}
                </div>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600">
              {mandCalc.nanceCareyDiff !== null ? (
                <span className="font-medium text-slate-700">
                  {mandCalc.nanceCareyDiff < 0
                    ? `Arch perimeter deficit of ${Math.abs(mandCalc.nanceCareyDiff)} mm. Space gaining required for alignment.`
                    : mandCalc.nanceCareyDiff > 0
                    ? `Arch perimeter surplus of ${mandCalc.nanceCareyDiff} mm.`
                    : 'Perimeter matches tooth material 5–5.'}
                </span>
              ) : 'Enter measured arch perimeter.'}
            </div>
          </div>
        </div>

        {/* Tome's Index */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Tome's Index
            </h3>
            <button
              onClick={() => onOpenFormula({
                title: "Tome's Index (Lower to Upper Incisor Conversion)",
                formula: 'Calculated Upper SI = (Sum of Lower Incisors × 4) / 3 + 0.5 mm',
                description: "Predicts expected upper incisor arch width from measured lower incisor widths according to the institutional case history format.",
                reference: 'MDS Case History Format Standard'
              })}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" /> Formula
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs mb-2">
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Actual Measured Upper SI:</span>
              <span className="text-base font-bold text-slate-900">{tomeCalc.actualUpperSI ? `${tomeCalc.actualUpperSI} mm` : '—'}</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Lower SI (2–2):</span>
              <span className="text-base font-bold text-slate-900">{tomeCalc.lowerSI ? `${tomeCalc.lowerSI} mm` : '—'}</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Calculated Upper SI:</span>
              <span className="text-base font-bold text-emerald-700">{tomeCalc.calculatedUpperSI ? `${tomeCalc.calculatedUpperSI} mm` : '—'}</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Difference:</span>
              <span className="text-base font-bold text-slate-900">
                {tomeCalc.diff !== null ? `${tomeCalc.diff > 0 ? `+${tomeCalc.diff}` : tomeCalc.diff} mm` : '—'}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
            {tomeCalc.diff !== null ? (
              <span>
                {Math.abs(tomeCalc.diff) <= 0.5
                  ? `Upper incisor width matches lower incisor harmonic proportion (difference within ±0.5 mm).`
                  : tomeCalc.diff > 0.5
                  ? `Upper incisors are ${tomeCalc.diff} mm wider than predicted by lower incisors (tendency to maxillary anterior tooth excess).`
                  : `Upper incisors are ${Math.abs(tomeCalc.diff)} mm narrower than predicted by lower incisors.`}
              </span>
            ) : 'Enter upper and lower incisor widths to calculate Tome index.'}
          </div>
        </div>

        {/* BOLTON ANALYSIS */}
        <div className="border border-indigo-200 rounded-xl p-5 bg-indigo-50/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <h3 className="font-bold text-slate-900 text-sm">Bolton Tooth-Size Discrepancy Analysis</h3>
            </div>
            <button
              onClick={() => onOpenFormula({
                title: "Bolton's Interarch Tooth Size Ratios",
                formula: 'Overall: (Mandibular 12 / Maxillary 12) × 100 [91.3%] | Anterior: (Mandibular 6 / Maxillary 6) × 100 [77.2%]',
                description: 'Identifies disproportion between upper and lower dental material. Overall ratio uses first molar to first molar (12 teeth); anterior ratio uses canine to canine (6 teeth). Reference standard: Overall = 91.3%; Anterior = 77.2%.',
                reference: 'Bolton WA (1958) / MDS Case History Format',
                variables: [
                  { name: '< 91.3%', desc: 'Maxillary tooth material excess' },
                  { name: '> 91.3%', desc: 'Mandibular tooth material excess' },
                  { name: '< 77.2%', desc: 'Maxillary anterior excess' },
                  { name: '> 77.2%', desc: 'Mandibular anterior excess' }
                ]
              })}
              className="text-xs text-indigo-700 hover:text-indigo-900 font-medium flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-indigo-200 shadow-2xs"
            >
              <Info className="w-3.5 h-3.5" /> Formula
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            {/* Overall Ratio */}
            <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-800 mb-2">
                <span>Overall Ratio (6–6)</span>
                <span className="text-slate-400 font-mono">Mand 12 / Max 12 × 100</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                <div>
                  <span className="text-slate-500 block">Patient Value</span>
                  <span className="text-base font-bold text-indigo-950">
                    {boltonCalc.overallRatio !== null ? `${boltonCalc.overallRatio}%` : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Reference</span>
                  <span className="text-base font-bold text-slate-700">91.3%</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Difference</span>
                  <span className={`text-base font-bold ${
                    boltonCalc.overallDiff === null ? 'text-slate-400' :
                    Math.abs(boltonCalc.overallDiff) <= 1.0 ? 'text-slate-700' :
                    boltonCalc.overallDiff < 0 ? 'text-blue-700' : 'text-purple-700'
                  }`}>
                    {boltonCalc.overallDiff !== null ? `${boltonCalc.overallDiff > 0 ? `+${boltonCalc.overallDiff}` : boltonCalc.overallDiff}%` : '—'}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 border-t border-slate-100 pt-2">
                {boltonCalc.overallRatio === null
                  ? 'Enter 6-6 widths in both arches.'
                  : Math.abs(boltonCalc.overallDiff || 0) <= 1.0
                  ? 'Overall interarch tooth ratio is balanced and within normal harmony.'
                  : (boltonCalc.overallDiff || 0) < 0
                  ? `Ratio < 91.3% indicates relative maxillary tooth material excess.`
                  : `Ratio > 91.3% indicates relative mandibular tooth material excess.`}
              </p>
            </div>

            {/* Anterior Ratio */}
            <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-800 mb-2">
                <span>Anterior Ratio (3–3)</span>
                <span className="text-slate-400 font-mono">Mand 6 / Max 6 × 100</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                <div>
                  <span className="text-slate-500 block">Patient Value</span>
                  <span className="text-base font-bold text-indigo-950">
                    {boltonCalc.anteriorRatio !== null ? `${boltonCalc.anteriorRatio}%` : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Reference</span>
                  <span className="text-base font-bold text-slate-700">77.2%</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Difference</span>
                  <span className={`text-base font-bold ${
                    boltonCalc.anteriorDiff === null ? 'text-slate-400' :
                    Math.abs(boltonCalc.anteriorDiff) <= 1.2 ? 'text-slate-700' :
                    boltonCalc.anteriorDiff < 0 ? 'text-blue-700' : 'text-purple-700'
                  }`}>
                    {boltonCalc.anteriorDiff !== null ? `${boltonCalc.anteriorDiff > 0 ? `+${boltonCalc.anteriorDiff}` : boltonCalc.anteriorDiff}%` : '—'}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 border-t border-slate-100 pt-2">
                {boltonCalc.anteriorRatio === null
                  ? 'Enter 3-3 widths in both arches.'
                  : Math.abs(boltonCalc.anteriorDiff || 0) <= 1.2
                  ? 'Anterior tooth size relationship is harmoniously balanced.'
                  : (boltonCalc.anteriorDiff || 0) < 0
                  ? `Ratio < 77.2% indicates relative maxillary anterior tooth material excess.`
                  : `Ratio > 77.2% indicates relative mandibular anterior tooth material excess.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
