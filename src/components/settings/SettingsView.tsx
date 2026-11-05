import React, { useEffect, useState } from 'react';
import {
  Settings,
  Shield,
  RefreshCw,
  Key,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Database,
  Phone,
  Instagram,
  Coins,
  FileCode,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

export const SettingsView: React.FC = () => {
  const { currentUser, resetDemoData } = useApp();
  const [integrationStatus, setIntegrationStatus] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  useEffect(() => {
    api.integrations.getStatus().then((res) => {
      if (res.success) setIntegrationStatus(res);
    });
    api.payments.getBalance(currentUser.id).then((res) => {
      if (res.success) setWalletBalance(res.simulatedBalance || 0);
    });
  }, [currentUser]);

  return (
    <div className="space-y-6 pb-20 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-100">
            System & Architecture
          </span>
          <span className="text-xs text-slate-400">Node.js Express + Supabase + Gemini</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Full-Stack Settings & Integrations</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your TrustBridge profile preferences, database connections, Meta webhooks, Escrow sandbox, and ScopeGuard AI engine.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        {/* Active Profile */}
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm mb-3">Active Authenticated Profile</h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 gap-3">
            <div className="flex items-center space-x-4">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/30" />
              <div>
                <div className="font-bold text-slate-900 text-sm">{currentUser.name}</div>
                <div className="text-xs text-blue-600 font-medium capitalize">{currentUser.role} • {currentUser.title}</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email}</div>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-right self-start sm:self-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Simulated Balance</span>
              <div className="text-base font-black text-emerald-600">${walletBalance} USD</div>
            </div>
          </div>
        </div>

        {/* Database & Supabase */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-sm mb-2 flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Database: Supabase PostgreSQL (9 Tables)</span>
          </h3>
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
            <div className="flex items-center justify-between font-bold text-emerald-800">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Supabase PostgreSQL Schema & RLS Ready</span>
              </span>
              <span className="text-[10px] uppercase bg-emerald-100 px-2 py-0.5 rounded font-mono">
                supabase-schema.sql
              </span>
            </div>
            <p className="text-emerald-800/90 leading-relaxed text-[11px]">
              Full database definitions configured for: profiles, projects, agreements, milestones, escrow_transactions, messages, social_connections, ai_insights, and notifications with strict Row Level Security (RLS) policies.
            </p>
          </div>
        </div>

        {/* Escrow Engine Sandbox */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-sm mb-2 flex items-center space-x-2">
            <Coins className="w-4 h-4 text-blue-600" />
            <span>Escrow Sandbox Payment Engine</span>
          </h3>
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 text-xs text-blue-950 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-blue-800">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Backend-Controlled Escrow State Machine Active</span>
            </div>
            <p className="text-blue-800/90 leading-relaxed text-[11px]">
              Strict finite state transitions enforced on Node.js backend: CREATED → PENDING → AUTHORIZED → LOCKED → RELEASE_REQUESTED → RELEASED. Freelancers cannot approve their own payments; clients cannot release funds for unauthorized projects.
            </p>
            <div className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              DEMO ESCROW – No real money is transferred or held.
            </div>
          </div>
        </div>

        {/* Meta Integrations */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-sm mb-2 flex items-center space-x-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Meta Webhooks (WhatsApp & Instagram)</span>
          </h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">WhatsApp Cloud API:</span>
              <span className="text-emerald-600 font-bold">/api/integrations/whatsapp/webhook</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Instagram Messaging API:</span>
              <span className="text-emerald-600 font-bold">/api/integrations/instagram/webhook</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Verify Token:</span>
              <span className="text-slate-700">trustbridge_meta_verify_token_2026</span>
            </div>
          </div>
        </div>

        {/* ScopeGuard AI Engine */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-sm mb-2 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>Google Gemini 3.8 Flash AI Engine</span>
          </h3>
          <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2">
            <div className="flex items-center space-x-2 font-bold text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Server-Side @google/genai SDK Integration</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              API calls are proxied securely through the Node.js Express backend. Your Gemini API key is maintained securely on the server and never exposed in client bundles. Includes contract extraction, disparity scanning, and automated Version 2 agreement drafting.
            </p>
          </div>
        </div>

        {/* Reset Demo Data */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-sm mb-2 text-rose-600">Demo Data Reset</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Want to restart the 19-step demo journey from scratch? This button clears all stored changes and resets to Step 1 (Freelancer A with $200 baseline).
          </p>
          <button
            onClick={() => {
              if (confirm('Reset all demo state and return to Step 1?')) {
                resetDemoData();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors flex items-center space-x-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Workspace Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
