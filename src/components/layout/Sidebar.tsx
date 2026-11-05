import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Users,
  FileSignature,
  ShieldAlert,
  Coins,
  History,
  Bell,
  Settings,
  Sparkles,
  ArrowRightLeft,
  FilePlus2,
  CheckSquare,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const { currentUser, activeTab, setActiveTab, notifications, changeRequests, switchUserById } = useApp();

  const unreadNotifs = notifications.filter(
    (n) => (n.recipientId === currentUser.id || n.recipientId === 'all') && !n.read
  ).length;

  // Count pending scope items
  const pendingScopeCreep = changeRequests.filter(
    (r) => r.freelancerId === currentUser.id && (r.status === 'submitted' || r.status === 'analyzed')
  ).length;

  const pendingClientProposals = changeRequests.filter(
    (r) => r.clientId === currentUser.id && r.status === 'proposal_sent'
  ).length;

  // Freelancer Nav Items
  const freelancerNav: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'agreements', label: 'Agreements', icon: FileSignature },
    {
      id: 'scopeguard',
      label: 'ScopeGuard AI',
      icon: ShieldAlert,
      badge: pendingScopeCreep > 0 ? `${pendingScopeCreep} Alert` : 'AI Core',
      badgeColor: pendingScopeCreep > 0 ? 'bg-amber-500 text-slate-900 font-bold animate-pulse' : 'bg-blue-600/30 text-blue-300 font-semibold',
      highlight: true,
    },
    { id: 'milestones', label: 'Milestones', icon: Coins },
    {
      id: 'social-integrations',
      label: 'Social & Webhooks',
      icon: MessageSquare,
      badge: 'Meta Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 font-bold',
    },
    { id: 'version-history', label: 'Version History', icon: History },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifs > 0 ? `${unreadNotifs}` : undefined,
      badgeColor: 'bg-blue-500 text-white',
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Client Nav Items
  const clientNav: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'My Projects', icon: FolderGit2 },
    { id: 'agreements', label: 'Agreements', icon: FileSignature },
    {
      id: 'submit-scope',
      label: 'Request Changes',
      icon: FilePlus2,
      badge: 'Submit',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      id: 'proposals',
      label: 'Revised Proposals',
      icon: CheckSquare,
      badge: pendingClientProposals > 0 ? `${pendingClientProposals} Action` : undefined,
      badgeColor: 'bg-indigo-500 text-white animate-pulse',
      highlight: pendingClientProposals > 0,
    },
    { id: 'milestones', label: 'Milestone Escrow', icon: Coins },
    {
      id: 'social-integrations',
      label: 'Social & Webhooks',
      icon: MessageSquare,
      badge: 'Meta Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 font-bold',
    },
    { id: 'version-history', label: 'Agreement History', icon: History },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifs > 0 ? `${unreadNotifs}` : undefined,
      badgeColor: 'bg-blue-500 text-white',
    },
  ];

  // Admin Nav Items
  const adminNav: NavItem[] = [
    { id: 'admin-overview', label: 'Platform Overview', icon: LayoutDashboard },
    { id: 'admin-users', label: 'User Directory', icon: Users },
    { id: 'admin-projects', label: 'All Projects', icon: FolderGit2 },
    { id: 'admin-audits', label: 'Scope Audits', icon: ShieldAlert },
    {
      id: 'social-integrations',
      label: 'Social & Webhooks',
      icon: MessageSquare,
      badge: 'Meta Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 font-bold',
    },
    { id: 'version-history', label: 'Contract Versions', icon: History },
    { id: 'milestones', label: 'Escrow Ledgers', icon: Coins },
  ];

  const currentNav =
    currentUser.role === 'freelancer'
      ? freelancerNav
      : currentUser.role === 'client'
      ? clientNav
      : adminNav;

  return (
    <aside className="w-64 bg-[#0a1120] border-r border-slate-800 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Current User Quick Info */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/30"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                currentUser.role === 'freelancer'
                  ? 'bg-blue-400'
                  : currentUser.role === 'client'
                  ? 'bg-emerald-400'
                  : 'bg-purple-400'
              }`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-white truncate">{currentUser.name}</h4>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span
                className={`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                  currentUser.role === 'freelancer'
                    ? 'bg-blue-500/20 text-blue-400'
                    : currentUser.role === 'client'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-purple-500/20 text-purple-400'
                }`}
              >
                {currentUser.role}
              </span>
              <span className="text-[11px] text-slate-400 truncate">{currentUser.title}</span>
            </div>
          </div>
        </div>

        {/* Quick Switch Action */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 bg-slate-800/50 rounded-lg p-1.5 border border-slate-700/50">
          <span className="truncate">Active Workspace</span>
          <button
            onClick={() => {
              if (currentUser.role === 'freelancer') {
                switchUserById('client-a');
              } else if (currentUser.role === 'client') {
                switchUserById('freelancer-a');
              } else {
                switchUserById('freelancer-a');
              }
            }}
            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>
              {currentUser.role === 'freelancer'
                ? 'Test as Client A'
                : currentUser.role === 'client'
                ? 'Back to Freelancer A'
                : 'Switch Role'}
            </span>
          </button>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {currentNav.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                  : item.highlight
                  ? 'bg-blue-950/40 text-blue-300 hover:bg-blue-900/40 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : item.highlight ? 'text-blue-400' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Trust & Gemini Badge */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="rounded-xl p-3 bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/20 text-xs">
          <div className="flex items-center space-x-2 text-blue-400 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ScopeGuard Protection</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Every scope variation is automatically analyzed and documented into binding addendums.
          </p>
        </div>
      </div>
    </aside>
  );
};
