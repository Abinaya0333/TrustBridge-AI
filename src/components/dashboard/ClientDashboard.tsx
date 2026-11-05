import React, { useState } from 'react';
import {
  FolderGit2,
  FileSignature,
  FilePlus2,
  CheckCircle2,
  XCircle,
  Coins,
  History,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Send,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ClientDashboard: React.FC = () => {
  const {
    currentUser,
    projects,
    changeRequests,
    agreements,
    selectedProjectId,
    setSelectedProjectId,
    submitChangeRequestByClient,
    acceptRevisedProposal,
    rejectRevisedProposal,
    setActiveTab,
  } = useApp();

  const clientProjects = projects.filter((p) => p.clientId === currentUser.id);
  const activeProject =
    clientProjects.find((p) => p.id === selectedProjectId) || clientProjects[0] || projects[0];

  const pendingProposal = changeRequests.find(
    (r) => r.clientId === currentUser.id && r.status === 'proposal_sent'
  );

  const [newScopeText, setNewScopeText] = useState(
    'Add 3 additional custom pages, add an admin dashboard, integrate a payment gateway'
  );
  const [scopeSubmitSuccess, setScopeSubmitSuccess] = useState(false);

  const handleSubmitNewScope = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScopeText.trim() || !activeProject) return;

    submitChangeRequestByClient(activeProject.id, newScopeText);
    setScopeSubmitSuccess(true);
    setTimeout(() => setScopeSubmitSuccess(false), 5000);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
              Client Portal
            </span>
            <span className="text-xs text-slate-400">TrustBridge AI Protected</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentUser.company || 'Client Organization'} • Full transparency, versioned contracts & simulated escrow protection.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('submit-scope')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>Request Additional Scope</span>
          </button>
        </div>
      </div>

      {/* Pending Revised Proposal Action Banner (Step 15/16 in Demo Flow) */}
      {pendingProposal && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-blue-500/40 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
                <Sparkles className="w-3 h-3 text-cyan-300" />
                <span>ScopeGuard AI Revised Proposal Awaiting Your Approval</span>
              </div>
              <h3 className="text-xl font-extrabold">
                Review & Sign Agreement Version 2.0
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Alex Rivera analyzed your additional requirements (3 extra pages, admin dashboard,
                payment gateway). ScopeGuard calculated an objective adjustment:
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
                  <span className="text-slate-400">Original Scope: </span>
                  <span className="font-bold text-white">$200 (15 days)</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-400/30 text-xs">
                  <span className="text-blue-300">Added Scope: </span>
                  <span className="font-bold text-cyan-300">
                    +${pendingProposal.customAdditionalCost || 150} (+{pendingProposal.customAdditionalDays || 7} days)
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-xs">
                  <span className="text-emerald-300">Revised Total: </span>
                  <span className="font-bold text-emerald-300">
                    ${200 + (pendingProposal.customAdditionalCost || 150)} ({15 + (pendingProposal.customAdditionalDays || 7)} business days)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  rejectRevisedProposal(pendingProposal.id);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Decline (Keep v1.0)</span>
              </button>

              <button
                onClick={() => {
                  acceptRevisedProposal(pendingProposal.id);
                  setActiveTab('version-history');
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-102 flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept & Create Version 2.0</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Project Overview & Milestones */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Project Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-blue-600">
                  Active Project
                </span>
                <h3 className="text-lg font-bold text-slate-900">{activeProject?.title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                  Version {activeProject?.currentVersion}.0 Active
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {activeProject?.description}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Budget</span>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  ${activeProject?.budget}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Duration</span>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  {activeProject?.timelineDays} Days
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Milestones</span>
                <div className="text-lg font-black text-blue-600 mt-0.5">
                  {activeProject?.milestones.length} Phases
                </div>
              </div>
            </div>

            {/* Deliverables List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Contract Deliverables Included:
              </div>
              <div className="space-y-1.5">
                {activeProject?.deliverables.map((del, i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-2 p-2 rounded-lg bg-slate-50/70 text-xs text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Milestone Escrow Status */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Milestone Escrow & Payment Tracking
                </h3>
                <p className="text-xs text-slate-400">
                  DEMO MODE – Simulated escrow holding for mutual protection
                </p>
              </div>
              <button
                onClick={() => setActiveTab('milestones')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                View Full Escrow Ledger →
              </button>
            </div>

            <div className="space-y-3">
              {activeProject?.milestones.map((ms) => (
                <div
                  key={ms.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-xs">{ms.title}</span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          ms.status === 'released'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {ms.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{ms.description}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-slate-900">${ms.amount}</span>
                    <div className="text-[10px] text-slate-400 font-mono">{ms.simulatedTxId}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Submit Additional Requirements Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FilePlus2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Request Project Changes
                </h3>
                <p className="text-[11px] text-slate-400">Step 7 of Hackathon Demo</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Want additional features, pages, or third-party integrations? Submit them here.
              ScopeGuard AI ensures transparent fee calculations before work begins.
            </p>

            <form onSubmit={handleSubmitNewScope} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Describe New Requirements:
                </label>
                <textarea
                  value={newScopeText}
                  onChange={(e) => setNewScopeText(e.target.value)}
                  rows={4}
                  className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all leading-relaxed"
                  placeholder="Enter additional features requested..."
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 space-y-1">
                <div className="font-bold flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Hackathon Demo Requirements:</span>
                </div>
                <div>• Add 3 additional pages</div>
                <div>• Add an admin dashboard</div>
                <div>• Integrate a payment gateway</div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Requirements to Alex Rivera</span>
              </button>
            </form>

            {scopeSubmitSuccess && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Requirements dispatched! Freelancer notified to run ScopeGuard scan.</span>
              </div>
            )}
          </div>

          {/* Quick Version History Link */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800">
            <div className="flex items-center space-x-2 text-cyan-300 text-xs font-bold mb-2">
              <History className="w-4 h-4" />
              <span>Contract Versioning</span>
            </div>
            <h4 className="text-sm font-bold">Never Overwrite Past Contracts</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              TrustBridge maintains immutable cryptographic records of every version. When you accept
              proposals, Version 2.0 is created while preserving Version 1.0.
            </p>
            <button
              onClick={() => setActiveTab('version-history')}
              className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors"
            >
              View Version History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
