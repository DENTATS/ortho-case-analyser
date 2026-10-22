import React from 'react';
import { X, BookOpen, Calculator, Info } from 'lucide-react';
import { CEPH_REFERENCES } from '../data/orthoReferences';

interface FormulaModalProps {
  parameterId: string | null;
  customFormula?: {
    title: string;
    formula: string;
    description: string;
    reference: string;
    variables?: { name: string; desc: string }[];
  } | null;
  onClose: () => void;
}

export const FormulaModal: React.FC<FormulaModalProps> = ({ parameterId, customFormula, onClose }) => {
  if (!parameterId && !customFormula) return null;

  const ref = parameterId ? CEPH_REFERENCES[parameterId] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-200" />
            <h3 className="font-semibold text-lg tracking-tight">
              {customFormula?.title || ref?.name || 'Orthodontic Formula & Standard'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm text-slate-700 max-h-[75vh] overflow-y-auto">
          {customFormula ? (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5">
                <div className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">Mathematical Formula</div>
                <div className="text-base font-mono font-bold text-blue-950 bg-white p-2.5 rounded border border-blue-100">
                  {customFormula.formula}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                  <Info className="w-4 h-4 text-blue-600" /> Explanation
                </h4>
                <p className="text-slate-600 leading-relaxed">{customFormula.description}</p>
              </div>

              {customFormula.variables && customFormula.variables.length > 0 && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <h5 className="font-semibold text-slate-800 text-xs uppercase mb-2">Variables:</h5>
                  <ul className="space-y-1 text-xs">
                    {customFormula.variables.map((v, i) => (
                      <li key={i}>
                        <span className="font-mono font-semibold text-slate-900">{v.name}</span>: {v.desc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-slate-100 pt-3 text-xs text-slate-500 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Reference: <strong>{customFormula.reference}</strong></span>
              </div>
            </>
          ) : ref ? (
            <>
              {ref.formula && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">Formula</div>
                  <div className="text-base font-mono font-bold text-blue-950 bg-white p-2 rounded border border-blue-100">
                    {ref.formula}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                  <Info className="w-4 h-4 text-blue-600" /> What is it?
                </h4>
                <p className="text-slate-600 leading-relaxed">{ref.whatIsIt}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Normative Mean:</span>
                  <span className="font-semibold text-slate-900 text-sm">{ref.mean} {ref.unit}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Standard Range:</span>
                  <span className="font-semibold text-slate-900 text-sm">{ref.range || 'N/A'}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Clinical Relevance:</h4>
                <p className="text-slate-600 leading-relaxed">{ref.clinicalRelevance}</p>
              </div>

              <div className="border-t border-slate-100 pt-3 text-xs text-slate-500 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Source: <strong>{ref.source}</strong></span>
              </div>
            </>
          ) : null}
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
