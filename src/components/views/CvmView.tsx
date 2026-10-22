import React from 'react';
import { CVMStage } from '../../types/ortho';
import { CVM_STAGES_INFO } from '../../data/orthoReferences';
import { Activity, ShieldAlert, Award, Calendar, ChevronRight } from 'lucide-react';

interface CvmViewProps {
  cvmStage: CVMStage;
  onChange: (stage: CVMStage) => void;
  isLearningMode: boolean;
}

export const CvmView: React.FC<CvmViewProps> = ({
  cvmStage,
  onChange,
  isLearningMode
}) => {
  const currentInfo = cvmStage && cvmStage >= 1 && cvmStage <= 6 ? CVM_STAGES_INFO[cvmStage as 1|2|3|4|5|6] : null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-50 text-rose-700 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Cervical Vertebral Maturation (CVM) Analysis</h2>
              <p className="text-xs text-slate-500">
                Assessment of biological skeletal maturity and mandibular adolescent growth peak (Baccetti et al.).
              </p>
            </div>
          </div>
        </div>

        {/* Mandatory Educational Disclaimer */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3 text-xs text-amber-950 flex items-start gap-2 mb-6">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Important Clinical Disclaimer:</strong> CVM staging provides an <em>educational estimate</em> of adolescent craniofacial growth velocity. Individual growth variation occurs; clinical correlation with chronologic age, secondary sexual characteristics, and serial records is required.
          </div>
        </div>

        {/* Stage Selector Cards */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Select Patient's CVM Stage (CS1 – CS6)
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {[1, 2, 3, 4, 5, 6].map((stageNum) => {
              const info = CVM_STAGES_INFO[stageNum as 1|2|3|4|5|6];
              const isSelected = cvmStage === stageNum;

              return (
                <button
                  key={stageNum}
                  onClick={() => onChange(stageNum as CVMStage)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      CS {stageNum}
                    </span>
                    {isSelected && <Award className="w-3.5 h-3.5 text-rose-600" />}
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {info.name.split('– ')[1]}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                    {info.growthStatus}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Stage Breakdown Panel */}
        {currentInfo ? (
          <div className="border border-rose-200 rounded-xl bg-gradient-to-br from-rose-50/40 via-white to-slate-50 p-6 shadow-2xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg text-xs">
                {currentInfo.name}
              </span>
              <span className="text-xs text-rose-800 font-medium">Currently Selected Stage</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-rose-600" /> Morphological Characteristics (C2, C3, C4)
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {currentInfo.description}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-rose-600" /> Mandibular Adolescent Growth Peak Timing
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {currentInfo.growthStatus}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200/80">
                <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider mb-1">
                  Remaining Adolescent Growth
                </h4>
                <div className="text-sm font-bold text-rose-900">
                  {currentInfo.remainingGrowth}
                </div>
              </div>

              <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200/80">
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-1">
                  Orthodontic Treatment Timing & Clinical Window
                </h4>
                <div className="text-xs text-indigo-900 leading-relaxed">
                  {currentInfo.clinicalCorrelation}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
            Please select one of the CVM stages above to view cervical vertebral anatomy, remaining adolescent growth, and appliance timing.
          </div>
        )}
      </div>
    </div>
  );
};
