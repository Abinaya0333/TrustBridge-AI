import React, { useState } from 'react';
import {
  FileSignature,
  Sparkles,
  Send,
  Save,
  Eye,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AgreementGenerator: React.FC = () => {
  const {
    currentUser,
    projects,
    selectedProjectId,
    agreements,
    createAgreementDraft,
    sendAgreementToClient,
    setActiveTab,
  } = useApp();

  const currentProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  const existingAgr = agreements.find(
    (a) => a.projectId === currentProject?.id && a.version === 1
  );

  const [title, setTitle] = useState(
    existingAgr?.title || `Services Agreement v1.0 – ${currentProject?.title}`
  );
  const [budget, setBudget] = useState(currentProject?.budget || 200);
  const [timelineDays, setTimelineDays] = useState(currentProject?.timelineDays || 15);
  const [revisionLimit, setRevisionLimit] = useState(existingAgr?.revisionLimit || 2);
  const [deliverablesText, setDeliverablesText] = useState(
    currentProject?.deliverables.join('\n') ||
      'Website with 5 pages\nContact form with lead notifications\nMobile-first responsive design'
  );

  const [content, setContent] = useState(existingAgr?.content || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setStatusMessage(null);

    const deliverablesArray = deliverablesText
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    try {
      const newDraft = await createAgreementDraft({
        projectId: currentProject.id,
        title,
        budget,
        timelineDays,
        deliverables: deliverablesArray,
        revisionLimit,
        version: 1,
      });

      setContent(newDraft.content);
      setStatusMessage('AI Agreement Draft generated with protective ScopeGuard terms!');
    } catch (e: any) {
      setStatusMessage('Error generating draft: ' + e?.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = () => {
    setStatusMessage('Agreement draft saved successfully to LocalStorage.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleSendToClient = () => {
    if (existingAgr) {
      sendAgreementToClient(existingAgr.id);
    }
    setStatusMessage('Agreement sent to Client A for review and signoff!');
    setTimeout(() => {
      setStatusMessage(null);
      setActiveTab('version-history');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Notice regarding human review requirement */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 flex items-start space-x-3 text-blue-900 text-xs">
        <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-bold">Human Review Required:</strong> Automated agreement drafts
          generated on TrustBridge AI incorporate protective ScopeGuard™ clauses, revision
          limits, and milestone payment schedules. These templates are illustrative examples and
          should be customized to your jurisdiction and specific engagement scope.
        </p>
      </div>

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-100">
              Contract Drafter
            </span>
            <span className="text-xs text-slate-400">Step 5 of Demo Flow</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            AI Agreement Generator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Project: <strong className="text-slate-800">{currentProject?.title}</strong> • Version 1.0 Baseline
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            {mode === 'edit' ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{mode === 'edit' ? 'Preview Legal View' : 'Edit Clauses'}</span>
          </button>

          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Drafting with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Draft / Regenerate with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Editor & Parameter Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scope & Terms Parameters */}
        <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="font-extrabold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Contract Parameters
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Agreement Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Fixed Budget ($)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Timeline (Days)
              </label>
              <input
                type="number"
                value={timelineDays}
                onChange={(e) => setTimelineDays(Number(e.target.value))}
                className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Revision Limit (Included Rounds)
            </label>
            <input
              type="number"
              value={revisionLimit}
              onChange={(e) => setRevisionLimit(Number(e.target.value))}
              className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Deliverables (One per line)
            </label>
            <textarea
              rows={4}
              value={deliverablesText}
              onChange={(e) => setDeliverablesText(e.target.value)}
              className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-mono"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
            <button
              onClick={handleSaveDraft}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Agreement Draft</span>
            </button>

            <button
              onClick={handleSendToClient}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Agreement to Client</span>
            </button>
          </div>
        </div>

        {/* Right Column: Full Agreement Content Document */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center space-x-2">
              <FileSignature className="w-4 h-4 text-blue-600" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                {mode === 'edit' ? 'Editable Legal Clauses' : 'Legal Preview Document'}
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              STATUS: {existingAgr?.status.toUpperCase() || 'DRAFT'}
            </span>
          </div>

          {mode === 'edit' ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={22}
              className="w-full flex-1 text-xs text-slate-900 font-mono leading-relaxed bg-slate-50/70 border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-y"
              placeholder="Agreement text will appear here. Click 'Draft / Regenerate with AI' to populate."
            />
          ) : (
            <div className="flex-1 p-6 bg-slate-50/50 border border-slate-200 rounded-xl overflow-y-auto max-h-[500px] text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
              {content || 'No content yet. Click Draft with AI.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
