import React, { useState } from 'react';
import {
  Coins,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  AlertCircle,
  ExternalLink,
  Lock,
  Unlock,
  DollarSign,
  FileCheck2,
  Receipt,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MilestoneTracker: React.FC = () => {
  const { projects, selectedProjectId, currentUser, updateMilestoneStatus, addProjectMilestone } = useApp();

  const currentProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  const milestones = currentProject?.milestones || [];

  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
  const releasedAmount = milestones
    .filter((m) => m.status === 'released')
    .reduce((sum, m) => sum + m.amount, 0);
  const escrowFundedAmount = milestones
    .filter((m) => m.status === 'escrow_funded' || m.status === 'in_review')
    .reduce((sum, m) => sum + m.amount, 0);
  const pendingAmount = milestones
    .filter((m) => m.status === 'pending')
    .reduce((sum, m) => sum + m.amount, 0);

  const [receiptModalTx, setReceiptModalTx] = useState<string | null>(null);

  return (
    <div className="space-y-6 pb-20">
      {/* Prominent Demo Mode Disclaimer Banner as explicitly required */}
      <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center space-x-3 text-amber-900 shadow-sm">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
        <div className="text-xs leading-relaxed">
          <strong className="font-extrabold uppercase tracking-wider text-amber-800">
            DEMO MODE – No real money is transferred or held.
          </strong>
          <span className="block sm:inline sm:ml-1 text-amber-800/90">
            This simulated milestone escrow engine demonstrates fintech trust mechanisms, staged
            payouts, and contract addendum funding for hackathon prototype testing.
          </span>
        </div>
      </div>

      {/* Header & Financial Overview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-100">
              Simulated Escrow Protection
            </span>
            <span className="text-xs text-slate-400">Project: {currentProject?.title}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Milestone Payments & Escrow Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Funds are locked upfront in simulated escrow and released only upon client approval of
            deliverables.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900 text-white text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Total Contract Value</span>
            <div className="text-xl font-black text-white">${totalAmount} USD</div>
          </div>
        </div>
      </div>

      {/* Financial Health Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Value */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Agreed Budget</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">${totalAmount}</div>
          <span className="text-[11px] text-slate-400">
            Version {currentProject?.currentVersion}.0 total
          </span>
        </div>

        {/* Released to Freelancer */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 text-xs font-semibold">
            <span>Released to Freelancer</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">${releasedAmount}</div>
          <span className="text-[11px] text-emerald-700">Delivered & confirmed</span>
        </div>

        {/* Locked in Escrow */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 text-xs font-semibold">
            <span>Held in Escrow</span>
            <Lock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 mt-1">${escrowFundedAmount}</div>
          <span className="text-[11px] text-blue-600">Simulated deposit secured</span>
        </div>

        {/* Pending Escrow */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 text-xs font-semibold">
            <span>Pending Escrow Deposit</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1">${pendingAmount}</div>
          <span className="text-[11px] text-amber-700">Scheduled for later stage</span>
        </div>
      </div>

      {/* Milestones Staged Workflow */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Milestone Breakdown & Simulated Actions
            </h3>
            <p className="text-xs text-slate-400">
              Clients can release funds upon review; freelancers can submit deliverables.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {milestones.length} Defined Phases
          </span>
        </div>

        <div className="space-y-4">
          {milestones.map((ms, index) => {
            const isReleased = ms.status === 'released';
            const isEscrowed = ms.status === 'escrow_funded';
            const isInReview = ms.status === 'in_review';

            return (
              <div
                key={ms.id}
                className={`p-5 rounded-xl border transition-all ${
                  isReleased
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isEscrowed
                    ? 'border-blue-200 bg-blue-50/20'
                    : 'border-slate-200 bg-slate-50/40'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{ms.title}</h4>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                          isReleased
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : isEscrowed
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {ms.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 max-w-xl">{ms.description}</p>
                    <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
                      <span>Due: {ms.dueDate}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-500">{ms.simulatedTxId}</span>
                      {ms.releaseDate && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold">
                            Released on {ms.releaseDate}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end space-x-4 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Amount</span>
                      <div className="text-xl font-black text-slate-900">${ms.amount}</div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Action buttons based on status & role */}
                      {isReleased ? (
                        <button
                          onClick={() => setReceiptModalTx(ms.simulatedTxId)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold transition-colors flex items-center space-x-1"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      ) : isEscrowed ? (
                        <>
                          {currentUser.role === 'client' ? (
                            <button
                              onClick={() =>
                                updateMilestoneStatus(currentProject.id, ms.id, 'released')
                              }
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                              <span>Release ${ms.amount} Payment</span>
                            </button>
                          ) : (
                            <button
                              disabled={isInReview}
                              onClick={() =>
                                updateMilestoneStatus(currentProject.id, ms.id, 'in_review')
                              }
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                                isInReview
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                              }`}
                            >
                              {isInReview ? 'Awaiting Client Review' : 'Submit for Approval'}
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            updateMilestoneStatus(currentProject.id, ms.id, 'escrow_funded')
                          }
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
                        >
                          Fund Simulated Escrow
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulated Transaction Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm">
          Simulated Payment Gateway Transaction Audit
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Transaction ID</th>
                <th className="py-2.5 px-3">Milestone</th>
                <th className="py-2.5 px-3">Gateway Method</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {milestones.map((ms) => (
                <tr key={ms.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono text-[11px] text-blue-600">
                    {ms.simulatedTxId}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{ms.title}</td>
                  <td className="py-3 px-3 text-slate-500">PayPal Simulated Escrow</td>
                  <td className="py-3 px-3 font-extrabold text-slate-900">${ms.amount} USD</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ms.status === 'released'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {ms.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {receiptModalTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Payment Release Receipt</h3>
              </div>
              <button
                onClick={() => setReceiptModalTx(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Receipt Ref:</span>
                  <span className="text-slate-900 font-bold">{receiptModalTx}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Simulated Payer:</span>
                  <span className="text-slate-900">Marcus Vance (NexaTech)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Simulated Recipient:</span>
                  <span className="text-slate-900">Alex Rivera</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Disbursement Status:</span>
                  <span className="text-emerald-700 font-bold">100% Cleared Demo Funds</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                TrustBridge Simulated Escrow • Demo Receipt Proof
              </p>
            </div>

            <button
              onClick={() => setReceiptModalTx(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
