import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  History,
  FileSignature,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';

export const ProjectManagement: React.FC = () => {
  const {
    projects,
    currentUser,
    users,
    createProject,
    selectedProjectId,
    setSelectedProjectId,
    setActiveTab,
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('client-a');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(200);
  const [timelineDays, setTimelineDays] = useState(15);
  const [deliverables, setDeliverables] = useState<string[]>([
    'Website with 5 pages',
    'Contact form',
    'Responsive design',
  ]);
  const [newDeliverableInput, setNewDeliverableInput] = useState('');

  const clientUsers = users.filter((u) => u.role === 'client');

  const handleAddDeliverable = () => {
    if (!newDeliverableInput.trim()) return;
    setDeliverables([...deliverables, newDeliverableInput.trim()]);
    setNewDeliverableInput('');
  };

  const handleRemoveDeliverable = (idx: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== idx));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createProject({
      title,
      clientId,
      description,
      budget,
      timelineDays,
      deliverables,
    });

    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-100">
              Workspace Projects
            </span>
            <span className="text-xs text-slate-400">Total: {projects.length} Projects</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Project Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure project baselines, deliverable checklists, milestone schedules, and client scopes.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => {
          const isSelected = proj.id === selectedProjectId;
          const client = users.find((u) => u.id === proj.clientId);
          const freelancer = users.find((u) => u.id === proj.freelancerId);
          const hasScopeAlert = proj.status === 'scope_alert';

          return (
            <div
              key={proj.id}
              className={`rounded-2xl border transition-all p-6 bg-white flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                  : 'border-slate-200/80 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-100">
                        Version {proj.currentVersion}.0
                      </span>
                      {hasScopeAlert && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200 flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Scope Alert</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{proj.title}</h3>
                  </div>

                  <button
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? 'Active Scope' : 'Select'}
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">{proj.description}</p>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Client</span>
                    <div className="font-bold text-slate-900 truncate">
                      {client?.name || proj.clientId}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Budget</span>
                    <div className="font-black text-slate-900">${proj.budget}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Duration</span>
                    <div className="font-bold text-slate-900">{proj.timelineDays} Days</div>
                  </div>
                </div>

                {/* Deliverables Preview */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Agreed Deliverables ({proj.deliverables.length}):
                  </span>
                  {proj.deliverables.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 text-xs text-slate-700 truncate"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                  {proj.deliverables.length > 3 && (
                    <div className="text-[11px] text-blue-600 font-semibold pl-5">
                      +{proj.deliverables.length - 3} more items included
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    setActiveTab('agreements');
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <FileSignature className="w-3.5 h-3.5" />
                  <span>Agreement</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setActiveTab('version-history');
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Versions</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setActiveTab('scopeguard');
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Run ScopeGuard</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Create New Project Scope</h3>
                  <p className="text-xs text-slate-500">Establishes baseline terms for ScopeGuard</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Corporate Website & Portal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assign Client
                </label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  {clientUsers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company || 'Client'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Project Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Overview of the core deliverables..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Initial Budget ($)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Timeline (Days)
                  </label>
                  <input
                    type="number"
                    value={timelineDays}
                    onChange={(e) => setTimelineDays(Number(e.target.value))}
                    className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Fixed Baseline Deliverables
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. Website with 5 pages"
                    value={newDeliverableInput}
                    onChange={(e) => setNewDeliverableInput(e.target.value)}
                    className="flex-1 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="px-3 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {deliverables.map((del, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                    >
                      <span className="text-slate-800 font-medium">✓ {del}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(i)}
                        className="text-rose-500 hover:text-rose-700 font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  Create Project Baseline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
