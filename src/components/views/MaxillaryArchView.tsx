import React from 'react';
import { MaxillaryArchData, ToothWidths } from '../../types/ortho';
import { calculateMaxillaryArch } from '../../utils/orthoCalculations';
import { Calculator, Info, Scale, ArrowRightLeft } from 'lucide-react';

interface MaxillaryArchViewProps {
  maxillary: MaxillaryArchData;
  onChange: (updated: MaxillaryArchData) => void;
  isLearningMode: boolean;
  onOpenFormula: (custom: { title: string; formula: string; description: string; reference: string; variables?: { name: string; desc: string }[] }) => void;
}

export const MaxillaryArchView: React.FC<MaxillaryArchViewProps> = ({
  maxillary,
  onChange,
  isLearningMode,
  onOpenFormula
}) => {
  const calc = calculateMaxillaryArch(maxillary);

  const updateTooth = (side: 'Right' | 'Left', toothNum: number, value: number | '') => {
    const target = side === 'Right' ? 'toothWidthsRight' : 'toothWidthsLeft';
    const current = { ...maxillary[target] };
    if (value === '') {
      delete current[toothNum];
    } else {
      current[toothNum] = Math.max(0, value);
    }
    onChange({
      ...maxillary,
      [target]: current
    });
  };

  const updateField = <K extends keyof MaxillaryArchData>(field: K, value: MaxillaryArchData[K]) => {
    onChange({
      ...maxillary,
      [field]: value
    });
  };

  const toothNames: { [num: number]: string } = {
    1: 'Central Incisor (11 / 21)',
    2: 'Lateral Incisor (12 / 22)',
    3: 'Canine (13 / 23)',
    4: 'First Premolar (14 / 24)',
    5: 'Second Premolar (15 / 25)',
    6: 'First Molar (16 / 26)',
    7: 'Second Molar (17 / 27)'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Maxillary Arch Analysis</h2>
              <p className="text-xs text-slate-500">
                Mesiodistal tooth widths, arch perimeter analysis, and arch symmetry assessment.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenFormula({
              title: 'Maxillary Tooth Material & Perimeter Calculation',
              formula: 'Sum of Incisors (2–2) = 1R + 2R + 1L + 2L | Tooth Material 5–5 = Sum of (1-5 bilateral)',
              description: 'Tooth material measures the total space needed for ideal alignment. Arch perimeter discrepancy equals the measured dental arch perimeter minus the tooth material from second premolar to second premolar (5–5).',
              reference: 'Contemporary Orthodontics (Proffit 7th ed.)'
            })}
            className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
          >
            <Info className="w-3.5 h-3.5" /> Formula
          </button>
        </div>

        {/* Mesiodistal Tooth Width Table */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Mesiodistal Tooth Widths (mm)
            </h3>
            <span className="text-xs text-slate-500">Enter measured tooth size from anatomical contact points</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">Tooth</th>
                  <th className="px-3 py-2.5">Tooth Name</th>
                  <th className="px-3 py-2.5 text-center bg-blue-50/50">Right Quadrant (mm)</th>
                  <th className="px-3 py-2.5 text-center bg-indigo-50/50">Left Quadrant (mm)</th>
                  <th className="px-3 py-2.5 text-center font-bold">Total Pair (mm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                  const rVal = maxillary.toothWidthsRight[num] ?? '';
                  const lVal = maxillary.toothWidthsLeft[num] ?? '';
                  const pairTotal = (typeof rVal === 'number' ? rVal : 0) + (typeof lVal === 'number' ? lVal : 0);

                  return (
                    <tr key={num} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-3 py-2 font-mono font-bold text-slate-900">Tooth {num}</td>
                      <td className="px-3 py-2 text-slate-600">{toothNames[num]}</td>
                      <td className="px-3 py-2 text-center bg-blue-50/30">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={rVal}
                          onChange={(e) => updateTooth('Right', num, e.target.value === '' ? '' : parseFloat(e.target.value))}
                          className="w-20 px-2 py-1 text-center bg-white border border-slate-200 rounded font-semibold focus:ring-2 focus:ring-blue-500"
                          placeholder="0.0"
                        />
                      </td>
                      <td className="px-3 py-2 text-center bg-indigo-50/30">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={lVal}
                          onChange={(e) => updateTooth('Left', num, e.target.value === '' ? '' : parseFloat(e.target.value))}
                          className="w-20 px-2 py-1 text-center bg-white border border-slate-200 rounded font-semibold focus:ring-2 focus:ring-indigo-500"
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

        {/* Calculated Totals Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 text-xs block font-medium">Sum of Incisors (2–2):</span>
            <span className="text-xl font-bold text-slate-900">{calc.sumIncisors2to2} mm</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Used in Pont, Linder-Harth</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 text-xs block font-medium">Sum of Canines (3–3):</span>
            <span className="text-xl font-bold text-slate-900">{calc.sumCanines3to3} mm</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Used in Anterior Bolton</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 text-xs block font-medium">Tooth Material 5–5:</span>
            <span className="text-xl font-bold text-slate-900">{calc.toothMaterial5to5} mm</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Arch perimeter required</span>
          </div>

          <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200">
            <span className="text-blue-800 text-xs block font-bold">Total Tooth Material 6–6:</span>
            <span className="text-xl font-extrabold text-blue-950">{calc.toothMaterial6to6} mm</span>
            <span className="text-[11px] text-blue-600 block mt-0.5">Overall Bolton & Ashley Howe</span>
          </div>
        </div>

        {/* Proclination Notes */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-700 mb-1">Maxillary Incisor Proclination / Angulation Notes</label>
          <input
            type="text"
            value={maxillary.proclinationNotes}
            onChange={(e) => updateField('proclinationNotes', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Upper central incisors proclined with 2 mm spacing distal to 12 and 22..."
          />
        </div>

        {/* Arch Symmetry Section */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-blue-600" /> Arch Symmetry Analysis
            </h3>
            <span className="text-xs text-slate-500">Measure distance from mid-palatal suture to teeth</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Premolar Symmetry */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <div className="text-xs font-bold text-slate-800 mb-2">Premolar Symmetry (from Median Raphe)</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-slate-500 mb-1">Right (mm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={maxillary.archSymmetryPremolarRight}
                    onChange={(e) => updateField('archSymmetryPremolarRight', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full px-2 py-1 border border-slate-200 rounded bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Left (mm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={maxillary.archSymmetryPremolarLeft}
                    onChange={(e) => updateField('archSymmetryPremolarLeft', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full px-2 py-1 border border-slate-200 rounded bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Difference</label>
                  <div className="px-2 py-1 bg-slate-100 rounded font-bold text-slate-900 text-center">
                    {calc.premolarSymmetryDiff !== null ? `${calc.premolarSymmetryDiff} mm` : '—'}
                  </div>
                </div>
              </div>
            </div>

            {/* Molar Symmetry */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <div className="text-xs font-bold text-slate-800 mb-2">Molar Symmetry (from Median Raphe)</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-slate-500 mb-1">Right (mm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={maxillary.archSymmetryMolarRight}
                    onChange={(e) => updateField('archSymmetryMolarRight', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full px-2 py-1 border border-slate-200 rounded bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Left (mm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={maxillary.archSymmetryMolarLeft}
                    onChange={(e) => updateField('archSymmetryMolarLeft', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full px-2 py-1 border border-slate-200 rounded bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Difference</label>
                  <div className="px-2 py-1 bg-slate-100 rounded font-bold text-slate-900 text-center">
                    {calc.molarSymmetryDiff !== null ? `${calc.molarSymmetryDiff} mm` : '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Arch Perimeter Analysis */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowRightLeft className="w-4 h-4 text-blue-600" /> Maxillary Arch Perimeter Analysis
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Actual Measured Arch Perimeter
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  value={maxillary.archPerimeterMeasured}
                  onChange={(e) => updateField('archPerimeterMeasured', e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 74.0"
                />
                <span className="text-xs text-slate-500 font-medium">mm</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tooth Material 5–5 Required
              </label>
              <div className="text-base font-bold text-slate-900 pt-1">
                {calc.toothMaterial5to5 > 0 ? `${calc.toothMaterial5to5} mm` : '—'}
              </div>
            </div>

            <div className={`p-3 rounded-lg border ${
              calc.archPerimeterDiff === null ? 'bg-white border-slate-200' :
              calc.archPerimeterDiff >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
            }`}>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Difference (Discrepancy)
              </label>
              <div className="text-base font-bold pt-1">
                {calc.archPerimeterDiff !== null ? (
                  <span className={calc.archPerimeterDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                    {calc.archPerimeterDiff > 0 ? `+${calc.archPerimeterDiff} mm (Surplus)` : `${calc.archPerimeterDiff} mm (Deficit)`}
                  </span>
                ) : 'Enter measured perimeter'}
              </div>
            </div>
          </div>

          {calc.archPerimeterDiff !== null && (
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
              <span className="font-semibold text-slate-800 block mb-0.5">Educational Inference:</span>
              <p className="text-slate-600">
                {calc.archPerimeterDiff < 0
                  ? `Maxillary arch shows a perimeter deficit of ${Math.abs(calc.archPerimeterDiff)} mm. Space gaining through expansion, distalization, or IPR may be required to resolve crowding.`
                  : calc.archPerimeterDiff > 0
                  ? `Maxillary arch shows a perimeter excess/surplus of ${calc.archPerimeterDiff} mm, corresponding with spacing or flaring.`
                  : `Arch perimeter matches tooth material exactly (balanced perimeter equilibrium).`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
