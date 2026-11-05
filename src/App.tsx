import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { FreelancerDashboard } from './components/dashboard/FreelancerDashboard';
import { ClientDashboard } from './components/dashboard/ClientDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { ScopeGuardPage } from './components/scopeguard/ScopeGuardPage';
import { ProjectManagement } from './components/projects/ProjectManagement';
import { AgreementGenerator } from './components/agreements/AgreementGenerator';
import { VersionHistoryView } from './components/agreements/VersionHistoryView';
import { MilestoneTracker } from './components/milestones/MilestoneTracker';
import { ClientList } from './components/clients/ClientList';
import { SettingsView } from './components/settings/SettingsView';
import { DemoWalkthroughBar } from './components/walkthrough/DemoWalkthroughBar';

const AppContent: React.FC = () => {
  const { activeTab, currentUser } = useApp();

  // Full Landing Page view
  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <LandingPage />
        <DemoWalkthroughBar />
      </div>
    );
  }

  // Render view content based on activeTab and role
  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        if (currentUser.role === 'freelancer') return <FreelancerDashboard />;
        if (currentUser.role === 'client') return <ClientDashboard />;
        return <AdminDashboard />;

      case 'projects':
      case 'admin-projects':
        return <ProjectManagement />;

      case 'clients':
        return <ClientList />;

      case 'agreements':
        return <AgreementGenerator />;

      case 'scopeguard':
      case 'admin-audits':
        return <ScopeGuardPage />;

      case 'milestones':
        return <MilestoneTracker />;

      case 'version-history':
        return <VersionHistoryView />;

      case 'submit-scope':
      case 'proposals':
        return <ClientDashboard />;

      case 'admin-overview':
      case 'admin-users':
        return <AdminDashboard />;

      case 'settings':
        return <SettingsView />;

      default:
        if (currentUser.role === 'freelancer') return <FreelancerDashboard />;
        if (currentUser.role === 'client') return <ClientDashboard />;
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#edf3f8]">
      <Navbar />

      <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
        <Sidebar />

        {/* Content area: White and light-blue modern SaaS workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
          {renderView()}
        </main>
      </div>

      {/* Floating 19-Step Demo Walkthrough Tour Bar */}
      <DemoWalkthroughBar />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
