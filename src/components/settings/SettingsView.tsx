import React from 'react';
import { Settings, Shield, RefreshCw, Key, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { currentUser, resetDemoData } = useApp();

  return (
    <div className="space-y-6 pb-20 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">Workspace Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your TrustBridge profile preferences, ScopeGuard AI engine settings, and demo state.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm mb-3">Active Profile</h3>
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <div className="font-bold text-slate-900 text-sm">{currentUser.name}</div>
              <div className="text-xs text-blue-600 font-medium capitalize">{currentUser.role} • {currentUser.title}</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email}</div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-sm mb-2">ScopeGuard AI Engine</h3>
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 text-xs text-blue-900 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-blue-800">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Server-Side Gemini 3.8 Flash Integration Active</span>
            </div>
            <p className="text-blue-700/90 leading-relaxed">
              API calls are proxied securely through the Node.js Express backend. Your Gemini API key is maintained securely on the server and never exposed in client bundles.
            </p>
          </div>
        </div>

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
