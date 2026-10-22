import React, { useState } from 'react';
import { Sex, CaseData } from '../types/ortho';
import { createEmptyCase, getDemoCase } from '../data/demoCase';
import { X, PlusCircle, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCase: (newCase: CaseData) => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onCreateCase
}) => {
  const [caseId, setCaseId] = useState(`ORTHO-${Math.floor(1000 + Math.random() * 9000)}`);
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState<number | ''>(14);
  const [sex, setSex] = useState<Sex>('Female');
  const [templateType, setTemplateType] = useState<'blank' | 'norms' | 'demo'>('blank');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    let baseCase: CaseData;
    if (templateType === 'demo') {
      baseCase = getDemoCase();
    } else {
      baseCase = createEmptyCase();
      if (templateType === 'blank') {
        // Clear all numerical fields for a completely clean slate
        baseCase.downs = {
          facialAngle: '',
          angleOfConvexity: '',
          abPlane: '',
          mandibularPlaneAngle: '',
          yAxis: '',
          cantOfOcclusalPlane: '',
          oneToOne: '',
          oneToOcclusalPlane: '',
          oneToMandibularPlane: '',
          oneToAPog: ''
        };
        baseCase.steiner = {
          sna: '',
          snb: '',
          snd: '',
          anb: '',
          goGnToSN: '',
          u1ToNA_mm: '',
          u1ToNA_deg: '',
          l1ToNB_mm: '',
          l1ToNB_deg: '',
          pogToNB_mm: '',
          u1ToL1_deg: '',
          occlusalToSN: '',
          sLineUpperLip: '',
          sLineLowerLip: ''
        };
        baseCase.wits = { aoValue: '', boValue: '' };
        baseCase.tweed = { fmpa: '', fmia: '', impa: '' };
        baseCase.mcnamara = {
          nPerpToA: '',
          nPerpToPog: '',
          facialAxisAngle: '',
          mandibularPlaneAngle: '',
          effMaxillaryLength: '',
          effMandibularLength: '',
          lafh: '',
          oneToPointA: '',
          oneToAPog: '',
          upperAirway: '',
          lowerAirway: ''
        };
        baseCase.maxillary.archPerimeterMeasured = '';
        baseCase.maxillary.pontActualPremolar = '';
        baseCase.maxillary.pontActualMolar = '';
        baseCase.maxillary.linderHarthActualPremolar = '';
        baseCase.maxillary.linderHarthActualMolar = '';
        baseCase.maxillary.chaddhaActualPremolar = '';
        baseCase.maxillary.chaddhaActualMolar = '';
        baseCase.maxillary.ashleyHowePMD = '';
        baseCase.maxillary.ashleyHowePMBAW = '';
        baseCase.mandibular.curveOfSpeeRightDepth = '';
        baseCase.mandibular.curveOfSpeeLeftDepth = '';
        baseCase.mandibular.archPerimeterMeasured = '';
        baseCase.modelOcclusion.overjet = '';
        baseCase.modelOcclusion.overbite = '';
      }
    }

    const createdCase: CaseData = {
      ...baseCase,
      isDemoCase: templateType === 'demo',
      lastModified: new Date().toISOString(),
      patient: {
        ...baseCase.patient,
        id: caseId.trim() || `ORTHO-${Math.floor(1000 + Math.random() * 9000)}`,
        name: patientName.trim(),
        age: age === '' ? '' : Number(age),
        sex,
        date: new Date().toISOString().split('T')[0]
      }
    };

    onCreateCase(createdCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-200" />
            <h3 className="font-bold text-base">Create New Patient Case</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs text-slate-700">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-900 mb-1">
                Case / Patient ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 font-mono font-bold text-slate-900"
                placeholder="e.g. ORTHO-4050"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Patient Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Master A.K."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">Age (Years)</label>
              <input
                type="number"
                min="5"
                max="80"
                step="0.5"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 13"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Sex</label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as Sex)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block font-bold text-slate-900 mb-1.5">Choose Starting Preset</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTemplateType('blank')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  templateType === 'blank'
                    ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-slate-900 mb-0.5">Blank Case</div>
                <div className="text-[10px] text-slate-500">Fresh empty measurements</div>
              </button>

              <button
                type="button"
                onClick={() => setTemplateType('norms')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  templateType === 'norms'
                    ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-slate-900 mb-0.5">With Norms</div>
                <div className="text-[10px] text-slate-500">Pre-populates baseline means</div>
              </button>

              <button
                type="button"
                onClick={() => setTemplateType('demo')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  templateType === 'demo'
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-slate-900 mb-0.5">Sample Case</div>
                <div className="text-[10px] text-slate-500">Full Class II case with demo values</div>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              New case will be loaded into active workspace and automatically saved.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg shadow-2xs"
              >
                Create Case
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
