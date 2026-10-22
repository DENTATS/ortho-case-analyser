import React from 'react';
import { RadiographicChecklist } from '../../types/ortho';
import { Scan, ShieldAlert, CheckSquare } from 'lucide-react';

interface RadiographicViewProps {
  radiographic: RadiographicChecklist;
  onChange: (updated: RadiographicChecklist) => void;
  isLearningMode: boolean;
}

export const RadiographicView: React.FC<RadiographicViewProps> = ({
  radiographic,
  onChange,
  isLearningMode
}) => {
  const updateField = <K extends keyof RadiographicChecklist>(field: K, value: string) => {
    onChange({
      ...radiographic,
      [field]: value
    });
  };

  const checklistItems: { key: keyof RadiographicChecklist; label: string; placeholder: string }[] = [
    { key: 'teethPresent', label: 'Teeth Present', placeholder: 'e.g. All permanent teeth 17-27, 37-47 erupted' },
    { key: 'teethAbsent', label: 'Teeth Absent / Congenitally Missing', placeholder: 'e.g. Third molars absent or developing' },
    { key: 'rootResorption', label: 'Root Resorption', placeholder: 'e.g. No signs of pre-treatment apical or external resorption' },
    { key: 'rootFormation', label: 'Root Formation Stage', placeholder: 'e.g. Completed on all anterior teeth and first permanent molars' },
    { key: 'eruptionLevel', label: 'Eruption Level / Impactions', placeholder: 'e.g. Maxillary canines erupting favorably, no impactions' },
    { key: 'characterOfRestoration', label: 'Character of Restoration / Endodontic Status', placeholder: 'e.g. Occlusal sealant on 36 and 46; no pulp involvement' },
    { key: 'laminaDura', label: 'Lamina Dura Integrity', placeholder: 'e.g. Continuous, uniform crestal and periapical lamina dura' },
    { key: 'heightOfInterdentalCrest', label: 'Height of Interdental Alveolar Crest', placeholder: 'e.g. Normal bone crest height (1-1.5 mm below CEJ)' },
    { key: 'supernumeraryTeeth', label: 'Supernumerary Teeth / Odontomas', placeholder: 'e.g. None observed in midline or anterior region' },
    { key: 'thirdMolars', label: 'Third Molar Status & Angulation', placeholder: 'e.g. 18, 28, 38, 48 tooth crypts present, developing' },
    { key: 'pathologicalCondition', label: 'Pathological Conditions / Cysts / Radiolucencies', placeholder: 'e.g. Normal trabecular architecture, no radiolucency' },
    { key: 'otherInvestigations', label: 'Other Special Investigations / CBCT / Occlusal', placeholder: 'e.g. Lateral cephalogram taken in NHP with centric occlusion' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Radiographic & Imaging Checklist</h2>
              <p className="text-xs text-slate-500">
                Orthopantomogram (OPG) and Intraoral Periapical (IOPA) structured findings.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2 mb-6">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Educational Radiographic Safety Notice:</strong> The software organizes entered student findings into structured reports but does not perform autonomous radiographic interpretation. Radiographic diagnosis remains the clinical responsibility of the treating clinician.
          </div>
        </div>

        {/* OPG Checklist Grid */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            Panoramic Radiograph (OPG) Examination
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checklistItems.map((item) => (
              <div key={item.key} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  {item.label}
                </label>
                <input
                  type="text"
                  value={radiographic[item.key]}
                  onChange={(e) => updateField(item.key, e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={item.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* IOPA Findings */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Intraoral Periapical Radiograph (IOPA) & Localized Views
          </h3>
          <textarea
            rows={3}
            value={radiographic.iopaFindings}
            onChange={(e) => updateField('iopaFindings', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Document detailed findings for specific root apices, periodontal ligament spaces, dilacerations, impacted canines, or previous endodontic restorations..."
          />
        </div>
      </div>
    </div>
  );
};
