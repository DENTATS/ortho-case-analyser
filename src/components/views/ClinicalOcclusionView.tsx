import React from 'react';
import { ModelOcclusion, AngleClass, CanineClass, CrossbiteType } from '../../types/ortho';
import { Layers, AlertCircle, Info, ArrowLeftRight } from 'lucide-react';

interface ClinicalOcclusionViewProps {
  occlusion: ModelOcclusion;
  onChange: (updated: ModelOcclusion) => void;
  isLearningMode: boolean;
  onOpenFormula: (custom: { title: string; formula: string; description: string; reference: string }) => void;
}

export const ClinicalOcclusionView: React.FC<ClinicalOcclusionViewProps> = ({
  occlusion,
  onChange,
  isLearningMode,
  onOpenFormula
}) => {
  const updateField = <K extends keyof ModelOcclusion>(field: K, value: ModelOcclusion[K]) => {
    onChange({
      ...occlusion,
      [field]: value
    });
  };

  // Midline inference calculation
  const getMidlineInference = () => {
    const upShift = typeof occlusion.upperMidline === 'number' ? occlusion.upperMidline : 0;
    const lowShift = typeof occlusion.lowerMidline === 'number' ? occlusion.lowerMidline : 0;
    const upDir = occlusion.upperMidlineDirection;
    const lowDir = occlusion.lowerMidlineDirection;

    if (upDir === 'Coincident' && lowDir === 'Coincident') {
      return 'Upper and lower midlines are coincident with facial midline.';
    }

    const parts: string[] = [];
    if (upDir !== 'Coincident' && upShift > 0) {
      parts.push(`Upper dental midline shifted ${upShift} mm to ${upDir.replace('Shifted ', '')}.`);
    } else if (upDir === 'Coincident') {
      parts.push('Upper dental midline is coincident with facial midline.');
    }

    if (lowDir !== 'Coincident' && lowShift > 0) {
      parts.push(`Lower dental midline shifted ${lowShift} mm to ${lowDir.replace('Shifted ', '')}.`);
    } else if (lowDir === 'Coincident') {
      parts.push('Lower dental midline is coincident with facial midline.');
    }

    parts.push('Midline discrepancy present; differentiate skeletal deviation, functional shift, or unilateral dental drifting.');
    return parts.join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Clinical & Model Occlusion</h2>
              <p className="text-xs text-slate-500">
                Evaluation of teeth present, inter-arch sagittal/vertical/transverse relations and midlines.
              </p>
            </div>
          </div>
        </div>

        {isLearningMode && (
          <div className="mb-6 bg-indigo-50/80 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-950 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
            <div>
              <strong>MDS Educational Note:</strong> Static occlusion reflects molar and canine sagittal relationships (Angle's classification), incisor overlap, and transverse coordination. Always verify whether a dental midline shift is secondary to unilateral premature contact causing a functional mandibular shift.
            </div>
          </div>
        )}

        {/* Teeth Present */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Maxillary Teeth Present</label>
            <input
              type="text"
              value={occlusion.teethPresentUpper}
              onChange={(e) => updateField('teethPresentUpper', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 17 to 27 fully erupted"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mandibular Teeth Present</label>
            <input
              type="text"
              value={occlusion.teethPresentLower}
              onChange={(e) => updateField('teethPresentLower', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 37 to 47 fully erupted"
            />
          </div>
        </div>

        {/* Models in Occlusion: Canine & Molar */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Models in Occlusion – Sagittal Relationships
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Right Molar Relation</label>
              <select
                value={occlusion.rightMolar}
                onChange={(e) => updateField('rightMolar', e.target.value as AngleClass)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Class I">Class I</option>
                <option value="Class II div 1">Class II div 1</option>
                <option value="Class II div 2">Class II div 2</option>
                <option value="Class III">Class III</option>
                <option value="End-on">End-on</option>
                <option value="Not Recorded">Not Recorded</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Left Molar Relation</label>
              <select
                value={occlusion.leftMolar}
                onChange={(e) => updateField('leftMolar', e.target.value as AngleClass)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Class I">Class I</option>
                <option value="Class II div 1">Class II div 1</option>
                <option value="Class II div 2">Class II div 2</option>
                <option value="Class III">Class III</option>
                <option value="End-on">End-on</option>
                <option value="Not Recorded">Not Recorded</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Right Canine Relation</label>
              <select
                value={occlusion.rightCanine}
                onChange={(e) => updateField('rightCanine', e.target.value as CanineClass)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Class I">Class I</option>
                <option value="Class II">Class II</option>
                <option value="Class III">Class III</option>
                <option value="Not Recorded">Not Recorded</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Left Canine Relation</label>
              <select
                value={occlusion.leftCanine}
                onChange={(e) => updateField('leftCanine', e.target.value as CanineClass)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Class I">Class I</option>
                <option value="Class II">Class II</option>
                <option value="Class III">Class III</option>
                <option value="Not Recorded">Not Recorded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overjet, Overbite, Transverse */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800">Overjet (OJ)</label>
              <span className="text-xs text-slate-500">Normal: 2 to 3 mm</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                value={occlusion.overjet}
                onChange={(e) => updateField('overjet', e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-semibold"
                placeholder="2.5"
              />
              <span className="text-xs font-medium text-slate-600">mm</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {typeof occlusion.overjet === 'number' && (
                occlusion.overjet > 3.5 ? 'Increased overjet' :
                occlusion.overjet < 1.0 ? 'Reduced / edge-to-edge overjet' : 'Within normal limits'
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800">Overbite (OB)</label>
              <span className="text-xs text-slate-500">Normal: 2 mm (10-30%)</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                value={occlusion.overbite}
                onChange={(e) => updateField('overbite', e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-semibold"
                placeholder="2.0"
              />
              <span className="text-xs font-medium text-slate-600">mm / %</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {typeof occlusion.overbite === 'number' && (
                occlusion.overbite > 3.5 ? 'Increased overbite / deep bite' :
                occlusion.overbite < 1.0 ? 'Reduced overbite / open bite tendency' : 'Normal vertical overlap'
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 mb-1">Transverse Relation / Crossbite</label>
            <select
              value={occlusion.transverseRelation}
              onChange={(e) => updateField('transverseRelation', e.target.value as CrossbiteType)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-2"
            >
              <option value="None">None (Normal transverse)</option>
              <option value="Unilateral Right">Unilateral Right Posterior Crossbite</option>
              <option value="Unilateral Left">Unilateral Left Posterior Crossbite</option>
              <option value="Bilateral">Bilateral Posterior Crossbite</option>
              <option value="Anterior Crossbite">Anterior Crossbite</option>
            </select>
            <input
              type="text"
              value={occlusion.crossbiteNotes}
              onChange={(e) => updateField('crossbiteNotes', e.target.value)}
              placeholder="Teeth involved / scissor bite notes..."
              className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Dental Midlines */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowLeftRight className="w-4 h-4 text-indigo-600" />
              Midline Analysis (Upper & Lower vs Facial Midline)
            </h3>
            <button
              onClick={() => onOpenFormula({
                title: 'Midline Discrepancy & Evaluation',
                formula: 'Upper Shift vs Lower Shift relative to Philtrum / Facial Midline',
                description: 'Midline evaluation must distinguish whether discrepancy lies in the maxilla (skeletal/dental), the mandible (functional mandibular shift or true asymmetry), or both.',
                reference: 'Contemporary Orthodontics (Proffit 7th ed.)'
              })}
              className="text-xs text-indigo-700 hover:text-indigo-900 font-medium flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" /> Clinical Guide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Upper Dental Midline</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={occlusion.upperMidlineDirection}
                  onChange={(e) => updateField('upperMidlineDirection', e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Coincident">Coincident</option>
                  <option value="Shifted Right">Shifted Right</option>
                  <option value="Shifted Left">Shifted Left</option>
                </select>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={occlusion.upperMidline}
                    onChange={(e) => updateField('upperMidline', e.target.value === '' ? '' : Math.abs(parseFloat(e.target.value)))}
                    disabled={occlusion.upperMidlineDirection === 'Coincident'}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg disabled:opacity-40"
                    placeholder="0"
                  />
                  <span className="text-xs text-slate-500">mm</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lower Dental Midline</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={occlusion.lowerMidlineDirection}
                  onChange={(e) => updateField('lowerMidlineDirection', e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Coincident">Coincident</option>
                  <option value="Shifted Right">Shifted Right</option>
                  <option value="Shifted Left">Shifted Left</option>
                </select>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={occlusion.lowerMidline}
                    onChange={(e) => updateField('lowerMidline', e.target.value === '' ? '' : Math.abs(parseFloat(e.target.value)))}
                    disabled={occlusion.lowerMidlineDirection === 'Coincident'}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg disabled:opacity-40"
                    placeholder="0"
                  />
                  <span className="text-xs text-slate-500">mm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
            <span className="font-semibold text-slate-800 block mb-0.5">Educational Inference:</span>
            <p className="text-slate-600">{getMidlineInference()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
