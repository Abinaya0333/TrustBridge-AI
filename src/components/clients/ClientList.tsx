import React from 'react';
import { Users, Mail, Phone, ExternalLink, ShieldCheck, FolderGit2, Star, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ClientList: React.FC = () => {
  const { users, projects, setSelectedProjectId, setActiveTab } = useApp();

  const clientUsers = users.filter((u) => u.role === 'client');

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-100">
              Client Directory
            </span>
            <span className="text-xs text-slate-400">Verified Corporate Accounts</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Client Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage client communications, active agreements, and ScopeGuard change logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clientUsers.map((client) => {
          const clientProjects = projects.filter((p) => p.clientId === client.id);
          const totalSpent = clientProjects.reduce((sum, p) => sum + p.budget, 0);

          return (
            <div
              key={client.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={client.avatar}
                    alt={client.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/20"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-extrabold text-slate-900 text-base">{client.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{client.title} • {client.company}</p>
                    <p className="text-xs text-blue-600 font-mono mt-0.5">{client.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Projects</span>
                    <div className="font-extrabold text-slate-900">{clientProjects.length}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Total Budget</span>
                    <div className="font-black text-slate-900">${totalSpent}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Trust Rating</span>
                    <div className="font-bold text-emerald-600 flex items-center space-x-0.5">
                      <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                      <span>5.0</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Associated Projects:
                  </span>
                  {clientProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedProjectId(p.id);
                        setActiveTab('projects');
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <FolderGit2 className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {p.title}
                        </span>
                      </div>
                      <span className="text-xs font-black text-slate-800">${p.budget}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    if (clientProjects[0]) setSelectedProjectId(clientProjects[0].id);
                    setActiveTab('scopeguard');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors"
                >
                  Analyze Scope
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
