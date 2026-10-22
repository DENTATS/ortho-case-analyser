import React, { useState, useRef } from 'react';
import { CaseData, SavedCaseItem } from '../types/ortho';
import {
  X,
  FolderOpen,
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  CheckCircle2,
  Search,
  Calendar,
  AlertCircle,
  FileText,
  Edit3
} from 'lucide-react';

interface SavedCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCases: SavedCaseItem[];
  currentCaseId: string;
  onSelectCase: (caseData: CaseData) => void;
  onDeleteCase: (id: string) => void;
  onDuplicateCase: (caseData: CaseData) => void;
  onOpenNewCaseModal: () => void;
  onImportCase: (caseData: CaseData) => void;
}

export const SavedCasesModal: React.FC<SavedCasesModalProps> = ({
  isOpen,
  onClose,
  savedCases,
  currentCaseId,
  onSelectCase,
  onDeleteCase,
  onDuplicateCase,
  onOpenNewCaseModal,
  onImportCase
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filteredCases = savedCases.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.id.toLowerCase().includes(term) ||
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.date && c.date.includes(term))
    );
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.patient && parsed.modelOcclusion) {
          onImportCase(parsed);
          onClose();
        } else {
          setImportError('Invalid orthodontic case file format. Missing required clinical structures.');
        }
      } catch (err) {
        setImportError('Failed to parse file. Please verify that this is a valid .json case file.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportSingleCase = (c: SavedCaseItem) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(c.data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${c.id || 'ortho-case'}_analysis.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 px-6 py-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <FolderOpen className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-snug">Case Management & Archives</h3>
              <p className="text-[11px] text-blue-200">
                Access, edit, duplicate, and export stored orthodontic cases ({savedCases.length} saved)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
          {importError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Search Box */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search cases by ID, name, or date..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" /> Import JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => {
                  onOpenNewCaseModal();
                  onClose();
                }}
                className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> + New Case
              </button>
            </div>
          </div>
        </div>

        {/* Case List Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-2.5">
          {filteredCases.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              {searchTerm ? (
                <>No cases matching "{searchTerm}"</>
              ) : (
                <>
                  <p className="font-semibold text-slate-600 mb-1">No cases stored yet</p>
                  <p className="text-slate-400 mb-3">Click "+ New Case" above or load the sample demo case to get started.</p>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenNewCaseModal();
                      onClose();
                    }}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg"
                  >
                    Create First Case
                  </button>
                </>
              )}
            </div>
          ) : (
            filteredCases.map((c) => {
              const isCurrent = c.id === currentCaseId;
              const isConfirmingDelete = deleteConfirmId === c.id;

              return (
                <div
                  key={c.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-slate-900 text-sm tracking-tight">
                        {c.id}
                      </span>
                      {c.name && (
                        <span className="text-xs font-semibold text-slate-700">
                          • {c.name}
                        </span>
                      )}
                      {c.isDemoCase && (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-amber-300">
                          Demo
                        </span>
                      )}
                      {isCurrent && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Active in Workspace
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      {isConfirmingDelete ? (
                        <div className="flex items-center gap-1.5 bg-rose-50 p-1 rounded-lg border border-rose-200">
                          <span className="text-[11px] font-bold text-rose-800 px-1">Delete case?</span>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteCase(c.id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-[11px]"
                          >
                            Yes, Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded text-[11px] border border-slate-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              onSelectCase(c.data);
                              onClose();
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              isCurrent
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                                : 'bg-slate-100 hover:bg-blue-50 text-blue-700 hover:border-blue-300 border border-slate-200'
                            }`}
                          >
                            <Edit3 className="w-3 h-3" />
                            {isCurrent ? 'Continue Editing' : 'Open & Edit'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleExportSingleCase(c)}
                            title="Export this case as JSON"
                            className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDuplicateCase(c.data)}
                            title="Duplicate Case"
                            className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(c.id)}
                            title="Delete Case"
                            className="p-1.5 bg-white border border-slate-200 hover:bg-rose-50 text-rose-600 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Record Date: <strong className="text-slate-700">{c.date || '—'}</strong>
                    </span>
                    <span>
                      Age: <strong className="text-slate-700">{c.data.patient.age || '—'} yrs</strong> ({c.data.patient.sex})
                    </span>
                    {c.data.patient.chiefComplaint && (
                      <span className="truncate max-w-[280px]">
                        Complaint: <em>{c.data.patient.chiefComplaint}</em>
                      </span>
                    )}
                    <span className="ml-auto text-slate-400 text-[10px]">
                      Edited: {new Date(c.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 shrink-0">
          <span>Cases are preserved safely in your browser storage.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
