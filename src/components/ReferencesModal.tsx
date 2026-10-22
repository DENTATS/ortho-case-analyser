import React from 'react';
import { X, BookCheck, ExternalLink, GraduationCap } from 'lucide-react';
import { TEXTBOOK_CITATIONS } from '../data/orthoReferences';

interface ReferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferencesModal: React.FC<ReferencesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-blue-300" />
            <div>
              <h3 className="font-bold text-lg leading-tight">Orthodontic Academic References</h3>
              <p className="text-xs text-blue-200">Textbook & Classic Literature Standards for MDS Postgraduate Training</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm text-slate-700">
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3 rounded-lg flex items-start gap-2">
            <BookCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Academic Note:</strong> All normative values, angular measurements, indices, and linear standards in this tool derive from published orthodontic literature and the institutional MDS Case History format. When standard ranges differ across editions, the Case History format standard is highlighted.
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {TEXTBOOK_CITATIONS.map((cite, idx) => (
              <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                <div className="font-semibold text-slate-900 text-sm">{cite.title}</div>
                <div className="text-xs text-slate-600 mt-0.5">
                  <span className="font-medium text-slate-800">{cite.authors}</span> ({cite.year}). {cite.publisher}.
                </div>
                <p className="text-xs text-slate-500 mt-1 italic">{cite.annotation}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Department of Orthodontics & Dentofacial Orthopedics</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
