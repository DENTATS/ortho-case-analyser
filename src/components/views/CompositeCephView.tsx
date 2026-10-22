import React, { useState } from 'react';
import { CompositeCephStage } from '../../types/ortho';
import { calculateStageDelta } from '../../utils/orthoCalculations';
import { Layers, ArrowRight, GitCommit, Split } from 'lucide-react';

interface CompositeCephViewProps {
  composite: {
    preTreatment: CompositeCephStage;
    midTreatment: CompositeCephStage;
    postTreatment: CompositeCephStage;
  };
  onChangeComposite: (updated: {
    preTreatment: CompositeCephStage;
    midTreatment: CompositeCephStage;
    postTreatment: CompositeCephStage;
  }) => void;
  isLearningMode: boolean;
}

export const CompositeCephView: React.FC<CompositeCephViewProps> = ({
  composite,
  onChangeComposite,
  isLearningMode
}) => {
  const [selectedStage, setSelectedStage] = useState<'preTreatment' | 'midTreatment' | 'postTreatment'>('preTreatment');

  const deltaPreToMid = calculateStageDelta(composite.preTreatment, composite.midTreatment);
  const deltaPreToPost = calculateStageDelta(composite.preTreatment, composite.postTreatment);

  const updateStageField = <K extends keyof CompositeCephStage>(
    stage: 'preTreatment' | 'midTreatment' | 'postTreatment',
    field: K,
    val: number | ''
  ) => {
    onChangeComposite({
      ...composite,
      [stage]: {
        ...composite[stage],
        [field]: val
      }
    });
  };

  const domainGroups: {
    title: string;
    params: { key: keyof CompositeCephStage; name: string; norm: string; unit: string }[];
  }[] = [
    {
      title: 'I. Maxilla to Cranium',
      params: [
        { key: 'sna', name: 'SNA', norm: '82.0°', unit: '°' },
        { key: 'nPerpToA', name: 'N perpendicular to Point A', norm: '0.0 mm', unit: 'mm' },
        { key: 'effMaxillaryLength', name: 'Effective Maxillary Length (Co-A)', norm: '90.0 mm', unit: 'mm' },
        { key: 'convexityOfPointA', name: 'Convexity of Point A (Ricketts)', norm: '2.0 mm', unit: 'mm' }
      ]
    },
    {
      title: 'II. Mandible to Cranium',
      params: [
        { key: 'snb', name: 'SNB', norm: '80.0°', unit: '°' },
        { key: 'facialAngle', name: 'Facial Angle (Downs)', norm: '87.8°', unit: '°' },
        { key: 'effMandibularLength', name: 'Effective Mandibular Length (Co-Gn)', norm: '115.0 mm', unit: 'mm' },
        { key: 'nPerpToPog', name: 'N perpendicular to Pogonion', norm: '-2.0 mm', unit: 'mm' }
      ]
    },
    {
      title: 'III. Maxilla to Mandible',
      params: [
        { key: 'anb', name: 'ANB', norm: '2.0°', unit: '°' },
        { key: 'abPlaneAngle', name: 'A-B Plane Angle', norm: '-4.6°', unit: '°' },
        { key: 'wits', name: 'Wits Appraisal (BO - AO)', norm: '0.0 mm', unit: 'mm' },
        { key: 'angleOfConvexity', name: 'Angle of Convexity (N-A-Pog)', norm: '0.0°', unit: '°' },
        { key: 'maxilloMandibularDiff', name: 'Maxillomandibular Differential', norm: '25.0 mm', unit: 'mm' }
      ]
    },
    {
      title: 'IV. Vertical Relationship',
      params: [
        { key: 'goGnToSN', name: 'Go-Gn to SN', norm: '32.0°', unit: '°' },
        { key: 'fhToMandibularPlane', name: 'FH to Mandibular Plane (FMA)', norm: '25.0°', unit: '°' },
        { key: 'fmpa', name: 'FMPA (Tweed)', norm: '25.0°', unit: '°' },
        { key: 'facialAxisAngle', name: 'Facial Axis Angle', norm: '90.0°', unit: '°' },
        { key: 'yAxis', name: 'Y-Axis', norm: '59.4°', unit: '°' },
        { key: 'jarabakRatio', name: 'Jarabak Ratio (S-Go/N-Me)', norm: '63.5%', unit: '%' },
        { key: 'snToOcclusalPlane', name: 'SN to Occlusal Plane', norm: '14.0°', unit: '°' },
        { key: 'palatalToOcclusalPlane', name: 'Palatal to Occlusal Plane', norm: '8.0°', unit: '°' },
        { key: 'lafh', name: 'Lower Anterior Facial Height (LAFH)', norm: '65.0 mm', unit: 'mm' },
        { key: 'sumOfPosteriorAngles', name: 'Sum of Posterior Angles (Jarabak)', norm: '396.0°', unit: '°' }
      ]
    },
    {
      title: 'V. Dental Parameters',
      params: [
        { key: 'u1ToNAAngle', name: 'Upper 1 to NA (angle)', norm: '22.0°', unit: '°' },
        { key: 'u1ToNAMm', name: 'Upper 1 to NA (mm)', norm: '4.0 mm', unit: 'mm' },
        { key: 'u1ToSN', name: 'Upper 1 to SN (angle)', norm: '102.0°', unit: '°' },
        { key: 'l1ToNBAngle', name: 'Lower 1 to NB (angle)', norm: '25.0°', unit: '°' },
        { key: 'l1ToNBMm', name: 'Lower 1 to NB (mm)', norm: '4.0 mm', unit: 'mm' },
        { key: 'impa', name: 'IMPA (Tweed)', norm: '90.0°', unit: '°' },
        { key: 'interincisalAngle', name: 'Interincisal Angle (U1-L1)', norm: '131.0°', unit: '°' },
        { key: 'holdawayRatio', name: 'Holdaway Ratio (L1-NB : Pog-NB)', norm: '1.0 : 1', unit: 'ratio' }
      ]
    },
    {
      title: 'VI. Soft Tissue',
      params: [
        { key: 'upperLipToELine', name: 'Upper Lip to E-Line', norm: '-3.0 mm', unit: 'mm' },
        { key: 'lowerLipToELine', name: 'Lower Lip to E-Line', norm: '-1.0 mm', unit: 'mm' },
        { key: 'nasolabialAngle', name: 'Nasolabial Angle', norm: '102.0°', unit: '°' },
        { key: 'merrifieldZAngle', name: 'Merrifield Z Angle', norm: '78.0°', unit: '°' },
        { key: 'sLine', name: 'Steiner S-Line to Lips', norm: '0.0 mm', unit: 'mm' },
        { key: 'mentolabialSulcusDepth', name: 'Mentolabial Sulcus Depth', norm: '4.0 mm', unit: 'mm' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Composite Cephalometric Analysis Dashboard</h2>
              <p className="text-xs text-slate-500">
                Multi-stage comparison across Pre-Treatment (T1), Mid-Treatment (T2), and Post-Treatment (T3).
              </p>
            </div>
          </div>
        </div>

        {/* Stage Selection & Comparison Mode */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Select Active Entry Stage:</span>
            <div className="flex gap-1.5">
              {(['preTreatment', 'midTreatment', 'postTreatment'] as const).map((stage) => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedStage === stage
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {stage === 'preTreatment' ? 'Pre-Treatment (T1)' :
                   stage === 'midTreatment' ? 'Mid-Treatment (T2)' : 'Post-Treatment (T3)'}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
            <GitCommit className="w-4 h-4 text-blue-600" />
            <span>Automatic deltas (T2 - T1) & (T3 - T1) calculated in real-time</span>
          </div>
        </div>

        {/* Domain Groups Grid */}
        <div className="space-y-6">
          {domainGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>{group.title}</span>
                <span className="text-[11px] text-slate-400 font-normal">Standard Normative Reference</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/60 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="px-3 py-2 w-1/3">Parameter</th>
                      <th className="px-3 py-2 text-center w-24">Norm Standard</th>
                      <th className="px-3 py-2 text-center bg-blue-50/30">Pre-Tx (T1)</th>
                      <th className="px-3 py-2 text-center bg-indigo-50/30">Mid-Tx (T2)</th>
                      <th className="px-3 py-2 text-center bg-emerald-50/30">Post-Tx (T3)</th>
                      <th className="px-3 py-2 text-center font-bold text-slate-700">Change (T3 - T1)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {group.params.map((p) => {
                      const preVal = composite.preTreatment[p.key];
                      const midVal = composite.midTreatment[p.key];
                      const postVal = composite.postTreatment[p.key];
                      const deltaPost = deltaPreToPost[p.key];

                      return (
                        <tr key={p.key} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-3 py-2 font-medium text-slate-900">
                            {p.name}
                          </td>

                          <td className="px-3 py-2 text-center text-slate-500 font-mono text-[11px]">
                            {p.norm}
                          </td>

                          <td className="px-3 py-2 text-center bg-blue-50/20">
                            <input
                              type="number"
                              step="0.5"
                              value={preVal ?? ''}
                              onChange={(e) => updateStageField('preTreatment', p.key, e.target.value === '' ? '' : parseFloat(e.target.value))}
                              className="w-18 px-1.5 py-0.5 border border-slate-200 rounded text-center font-semibold bg-white text-xs"
                              placeholder="0.0"
                            />
                          </td>

                          <td className="px-3 py-2 text-center bg-indigo-50/20">
                            <input
                              type="number"
                              step="0.5"
                              value={midVal ?? ''}
                              onChange={(e) => updateStageField('midTreatment', p.key, e.target.value === '' ? '' : parseFloat(e.target.value))}
                              className="w-18 px-1.5 py-0.5 border border-slate-200 rounded text-center font-semibold bg-white text-xs"
                              placeholder="0.0"
                            />
                          </td>

                          <td className="px-3 py-2 text-center bg-emerald-50/20">
                            <input
                              type="number"
                              step="0.5"
                              value={postVal ?? ''}
                              onChange={(e) => updateStageField('postTreatment', p.key, e.target.value === '' ? '' : parseFloat(e.target.value))}
                              className="w-18 px-1.5 py-0.5 border border-slate-200 rounded text-center font-semibold bg-white text-xs"
                              placeholder="0.0"
                            />
                          </td>

                          <td className="px-3 py-2 text-center font-mono font-bold text-xs">
                            {deltaPost !== null ? (
                              <span className={
                                deltaPost === 0 ? 'text-slate-400' :
                                deltaPost > 0 ? 'text-blue-700' : 'text-purple-700'
                              }>
                                {deltaPost > 0 ? `+${deltaPost}` : deltaPost} {p.unit}
                              </span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
