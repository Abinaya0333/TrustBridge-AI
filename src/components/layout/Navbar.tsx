import React, { useState } from 'react';
import {
  Shield,
  Sparkles,
  Bell,
  RefreshCw,
  ChevronDown,
  Globe,
  LayoutDashboard,
  CheckCircle2,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthModal } from '../auth/AuthModal';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchUserById,
    users,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    activeTab,
    setActiveTab,
    resetDemoData,
    isWalkthroughOpen,
    setIsWalkthroughOpen,
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const userNotifications = notifications.filter(
    (n) => n.recipientId === currentUser.id || n.recipientId === 'all'
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-2.5 focus:outline-none group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                  TrustBridge<span className="text-blue-400">.ai</span>
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                  Gemini ScopeGuard
                </span>
              </div>
            </button>
          </div>

          {/* Quick Controls & Persona Switcher */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* View Mode Toggle: Landing Page vs Workspace */}
            <button
              onClick={() => setActiveTab(activeTab === 'landing' ? 'dashboard' : 'landing')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                activeTab === 'landing'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {activeTab === 'landing' ? (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Go to App</span>
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Landing Page</span>
                  <span className="sm:hidden">Landing</span>
                </>
              )}
            </button>

            {/* Walkthrough guide toggle */}
            <button
              onClick={() => setIsWalkthroughOpen(!isWalkthroughOpen)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                isWalkthroughOpen
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Toggle 19-Step Demo Walkthrough Guide"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Demo Tour</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowUserMenu(false);
                }}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-white">Notifications</span>
                      <span className="px-1.5 py-0.5 text-[10px] bg-blue-500/20 text-blue-400 rounded-full font-bold">
                        {userNotifications.length}
                      </span>
                    </div>
                    {userNotifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                    {userNotifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 text-xs">
                        No notifications yet.
                      </div>
                    ) : (
                      userNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.linkTab) setActiveTab(notif.linkTab);
                            setShowNotifMenu(false);
                          }}
                          className={`p-3.5 hover:bg-slate-800/60 transition-colors cursor-pointer text-xs ${
                            !notif.read ? 'bg-blue-950/20' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-semibold text-white flex items-center space-x-1.5">
                              {!notif.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                              )}
                              <span>{notif.title}</span>
                            </span>
                            <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className="mt-1 text-slate-400 text-[11px] leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifMenu(false);
                }}
                className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500/50"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-white flex items-center space-x-1">
                    <span>{currentUser.name}</span>
                  </div>
                  <div className="text-[10px] text-blue-400 capitalize font-medium flex items-center space-x-1">
                    <span>{currentUser.role}</span>
                    {currentUser.company && (
                      <span className="text-slate-400 truncate max-w-[80px]">
                        • {currentUser.company}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Persona Switcher Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-slate-200">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Switch Demo Role
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Simulate multi-party agreement workflows
                    </p>
                  </div>
                  <div className="p-1 space-y-1">
                    {users.map((u) => {
                      const isActive = u.id === currentUser.id;
                      const roleBadgeColor =
                        u.role === 'freelancer'
                          ? 'bg-blue-500/20 text-blue-400'
                          : u.role === 'client'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-purple-500/20 text-purple-400';

                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUserById(u.id);
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                            isActive
                              ? 'bg-blue-600/20 text-white font-medium border border-blue-500/40'
                              : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold truncate">{u.name}</span>
                              <span
                                className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${roleBadgeColor}`}
                              >
                                {u.role}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">
                              {u.title} {u.company ? `(${u.company})` : ''}
                            </p>
                          </div>
                          {isActive && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800 px-2 space-y-1">
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-950/30 rounded-lg transition-colors font-bold"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Supabase Auth & Roles</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Reset demo data to initial state? This clears changes and resets to Step 1.')) {
                          resetDemoData();
                          setShowUserMenu(false);
                        }
                      }}
                      className="w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-lg transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Demo Data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Supabase Authentication & Profile Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};
