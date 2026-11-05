import React from 'react';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  DollarSign,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  FileSignature,
  Coins,
  ChevronRight,
  AlertTriangle,
  Play,
  MessageSquare,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const FreelancerDashboard: React.FC = () => {
  const {
    currentUser,
    projects,
    changeRequests,
    agreements,
    setActiveTab,
    setSelectedProjectId,
  } = useApp();

  const userProjects = projects.filter((p) => p.freelancerId === currentUser.id);
  const totalValue = userProjects.reduce((acc, p) => acc + p.budget, 0);
  const activeCount = userProjects.filter((p) => p.status === 'active' || p.status === 'scope_alert').length;
  const completedCount = userProjects.filter((p) => p.status === 'completed').length;
  const pendingChangeRequests = changeRequests.filter(
    (r) => r.freelancerId === currentUser.id && (r.status === 'submitted' || r.status === 'analyzed')
  );

  // Sample analytics data
  const revenueData = [
    { month: 'Jun', baseline: 1200, scopeProtected: 350 },
    { month: 'Jul', baseline: 1800, scopeProtected: 520 },
    { month: 'Aug', baseline: 2400, scopeProtected: 800 },
    { month: 'Sep', baseline: 2100, scopeProtected: 650 },
    { month: 'Oct', baseline: 3100, scopeProtected: 1100 },
    { month: 'Nov', baseline: totalValue, scopeProtected: 350 },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-600 border border-blue-100">
              Freelancer Workspace
            </span>
            <span className="text-xs text-slate-400">TrustBridge AI Protected</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentUser.title} • {userProjects.length} active engagements under ScopeGuard protection.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('scopeguard')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Open ScopeGuard AI</span>
          </button>
          <button
            onClick={() => setActiveTab('social-integrations')}
            className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Social & Webhooks</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Manage Projects</span>
          </button>
        </div>
      </div>

      {/* Scope Creep Alert Card if pending change requests exist */}
      {pendingChangeRequests.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg animate-in slide-in-from-top-2 duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded">
                  Scope Creep Detected!
                </span>
                <span className="text-xs text-amber-100">Action Required</span>
              </div>
              <h3 className="font-extrabold text-base mt-1">
                Client submitted new requirements outside the agreed scope
              </h3>
              <p className="text-xs text-amber-100 mt-0.5">
                "{pendingChangeRequests[0].requestedText.substring(0, 90)}..."
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedProjectId(pendingChangeRequests[0].projectId);
              setActiveTab('scopeguard');
            }}
            className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-amber-50 font-black text-xs shadow-md shrink-0 flex items-center justify-center space-x-2 transition-transform hover:scale-102"
          >
            <span>Scan with ScopeGuard AI</span>
            <ChevronRight className="w-4 h-4 text-amber-600" />
          </button>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Projects */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Projects</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{userProjects.length}</div>
          <span className="text-[11px] text-slate-500">All contracts</span>
        </div>

        {/* Active Projects */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-blue-600">Active</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{activeCount}</div>
          <span className="text-[11px] text-slate-500">In production</span>
        </div>

        {/* Completed Projects */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-emerald-600">Completed</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{completedCount || 1}</div>
          <span className="text-[11px] text-slate-500">Fully released</span>
        </div>

        {/* Pending Proposals */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-amber-600">Proposals</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {changeRequests.filter((r) => r.freelancerId === currentUser.id && r.status === 'proposal_sent').length || 1}
          </div>
          <span className="text-[11px] text-slate-500">Awaiting client sign</span>
        </div>

        {/* Total Project Value */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm col-span-2">
          <span className="text-[10px] uppercase font-bold text-indigo-600">Total Project Value</span>
          <div className="text-2xl font-black text-indigo-900 mt-1">${totalValue.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 inline mr-0.5" />
            +$350 protected via ScopeGuard
          </span>
        </div>
      </div>

      {/* Analytics Charts & Project List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Protected Scope Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Revenue & Scope Creep Protection History
              </h3>
              <p className="text-xs text-slate-400">
                Baseline contracts vs. additional fees captured through ScopeGuard AI addendums
              </p>
            </div>
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="flex items-center space-x-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>Base Contract</span>
              </span>
              <span className="flex items-center space-x-1 text-emerald-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Scope Additions</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="baseline" name="Base Fee ($)" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="scopeProtected" name="ScopeGuard ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick ScopeGuard Status Widget */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between border border-blue-500/20">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                ScopeGuard Protection
              </span>
              <ShieldAlert className="w-5 h-5 text-blue-400" />
            </div>

            <h3 className="text-lg font-bold">Unbilled Scope Sentinel</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Never do unpaid out-of-scope work again. TrustBridge AI automatically evaluates every
              new client request against the signed agreement and drafts legal Version 2.0 addendums.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Protected Projects:</span>
                <span className="font-bold text-white">{userProjects.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Current Agreement Ver:</span>
                <span className="font-bold text-blue-400">
                  v{userProjects[0]?.currentVersion || 1}.0
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Escrow Milestones:</span>
                <span className="font-bold text-emerald-400">Active</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('scopeguard')}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <span>Test ScopeGuard AI Demo</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Active Projects & Status</h3>
            <p className="text-xs text-slate-400">
              Contract terms, active versions, and deliverable tracking
            </p>
          </div>
          <button
            onClick={() => setActiveTab('projects')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            View All Projects →
          </button>
        </div>

        <div className="space-y-3">
          {userProjects.map((p) => {
            const hasAlert = p.status === 'scope_alert';
            return (
              <div
                key={p.id}
                className={`p-4 rounded-xl border transition-all ${
                  hasAlert
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200/80 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{p.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-600 border border-blue-100">
                        Version {p.currentVersion}.0
                      </span>
                      {hasAlert && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200 flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Scope Creep Alert</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 max-w-xl truncate">{p.description}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {p.deliverables.slice(0, 3).map((d, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px]"
                        >
                          ✓ {d}
                        </span>
                      ))}
                      {p.deliverables.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold">
                          +{p.deliverables.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Total Budget</div>
                      <div className="text-base font-black text-slate-900">${p.budget}</div>
                      <div className="text-[11px] text-slate-500">{p.timelineDays} days timeline</div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          setActiveTab('scopeguard');
                        }}
                        className="px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs transition-colors"
                      >
                        ScopeGuard
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          setActiveTab('version-history');
                        }}
                        className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                      >
                        Version History
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
