import React from 'react';
import { MaxillaryArchData } from '../../types/ortho';
import { calculateMaxillaryArch } from '../../utils/orthoCalculations';
import { Calculator, Info, HelpCircle } from 'lucide-react';

interface ArchWidthIndicesViewProps {
  maxillary: MaxillaryArchData;
  onChange: (updated: MaxillaryArchData) => void;
  isLearningMode: boolean;
  onOpenFormula: (custom: { title: string; formula: string; description: string; reference: string; variables?: { name: string; desc: string }[] }) => void;
}

export const ArchWidthIndicesView: React.FC<ArchWidthIndicesViewProps> = ({
  maxillary,
  onChange,
  isLearningMode,
  onOpenFormula
}) => {
  const calc = calculateMaxillaryArch(maxillary);

  const updateField = <K extends keyof MaxillaryArchData>(field: K, value: MaxillaryArchData[K]) => {
    onChange({
      ...maxillary,
      [field]: value
    });
  };

  const getIndexInference = (diff: number | null, site: 'Premolar' | 'Molar', indexName: string) => {
    if (diff === null) return 'Enter measured arch width to compare with calculated index.';
    if (Math.abs(diff) <= 0.8) {
      return `Measured ${site.toLowerCase()} width closely matches the ${indexName} calculated value (within ±0.8 mm).`;
    }
    if (diff < -0.8) {
      return `Measured ${site.toLowerCase()} width is ${Math.abs(diff).toFixed(1)} mm narrower than ${indexName} expectation (relative arch constriction).`;
    }
    return `Measured ${site.toLowerCase()} width is ${diff.toFixed(1)} mm wider than ${indexName} expectation (broad arch).`;
  };

  const getAshleyHoweInference = () => {
    if (calc.ashleyHowePMBAWPercent === null) {
      return 'Enter Premolar Basal Arch Width (PMBAW) to calculate PMBAW percentage.';
    }
    const pct = calc.ashleyHowePMBAWPercent;
    if (pct < 37.0) {
      return `PMBAW is ${pct}% (< 37%), suggesting basal arch deficiency / severe basal crowding. Lateral dental tipping may not be stable.`;
    }
    if (pct <= 44.0) {
      return `PMBAW is ${pct}% (37%–44%), representing borderline basal arch width requiring careful diagnostic assessment.`;
    }
    return `PMBAW is ${pct}% (> 44%), indicating broad, adequate basal bone capable of accommodating dental arch alignment.`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Maxillary Arch Width Analysis & Indices</h2>
              <p className="text-xs text-slate-500">
                Pont's, Linder-Harth's, Chaddha's, and Ashley Howe's arch width diagnostic indices.
              </p>
            </div>
          </div>
          <div className="text-xs bg-slate-100 text-slate-700 font-mono px-3 py-1 rounded-lg">
            Sum of Incisors (SI): <strong>{calc.sumIncisors2to2} mm</strong>
          </div>
        </div>

        {/* 1. PONT'S INDEX */}
        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h3 className="font-bold text-slate-900 text-sm">1. Pont's Index</h3>
            </div>
            <button
              onClick={() => onOpenFormula({
                title: "Pont's Index Calculation",
                formula: 'Premolar = (SI × 100) / 80 | Molar = (SI × 100) / 64',
                description: 'Pont suggested that the width of the dental arch is correlated with the sum of the mesiodistal widths of the 4 maxillary incisors (SI). Premolar measurement is taken at the distal pit of the first premolars; molar measurement is taken at the central fossa of the first permanent molars.',
                reference: 'Pont A. (1909) / MDS Case History Format',
                variables: [
                  { name: 'SI', desc: 'Sum of maxillary incisors 2–2' },
                  { name: 'Calculated Premolar', desc: 'Expected arch width between first premolars' },
                  { name: 'Calculated Molar', desc: 'Expected arch width between first permanent molars' }
                ]
              })}
              className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-2xs"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Formula
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            {/* Premolar */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-800 mb-2">
                <span>Premolar Arch Width</span>
                <span className="text-slate-400 font-mono">SI × 100 / 80</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1">Actual Measured</label>
                  <input
                    type="number"
                    step="0.5"
                    value={maxillary.pontActualPremolar}
                    onChange={(e) => updateField('pontActualPremolar', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-semibold text-center"
                    placeholder="e.g. 36.0"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Calculated Ideal</label>
                  <div className="py-1 px-2 bg-slate-100 rounded text-slate-800 font-mono font-bold text-center">
                    {calc.pontCalculatedPremolar !== null ? `${calc.pontCalculatedPremolar} mm` : '—'}
                  </div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Difference</label>
                  <div className={`py-1 px-2 rounded font-mono font-bold text-center ${
                    calc.pontDiffPremolar === null ? 'bg-slate-100 text-slate-400' :
                    calc.pontDiffPremolar >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {calc.pontDiffPremolar !== null ? `${calc.pontDiffPremolar > 0 ? `+${calc.pontDiffPremolar}` : calc.pontDiffPremolar} mm` : '—'}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-slate-600 border-t border-slate-100 pt-1.5">
                {getIndexInference(calc.pontDiffPremolar, 'Premolar', "Pont's")}
              </p>
            </div>

            {/* Molar */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-800 mb-2">
                <span>Molar Arch Width</span>
                <span className="text-slate-400 font-mono">SI × 100 / 64</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1">Actual Measured</label>
                  <input
                    type="number"
                    step="0.5"
                    value={maxillary.pontActualMolar}
                    onChange={(e) => updateField('pontActualMolar', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-semibold text-center"
                    placeholder="e.g. 45.5"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Calculated Ideal</label>
                  <div className="py-1 px-2 bg-slate-100 rounded text-slate-800 font-mono font-bold text-center">
                    {calc.pontCalculatedMolar !== null ? `${calc.pontCalculatedMolar} mm` : '—'}
                  </div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Difference</label>
                  <div className={`py-1 px-2 rounded font-mono font-bold text-center ${
                    calc.pontDiffMolar === null ? 'bg-slate-100 text-slate-400' :
                    calc.pontDiffMolar >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {calc.pontDiffMolar !== null ? `${calc.pontDiffMolar > 0 ? `+${calc.pontDiffMolar}` : calc.pontDiffMolar} mm` : '—'}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-slate-600 border-t border-slate-100 pt-1.5">
                {getIndexInference(calc.pontDiffMolar, 'Molar', "Pont's")}
              </p>
            </div>
          </div>
        </div>

        {/* 2. LINDER-HARTH'S INDEX */}
        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <h3 className="font-bold text-slate-900 text-sm">2. Linder-Harth's Index</h3>
            </div>
            <button
              onClick={() => onOpenFormula({
                title: "Linder-Harth's Index Calculation",
                formula: 'Premolar = (SI × 100) / 85 | Molar = (SI × 100) / 64',
                description: 'Modification of Pont index for European arch shapes where premolar formula divisor is adjusted to 85.',
                reference: 'Linder H., Harth G. / MDS Case History Format',
                variables: [
                  { name: 'Premolar formula', desc: 'SI × 100 / 85' },
                  { name: 'Molar formula', desc: 'SI × 100 / 64' }
                ]
              })}
              className="text-xs text-indigo-700 hover:text-indigo-900 font-medium flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-2xs"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Formula
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Premolar */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-800 mb-2">
                <span>Premolar Arch Width</span>
                <span className="text-slate-400 font-mono">SI × 100 / 85</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1">Actual Measured</label>
                  <input
                    type="number"
                    step="0.5"
                    value={maxillary.linderHarthActualPremolar}
                    onChange={(e) => updateField('linderHarthActualPremolar', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-semibold text-center"
                    placeholder="e.g. 36.0"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Calculated Ideal</label>
                  <div className="py-1 px-2 bg-slate-100 rounded text-slate-800 font-mono font-bold text-center">
                    {calc.linderHarthCalculatedPremolar !== null ? `${calc.linderHarthCalculatedPremolar} mm` : '—'}
                  </div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Difference</label>
                  <div className="py-1 px-2 rounded font-mono font-bold text-center bg-slate-100 text-slate-700">
                    {calc.linderHarthDiffPremolar !== null ? `${calc.linderHarthDiffPremolar > 0 ? `+${calc.linderHarthDiffPremolar}` : calc.linderHarthDiffPremolar} mm` : '—'}
                  </div>
                </div>
              </div>
            </div>

            {/* Molar */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-800 mb-2">
                <span>Molar Arch Width</span>
                <span className="text-slate-400 font-mono">SI × 100 / 64</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1">Actual Measured</label>
                  <input
                    type="number"
                    step="0.5"
                    value={maxillary.linderHarthActualMolar}
                    onChange={(e) => updateField('linderHarthActualMolar', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-semibold text-center"
                    placeholder="e.g. 45.5"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Calculated Ideal</label>
                  <div className="py-1 px-2 bg-slate-100 rounded text-slate-800 font-mono font-bold text-center">
                    {calc.linderHarthCalculatedMolar !== null ? `${calc.linderHarthCalculatedMolar} mm` : '—'}
                  </div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Difference</label>
                  <div className="py-1 px-2 rounded font-mono font-bold text-center bg-slate-100 text-slate-700">
                    {calc.linderHarthDiffMolar !== null ? `${calc.linderHarthDiffMolar > 0 ? `+${calc.linderHarthDiffMolar}` : calc.linderHarthDiffMolar} mm` : '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. CHADDHA'S INDEX */}
        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-600"></span>
              <h3 className="font-bold text-slate-900 text-sm">3. Chaddha's Index</h3>
            </div>
            <button
              onClick={() => onOpenFormula({
                title: "Chaddha's Index Calculation",
                formula: 'Premolar = (SI × 100) / 83.7 | Molar = (SI × 100) / 63.7',
                description: 'Formula derived by Chaddha specifically calibrated for North Indian arch morphological standards.',
                reference: 'Chaddha AK / Case History Format Standard',
                variables: [
                  { name: 'Premolar formula', desc: 'SI × 100 / 83.7' },
                  { name: 'Molar formula', desc: 'SI × 100 / 63.7' }
                ]
              })}
              className="text-xs text-violet-700 hover:text-violet-900 font-medium flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-2xs"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Formula
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Premolar */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-800 mb-2">
                <span>Premolar Arch Width</span>
                <span className="text-slate-400 font-mono">SI × 100 / 83.7</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1">Actual Measured</label>
                  <input
                    type="number"
                    step="0.5"
                    value={maxillary.chaddhaActualPremolar}
                    onChange={(e) => updateField('chaddhaActualPremolar', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-semibold text-center"
                    placeholder="e.g. 36.0"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Calculated Ideal</label>
                  <div className="py-1 px-2 bg-slate-100 rounded text-slate-800 font-mono font-bold text-center">
                    {calc.chaddhaCalculatedPremolar !== null ? `${calc.chaddhaCalculatedPremolar} mm` : '—'}
                  </div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Difference</label>
                  <div className="py-1 px-2 rounded font-mono font-bold text-center bg-slate-100 text-slate-700">
                    {calc.chaddhaDiffPremolar !== null ? `${calc.chaddhaDiffPremolar > 0 ? `+${calc.chaddhaDiffPremolar}` : calc.chaddhaDiffPremolar} mm` : '—'}
                  </div>
                </div>
              </div>
            </div>

            {/* Molar */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-800 mb-2">
                <span>Molar Arch Width</span>
                <span className="text-slate-400 font-mono">SI × 100 / 63.7</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1">Actual Measured</label>
                  <input
                    type="number"
                    step="0.5"
                    value={maxillary.chaddhaActualMolar}
                    onChange={(e) => updateField('chaddhaActualMolar', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-semibold text-center"
                    placeholder="e.g. 45.5"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Calculated Ideal</label>
                  <div className="py-1 px-2 bg-slate-100 rounded text-slate-800 font-mono font-bold text-center">
                    {calc.chaddhaCalculatedMolar !== null ? `${calc.chaddhaCalculatedMolar} mm` : '—'}
                  </div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Difference</label>
                  <div className="py-1 px-2 rounded font-mono font-bold text-center bg-slate-100 text-slate-700">
                    {calc.chaddhaDiffMolar !== null ? `${calc.chaddhaDiffMolar > 0 ? `+${calc.chaddhaDiffMolar}` : calc.chaddhaDiffMolar} mm` : '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. ASHLEY HOWE'S INDEX */}
        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
              <h3 className="font-bold text-slate-900 text-sm">4. Ashley Howe's Index</h3>
            </div>
            <button
              onClick={() => onOpenFormula({
                title: "Ashley Howe's Index Calculation",
                formula: 'PMBAW% = (PMBAW × 100) / Total Tooth Material 6–6',
                description: 'Assesses whether the basal bone can support the total dental material (6–6) without tipping teeth outside the cortical bone envelope. PMD is premolar coronal dimension (tips of buccal cusps of first premolars); PMBAW is premolar basal arch width (measured at canine fossa apical to premolars).',
                reference: 'Ashley-Howe / Case History Format Standard',
                variables: [
                  { name: 'PMD', desc: 'Premolar Dimension (coronal arch width)' },
                  { name: 'PMBAW', desc: 'Premolar Basal Arch Width (apical base)' },
                  { name: 'PMBAW%', desc: 'Basal arch percentage: <37% narrow basal arch; 37-44% borderline; >44% broad' }
                ]
              })}
              className="text-xs text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-2xs"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Formula
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Premolar Dimension (PMD)
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.5"
                  value={maxillary.ashleyHowePMD}
                  onChange={(e) => updateField('ashleyHowePMD', e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-semibold text-center text-xs"
                  placeholder="e.g. 36.0"
                />
                <span className="text-xs text-slate-500">mm</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Premolar Basal Width (PMBAW)
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.5"
                  value={maxillary.ashleyHowePMBAW}
                  onChange={(e) => updateField('ashleyHowePMBAW', e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-semibold text-center text-xs"
                  placeholder="e.g. 38.0"
                />
                <span className="text-xs text-slate-500">mm</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Tooth Material 6–6
              </label>
              <div className="py-1 text-slate-900 font-bold text-sm text-center">
                {calc.toothMaterial6to6 > 0 ? `${calc.toothMaterial6to6} mm` : '—'}
              </div>
            </div>

            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200">
              <label className="text-xs font-bold text-amber-900 block mb-1">
                PMBAW % (Calculated)
              </label>
              <div className="py-1 text-amber-950 font-mono font-extrabold text-base text-center">
                {calc.ashleyHowePMBAWPercent !== null ? `${calc.ashleyHowePMBAWPercent}%` : '—'}
              </div>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
            <span className="font-semibold text-slate-800 block mb-0.5">Educational Inference:</span>
            <p className="text-slate-600">{getAshleyHoweInference()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
