import React from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DEMO_STEPS = [
  {
    step: 1,
    title: 'Login as Freelancer A',
    role: 'freelancer-a',
    tab: 'dashboard',
    desc: 'Switch to Alex Rivera (Senior Web Developer) profile.',
    actionLabel: 'Switch to Freelancer A',
  },
  {
    step: 2,
    title: 'Open / Create Website Project',
    role: 'freelancer-a',
    tab: 'projects',
    desc: 'Verify the "Corporate Website & Lead Capture Portal" workspace.',
    actionLabel: 'Go to Projects',
  },
  {
    step: 3,
    title: 'Configure Original Scope',
    role: 'freelancer-a',
    tab: 'projects',
    desc: 'Scope is defined: 5 pages, contact form, responsive design.',
    actionLabel: 'Inspect Deliverables',
  },
  {
    step: 4,
    title: 'Verify Budget & Timeline',
    role: 'freelancer-a',
    tab: 'projects',
    desc: 'Baseline budget set to $200 and timeline to 15 days.',
    actionLabel: 'View Financials ($200)',
  },
  {
    step: 5,
    title: 'Generate & Send Agreement v1.0',
    role: 'freelancer-a',
    tab: 'agreements',
    desc: 'Generate formal agreement draft with protective ScopeGuard clauses.',
    actionLabel: 'View v1.0 Agreement',
  },
  {
    step: 6,
    title: 'Switch to Client A (Marcus Vance)',
    role: 'client-a',
    tab: 'dashboard',
    desc: 'Log in as the client to manage project and requirements.',
    actionLabel: 'Switch to Client A',
  },
  {
    step: 7,
    title: 'Submit 3 New Scope Requirements',
    role: 'client-a',
    tab: 'submit-scope',
    desc: 'Client requests: 3 extra pages, Admin Dashboard & Payment Gateway.',
    actionLabel: 'Open Request Form',
  },
  {
    step: 8,
    title: 'Switch Back to Freelancer A',
    role: 'freelancer-a',
    tab: 'dashboard',
    desc: 'Freelancer receives scope creep notification banner.',
    actionLabel: 'Switch to Freelancer A',
  },
  {
    step: 9,
    title: 'Open ScopeGuard AI Engine',
    role: 'freelancer-a',
    tab: 'scopeguard',
    desc: 'View side-by-side comparison of original vs new requirements.',
    actionLabel: 'Open ScopeGuard AI',
  },
  {
    step: 10,
    title: 'Click "Analyze Scope Changes"',
    role: 'freelancer-a',
    tab: 'scopeguard',
    desc: 'Trigger Gemini 3.8 Flash AI contract and scope disparity analysis.',
    actionLabel: 'Trigger Gemini Scan',
  },
  {
    step: 11,
    title: 'Examine Gemini Scope Insights',
    role: 'freelancer-a',
    tab: 'scopeguard',
    desc: 'AI detects 3 added features with breakdown of effort and complexity.',
    actionLabel: 'Inspect Delta Table',
  },
  {
    step: 12,
    title: 'Review Cost & Timeline Impact',
    role: 'freelancer-a',
    tab: 'scopeguard',
    desc: 'Original: $200 (15d) -> Added: +$150 (+7d) -> Revised: $350 (22d).',
    actionLabel: 'Review Impact Summary',
  },
  {
    step: 13,
    title: 'Generate Revised Proposal',
    role: 'freelancer-a',
    tab: 'scopeguard',
    desc: 'Prepare formal addendum proposal with revised $350 budget.',
    actionLabel: 'Prepare Proposal',
  },
  {
    step: 14,
    title: 'Send Proposal to Client A',
    role: 'freelancer-a',
    tab: 'scopeguard',
    desc: 'Transmit ScopeGuard proposal with transparent breakdown.',
    actionLabel: 'Send Proposal',
  },
  {
    step: 15,
    title: 'Switch to Client A to Review',
    role: 'client-a',
    tab: 'proposals',
    desc: 'Client receives prompt to accept or reject Version 2 terms.',
    actionLabel: 'Switch to Client Review',
  },
  {
    step: 16,
    title: 'Client Accepts Proposal',
    role: 'client-a',
    tab: 'proposals',
    desc: 'Client approves the +$150 / +7 days scope change.',
    actionLabel: 'Approve & Create v2.0',
  },
  {
    step: 17,
    title: 'Create Agreement Version 2.0',
    role: 'client-a',
    tab: 'version-history',
    desc: 'System locks v1.0 as superseded and activates Version 2.0.',
    actionLabel: 'View Version 2.0',
  },
  {
    step: 18,
    title: 'Compare Version 1 & 2 Side-by-Side',
    role: 'freelancer-a',
    tab: 'version-history',
    desc: 'Full side-by-side delta showing $200 vs $350 and expanded deliverables.',
    actionLabel: 'View Side-by-Side Diff',
  },
  {
    step: 19,
    title: 'Verify Updated Budget & Milestones',
    role: 'freelancer-a',
    tab: 'milestones',
    desc: 'Check live project budget ($350) and new Milestone 3 ($150).',
    actionLabel: 'Inspect Updated Milestones',
  },
];

export const DemoWalkthroughBar: React.FC = () => {
  const {
    walkthroughStep,
    setWalkthroughStep,
    isWalkthroughOpen,
    setIsWalkthroughOpen,
    switchUserById,
    setActiveTab,
    acceptRevisedProposal,
    resetDemoData,
  } = useApp();

  if (!isWalkthroughOpen) return null;

  const currentStepIndex = Math.min(Math.max(walkthroughStep, 0), DEMO_STEPS.length - 1);
  const current = DEMO_STEPS[currentStepIndex];

  const handleNext = () => {
    const nextIdx = Math.min(currentStepIndex + 1, DEMO_STEPS.length - 1);
    executeStep(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = Math.max(currentStepIndex - 1, 0);
    executeStep(prevIdx);
  };

  const executeStep = (stepIdx: number) => {
    setWalkthroughStep(stepIdx);
    const target = DEMO_STEPS[stepIdx];
    switchUserById(target.role);
    setActiveTab(target.tab);

    // If step 16 or 17, automatically trigger proposal acceptance for demonstration convenience
    if (target.step === 16 || target.step === 17) {
      acceptRevisedProposal('req-1');
    }
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl bg-slate-900/95 backdrop-blur-md border border-blue-500/40 rounded-2xl shadow-2xl p-3 sm:p-4 text-white animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Step indicator & badge */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/25">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Step {current.step} of 19
              </span>
              <span className="text-[11px] font-medium text-slate-400 flex items-center space-x-1">
                <Users className="w-3 h-3 text-slate-500" />
                <span className="capitalize">{current.role.replace('-', ' ')}</span>
              </span>
            </div>
            <h4 className="text-sm font-bold text-white truncate mt-0.5">
              {current.title}
            </h4>
            <p className="text-xs text-slate-300 truncate hidden md:block">
              {current.desc}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:text-slate-400 transition-colors"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => executeStep(currentStepIndex)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all hover:scale-102"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{current.actionLabel}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === DEMO_STEPS.length - 1}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

          <button
            onClick={() => {
              if (confirm('Restart demo walkthrough from Step 1?')) {
                resetDemoData();
                executeStep(0);
              }
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Restart Tour from Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsWalkthroughOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Dismiss Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
