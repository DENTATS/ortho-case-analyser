import React from 'react';
import { SoftTissueAnalysisData, BurstoneSoftAnalysisData } from '../../types/ortho';
import { BURSTONE_SOFT_NORMS } from '../../data/orthoReferences';
import { Smile, Info, HeartHandshake } from 'lucide-react';

interface SoftTissueViewProps {
  softTissue: SoftTissueAnalysisData;
  burstoneSoft: BurstoneSoftAnalysisData;
  onChangeSoftTissue: (data: SoftTissueAnalysisData) => void;
  onChangeBurstoneSoft: (data: BurstoneSoftAnalysisData) => void;
  isLearningMode: boolean;
  onOpenFormula: (paramId: string) => void;
}

export const SoftTissueView: React.FC<SoftTissueViewProps> = ({
  softTissue,
  burstoneSoft,
  onChangeSoftTissue,
  onChangeBurstoneSoft,
  isLearningMode,
  onOpenFormula
}) => {
  const updateSoftField = <K extends keyof SoftTissueAnalysisData>(field: K, value: number | '') => {
    onChangeSoftTissue({
      ...softTissue,
      [field]: value
    });
  };

  const updateBurstoneField = <K extends keyof BurstoneSoftAnalysisData>(field: K, value: number | '') => {
    onChangeBurstoneSoft({
      ...burstoneSoft,
      [field]: value
    });
  };

  const classicSoftParams: {
    key: keyof SoftTissueAnalysisData;
    name: string;
    mean: number;
    range: string;
    unit: string;
    refId?: string;
    description: string;
  }[] = [
    { key: 'nasomentalAngle', name: 'Nasomental Angle', mean: 128.0, range: '120°–135°', unit: 'degrees', description: 'Angle connecting nose tip, soft pogonion, and menton' },
    { key: 'nasolabialAngle', name: 'Nasolabial Angle (Cm-Sn-Ls)', mean: 102.0, range: '90°–110°', unit: 'degrees', refId: 'soft_nasolabialAngle', description: 'Columella to upper lip philtrum angle' },
    { key: 'upperLipProminence', name: 'Upper Lip Prominence', mean: 3.0, range: '2–4 mm', unit: 'mm', description: 'Prominence of labrale superius' },
    { key: 'lowerLipProminence', name: 'Lower Lip Prominence', mean: 2.0, range: '1–3 mm', unit: 'mm', description: 'Prominence of labrale inferius' },
    { key: 'chinProminence', name: 'Chin Prominence', mean: 11.0, range: '10–12 mm', unit: 'mm', description: 'Soft tissue pogonion projection' },
    { key: 'eLineUpperLip', name: 'Upper Lip to Ricketts E-Line', mean: -3.0, range: '-4 to -2 mm', unit: 'mm', description: 'Distance of upper lip behind nose-chin esthetic line' },
    { key: 'eLineLowerLip', name: 'Lower Lip to Ricketts E-Line', mean: -1.0, range: '-2 to 0 mm', unit: 'mm', refId: 'ricketts_lowerLipToEPlane', description: 'Distance of lower lip behind nose-chin esthetic line' },
    { key: 'sLineUpperLip', name: 'Upper Lip to Steiner S-Line', mean: 0.0, range: '-1 to +1 mm', unit: 'mm', refId: 'soft_sLineUpperLip', description: 'Light contact in balanced profile' },
    { key: 'sLineLowerLip', name: 'Lower Lip to Steiner S-Line', mean: 0.0, range: '-1 to +1 mm', unit: 'mm', refId: 'soft_sLineLowerLip', description: 'Light contact in balanced profile' },
    { key: 'bLineUpperLip', name: 'Burstone B-Line', mean: 3.5, range: '2–5 mm', unit: 'mm', description: 'Upper lip distance from subnasale-pogonion reference' },
    { key: 'merrifieldZAngle', name: 'Merrifield Z Angle', mean: 78.0, range: '75°–80°', unit: 'degrees', refId: 'soft_merrifieldZAngle', description: 'Profile line tangent to chin/most prominent lip to FH' },
    { key: 'softTissueChinThickness', name: 'Soft Tissue Chin Thickness', mean: 11.5, range: '10–13 mm', unit: 'mm', description: 'Distance between hard and soft tissue pogonion' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-pink-50 text-pink-700 rounded-lg">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Soft Tissue & Facial Esthetic Analysis</h2>
              <p className="text-xs text-slate-500">
                Evaluation of lip prominence, nasolabial angle, and Burstone soft-tissue profile parameters.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-xs text-blue-950 flex items-start gap-2 mb-6">
          <HeartHandshake className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <strong>Educational Philosophy Note:</strong> Orthodontic esthetic evaluations avoid declaring a profile strictly "abnormal". Interpretations utilize neutral descriptive terminology such as <em>"More prominent than reference"</em> or <em>"Less prominent than reference"</em> to respect ethnic and individual variations.
          </div>
        </div>

        {/* Classic Soft Tissue Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider">
            Standard Soft-Tissue Facial Profile Parameters
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 text-slate-600 text-[11px] font-semibold border-b border-slate-200">
              <tr>
                <th className="px-3 py-2">Parameter</th>
                <th className="px-3 py-2 text-center">Patient Value</th>
                <th className="px-3 py-2 text-center">Reference Mean</th>
                <th className="px-3 py-2 text-center">Range</th>
                <th className="px-3 py-2 text-center">Diff</th>
                <th className="px-3 py-2">Descriptive Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classicSoftParams.map((param) => {
                const val = typeof softTissue[param.key] === 'number' ? (softTissue[param.key] as number) : null;
                const diff = val !== null ? Number((val - param.mean).toFixed(1)) : null;

                let inferenceText = 'Enter value';
                if (diff !== null) {
                  if (Math.abs(diff) <= 0.8) {
                    inferenceText = 'Consistent with normative reference standard.';
                  } else if (diff > 0.8) {
                    inferenceText = `More prominent / greater than reference (+${diff} ${param.unit}).`;
                  } else {
                    inferenceText = `Less prominent / smaller than reference (${diff} ${param.unit}).`;
                  }
                }

                return (
                  <tr key={param.key} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3 py-2.5 font-medium text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{param.name}</span>
                        {param.refId && (
                          <button
                            onClick={() => onOpenFormula(param.refId!)}
                            className="text-slate-400 hover:text-blue-600"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">{param.description}</div>
                    </td>

                    <td className="px-3 py-2.5 text-center">
                      <input
                        type="number"
                        step="0.5"
                        value={softTissue[param.key] ?? ''}
                        onChange={(e) => updateSoftField(param.key, e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="w-18 px-2 py-1 bg-white border border-slate-200 rounded text-center font-semibold text-xs"
                        placeholder="0.0"
                      />
                      <span className="text-[10px] text-slate-400 ml-1">{param.unit}</span>
                    </td>

                    <td className="px-3 py-2.5 text-center text-slate-700">
                      {param.mean} {param.unit}
                    </td>

                    <td className="px-3 py-2.5 text-center font-mono text-slate-500 text-[11px]">
                      {param.range}
                    </td>

                    <td className="px-3 py-2.5 text-center">
                      <span className={`font-mono text-xs font-semibold ${
                        diff === null ? 'text-slate-400' :
                        Math.abs(diff) <= 0.8 ? 'text-slate-700' :
                        diff > 0 ? 'text-pink-700' : 'text-blue-700'
                      }`}>
                        {diff !== null ? (diff > 0 ? `+${diff}` : `${diff}`) : '—'}
                      </span>
                    </td>

                    <td className="px-3 py-2.5 text-slate-600 text-[11px]">
                      {inferenceText}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Burstone Soft-Tissue Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider">
            Burstone Soft-Tissue Cephalometric Analysis (Legan & Burstone 1980)
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 text-slate-600 text-[11px] font-semibold border-b border-slate-200">
              <tr>
                <th className="px-3 py-2">Parameter</th>
                <th className="px-3 py-2 text-center">Patient Value</th>
                <th className="px-3 py-2 text-center">Standard Mean</th>
                <th className="px-3 py-2 text-center">Range</th>
                <th className="px-3 py-2 text-center">Diff</th>
                <th className="px-3 py-2">Educational Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(Object.keys(BURSTONE_SOFT_NORMS) as (keyof BurstoneSoftAnalysisData)[]).map((key) => {
                const norm = BURSTONE_SOFT_NORMS[key];
                if (!norm) return null;

                const val = typeof burstoneSoft[key] === 'number' ? (burstoneSoft[key] as number) : null;
                const diff = val !== null ? Number((val - norm.mean).toFixed(1)) : null;

                return (
                  <tr key={key} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3 py-2 font-medium text-slate-900">{norm.name}</td>
                    <td className="px-3 py-2 text-center">
                      <input
                        type="number"
                        step="0.5"
                        value={burstoneSoft[key] ?? ''}
                        onChange={(e) => updateBurstoneField(key, e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="w-18 px-1.5 py-0.5 border border-slate-200 rounded text-center font-semibold bg-white text-xs"
                        placeholder="0.0"
                      />
                      <span className="text-[10px] text-slate-400 ml-1">{norm.unit}</span>
                    </td>
                    <td className="px-3 py-2 text-center text-slate-700">
                      {norm.mean} {norm.unit}
                    </td>
                    <td className="px-3 py-2 text-center font-mono text-slate-500 text-[11px]">
                      {norm.range}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`font-mono text-xs font-semibold ${
                        diff === null ? 'text-slate-400' :
                        Math.abs(diff) <= 0.5 ? 'text-slate-700' :
                        diff > 0 ? 'text-purple-700' : 'text-blue-700'
                      }`}>
                        {diff !== null ? (diff > 0 ? `+${diff}` : `${diff}`) : '—'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-500 text-[11px]">
                      {diff === null ? 'Enter value' :
                       Math.abs(diff) <= 0.5 ? 'Normative proportion.' :
                       diff > 0 ? `Increased relative to standard (${diff > 0 ? `+${diff}` : diff} ${norm.unit}).` :
                       `Reduced relative to standard (${diff} ${norm.unit}).`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
