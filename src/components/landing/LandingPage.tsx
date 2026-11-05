import React, { useState } from 'react';
import {
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Layers,
  Coins,
  Scale,
  Users,
  ChevronDown,
  DollarSign,
  Clock,
  Lock,
  Play,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingPage: React.FC = () => {
  const { setActiveTab, switchUserById } = useApp();

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Interactive micro-demo state for the landing page showcase
  const [demoScope, setDemoScope] = useState('Website with 5 pages, contact form, responsive design');
  const [demoNewReq, setDemoNewReq] = useState('Add 3 additional pages, add admin dashboard, integrate payment gateway');
  const [demoAnalyzed, setDemoAnalyzed] = useState(false);

  const faqs = [
    {
      q: 'How does ScopeGuard AI prevent project scope creep?',
      a: 'ScopeGuard AI uses Gemini 3.8 Flash to semantically compare original contract specifications with subsequent client change requests. It identifies newly introduced features, quantifies the added engineering effort, and generates an objective cost and timeline proposal addendum before any unbilled work commences.',
    },
    {
      q: 'Does TrustBridge overwrite original agreements when changes happen?',
      a: 'Never. TrustBridge implements immutable version history. When a client approves a ScopeGuard proposal, Agreement Version 2.0 is created with updated fees and milestones, while Version 1.0 remains permanently preserved in the cryptographic audit ledger.',
    },
    {
      q: 'What is Simulated Milestone Escrow in the demo?',
      a: 'In this hackathon prototype, milestone funds are held in a simulated PayPal/fintech escrow state. Clients deposit demo funds upfront, and payments are unlocked step-by-step as each milestone deliverable is verified. No real money or third-party bank transfers are initiated.',
    },
    {
      q: 'Can both freelancers and clients propose adjustments to AI estimates?',
      a: 'Yes! While Gemini provides realistic baseline estimates for hours and fees, both freelancers and clients can fine-tune additional costs and timelines before formalizing Agreement Version 2.0.',
    },
    {
      q: 'What happens if a client declines a revised proposal?',
      a: 'If a client declines an addendum, the original Version 1.0 agreement remains 100% active and enforceable. Freelancers continue working exclusively on the initial agreed deliverables without penalty.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-600 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 sm:pt-20 sm:pb-32">
        {/* Glow & Grid Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-blue-600/25 via-indigo-600/20 to-cyan-400/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Next-Generation Freelancer Protection Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1]">
            Your Work. Your Terms.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Your Protection.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            TrustBridge AI eliminates scope creep, unclear agreements, and payment disputes with
            automated <strong>ScopeGuard™ AI analysis</strong>, immutable agreement versioning, and
            transparent milestone escrow.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                switchUserById('freelancer-a');
                setActiveTab('dashboard');
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base shadow-xl shadow-blue-500/30 hover:scale-102 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                switchUserById('freelancer-a');
                setActiveTab('scopeguard');
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold text-base shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-cyan-400 fill-current" />
              <span>Explore Interactive Demo</span>
            </button>
          </div>

          {/* Social Proof Tags */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Powered by Gemini 3.8 Flash</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Version 2.0 Addendum Generation</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Simulated Milestone Escrow</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
              The Problem & The Solution
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold">
              Freelancing is Broken by Scope Creep & Payment Disagreements
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Broken Status Quo */}
            <div className="rounded-2xl bg-slate-950/80 border border-rose-500/30 p-8 space-y-5">
              <div className="flex items-center space-x-3 text-rose-400">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold">The Frustrating Status Quo</h4>
              </div>
              <ul className="space-y-3.5 text-sm text-slate-300">
                <li className="flex items-start space-x-3">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>
                    <strong>Unclear Project Agreements:</strong> Handshake deals and vague messages
                    leave deliverables open to interpretation.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>
                    <strong>Unbilled "Quick Favors":</strong> Clients request extra pages, dashboards,
                    and payment gateways without compensating for added time.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>
                    <strong>Payment Disagreements:</strong> Lack of staged escrow causes tension
                    and withheld final compensation at project launch.
                  </span>
                </li>
              </ul>
            </div>

            {/* The TrustBridge AI Solution */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-950/60 to-slate-950 border border-blue-500/40 p-8 space-y-5 shadow-xl shadow-blue-500/10">
              <div className="flex items-center space-x-3 text-blue-400">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-300" />
                </div>
                <h4 className="text-xl font-bold">The TrustBridge AI Guarantee</h4>
              </div>
              <ul className="space-y-3.5 text-sm text-slate-200">
                <li className="flex items-start space-x-3">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>
                    <strong>ScopeGuard AI Engine:</strong> Gemini 3.8 Flash detects scope divergence
                    and calculates fair, objective pricing adjustments automatically.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>
                    <strong>Agreement Versioning:</strong> Never overwrite the original contract.
                    Activate legal Version 2.0 only when mutually signed.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>
                    <strong>Transparent Milestone Escrow:</strong> Staged milestone disbursements
                    ensure freelancers are paid on time and clients receive quality work.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ScopeGuard AI Showcase Widget */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Innovation Preview</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black">
            ScopeGuard AI in Action
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            See how TrustBridge turns client change requests into structured, paid proposals.
          </p>
        </div>

        {/* Interactive ScopeGuard Mockup Card */}
        <div className="bg-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Baseline */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Agreement Version 1.0 (Signed Baseline)</span>
                </span>
                <span className="text-slate-400">$200 • 15 Days</span>
              </div>
              <p className="text-xs text-slate-300 font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                {demoScope}
              </p>
            </div>

            {/* New additions */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>New Client Requests (Unbilled Additions)</span>
                </span>
                <span className="text-amber-300 font-semibold">Scope Expansion</span>
              </div>
              <p className="text-xs text-slate-300 font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                {demoNewReq}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center">
            <button
              onClick={() => setDemoAnalyzed(true)}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all hover:scale-102 flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Simulate ScopeGuard Analysis</span>
            </button>
          </div>

          {demoAnalyzed && (
            <div className="mt-8 pt-6 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-200 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Original Budget</div>
                  <div className="text-xl font-bold text-white mt-1">$200</div>
                </div>
                <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-500/30">
                  <div className="text-[10px] uppercase font-bold text-cyan-300">Added Cost</div>
                  <div className="text-xl font-bold text-cyan-400 mt-1">+$150</div>
                </div>
                <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30">
                  <div className="text-[10px] uppercase font-bold text-emerald-300">Revised Budget</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">$350</div>
                </div>
                <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/30">
                  <div className="text-[10px] uppercase font-bold text-indigo-300">Revised Timeline</div>
                  <div className="text-xl font-bold text-indigo-400 mt-1">22 Days (+7d)</div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    switchUserById('freelancer-a');
                    setActiveTab('scopeguard');
                  }}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                >
                  <span>Launch Full ScopeGuard AI in Workspace →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
              Platform Features
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold">
              Built for Unbreakable Trust & Frictionless Delivery
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">ScopeGuard AI Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Objective comparison powered by Gemini 3.8 Flash. Analyzes added, modified, or
                clarified deliverables and calculates effort and costs automatically.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Immutable Version History</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Never overwrite existing contracts. Version 1.0 remains locked and active until
                Version 2.0 is accepted by the client. Both sides have complete transparency.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Milestone Escrow Protection</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stage disbursements as milestones are met. No disputes over uncompleted work or
                unpaid final invoices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (4 Steps) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
            The TrustBridge Protocol
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold">How It Works in 4 Steps</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Draft Baseline Agreement',
              desc: 'Define scope, budget ($200), and timeline (15d) with protective ScopeGuard terms.',
            },
            {
              step: '02',
              title: 'Client Submits New Scope',
              desc: 'Client requests extra pages, dashboards, or gateway integrations in the portal.',
            },
            {
              step: '03',
              title: 'Gemini Scans Delta',
              desc: 'ScopeGuard calculates +$150 and +7 days with an itemized impact table.',
            },
            {
              step: '04',
              title: 'Accept & Seal Version 2.0',
              desc: 'Client approves proposal; Version 2.0 ($350, 22d) is created without touching v1.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 relative"
            >
              <span className="text-2xl font-black text-blue-500 font-mono">{item.step}</span>
              <h4 className="text-base font-bold text-white">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
              Transparent Pricing
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold">
              Predictable Plans for Freelancers and Teams
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-base font-bold text-white">Starter Freelancer</h4>
              <div className="text-3xl font-black text-white">$0</div>
              <p className="text-xs text-slate-400">For individual contractors getting started.</p>
              <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                <li>✓ Up to 3 active agreements</li>
                <li>✓ Basic ScopeGuard AI scans</li>
                <li>✓ Simulated milestone escrow</li>
              </ul>
              <button
                onClick={() => {
                  switchUserById('freelancer-a');
                  setActiveTab('dashboard');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Use Free Prototype
              </button>
            </div>

            {/* Pro Tier (Popular) */}
            <div className="bg-gradient-to-b from-blue-950/80 to-slate-950 border-2 border-blue-500 rounded-2xl p-6 space-y-4 shadow-xl relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                Most Popular
              </span>
              <h4 className="text-base font-bold text-white">Solo Pro</h4>
              <div className="text-3xl font-black text-white">
                $19 <span className="text-xs text-slate-400 font-normal">/ month</span>
              </div>
              <p className="text-xs text-slate-400">
                For professional freelancers managing high-value clients.
              </p>
              <ul className="space-y-2 text-xs text-slate-200 pt-3 border-t border-slate-800">
                <li>✓ Unlimited agreements & projects</li>
                <li>✓ Priority Gemini 3.8 Flash analysis</li>
                <li>✓ Custom proposal branding & addendums</li>
                <li>✓ Unlimited version history logs</li>
              </ul>
              <button
                onClick={() => {
                  switchUserById('freelancer-a');
                  setActiveTab('dashboard');
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/30 transition-colors"
              >
                Start Pro Demo
              </button>
            </div>

            {/* Agency Tier */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-base font-bold text-white">Agency & Enterprise</h4>
              <div className="text-3xl font-black text-white">
                $49 <span className="text-xs text-slate-400 font-normal">/ month</span>
              </div>
              <p className="text-xs text-slate-400">For studios and multi-freelancer teams.</p>
              <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                <li>✓ Team accounts & multi-role RBAC</li>
                <li>✓ Company legal template repository</li>
                <li>✓ Advanced audit & dispute resolution</li>
              </ul>
              <button
                onClick={() => {
                  switchUserById('admin-1');
                  setActiveTab('admin-overview');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                View Admin Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">FAQ</h2>
          <h3 className="text-3xl font-extrabold">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white">TrustBridge AI</span>
            <span>• Protect Your Work. Build Trust. Manage Every Change.</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                switchUserById('freelancer-a');
                setActiveTab('dashboard');
              }}
              className="hover:text-slate-300 transition-colors"
            >
              Freelancer App
            </button>
            <button
              onClick={() => {
                switchUserById('client-a');
                setActiveTab('dashboard');
              }}
              className="hover:text-slate-300 transition-colors"
            >
              Client Portal
            </button>
            <button
              onClick={() => {
                switchUserById('admin-1');
                setActiveTab('admin-overview');
              }}
              className="hover:text-slate-300 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
