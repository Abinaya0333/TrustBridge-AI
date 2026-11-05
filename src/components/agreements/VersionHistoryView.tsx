import React, { useState } from 'react';
import {
  History,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Download,
  Copy,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VersionHistoryView: React.FC = () => {
  const { projects, agreements, selectedProjectId } = useApp();

  const currentProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  const projectAgreements = agreements
    .filter((a) => a.projectId === currentProject?.id)
    .sort((a, b) => a.version - b.version);

  const [expandedVersionId, setExpandedVersionId] = useState<string | null>(null);

  const v1 = projectAgreements.find((a) => a.version === 1);
  const v2 = projectAgreements.find((a) => a.version === 2);

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
              Immutable Contract Trail
            </span>
            <span className="text-xs text-slate-400">Zero Overwrite Guarantee</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Agreement Version History & Diff
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Project: <strong className="text-slate-800">{currentProject?.title}</strong> • Every scope adjustment creates an auditable legal addendum.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200">
            Total Versions: {projectAgreements.length}
          </span>
          {v2 ? (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-xs font-bold text-emerald-700 border border-emerald-200 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Version 2.0 Live & Signed</span>
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-xs font-bold text-blue-700 border border-blue-200 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Version 1.0 Baseline Active</span>
            </span>
          )}
        </div>
      </div>

      {/* Side-by-Side Comparison: Version 1 vs Version 2 */}
      {v1 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Side-by-Side Version Evolution</span>
              </h3>
              <p className="text-xs text-slate-500">
                Direct comparison between baseline contract (v1.0) and ScopeGuard revised addendum (v2.0)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Version 1 Card */}
            <div
              className={`rounded-2xl border p-5 transition-all ${
                v2
                  ? 'bg-slate-50/60 border-slate-200 text-slate-700'
                  : 'bg-blue-50/20 border-blue-300 ring-2 ring-blue-500/20 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-white font-extrabold flex items-center justify-center text-xs">
                    v1.0
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Version 1.0 (Original Scope)</h4>
                    <span className="text-[10px] text-slate-500">Signed November 1, 2026</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    v2 ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {v2 ? 'Superseded by v2.0' : 'Active Baseline'}
                </span>
              </div>

              {/* Scope Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Fixed Budget</span>
                  <div className="text-xl font-black text-slate-900 mt-0.5">${v1.budget}</div>
                  <span className="text-[10px] text-slate-500">USD Fixed Fee</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Timeline</span>
                  <div className="text-xl font-black text-slate-900 mt-0.5">{v1.timelineDays} Days</div>
                  <span className="text-[10px] text-slate-500">Initial Delivery</span>
                </div>
              </div>

              {/* Deliverables List */}
              <div className="space-y-2 mb-4">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Agreed Deliverables (v1.0):
                </span>
                <div className="space-y-1.5">
                  {v1.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature Proof */}
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">Cryptographic Seal v1.0:</div>
                <div className="font-mono text-[10px] text-slate-500 truncate">
                  SHA256: e8b9f10a7204bc9931ad34901fbc651849a9
                </div>
                <div className="text-[10px] text-slate-500">Signed by Alex Rivera & Marcus Vance</div>
              </div>
            </div>

            {/* Version 2 Card */}
            {v2 ? (
              <div className="rounded-2xl border-2 border-emerald-500/80 bg-emerald-50/20 p-5 shadow-md relative">
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-500 text-white shadow-sm flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active Binding Contract</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2 pb-3 border-b border-emerald-200/80 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs shadow-md">
                    v2.0
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Version 2.0 (ScopeGuard Revised)
                    </h4>
                    <span className="text-[10px] text-emerald-800 font-semibold">
                      Approved & Activated Today
                    </span>
                  </div>
                </div>

                {/* Scope Metrics with Deltas */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-emerald-700">
                        Revised Budget
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                        +${v2.budget - v1.budget}
                      </span>
                    </div>
                    <div className="text-xl font-black text-emerald-700 mt-0.5">${v2.budget}</div>
                    <span className="text-[10px] text-slate-500">
                      Baseline $200 + $150 Scope
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-indigo-700">
                        Revised Timeline
                      </span>
                      <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                        +{v2.timelineDays - v1.timelineDays}d
                      </span>
                    </div>
                    <div className="text-xl font-black text-indigo-900 mt-0.5">
                      {v2.timelineDays} Days
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Baseline 15d + 7d Scope
                    </span>
                  </div>
                </div>

                {/* Deliverables List (with highlight for newly added items!) */}
                <div className="space-y-2 mb-4">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Full Deliverables in v2.0:
                  </span>
                  <div className="space-y-1.5">
                    {v2.deliverables.map((item, idx) => {
                      const isNew = idx >= v1.deliverables.length;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-2 rounded-lg text-xs font-medium ${
                            isNew
                              ? 'bg-emerald-100/80 text-emerald-900 border border-emerald-300 font-bold'
                              : 'bg-white border border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isNew ? 'text-emerald-700' : 'text-slate-400'
                              }`}
                            />
                            <span>{item}</span>
                          </div>
                          {isNew && (
                            <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-600 text-white rounded">
                              ScopeGuard Added
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Signature Proof */}
                <div className="p-3 rounded-xl bg-emerald-100/70 border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                  <div className="font-semibold text-emerald-950 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Cryptographic Seal v2.0 (Mutual Consent):</span>
                  </div>
                  <div className="font-mono text-[10px] text-emerald-800 truncate">
                    SHA256: 7f4a210d481bce9842a159930fab89218d6e
                  </div>
                  <div className="text-[10px] text-emerald-700">
                    Client A (Marcus Vance) accepted proposal terms. Milestone 3 ($150) scheduled.
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <History className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Version 2.0 Not Yet Created</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Version 2.0 is only created after the client accepts the ScopeGuard revised proposal.
                  The original agreement (Version 1.0) remains preserved and fully enforceable.
                </p>
                <div className="pt-2">
                  <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                    Follow Hackathon Steps 6-16 to activate Version 2.0
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Raw Agreement Document Inspector Drawer/Accordions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">
          Full Contract Clauses & Document Inspector
        </h3>
        <div className="space-y-3">
          {projectAgreements.map((agr) => (
            <div key={agr.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() =>
                  setExpandedVersionId(expandedVersionId === agr.id ? null : agr.id)
                }
                className="w-full p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="font-bold text-xs text-slate-900">{agr.title}</span>
                    <span className="text-[11px] text-slate-500 ml-2">
                      (${agr.budget} • {agr.timelineDays} days)
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      agr.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {agr.status}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      expandedVersionId === agr.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {expandedVersionId === agr.id && (
                <div className="p-4 bg-slate-900 text-slate-200 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap border-t border-slate-200">
                  {agr.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
