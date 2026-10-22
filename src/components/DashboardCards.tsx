import React from 'react';
import { CaseData } from '../types/ortho';
import { generateInference } from '../utils/orthoInference';
import { calculateSpaceArch } from '../utils/orthoCalculations';
import { User, Activity, Compass, Layers, Ruler, Smile } from 'lucide-react';

interface DashboardCardsProps {
  caseData: CaseData;
  onNavigateToTab: (tabId: string) => void;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({ caseData, onNavigateToTab }) => {
  const inference = generateInference(caseData);
  const lowerSpace = calculateSpaceArch(caseData.spaceAnalysis.lower);

  // Quick summary tags
  const skeletalTag = inference.skeletal.sagittal.includes('Class II') ? 'Class II tendency' :
                      inference.skeletal.sagittal.includes('Class III') ? 'Class III tendency' : 'Class I harmonious';

  const verticalTag = inference.skeletal.vertical.includes('hyperdivergent') ? 'High Angle / Hyperdivergent' :
                      inference.skeletal.vertical.includes('hypodivergent') ? 'Low Angle / Hypodivergent' : 'Normodivergent';

  const spaceTag = lowerSpace.discrepancy < 0 ? `${lowerSpace.discrepancy} mm Deficit` :
                   lowerSpace.discrepancy > 0 ? `+${lowerSpace.discrepancy} mm Surplus` : '0.0 mm Equilibrium';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {/* Patient */}
      <button
        onClick={() => onNavigateToTab('patient')}
        className="p-3 bg-white rounded-xl border border-slate-200 text-left hover:border-blue-400 hover:shadow-xs transition-all group"
      >
        <div className="flex items-center justify-between text-slate-400 group-hover:text-blue-600 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Patient</span>
          <User className="w-3.5 h-3.5" />
        </div>
        <div className="font-bold text-slate-900 text-sm truncate font-mono">
          {caseData.patient.id || 'No ID'}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">
          {caseData.patient.age ? `${caseData.patient.age} yrs • ${caseData.patient.sex}` : 'Age pending'}
        </div>
      </button>

      {/* CVM */}
      <button
        onClick={() => onNavigateToTab('cvm')}
        className="p-3 bg-white rounded-xl border border-slate-200 text-left hover:border-rose-400 hover:shadow-xs transition-all group"
      >
        <div className="flex items-center justify-between text-slate-400 group-hover:text-rose-600 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">CVM Stage</span>
          <Activity className="w-3.5 h-3.5" />
        </div>
        <div className="font-bold text-slate-900 text-sm">
          {caseData.cvmStage ? `CS ${caseData.cvmStage}` : 'Unselected'}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5 truncate">
          {inference.growth.remainingGrowth.split(' ')[0]} {inference.growth.remainingGrowth.split(' ')[1] || 'Growth'}
        </div>
      </button>

      {/* Skeletal */}
      <button
        onClick={() => onNavigateToTab('summary')}
        className="p-3 bg-white rounded-xl border border-slate-200 text-left hover:border-indigo-400 hover:shadow-xs transition-all group"
      >
        <div className="flex items-center justify-between text-slate-400 group-hover:text-indigo-600 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Skeletal</span>
          <Compass className="w-3.5 h-3.5" />
        </div>
        <div className="font-bold text-slate-900 text-xs truncate">
          {skeletalTag}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">
          ANB: {caseData.steiner.anb !== '' ? `${caseData.steiner.anb}°` : '—'}
        </div>
      </button>

      {/* Vertical */}
      <button
        onClick={() => onNavigateToTab('ceph')}
        className="p-3 bg-white rounded-xl border border-slate-200 text-left hover:border-violet-400 hover:shadow-xs transition-all group"
      >
        <div className="flex items-center justify-between text-slate-400 group-hover:text-violet-600 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Vertical</span>
          <Layers className="w-3.5 h-3.5" />
        </div>
        <div className="font-bold text-slate-900 text-xs truncate">
          {verticalTag.split(' / ')[0]}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">
          FMPA: {caseData.tweed.fmpa !== '' ? `${caseData.tweed.fmpa}°` : '—'}
        </div>
      </button>

      {/* Dental Overjet / Overbite */}
      <button
        onClick={() => onNavigateToTab('clinical')}
        className="p-3 bg-white rounded-xl border border-slate-200 text-left hover:border-emerald-400 hover:shadow-xs transition-all group"
      >
        <div className="flex items-center justify-between text-slate-400 group-hover:text-emerald-600 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Dental OJ/OB</span>
          <Smile className="w-3.5 h-3.5" />
        </div>
        <div className="font-bold text-slate-900 text-xs truncate">
          OJ: {caseData.modelOcclusion.overjet !== '' ? `${caseData.modelOcclusion.overjet} mm` : '—'}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">
          OB: {caseData.modelOcclusion.overbite !== '' ? `${caseData.modelOcclusion.overbite} mm` : '—'}
        </div>
      </button>

      {/* Space Analysis */}
      <button
        onClick={() => onNavigateToTab('space')}
        className="p-3 bg-white rounded-xl border border-slate-200 text-left hover:border-purple-400 hover:shadow-xs transition-all group"
      >
        <div className="flex items-center justify-between text-slate-400 group-hover:text-purple-600 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Lower Space</span>
          <Ruler className="w-3.5 h-3.5" />
        </div>
        <div className={`font-bold text-xs truncate ${lowerSpace.discrepancy < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
          {spaceTag}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">
          Spee: {caseData.mandibular.curveOfSpeeRightDepth !== '' ? `${caseData.mandibular.curveOfSpeeRightDepth} mm` : '—'}
        </div>
      </button>
    </div>
  );
};
