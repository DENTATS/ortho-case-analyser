import React from 'react';
import { CaseData } from '../../types/ortho';
import { generateInference } from '../../utils/orthoInference';
import {
  GitCompare,
  AlertCircle,
  FileCheck2,
  Sparkles,
  ClipboardEdit,
  Lightbulb,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface CrossCheckSummaryViewProps {
  caseData: CaseData;
  onUpdateNotes: (notes: string) => void;
  onUpdateDiagnosisOverride: (draft: string) => void;
  isLearningMode: boolean;
}

export const CrossCheckSummaryView: React.FC<CrossCheckSummaryViewProps> = ({
  caseData,
  onUpdateNotes,
  onUpdateDiagnosisOverride,
  isLearningMode
}) => {
  const inference = generateInference(caseData);

  return (
    <div className="space-y-6">
      {/* 1. CROSS-CHECK SYSTEM BANNER */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Orthodontic Multi-Analysis Cross-Check</h2>
              <p className="text-xs text-slate-500">
                Rule-based algorithmic cross-correlation between model indices, skeletal planes, vertical patterns, and soft tissue.
              </p>
            </div>
          </div>
        </div>

        {/* Cross Check Findings Cards */}
        {inference.crossChecks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {inference.crossChecks.map((check, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  check.type === 'consistent'
                    ? 'bg-blue-50/50 border-blue-200'
                    : check.type === 'discrepant'
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-indigo-50/50 border-indigo-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {check.domain}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    check.type === 'consistent' ? 'bg-blue-200 text-blue-900' :
                    check.type === 'discrepant' ? 'bg-amber-200 text-amber-900' :
                    'bg-indigo-200 text-indigo-900'
                  }`}>
                    {check.type}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">{check.summary}</h4>
                <div className="text-xs text-slate-500 mb-2 font-mono">
                  Parameters: {check.parametersInvolved.join(' • ')}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-slate-200/50">
                  <strong className="text-slate-900">Clinical Implication:</strong> {check.clinicalImplication}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 mb-6">
            Enter cephalometric and model analysis values to generate multi-parameter cross-check correlations.
          </div>
        )}

        {/* 2. STRUCTURED FINAL ORTHODONTIC SUMMARY */}
        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 mb-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-blue-600" />
            Synthesized Case Findings Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Skeletal */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1.5">1. Skeletal Pattern</h4>
              <div>
                <span className="font-semibold text-slate-700">Sagittal: </span>
                <span className="text-slate-600">{inference.skeletal.sagittal}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Vertical: </span>
                <span className="text-slate-600">{inference.skeletal.vertical}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Transverse: </span>
                <span className="text-slate-600">{inference.skeletal.transverse}</span>
              </div>
            </div>

            {/* Dental */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1.5">2. Dental Pattern</h4>
              <div>
                <span className="font-semibold text-slate-700">Molar & Canine: </span>
                <span className="text-slate-600">{inference.dental.molarCanine}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Overjet & Overbite: </span>
                <span className="text-slate-600">{inference.dental.overjetOverbite}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Midlines: </span>
                <span className="text-slate-600">{inference.dental.midlines}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Incisor Inclination: </span>
                <span className="text-slate-600">{inference.dental.incisorInclination}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Bolton Ratio: </span>
                <span className="text-slate-600">{inference.dental.bolton}</span>
              </div>
            </div>

            {/* Soft Tissue */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1.5">3. Soft Tissue & Profile</h4>
              <div>
                <span className="font-semibold text-slate-700">Profile & Lips: </span>
                <span className="text-slate-600">{inference.softTissue.profile}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Nasolabial Angle: </span>
                <span className="text-slate-600">{inference.softTissue.nasolabialAngle}</span>
              </div>
            </div>

            {/* Growth & Space */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1.5">4. Biological Growth & Space</h4>
              <div>
                <span className="font-semibold text-slate-700">CVM Staging: </span>
                <span className="text-slate-600">{inference.growth.stage} — {inference.growth.status}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Upper Space Discrepancy: </span>
                <span className="font-semibold text-slate-800">{inference.space.upperInference}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Lower Space Discrepancy: </span>
                <span className="font-semibold text-slate-800">{inference.space.lowerInference}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. CASE DIAGNOSIS – STUDENT DRAFT */}
        <div className="border border-blue-200 rounded-xl p-5 bg-blue-50/30 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardEdit className="w-4 h-4 text-blue-700" />
              Case Diagnosis – Student Draft
            </h3>
            <span className="text-[11px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-semibold border border-amber-200">
              AI-assisted educational draft – verify clinically
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-3">
            The software assembles your clinical findings into a structured orthodontic diagnostic summary. You may edit or augment this text before printing or finalizing your report.
          </p>

          <textarea
            rows={4}
            value={caseData.studentDiagnosisDraftOverride ?? inference.studentDiagnosisDraft}
            onChange={(e) => onUpdateDiagnosisOverride(e.target.value)}
            className="w-full p-3 text-xs bg-white border border-blue-200 rounded-xl text-slate-800 leading-relaxed focus:ring-2 focus:ring-blue-500 shadow-2xs"
            placeholder="Edit educational diagnostic summary..."
          />
        </div>

        {/* 4. TREATMENT PLANNING CONSIDERATIONS */}
        <div className="border border-amber-200 rounded-xl p-5 bg-amber-50/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              Possible Educational Treatment Considerations
            </h3>
            <span className="text-[11px] text-amber-800 font-medium">Non-prescriptive considerations</span>
          </div>

          <div className="space-y-2 text-xs">
            {inference.treatmentConsiderations.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-white p-3 rounded-lg border border-amber-100">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-slate-700 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200/60 text-[11px] text-amber-900 flex items-center justify-between">
            <span><strong>Academic Standard:</strong> The final diagnosis and treatment mechanics remain the exclusive responsibility of the treating orthodontist.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
