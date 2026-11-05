import React from 'react';
import {
  Users,
  ShieldCheck,
  FolderGit2,
  FileSignature,
  Clock,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const { users, projects, agreements, changeRequests } = useApp();

  const freelancersCount = users.filter((u) => u.role === 'freelancer').length;
  const clientsCount = users.filter((u) => u.role === 'client').length;
  const pendingApprovalsCount = changeRequests.filter((r) => r.status === 'proposal_sent').length;
  const scopeAlertsCount = projects.filter((p) => p.status === 'scope_alert').length;

  const totalGMV = projects.reduce((sum, p) => sum + p.budget, 0);

  // Chart data
  const categoryData = [
    { name: 'Web Dev', count: 12, fill: '#2563eb' },
    { name: 'UI/UX Design', count: 8, fill: '#06b6d4' },
    { name: 'Full-Stack', count: 6, fill: '#6366f1' },
    { name: 'Mobile App', count: 4, fill: '#10b981' },
  ];

  const scopeCreepTrends = [
    { week: 'W1', resolvedAmicably: 4, disputesAverted: 3 },
    { week: 'W2', resolvedAmicably: 7, disputesAverted: 6 },
    { week: 'W3', resolvedAmicably: 11, disputesAverted: 9 },
    { week: 'W4', resolvedAmicably: 16, disputesAverted: 14 },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Platform Governance
            </span>
            <span className="text-xs text-slate-400">TrustBridge AI Global Network</span>
          </div>
          <h1 className="text-2xl font-extrabold mt-1">Platform Admin & Trust Operations</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit scopes, monitor contract disputes averted via Gemini, and inspect platform liquidity.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-xl bg-slate-800 text-right border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Dispute Free Rate</span>
            <div className="text-xl font-black text-emerald-400">99.4%</div>
          </div>
        </div>
      </div>

      {/* Overview Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Users */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Users</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{users.length}</div>
          <span className="text-[11px] text-slate-500">Verified members</span>
        </div>

        {/* Freelancers */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-blue-600">Freelancers</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{freelancersCount}</div>
          <span className="text-[11px] text-slate-500">Contractors</span>
        </div>

        {/* Clients */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-emerald-600">Clients</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{clientsCount}</div>
          <span className="text-[11px] text-slate-500">Enterprises</span>
        </div>

        {/* Projects */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-indigo-600">Projects</span>
          <div className="text-2xl font-black text-indigo-900 mt-1">{projects.length}</div>
          <span className="text-[11px] text-slate-500">Live contracts</span>
        </div>

        {/* Agreements */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-cyan-600">Agreements</span>
          <div className="text-2xl font-black text-cyan-700 mt-1">{agreements.length}</div>
          <span className="text-[11px] text-slate-500">Versions sealed</span>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-amber-600">Pending Addendums</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingApprovalsCount}</div>
          <span className="text-[11px] text-slate-500">Under negotiation</span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Disputes Averted via ScopeGuard AI
              </h3>
              <p className="text-xs text-slate-400">
                Weekly trends of scope disagreements converted into paid addendums
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scopeCreepTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="resolvedAmicably" name="Amicable Addendums" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="disputesAverted" name="Scope Creep Neutralized" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm mb-1">
              Active Contract Distribution
            </h3>
            <p className="text-xs text-slate-400 mb-4">By engineering discipline</p>

            <div className="space-y-3">
              {categoryData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-slate-700 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.count} projects</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
            <strong>Platform Liquidity:</strong> ${totalGMV.toLocaleString()} in protected contract value.
          </div>
        </div>
      </div>

      {/* Registered User Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm">
          Platform Demo User Accounts Directory
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider text-[10px]">
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Title / Organization</th>
                <th className="py-2.5 px-3">Email Address</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2.5">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-bold text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'freelancer'
                          ? 'bg-blue-100 text-blue-800'
                          : u.role === 'client'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {u.title} {u.company ? `(${u.company})` : ''}
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{u.email}</td>
                  <td className="py-3 px-3">
                    <span className="flex items-center space-x-1 text-emerald-600 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
