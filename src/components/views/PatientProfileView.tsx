import React from 'react';
import { PatientProfile, Sex } from '../../types/ortho';
import { User, Calendar, FileText, Activity, AlertCircle } from 'lucide-react';

interface PatientProfileViewProps {
  patient: PatientProfile;
  onChange: (updated: PatientProfile) => void;
  isLearningMode: boolean;
}

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({
  patient,
  onChange,
  isLearningMode
}) => {
  const updateField = <K extends keyof PatientProfile>(field: K, value: PatientProfile[K]) => {
    onChange({
      ...patient,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Patient Demographics & Case History</h2>
              <p className="text-xs text-slate-500">
                Primary Case History Format Specification (Section 1). Patient name is optional for student privacy.
              </p>
            </div>
          </div>
        </div>

        {isLearningMode && (
          <div className="mb-6 bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <strong>MDS Educational Note:</strong> A comprehensive orthodontic case history establishes the biological age, chief complaint, habit history, and growth window. In growing patients, the chronological age provides an initial benchmark before radiographic CVM staging.
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Patient ID / Case No. *</label>
            <input
              type="text"
              value={patient.id}
              onChange={(e) => updateField('id', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="e.g. ORTHO-4012"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Patient Name <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={patient.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Master A.K. / Anonymous"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Years) *</label>
            <div className="flex items-center">
              <input
                type="number"
                min="5"
                max="80"
                step="0.5"
                value={patient.age}
                onChange={(e) => updateField('age', e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 13"
              />
              <span className="ml-2 text-xs text-slate-500 font-medium">yrs</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Sex *</label>
            <select
              value={patient.sex}
              onChange={(e) => updateField('sex', e.target.value as Sex)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Record Date</label>
            <div className="relative">
              <input
                type="date"
                value={patient.date}
                onChange={(e) => updateField('date', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Growth Status</label>
            <input
              type="text"
              value={patient.growthStatus}
              onChange={(e) => updateField('growthStatus', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Pubertal growth spurt / Post-pubertal"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Chief Complaint <span className="text-slate-400 font-normal">(in patient's own words)</span>
            </label>
            <input
              type="text"
              value={patient.chiefComplaint}
              onChange={(e) => updateField('chiefComplaint', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Forwardly placed upper front teeth, irregular lower teeth"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">History of Present Illness</label>
            <textarea
              rows={2}
              value={patient.historyOfPresentIllness}
              onChange={(e) => updateField('historyOfPresentIllness', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
              placeholder="Describe onset, duration, progression and awareness of malocclusion..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Medical History</label>
              <textarea
                rows={2}
                value={patient.medicalHistory}
                onChange={(e) => updateField('medicalHistory', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="Systemic conditions, allergies, bone disorders, chronic medications..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dental History</label>
              <textarea
                rows={2}
                value={patient.dentalHistory}
                onChange={(e) => updateField('dentalHistory', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="Trauma, dental extractions, restorative work, regular check-ups..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Family History</label>
              <input
                type="text"
                value={patient.familyHistory}
                onChange={(e) => updateField('familyHistory', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="Parental profile tendency, mandibular prognathism..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Oral Habits</label>
              <input
                type="text"
                value={patient.oralHabits}
                onChange={(e) => updateField('oralHabits', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="Mouth breathing, tongue thrust, thumb sucking, lip biting..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Previous Orthodontic Treatment</label>
              <input
                type="text"
                value={patient.previousOrthoTreatment}
                onChange={(e) => updateField('previousOrthoTreatment', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="Removable appliances, habit breaker, expansion, none..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
