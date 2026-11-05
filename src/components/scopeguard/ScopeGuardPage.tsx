import React, { useState } from 'react';
import {
  ShieldAlert,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Send,
  Sliders,
  FileCheck2,
  Info,
  HelpCircle,
  RefreshCw,
  Edit3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScopeGuardAnalysis, ScopeChangeType } from '../../types';

export const ScopeGuardPage: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    currentUser,
    runScopeGuardAnalysis,
    sendRevisedProposal,
    changeRequests,
    setActiveTab,
  } = useApp();

  const currentProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Form states
  const [originalScope, setOriginalScope] = useState<string>(
    'Website with 5 pages (Home, About, Services, Case Studies, Contact), contact form with lead notifications, responsive design for mobile & desktop'
  );
  const [originalBudget, setOriginalBudget] = useState<number>(currentProject?.budget || 200);
  const [originalDays, setOriginalDays] = useState<number>(currentProject?.timelineDays || 15);

  const [newRequirements, setNewRequirements] = useState<string>(
    'Add 3 additional custom pages (Total 8 pages), add an admin dashboard with role-based auth, and integrate a secure payment gateway with webhook processing'
  );

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ScopeGuardAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Editable fields after analysis
  const [customCost, setCustomCost] = useState<number>(150);
  const [customDays, setCustomDays] = useState<number>(7);
  const [proposalNotes, setProposalNotes] = useState<string>(
    'ScopeGuard AI identified 3 significant functional expansions requiring backend authentication and gateway integration. Recommended revised timeline: 22 business days.'
  );

  const [isProposalModalOpen, setIsProposalModalOpen] = useState<boolean>(false);
  const [proposalSentSuccess, setProposalSentSuccess] = useState<boolean>(false);

  // Load Hackathon Demo Preset
  const loadDemoPreset = () => {
    setOriginalScope('Website with 5 pages, contact form, responsive design');
    setOriginalBudget(200);
    setOriginalDays(15);
    setNewRequirements('Add 3 additional pages, add an admin dashboard, integrate a payment gateway');
    setAnalysisResult(null);
    setProposalSentSuccess(false);
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setProposalSentSuccess(false);

    try {
      const result = await runScopeGuardAnalysis(
        currentProject.id,
        originalScope,
        originalBudget,
        originalDays,
        newRequirements
      );
      setAnalysisResult(result);
      setCustomCost(result.totalAdditionalCost || 150);
      setCustomDays(result.totalAdditionalDays || 7);
    } catch (err: any) {
      setAnalysisError(err?.message || 'Failed to analyze scope. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendProposal = () => {
    // Find active request or create
    const targetReq = changeRequests.find(
      (r) => r.projectId === currentProject.id && (r.status === 'submitted' || r.status === 'analyzed')
    );
    const reqId = targetReq ? targetReq.id : `req-temp-${Date.now()}`;

    sendRevisedProposal(reqId, customCost, customDays, proposalNotes, analysisResult || undefined);
    setIsProposalModalOpen(false);
    setProposalSentSuccess(true);
  };

  // Helper for badge color
  const getChangeBadge = (type: ScopeChangeType) => {
    switch (type) {
      case 'added':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'modified':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'removed':
        return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      case 'clarified':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-blue-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>ScopeGuard AI • Powered by Gemini 3.8 Flash</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Contract Scope Guard & Change Analyzer
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Detect scope creep instantly. Gemini objectively compares original contract
              deliverables against newly requested client additions, estimating fair effort,
              cost adjustments, and revised delivery timelines.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={loadDemoPreset}
              className="flex items-center justify-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              <span>Load Hackathon Preset</span>
            </button>
            <div className="px-3 py-2 rounded-xl bg-blue-900/40 border border-blue-500/30 text-center">
              <div className="text-[10px] text-blue-300 uppercase tracking-wider font-bold">
                Project Selected
              </div>
              <div className="text-xs font-semibold text-white truncate max-w-[180px]">
                {currentProject.title}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel: Original Agreement */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                v1
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Original Agreement Scope</h3>
                <p className="text-xs text-slate-500">Agreed contract baseline deliverables</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
              Locked Baseline
            </span>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contract Deliverables Description
              </label>
              <textarea
                value={originalScope}
                onChange={(e) => setOriginalScope(e.target.value)}
                rows={4}
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all leading-relaxed"
                placeholder="List agreed deliverables..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex items-center space-x-1.5 text-slate-500 text-xs mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-medium">Original Budget</span>
                </div>
                <div className="flex items-center">
                  <span className="text-slate-400 font-bold mr-1 text-sm">$</span>
                  <input
                    type="number"
                    value={originalBudget}
                    onChange={(e) => setOriginalBudget(Number(e.target.value))}
                    className="w-full font-extrabold text-base text-slate-900 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex items-center space-x-1.5 text-slate-500 text-xs mb-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-medium">Original Timeline</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={originalDays}
                    onChange={(e) => setOriginalDays(Number(e.target.value))}
                    className="w-16 font-extrabold text-base text-slate-900 bg-transparent focus:outline-none"
                  />
                  <span className="text-slate-500 text-xs font-medium ml-1">business days</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/60 text-xs text-blue-800 flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Hackathon Baseline:</strong> 5 pages, contact form, and responsive design
                totaling <strong>$200</strong> in <strong>15 days</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: New Client Requirements */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                v2?
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">New Client Requirements</h3>
                <p className="text-xs text-slate-500">Proposed additions or scope modification</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              Needs Evaluation
            </span>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Requested Scope Additions
              </label>
              <textarea
                value={newRequirements}
                onChange={(e) => setNewRequirements(e.target.value)}
                rows={4}
                className="w-full text-xs text-slate-800 bg-amber-50/30 border border-amber-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all leading-relaxed"
                placeholder="Enter client's new feature requests..."
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Detected Change Requests:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1 text-[11px]">
                <li>Add 3 additional custom content pages (expanding beyond 5 pages)</li>
                <li>Add role-based Admin Dashboard</li>
                <li>Integrate Stripe/PayPal payment gateway with checkout workflow</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Action Button: ANALYZE SCOPE CHANGES */}
      <div className="flex flex-col items-center justify-center py-2">
        <button
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          className="relative group px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-extrabold text-base shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-102 active:scale-98 transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center space-x-3 cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>GEMINI ANALYZING SCOPE DELTAS...</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span className="tracking-wide">ANALYZE SCOPE CHANGES WITH SCOPEGUARD</span>
              <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
            </>
          )}
        </button>

        <p className="text-xs text-slate-500 mt-2 flex items-center space-x-1">
          <span>Objective disparity engine powered by Gemini 3.8 Flash • Protects both sides</span>
        </p>
      </div>

      {/* Analysis Error Notification if any */}
      {analysisError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{analysisError}</span>
        </div>
      )}

      {/* Proposal Sent Toast/Banner */}
      {proposalSentSuccess && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm text-emerald-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Revised Proposal Dispatched to Client!</h4>
              <p className="text-xs text-emerald-700">
                Client A (Marcus Vance) received an interactive prompt to review & sign Agreement
                v2.0 (+${customCost}, +{customDays} days).
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('version-history')}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
          >
            Track in Version History
          </button>
        </div>
      )}

      {/* Gemini Analysis Results Section */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Impact Summary Metrics Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-6">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Scope Impact & Financial Analysis
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                      analysisResult.riskLevel === 'High' || analysisResult.riskLevel === 'Critical'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    Risk Level: {analysisResult.riskLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calculated based on design complexity, architecture additions, and payment security
                  guidelines.
                </p>
              </div>

              {analysisResult.isSampleFallback && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                  Fallback Engine Active (Demo Mode)
                </span>
              )}
            </div>

            {/* Financial & Timeline Comparison Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Card 1: Budget */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  Original Budget
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  ${originalBudget}
                </div>
                <span className="text-xs text-slate-400">Baseline Agreement</span>
              </div>

              {/* Card 2: Additional Cost (Editable) */}
              <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-200 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-blue-700">
                    Additional Scope Cost
                  </span>
                  <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-blue-600 text-xl font-bold mr-1">+$</span>
                  <input
                    type="number"
                    value={customCost}
                    onChange={(e) => setCustomCost(Number(e.target.value))}
                    className="w-24 text-2xl font-black text-blue-700 bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <span className="text-xs text-blue-600/80">Editable estimation</span>
              </div>

              {/* Card 3: Revised Budget */}
              <div className="bg-emerald-50/70 rounded-xl p-4 border border-emerald-200 relative">
                <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-800">
                  Revised Total Budget
                </span>
                <div className="text-2xl font-black text-emerald-700 mt-1">
                  ${originalBudget + customCost}
                </div>
                <span className="text-xs text-emerald-600">
                  {originalBudget} + {customCost}
                </span>
              </div>

              {/* Card 4: Timeline Impact (Editable) */}
              <div className="bg-indigo-50/70 rounded-xl p-4 border border-indigo-200 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-800">
                    Revised Timeline
                  </span>
                  <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-black text-indigo-900">
                    {originalDays + customDays}
                  </span>
                  <span className="text-xs text-indigo-700 font-semibold ml-1.5">days</span>
                  <span className="text-xs text-indigo-500 ml-1.5">
                    (+
                    <input
                      type="number"
                      value={customDays}
                      onChange={(e) => setCustomDays(Number(e.target.value))}
                      className="w-8 font-bold bg-transparent border-b border-indigo-300 text-center focus:outline-none"
                    />
                    d)
                  </span>
                </div>
                <span className="text-xs text-indigo-600">Original: {originalDays} days</span>
              </div>
            </div>

            {/* Executive AI Summary Box */}
            <div className="p-4 rounded-xl bg-slate-900 text-white text-xs leading-relaxed space-y-2 mb-6">
              <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Executive ScopeGuard AI Summary</span>
              </div>
              <p className="text-slate-300">{analysisResult.summary}</p>
            </div>

            {/* Requirement Delta Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider text-[10px]">
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Original Requirement</th>
                    <th className="py-3 px-3">New Requirement</th>
                    <th className="py-3 px-3">Impact Explanation</th>
                    <th className="py-3 px-3 text-right">Est. Cost</th>
                    <th className="py-3 px-3 text-right">Est. Days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analysisResult.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${getChangeBadge(
                            item.changeType
                          )}`}
                        >
                          {item.changeType}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-medium max-w-[160px] truncate">
                        {item.originalRequirement}
                      </td>
                      <td className="py-3 px-3 text-slate-900 font-bold max-w-[200px]">
                        {item.newRequirement}
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-[280px] leading-relaxed">
                        {item.explanation}
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-blue-600">
                        +${item.estimatedCost}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-700">
                        +{item.estimatedDays}d
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Contractual Recommendations */}
            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>ScopeGuard Contract Recommendations:</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {analysisResult.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100 text-[11px] text-blue-900 leading-normal"
                    >
                      • {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workflow Action Bar */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Ready to formalize? Generate a revised proposal with these adjusted figures.
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsProposalModalOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Generate Revised Proposal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revised Proposal Preparation Modal */}
      {isProposalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  v2
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Review & Dispatch Revised Proposal
                  </h3>
                  <p className="text-xs text-slate-500">
                    Transmits formal addendum proposal to {currentProject.clientId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProposalModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Original Agreement:</span>
                <span className="font-bold text-slate-900">${originalBudget} (15 days)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-blue-600 font-semibold">ScopeGuard Additions:</span>
                <span className="font-bold text-blue-600">
                  +${customCost} (+{customDays} days)
                </span>
              </div>
              <div className="flex justify-between py-1 pt-2 font-extrabold text-sm text-slate-900">
                <span>Revised Total Proposal:</span>
                <span className="text-emerald-600">
                  ${originalBudget + customCost} ({originalDays + customDays} business days)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Proposal Rationale / Note to Client
              </label>
              <textarea
                value={proposalNotes}
                onChange={(e) => setProposalNotes(e.target.value)}
                rows={3}
                className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsProposalModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendProposal}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Proposal to Client</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
