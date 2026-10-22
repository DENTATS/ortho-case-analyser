import React, { useState, useEffect } from 'react';
import { CaseData, SavedCaseItem } from './types/ortho';
import { createEmptyCase, getDemoCase } from './data/demoCase';
import { PatientProfileView } from './components/views/PatientProfileView';
import { ClinicalOcclusionView } from './components/views/ClinicalOcclusionView';
import { MaxillaryArchView } from './components/views/MaxillaryArchView';
import { ArchWidthIndicesView } from './components/views/ArchWidthIndicesView';
import { MandibularArchView } from './components/views/MandibularArchView';
import { SpaceAnalysisView } from './components/views/SpaceAnalysisView';
import { RadiographicView } from './components/views/RadiographicView';
import { CvmView } from './components/views/CvmView';
import { CephalometricsView } from './components/views/CephalometricsView';
import { SoftTissueView } from './components/views/SoftTissueView';
import { CompositeCephView } from './components/views/CompositeCephView';
import { CrossCheckSummaryView } from './components/views/CrossCheckSummaryView';
import { CaseReportView } from './components/views/CaseReportView';
import { DashboardCards } from './components/DashboardCards';
import { FormulaModal } from './components/FormulaModal';
import { ReferencesModal } from './components/ReferencesModal';
import { SavedCasesModal } from './components/SavedCasesModal';
import { NewCaseModal } from './components/NewCaseModal';
import { ConfirmModal } from './components/ConfirmModal';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  FolderOpen,
  Save,
  RotateCcw,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Plus,
  Edit,
  History,
  Layers,
  FileCheck
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'ortho_case_analyzer_saved_cases_v2';
const CURRENT_CASE_KEY = 'ortho_case_analyzer_active_case_v2';

export default function App() {
  // Saved Cases State (Reactive)
  const [savedCases, setSavedCases] = useState<SavedCaseItem[]>(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    // Seed initial list with demo case
    const demo = getDemoCase();
    const initialList: SavedCaseItem[] = [
      {
        id: demo.patient.id,
        name: demo.patient.name,
        date: demo.patient.date,
        lastModified: demo.lastModified,
        isDemoCase: true,
        data: demo
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialList));
    return initialList;
  });

  // Active Case State
  const [caseData, setCaseData] = useState<CaseData>(() => {
    const saved = localStorage.getItem(CURRENT_CASE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return getDemoCase();
  });

  const [activeTab, setActiveTab] = useState<string>('patient');
  const [isLearningMode, setIsLearningMode] = useState<boolean>(true);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // Modals state
  const [selectedFormulaParam, setSelectedFormulaParam] = useState<string | null>(null);
  const [customFormula, setCustomFormula] = useState<{
    title: string;
    formula: string;
    description: string;
    reference: string;
    variables?: { name: string; desc: string }[];
  } | null>(null);
  const [isReferencesOpen, setIsReferencesOpen] = useState<boolean>(false);
  const [isSavedCasesOpen, setIsSavedCasesOpen] = useState<boolean>(false);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState<boolean>(false);

  // In-app confirm modal state (NO window.confirm or window.alert!)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    confirmVariant?: 'danger' | 'primary' | 'warning';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Sync active case to local storage
  useEffect(() => {
    localStorage.setItem(CURRENT_CASE_KEY, JSON.stringify(caseData));
  }, [caseData]);

  // Persist saved cases list
  const persistSavedCases = (updatedList: SavedCaseItem[]) => {
    setSavedCases(updatedList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
  };

  // Save current case into list
  const handleSaveCase = () => {
    const patientId = caseData.patient.id?.trim() || `ORTHO-${Math.floor(1000 + Math.random() * 9000)}`;
    const updatedCaseData = {
      ...caseData,
      patient: {
        ...caseData.patient,
        id: patientId
      },
      lastModified: new Date().toISOString()
    };

    setCaseData(updatedCaseData);

    const existingIdx = savedCases.findIndex((c) => c.id === patientId);
    const newRecord: SavedCaseItem = {
      id: patientId,
      name: updatedCaseData.patient.name,
      date: updatedCaseData.patient.date,
      lastModified: updatedCaseData.lastModified,
      isDemoCase: updatedCaseData.isDemoCase,
      data: updatedCaseData
    };

    let updatedList: SavedCaseItem[];
    if (existingIdx >= 0) {
      updatedList = [...savedCases];
      updatedList[existingIdx] = newRecord;
    } else {
      updatedList = [newRecord, ...savedCases];
    }

    persistSavedCases(updatedList);
    setSaveNotification(`Case "${patientId}" saved successfully!`);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  // Open / Switch to a saved case
  const handleSelectCase = (selectedData: CaseData) => {
    setCaseData(selectedData);
    setSaveNotification(`Loaded case "${selectedData.patient.id}". Ready to edit.`);
    setTimeout(() => setSaveNotification(null), 3500);
  };

  // Switch case directly via top dropdown
  const handleSwitchCaseById = (id: string) => {
    const found = savedCases.find((c) => c.id === id);
    if (found) {
      handleSelectCase(found.data);
    }
  };

  // Delete a saved case
  const handleDeleteSavedCase = (id: string) => {
    const updated = savedCases.filter((c) => c.id !== id);
    persistSavedCases(updated);

    // If currently viewing deleted case, switch to first available or new
    if (caseData.patient.id === id) {
      if (updated.length > 0) {
        setCaseData(updated[0].data);
      } else {
        setCaseData(createEmptyCase());
      }
    }
    setSaveNotification(`Case ${id} deleted.`);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  // Duplicate a case
  const handleDuplicateCase = (data: CaseData) => {
    const newId = `${data.patient.id}-COPY`;
    const duplicated: CaseData = {
      ...data,
      patient: {
        ...data.patient,
        id: newId
      },
      isDemoCase: false,
      lastModified: new Date().toISOString()
    };

    const newRecord: SavedCaseItem = {
      id: newId,
      name: `${data.patient.name || ''} (Copy)`,
      date: data.patient.date,
      lastModified: duplicated.lastModified,
      isDemoCase: false,
      data: duplicated
    };

    const updated = [newRecord, ...savedCases];
    persistSavedCases(updated);
    setCaseData(duplicated);
    setIsSavedCasesOpen(false);
    setSaveNotification(`Duplicated as "${newId}" and set active!`);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  // Create a brand new case
  const handleCreateNewCase = (newCase: CaseData) => {
    // Add to saved cases list automatically
    const newRecord: SavedCaseItem = {
      id: newCase.patient.id,
      name: newCase.patient.name,
      date: newCase.patient.date,
      lastModified: newCase.lastModified,
      isDemoCase: newCase.isDemoCase,
      data: newCase
    };

    const updated = [newRecord, ...savedCases.filter((c) => c.id !== newCase.patient.id)];
    persistSavedCases(updated);
    setCaseData(newCase);
    setActiveTab('patient');
    setSaveNotification(`Created case "${newCase.patient.id}".`);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  // Load demo case
  const handleLoadDemo = () => {
    const demo = getDemoCase();
    // Ensure demo is in saved cases list
    const existingIdx = savedCases.findIndex((c) => c.id === demo.patient.id);
    if (existingIdx === -1) {
      const demoRecord: SavedCaseItem = {
        id: demo.patient.id,
        name: demo.patient.name,
        date: demo.patient.date,
        lastModified: demo.lastModified,
        isDemoCase: true,
        data: demo
      };
      persistSavedCases([demoRecord, ...savedCases]);
    }
    setCaseData(demo);
    setActiveTab('patient');
    setSaveNotification('Loaded Educational Demonstration Case!');
    setTimeout(() => setSaveNotification(null), 3000);
  };

  // Reset case values prompt (in-app modal, NO window.confirm!)
  const handlePromptReset = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Current Case Values?',
      message: 'This will reset all measurements for this case back to blank starting values. Unsaved inputs will be cleared.',
      confirmLabel: 'Yes, Reset Values',
      confirmVariant: 'danger',
      onConfirm: () => {
        setCaseData(createEmptyCase());
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        setSaveNotification('Case values reset to blank.');
        setTimeout(() => setSaveNotification(null), 3000);
      }
    });
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(caseData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${caseData.patient.id || 'ortho-case'}_analysis.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON case handler
  const handleImportCase = (importedCase: CaseData) => {
    const patientId = importedCase.patient.id || `ORTHO-${Math.floor(1000 + Math.random() * 9000)}`;
    const record: SavedCaseItem = {
      id: patientId,
      name: importedCase.patient.name,
      date: importedCase.patient.date,
      lastModified: new Date().toISOString(),
      isDemoCase: importedCase.isDemoCase,
      data: importedCase
    };
    const updated = [record, ...savedCases.filter((c) => c.id !== patientId)];
    persistSavedCases(updated);
    setCaseData(importedCase);
    setSaveNotification(`Imported and activated case "${patientId}".`);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  const tabs: { id: string; label: string; number: number }[] = [
    { id: 'patient', label: 'Patient', number: 1 },
    { id: 'clinical', label: 'Clinical', number: 2 },
    { id: 'model', label: 'Model Analysis', number: 3 },
    { id: 'indices', label: 'Arch Analysis', number: 4 },
    { id: 'space', label: 'Space Analysis', number: 5 },
    { id: 'radiograph', label: 'Radiograph', number: 6 },
    { id: 'cvm', label: 'CVM', number: 7 },
    { id: 'ceph', label: 'Cephalometrics', number: 8 },
    { id: 'softTissue', label: 'Soft Tissue', number: 9 },
    { id: 'composite', label: 'Composite', number: 10 },
    { id: 'summary', label: 'Summary', number: 11 },
    { id: 'report', label: 'Report', number: 12 }
  ];

  const currentTabIndex = tabs.findIndex((t) => t.id === activeTab);

  const goToNextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
      {/* Top Academic Disclaimer & Notification Bar */}
      <div className="bg-slate-900 text-slate-300 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 print:hidden">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>EDUCATIONAL MDS ORTHODONTICS CASE ANALYSIS TOOL</strong> • Not an autonomous clinical diagnostic device. Final diagnosis & treatment plan remain with treating orthodontist.
          </span>
        </div>

        <div className="flex items-center gap-3">
          {saveNotification && (
            <span className="bg-emerald-500/20 text-emerald-300 font-semibold px-2.5 py-0.5 rounded text-[11px] border border-emerald-500/40 flex items-center gap-1 animate-pulse">
              <CheckCircle className="w-3 h-3 text-emerald-400" /> {saveNotification}
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsReferencesOpen(true)}
            className="hover:text-white flex items-center gap-1 transition-colors text-slate-400"
          >
            <BookOpen className="w-3.5 h-3.5" /> Textbook References
          </button>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">ORTHO CASE ANALYZER</h1>
                {caseData.isDemoCase && (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-amber-300">
                    DEMO CASE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">MDS Orthodontics Case History, Model & Cephalometric Analysis Platform</p>
            </div>
          </div>

          {/* Active Case Switcher & Case Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Case Switcher Dropdown */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-blue-600" /> Case:
              </span>
              <select
                value={caseData.patient.id}
                onChange={(e) => handleSwitchCaseById(e.target.value)}
                className="bg-white text-xs font-bold text-slate-900 px-2 py-1 rounded border border-slate-200 focus:ring-2 focus:ring-blue-500 font-mono"
              >
                {savedCases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} {c.name ? `(${c.name})` : ''} {c.isDemoCase ? '[Demo]' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* + New Case Button (High Visibility) */}
            <button
              type="button"
              onClick={() => setIsNewCaseModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors flex items-center gap-1"
              title="Create a new patient case"
            >
              <Plus className="w-3.5 h-3.5" /> New Case
            </button>

            {/* All Cases Library Button */}
            <button
              type="button"
              onClick={() => setIsSavedCasesOpen(true)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
              title="View, search, or edit all saved cases"
            >
              <FolderOpen className="w-3.5 h-3.5 text-blue-600" /> Cases ({savedCases.length})
            </button>

            {/* Save Case Button */}
            <button
              type="button"
              onClick={handleSaveCase}
              className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors flex items-center gap-1"
              title="Save current modifications to case storage"
            >
              <Save className="w-3.5 h-3.5" /> Save Case
            </button>

            {/* Demo Button */}
            <button
              type="button"
              onClick={handleLoadDemo}
              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold rounded-lg transition-colors hidden md:flex items-center gap-1"
              title="Reload the sample case with pre-filled orthodontic measurements"
            >
              Demo Case
            </button>

            {/* Mode Switcher */}
            <div className="bg-slate-100 p-0.5 rounded-lg hidden lg:flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setIsLearningMode(false)}
                className={`px-2 py-1 rounded-md transition-all ${
                  !isLearningMode ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Calculator
              </button>
              <button
                type="button"
                onClick={() => setIsLearningMode(true)}
                className={`px-2 py-1 rounded-md flex items-center gap-1 transition-all ${
                  isLearningMode ? 'bg-blue-700 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-3 h-3" /> Learning Mode
              </button>
            </div>
          </div>
        </div>

        {/* 12 Tab Navigation Bar */}
        <div className="border-t border-slate-100 bg-white overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 flex gap-1 py-1.5 text-xs font-medium">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tab.number}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Active Case Banner */}
        <div className="mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-500">Editing Case:</span>
            <strong className="text-slate-900 font-mono text-sm">{caseData.patient.id}</strong>
            {caseData.patient.name && (
              <span className="text-slate-600 font-medium">— {caseData.patient.name}</span>
            )}
            <span className="text-slate-400 text-[11px] ml-1">
              ({caseData.patient.age || '—'} yrs, {caseData.patient.sex})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('patient')}
              className="text-blue-700 hover:text-blue-900 font-semibold underline text-xs"
            >
              Edit Demographics
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => setIsSavedCasesOpen(true)}
              className="text-slate-600 hover:text-slate-900 font-semibold text-xs"
            >
              Switch Case
            </button>
          </div>
        </div>

        {/* Quick Glance Dashboard Cards (shown on all input tabs except report) */}
        {activeTab !== 'report' && (
          <div className="print:hidden">
            <DashboardCards caseData={caseData} onNavigateToTab={(tab) => setActiveTab(tab)} />
          </div>
        )}

        {/* Dynamic Tab Views */}
        <div className="transition-all">
          {activeTab === 'patient' && (
            <PatientProfileView
              patient={caseData.patient}
              onChange={(updated) => setCaseData({ ...caseData, patient: updated })}
              isLearningMode={isLearningMode}
            />
          )}

          {activeTab === 'clinical' && (
            <ClinicalOcclusionView
              occlusion={caseData.modelOcclusion}
              onChange={(updated) => setCaseData({ ...caseData, modelOcclusion: updated })}
              isLearningMode={isLearningMode}
              onOpenFormula={(f) => setCustomFormula(f)}
            />
          )}

          {activeTab === 'model' && (
            <div className="space-y-6">
              <MaxillaryArchView
                maxillary={caseData.maxillary}
                onChange={(updated) => setCaseData({ ...caseData, maxillary: updated })}
                isLearningMode={isLearningMode}
                onOpenFormula={(f) => setCustomFormula(f)}
              />
              <MandibularArchView
                mandibular={caseData.mandibular}
                maxillary={caseData.maxillary}
                onChangeMandibular={(updated) => setCaseData({ ...caseData, mandibular: updated })}
                isLearningMode={isLearningMode}
                onOpenFormula={(f) => setCustomFormula(f)}
              />
            </div>
          )}

          {activeTab === 'indices' && (
            <ArchWidthIndicesView
              maxillary={caseData.maxillary}
              onChange={(updated) => setCaseData({ ...caseData, maxillary: updated })}
              isLearningMode={isLearningMode}
              onOpenFormula={(f) => setCustomFormula(f)}
            />
          )}

          {activeTab === 'space' && (
            <SpaceAnalysisView
              spaceAnalysis={caseData.spaceAnalysis}
              onChange={(updated) => setCaseData({ ...caseData, spaceAnalysis: updated })}
              isLearningMode={isLearningMode}
              onOpenFormula={(f) => setCustomFormula(f)}
            />
          )}

          {activeTab === 'radiograph' && (
            <RadiographicView
              radiographic={caseData.radiographic}
              onChange={(updated) => setCaseData({ ...caseData, radiographic: updated })}
              isLearningMode={isLearningMode}
            />
          )}

          {activeTab === 'cvm' && (
            <CvmView
              cvmStage={caseData.cvmStage}
              onChange={(stage) => setCaseData({ ...caseData, cvmStage: stage })}
              isLearningMode={isLearningMode}
            />
          )}

          {activeTab === 'ceph' && (
            <CephalometricsView
              downs={caseData.downs}
              steiner={caseData.steiner}
              wits={caseData.wits}
              tweed={caseData.tweed}
              mcnamara={caseData.mcnamara}
              rakosiJarabak={caseData.rakosiJarabak}
              ricketts={caseData.ricketts}
              burstoneHard={caseData.burstoneHard}
              patientSex={caseData.patient.sex}
              onChangeDowns={(d) => setCaseData({ ...caseData, downs: d })}
              onChangeSteiner={(d) => setCaseData({ ...caseData, steiner: d })}
              onChangeWits={(d) => setCaseData({ ...caseData, wits: d })}
              onChangeTweed={(d) => setCaseData({ ...caseData, tweed: d })}
              onChangeMcNamara={(d) => setCaseData({ ...caseData, mcnamara: d })}
              onChangeJarabak={(d) => setCaseData({ ...caseData, rakosiJarabak: d })}
              onChangeRicketts={(d) => setCaseData({ ...caseData, ricketts: d })}
              onChangeBurstoneHard={(d) => setCaseData({ ...caseData, burstoneHard: d })}
              isLearningMode={isLearningMode}
              onOpenFormula={(id) => setSelectedFormulaParam(id)}
            />
          )}

          {activeTab === 'softTissue' && (
            <SoftTissueView
              softTissue={caseData.softTissue}
              burstoneSoft={caseData.burstoneSoft}
              onChangeSoftTissue={(d) => setCaseData({ ...caseData, softTissue: d })}
              onChangeBurstoneSoft={(d) => setCaseData({ ...caseData, burstoneSoft: d })}
              isLearningMode={isLearningMode}
              onOpenFormula={(id) => setSelectedFormulaParam(id)}
            />
          )}

          {activeTab === 'composite' && (
            <CompositeCephView
              composite={caseData.composite}
              onChangeComposite={(updated) => setCaseData({ ...caseData, composite: updated })}
              isLearningMode={isLearningMode}
            />
          )}

          {activeTab === 'summary' && (
            <CrossCheckSummaryView
              caseData={caseData}
              onUpdateNotes={(n) => setCaseData({ ...caseData, studentNotes: n })}
              onUpdateDiagnosisOverride={(draft) => setCaseData({ ...caseData, studentDiagnosisDraftOverride: draft })}
              isLearningMode={isLearningMode}
            />
          )}

          {activeTab === 'report' && (
            <CaseReportView
              caseData={caseData}
              onExportJson={handleExportJson}
            />
          )}
        </div>

        {/* Bottom Navigation & Workflow Buttons */}
        <div className="mt-8 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPrevTab}
              disabled={currentTabIndex === 0}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              type="button"
              onClick={goToNextTab}
              disabled={currentTabIndex === tabs.length - 1}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePromptReset}
              className="px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>

            <button
              type="button"
              onClick={handleSaveCase}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>

            {activeTab !== 'report' && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('report');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Generate Report
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>Ortho Case Analyzer • Educational MDS Orthodontics Case Analysis Tool</span>
          <span>Textbook References: Proffit Contemporary Orthodontics (7th ed.) • Graber (7th ed.)</span>
        </div>
      </footer>

      {/* Formula & Standard Info Modal */}
      <FormulaModal
        parameterId={selectedFormulaParam}
        customFormula={customFormula}
        onClose={() => {
          setSelectedFormulaParam(null);
          setCustomFormula(null);
        }}
      />

      {/* References Modal */}
      <ReferencesModal
        isOpen={isReferencesOpen}
        onClose={() => setIsReferencesOpen(false)}
      />

      {/* New Case Modal */}
      <NewCaseModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
        onCreateCase={handleCreateNewCase}
      />

      {/* Saved Cases Library Modal */}
      <SavedCasesModal
        isOpen={isSavedCasesOpen}
        onClose={() => setIsSavedCasesOpen(false)}
        savedCases={savedCases}
        currentCaseId={caseData.patient.id}
        onSelectCase={handleSelectCase}
        onDeleteCase={handleDeleteSavedCase}
        onDuplicateCase={handleDuplicateCase}
        onOpenNewCaseModal={() => setIsNewCaseModalOpen(true)}
        onImportCase={handleImportCase}
      />

      {/* Custom Confirmation Modal (No window.confirm!) */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        confirmVariant={confirmDialog.confirmVariant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
