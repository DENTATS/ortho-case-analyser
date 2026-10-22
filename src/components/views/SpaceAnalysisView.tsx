import React from 'react';
import { SpaceAnalysisData, SpaceAnalysisArch } from '../../types/ortho';
import { calculateSpaceArch } from '../../utils/orthoCalculations';
import { Ruler, Info, PlusCircle, MinusCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SpaceAnalysisViewProps {
  spaceAnalysis: SpaceAnalysisData;
  onChange: (updated: SpaceAnalysisData) => void;
  isLearningMode: boolean;
  onOpenFormula: (custom: { title: string; formula: string; description: string; reference: string }) => void;
}

export const SpaceAnalysisView: React.FC<SpaceAnalysisViewProps> = ({
  spaceAnalysis,
  onChange,
  isLearningMode,
  onOpenFormula
}) => {
  const upperCalc = calculateSpaceArch(spaceAnalysis.upper);
  const lowerCalc = calculateSpaceArch(spaceAnalysis.lower);

  const updateArchValue = (
    arch: 'upper' | 'lower',
    field: keyof SpaceAnalysisArch,
    value: number | ''
  ) => {
    onChange({
      ...spaceAnalysis,
      [arch]: {
        ...spaceAnalysis[arch],
        [field]: value
      }
    });
  };

  const renderArchSection = (
    archName: 'Upper Arch' | 'Lower Arch',
    archKey: 'upper' | 'lower',
    archData: SpaceAnalysisArch,
    calc: { spaceRequired: number; spaceAvailable: number; discrepancy: number },
    hasCurveOfSpee: boolean
  ) => {
    return (
      <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/60 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${archKey === 'upper' ? 'bg-blue-600' : 'bg-emerald-600'}`}></span>
            <h3 className="font-bold text-slate-900 text-base">{archName} Space Analysis</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Discrepancy:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
              calc.discrepancy < 0 ? 'bg-rose-100 text-rose-800' :
              calc.discrepancy > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
            }`}>
              {calc.discrepancy > 0 ? `+${calc.discrepancy} mm (Surplus)` :
               calc.discrepancy < 0 ? `${calc.discrepancy} mm (Deficit)` : '0.0 mm (Equilibrium)'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
          {/* SPACE REQUIRED */}
          <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-2xs">
            <div className="flex items-center justify-between mb-3 text-rose-900 font-bold text-xs uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <MinusCircle className="w-4 h-4 text-rose-600" /> Space Required (Deficits)
              </span>
              <span className="font-mono text-sm">{calc.spaceRequired} mm</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <label className="text-slate-600">1. To correct proclination</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={archData.proclinationCorrection}
                    onChange={(e) => updateArchValue(archKey, 'proclinationCorrection', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-center text-xs"
                    placeholder="0.0"
                  />
                  <span className="text-slate-400">mm</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-slate-600">2. To correct rotation</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={archData.rotationCorrection}
                    onChange={(e) => updateArchValue(archKey, 'rotationCorrection', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-center text-xs"
                    placeholder="0.0"
                  />
                  <span className="text-slate-400">mm</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-slate-600">3. To correct crowding</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={archData.crowdingCorrection}
                    onChange={(e) => updateArchValue(archKey, 'crowdingCorrection', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-center text-xs font-semibold"
                    placeholder="0.0"
                  />
                  <span className="text-slate-400">mm</span>
                </div>
              </div>

              {hasCurveOfSpee && (
                <div className="flex items-center justify-between">
                  <label className="text-slate-600">4. To correct curve of Spee</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={archData.curveOfSpeeCorrection ?? ''}
                      onChange={(e) => updateArchValue(archKey, 'curveOfSpeeCorrection', e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-center text-xs"
                      placeholder="0.0"
                    />
                    <span className="text-slate-400">mm</span>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-rose-950">
                <span>TOTAL SPACE REQUIRED:</span>
                <span className="font-mono">{calc.spaceRequired} mm</span>
              </div>
            </div>
          </div>

          {/* SPACE AVAILABLE */}
          <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
            <div className="flex items-center justify-between mb-3 text-emerald-900 font-bold text-xs uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-emerald-600" /> Space Available (Gaining)
              </span>
              <span className="font-mono text-sm">{calc.spaceAvailable} mm</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <label className="text-slate-600">1. Interdental spacing</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={archData.interdentalSpacing}
                    onChange={(e) => updateArchValue(archKey, 'interdentalSpacing', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-20 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-center text-xs"
                    placeholder="0.0"
                  />
                  <span className="text-slate-400">mm</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-slate-600">2. Expansion</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={archData.expansion}
                    onChange={(e) => updateArchValue(archKey, 'expansion', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-20 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-center text-xs"
                    placeholder="0.0"
                  />
                  <span className="text-slate-400">mm</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-slate-600">3. Distalization</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={archData.distalization}
                    onChange={(e) => updateArchValue(archKey, 'distalization', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-20 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-center text-xs"
                    placeholder="0.0"
                  />
                  <span className="text-slate-400">mm</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-slate-600">4. Labialisation of anteriors</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={archData.labialisationAnteriors}
                    onChange={(e) => updateArchValue(archKey, 'labialisationAnteriors', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-20 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-center text-xs"
                    placeholder="0.0"
                  />
                  <span className="text-slate-400">mm</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-slate-600">5. Uprighting of posteriors</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={archData.uprightingPosteriors}
                    onChange={(e) => updateArchValue(archKey, 'uprightingPosteriors', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-20 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-center text-xs"
                    placeholder="0.0"
                  />
                  <span className="text-slate-400">mm</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-slate-600">6. Derotation of posteriors</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={archData.derotationPosteriors}
                    onChange={(e) => updateArchValue(archKey, 'derotationPosteriors', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-20 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-center text-xs"
                    placeholder="0.0"
                  />
                  <span className="text-slate-400">mm</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-slate-600">7. Proximal stripping (IPR)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={archData.proximalStripping}
                    onChange={(e) => updateArchValue(archKey, 'proximalStripping', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-20 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-center text-xs"
                    placeholder="0.0"
                  />
                  <span className="text-slate-400">mm</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-slate-600">8. Extraction</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={archData.extraction}
                    onChange={(e) => updateArchValue(archKey, 'extraction', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-20 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-center text-xs"
                    placeholder="0.0"
                  />
                  <span className="text-slate-400">mm</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-emerald-950">
                <span>TOTAL SPACE AVAILABLE:</span>
                <span className="font-mono">{calc.spaceAvailable} mm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inference footer */}
        <div className={`p-3 rounded-lg text-xs border ${
          calc.discrepancy < 0 ? 'bg-rose-50 border-rose-200 text-rose-900' :
          calc.discrepancy > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
          'bg-slate-100 border-slate-200 text-slate-800'
        }`}>
          <span className="font-bold block mb-0.5">Educational Inference:</span>
          {calc.discrepancy < 0
            ? `Approximately ${Math.abs(calc.discrepancy)} mm space deficit in the ${archName.toLowerCase()}. Additional space-gaining strategies or tooth material management required.`
            : calc.discrepancy > 0
            ? `Approximately ${calc.discrepancy} mm space surplus in the ${archName.toLowerCase()}. Surplus space may be utilized for retraction, derotation, or space closure.`
            : `Space required equals space available in the ${archName.toLowerCase()} (neutral arch balance).`}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Total Arch Space Analysis</h2>
              <p className="text-xs text-slate-500">
                Systematic breakdown of Space Required vs Space Available for Upper and Lower Arches.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenFormula({
              title: 'Space Discrepancy Formula',
              formula: 'Space Discrepancy = Total Space Available – Total Space Required',
              description: 'Space required aggregates crowding, rotations, leveling curve of Spee, and planned incisor retraction. Space available accounts for interdental spaces, arch expansion, IPR, distalization, or planned therapeutic extractions. Positive value = surplus; negative value = deficit.',
              reference: 'Contemporary Orthodontics (Proffit 7th ed.) / MDS Case History Format'
            })}
            className="text-xs text-purple-700 hover:text-purple-900 font-medium flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200"
          >
            <Info className="w-3.5 h-3.5" /> Formula
          </button>
        </div>

        <div className="space-y-6">
          {renderArchSection('Lower Arch', 'lower', spaceAnalysis.lower, lowerCalc, true)}
          {renderArchSection('Upper Arch', 'upper', spaceAnalysis.upper, upperCalc, false)}
        </div>
      </div>
    </div>
  );
};
