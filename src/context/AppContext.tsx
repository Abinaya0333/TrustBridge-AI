import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Project,
  Agreement,
  ScopeChangeRequest,
  NotificationItem,
  ScopeGuardAnalysis,
  ProjectMilestone,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_PROJECTS,
  INITIAL_AGREEMENTS,
  INITIAL_CHANGE_REQUESTS,
  INITIAL_NOTIFICATIONS,
} from '../data/seedData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchUserById: (userId: string) => void;
  users: User[];
  projects: Project[];
  agreements: Agreement[];
  changeRequests: ScopeChangeRequest[];
  notifications: NotificationItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  
  // Project Actions
  createProject: (data: Partial<Project>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  
  // Agreement Actions
  createAgreementDraft: (data: Partial<Agreement>) => Promise<Agreement>;
  sendAgreementToClient: (agreementId: string) => void;
  
  // ScopeGuard & Proposal Actions
  submitChangeRequestByClient: (projectId: string, requestedText: string) => ScopeChangeRequest;
  runScopeGuardAnalysis: (
    projectId: string,
    originalScope: string,
    originalBudget: number,
    originalDays: number,
    newRequirements: string
  ) => Promise<ScopeGuardAnalysis>;
  sendRevisedProposal: (
    requestId: string,
    cost: number,
    days: number,
    notes: string,
    analysis?: ScopeGuardAnalysis
  ) => void;
  acceptRevisedProposal: (requestId: string) => void;
  rejectRevisedProposal: (requestId: string, reason?: string) => void;
  
  // Milestones Actions
  updateMilestoneStatus: (projectId: string, milestoneId: string, status: ProjectMilestone['status']) => void;
  addProjectMilestone: (projectId: string, milestone: Omit<ProjectMilestone, 'id' | 'projectId' | 'simulatedTxId'>) => void;
  
  // Notification Actions
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Demo State & Walkthrough
  resetDemoData: () => void;
  walkthroughStep: number;
  setWalkthroughStep: (step: number) => void;
  isWalkthroughOpen: boolean;
  setIsWalkthroughOpen: (open: boolean) => void;
  executeWalkthroughAction: (step: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'trustbridge_user_id',
  PROJECTS: 'trustbridge_projects_v2',
  AGREEMENTS: 'trustbridge_agreements_v2',
  CHANGE_REQUESTS: 'trustbridge_change_requests_v2',
  NOTIFICATIONS: 'trustbridge_notifications_v2',
  WALKTHROUGH_STEP: 'trustbridge_step_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const users = DEMO_USERS;
  
  // Local storage state initialization
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    const found = users.find((u) => u.id === savedId);
    return found || users[0]; // Default: Freelancer A
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [agreements, setAgreements] = useState<Agreement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AGREEMENTS);
      return saved ? JSON.parse(saved) : INITIAL_AGREEMENTS;
    } catch {
      return INITIAL_AGREEMENTS;
    }
  });

  const [changeRequests, setChangeRequests] = useState<ScopeChangeRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHANGE_REQUESTS);
      return saved ? JSON.parse(saved) : INITIAL_CHANGE_REQUESTS;
    } catch {
      return INITIAL_CHANGE_REQUESTS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-1');
  const [walkthroughStep, setWalkthroughStep] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WALKTHROUGH_STEP);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState<boolean>(true);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AGREEMENTS, JSON.stringify(agreements));
  }, [agreements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHANGE_REQUESTS, JSON.stringify(changeRequests));
  }, [changeRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WALKTHROUGH_STEP, walkthroughStep.toString());
  }, [walkthroughStep]);

  const switchUserById = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      // Auto-navigate appropriately
      if (user.role === 'admin') {
        setActiveTab('admin-overview');
      } else {
        setActiveTab('dashboard');
      }
    }
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Create Project
  const createProject = (data: Partial<Project>): Project => {
    const id = `proj-${Date.now()}`;
    const newProj: Project = {
      id,
      title: data.title || 'New Web Project',
      freelancerId: currentUser.role === 'freelancer' ? currentUser.id : 'freelancer-a',
      clientId: data.clientId || 'client-a',
      description: data.description || 'Full-stack responsive web project.',
      deliverables: data.deliverables || ['Website with 5 pages', 'Contact form', 'Responsive design'],
      budget: data.budget || 200,
      timelineDays: data.timelineDays || 15,
      startDate: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: 'active',
      currentVersion: 1,
      milestones: [
        {
          id: `ms-${id}-1`,
          projectId: id,
          title: 'Initial Wireframes & Page Architecture',
          description: 'Structure, wireframe specifications, and design signoff.',
          amount: Math.round((data.budget || 200) * 0.4),
          dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          status: 'pending',
          simulatedTxId: `TX-SIM-${Math.floor(100000 + Math.random() * 900000)}-TB`,
        },
        {
          id: `ms-${id}-2`,
          projectId: id,
          title: 'Complete Coding, Responsive Testing & Launch',
          description: 'Full deliverable implementation and deployment.',
          amount: Math.round((data.budget || 200) * 0.6),
          dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
          status: 'pending',
          simulatedTxId: `TX-SIM-${Math.floor(100000 + Math.random() * 900000)}-TB`,
        },
      ],
    };

    setProjects((prev) => [newProj, ...prev]);
    setSelectedProjectId(newProj.id);

    addNotification({
      recipientId: newProj.clientId,
      type: 'project',
      title: `New Project Created: ${newProj.title}`,
      message: `${currentUser.name} has created a new project workspace.`,
      linkTab: 'projects',
      linkProjectId: newProj.id,
    });

    return newProj;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  // Create Agreement Draft
  const createAgreementDraft = async (data: Partial<Agreement>): Promise<Agreement> => {
    const proj = projects.find((p) => p.id === (data.projectId || selectedProjectId));
    const client = users.find((u) => u.id === proj?.clientId);
    const freelancer = users.find((u) => u.id === proj?.freelancerId) || currentUser;

    let content = data.content || '';

    if (!content) {
      try {
        const res = await fetch('/api/gemini/generate-agreement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectTitle: proj?.title || 'Website Development',
            clientName: client?.name || 'Client',
            freelancerName: freelancer.name,
            budget: data.budget || proj?.budget || 200,
            timelineDays: data.timelineDays || proj?.timelineDays || 15,
            deliverables: data.deliverables || proj?.deliverables || ['Website with 5 pages', 'Contact form', 'Responsive design'],
            revisionLimit: data.revisionLimit || 2,
          }),
        });
        const resJson = await res.json();
        if (resJson.content) {
          content = resJson.content;
        }
      } catch (e) {
        console.warn('Could not call generate-agreement:', e);
      }
    }

    const newAgr: Agreement = {
      id: `agr-${Date.now()}`,
      projectId: proj?.id || 'proj-1',
      version: data.version || 1,
      title: data.title || `Services Agreement v${data.version || 1}.0`,
      content: content || 'Draft Agreement',
      deliverables: data.deliverables || proj?.deliverables || ['5 pages', 'Contact form', 'Responsive design'],
      budget: data.budget || proj?.budget || 200,
      timelineDays: data.timelineDays || proj?.timelineDays || 15,
      status: 'draft',
      createdAt: new Date().toISOString(),
      revisionLimit: 2,
      notes: data.notes || 'Created via TrustBridge AI Agreement Drafter',
    };

    setAgreements((prev) => [newAgr, ...prev]);
    return newAgr;
  };

  const sendAgreementToClient = (agreementId: string) => {
    const agr = agreements.find((a) => a.id === agreementId);
    if (!agr) return;

    setAgreements((prev) =>
      prev.map((a) => (a.id === agreementId ? { ...a, status: 'sent_to_client' } : a))
    );

    const proj = projects.find((p) => p.id === agr.projectId);
    if (proj) {
      addNotification({
        recipientId: proj.clientId,
        type: 'agreement',
        title: `New Agreement v${agr.version}.0 Sent for Review`,
        message: `${currentUser.name} has submitted the initial project agreement ($${agr.budget}, ${agr.timelineDays} days).`,
        linkTab: 'agreements',
        linkProjectId: proj.id,
      });
    }
  };

  // Submit Client Change Request
  const submitChangeRequestByClient = (projectId: string, requestedText: string): ScopeChangeRequest => {
    const proj = projects.find((p) => p.id === projectId);
    const newReq: ScopeChangeRequest = {
      id: `req-${Date.now()}`,
      projectId,
      clientId: currentUser.id,
      freelancerId: proj?.freelancerId || 'freelancer-a',
      title: 'Additional Feature & Scope Expansion Request',
      requestedText,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
    };

    setChangeRequests((prev) => [newReq, ...prev]);

    // Mark project status as scope_alert
    if (proj) {
      updateProject(projectId, { status: 'scope_alert' });
      addNotification({
        recipientId: proj.freelancerId,
        type: 'scope_request',
        title: '⚠️ Scope Alert: New Requirements Submitted',
        message: `${currentUser.name} requested changes: "${requestedText.substring(0, 60)}..." Run ScopeGuard AI to assess impact.`,
        linkTab: 'scopeguard',
        linkProjectId: projectId,
        linkRequestId: newReq.id,
      });
    }

    return newReq;
  };

  // Run ScopeGuard AI Analysis
  const runScopeGuardAnalysis = async (
    projectId: string,
    originalScope: string,
    originalBudget: number,
    originalDays: number,
    newRequirements: string
  ): Promise<ScopeGuardAnalysis> => {
    const proj = projects.find((p) => p.id === projectId);
    const response = await fetch('/api/gemini/analyze-scope', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectTitle: proj?.title || 'Website Development',
        originalScope,
        originalBudget,
        originalTimelineDays: originalDays,
        newRequirements,
      }),
    });

    const result = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Scope analysis failed');
    }

    const analysisData: ScopeGuardAnalysis = {
      ...result.data,
      source: result.source,
      isSampleFallback: result.isSampleFallback,
    };

    // Store in latest change request if present
    setChangeRequests((prev) => {
      const match = prev.find((r) => r.projectId === projectId && r.status === 'submitted');
      if (match) {
        return prev.map((r) =>
          r.id === match.id
            ? {
                ...r,
                status: 'analyzed',
                analysis: analysisData,
                customAdditionalCost: analysisData.totalAdditionalCost,
                customAdditionalDays: analysisData.totalAdditionalDays,
              }
            : r
        );
      }
      return prev;
    });

    return analysisData;
  };

  // Send Revised Proposal to Client
  const sendRevisedProposal = (
    requestId: string,
    cost: number,
    days: number,
    notes: string,
    analysis?: ScopeGuardAnalysis
  ) => {
    let targetReq: ScopeChangeRequest | undefined = changeRequests.find((r) => r.id === requestId);

    // If no existing request, create one on the fly for current project
    if (!targetReq) {
      const proj = projects.find((p) => p.id === selectedProjectId);
      targetReq = {
        id: `req-${Date.now()}`,
        projectId: selectedProjectId,
        clientId: proj?.clientId || 'client-a',
        freelancerId: currentUser.id,
        title: 'Revised Proposal for Scope Additions',
        requestedText: 'Add 3 additional pages, add an admin dashboard, integrate a payment gateway',
        submittedAt: new Date().toISOString(),
        status: 'proposal_sent',
        analysis,
        customAdditionalCost: cost,
        customAdditionalDays: days,
        freelancerProposalNotes: notes,
        proposalSentAt: new Date().toISOString(),
      };
      setChangeRequests((prev) => [targetReq!, ...prev]);
    } else {
      setChangeRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status: 'proposal_sent',
                customAdditionalCost: cost,
                customAdditionalDays: days,
                freelancerProposalNotes: notes,
                proposalSentAt: new Date().toISOString(),
                ...(analysis ? { analysis } : {}),
              }
            : r
        )
      );
    }

    const proj = projects.find((p) => p.id === targetReq?.projectId);
    if (proj) {
      addNotification({
        recipientId: proj.clientId,
        type: 'proposal',
        title: `Revised Proposal Sent: +$${cost} | +${days} Days`,
        message: `${currentUser.name} has prepared a ScopeGuard-backed proposal for your new requirements. Please review & sign Version 2.0.`,
        linkTab: 'agreements',
        linkProjectId: proj.id,
        linkRequestId: targetReq.id,
      });
    }
  };

  // Client Accepts Proposal -> creates Agreement Version 2!
  const acceptRevisedProposal = (requestId: string) => {
    const req = changeRequests.find((r) => r.id === requestId) || changeRequests[0];
    const projectId = req ? req.projectId : selectedProjectId;
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;

    const addCost = req?.customAdditionalCost || (req?.analysis?.totalAdditionalCost ?? 150);
    const addDays = req?.customAdditionalDays || (req?.analysis?.totalAdditionalDays ?? 7);

    const oldBudget = proj.budget;
    const newBudget = oldBudget + addCost;
    const oldDays = proj.timelineDays;
    const newDays = oldDays + addDays;

    // 1. Mark change request as accepted
    setChangeRequests((prev) =>
      prev.map((r) =>
        r.id === (req ? req.id : r.id)
          ? { ...r, status: 'accepted', clientReviewedAt: new Date().toISOString() }
          : r
      )
    );

    // 2. Mark existing Version 1 agreement as superseded
    setAgreements((prev) =>
      prev.map((a) =>
        a.projectId === projectId && a.version === 1 ? { ...a, status: 'superseded' } : a
      )
    );

    // 3. Create Version 2 Agreement
    const updatedDeliverables = [
      ...proj.deliverables,
      '3 Additional customized pages (Total 8 responsive pages)',
      'Admin Dashboard with user & content management',
      'Secure Payment Gateway Integration with webhook notifications',
    ];

    const v2Content = `MASTER FREELANCE SERVICES AGREEMENT – VERSION 2.0 (REVISED ADDENDUM)
-----------------------------------------------------------------------------
FREELANCER: Alex Rivera (Senior Web Developer)
CLIENT: Marcus Vance (NexaTech Solutions)
AMENDMENT EFFECTIVE DATE: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
SUPERSEDES: Version 1.0 (Signed Nov 1, 2026)

1. REVISED SCOPE OF WORK & EXPANDED DELIVERABLES
In addition to the original 5 pages, contact form, and responsive design, this Version 2.0 explicitly incorporates the following additions validated via ScopeGuard™ AI:
   1.1 Three (3) Additional Custom Pages (Expanding total footprint to 8 pages)
   1.2 Dedicated Admin Dashboard with role-based view and management controls
   1.3 Production-grade Payment Gateway Integration with checkout workflows and validation

2. REVISED BUDGET & TIMELINE ADJUSTMENT
Original Baseline Budget: $${oldBudget} USD
Agreed Scope Expansion Fee: +$${addCost} USD
REVISED TOTAL CONTRACT VALUE: $${newBudget} USD

Original Project Timeline: ${oldDays} business days
Added Implementation Window: +${addDays} business days
REVISED TOTAL PROJECT DURATION: ${newDays} business days

3. UPDATED MILESTONE SCHEDULE
- Milestone 1: Wireframing & Initial Pages ($80, Released)
- Milestone 2: 5 Responsive Pages & Contact Form ($120, Escrow Funded)
- Milestone 3: Admin Dashboard & Payment Gateway Integration ($${addCost}, Scheduled Escrow)

4. DISPUTE PREVENTION & AUDIT RECORD
Both parties have agreed to these terms transparently via TrustBridge ScopeGuard AI.`;

    const v2Agreement: Agreement = {
      id: `agr-${projectId}-v2`,
      projectId,
      version: 2,
      title: `Services Agreement v2.0 – Corporate Website (Revised Scope)`,
      content: v2Content,
      deliverables: updatedDeliverables,
      budget: newBudget,
      timelineDays: newDays,
      status: 'accepted',
      createdAt: new Date().toISOString(),
      signedAt: new Date().toISOString(),
      revisionLimit: 3,
      notes: `Upgraded from v1.0. Scope expanded with +$${addCost} and +${addDays} days.`,
    };

    setAgreements((prev) => [v2Agreement, ...prev]);

    // 4. Update Project with Version 2, updated budget, and add new milestone
    const newMilestone: ProjectMilestone = {
      id: `ms-${projectId}-3`,
      projectId,
      title: 'Milestone 3: Admin Dashboard & Payment Gateway Integration',
      description: 'Role-based admin view, transaction state management, and payment checkout testing.',
      amount: addCost,
      dueDate: new Date(Date.now() + newDays * 86400000).toISOString().split('T')[0],
      status: 'escrow_funded',
      simulatedTxId: `TX-SIM-${Math.floor(100000 + Math.random() * 900000)}-TB`,
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              budget: newBudget,
              timelineDays: newDays,
              currentVersion: 2,
              status: 'active',
              deliverables: updatedDeliverables,
              milestones: [...p.milestones, newMilestone],
            }
          : p
      )
    );

    // 5. Fire celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#38bdf8', '#10b981', '#6366f1'],
      });
    } catch {
      // safe fallback
    }

    // 6. Notify freelancer and client
    addNotification({
      recipientId: proj.freelancerId,
      type: 'proposal',
      title: '🎉 Proposal Accepted! Version 2.0 Activated',
      message: `${currentUser.name} accepted your revised proposal ($${newBudget}, ${newDays} days). Version 2 agreement is officially live!`,
      linkTab: 'version-history',
      linkProjectId: projectId,
    });

    addNotification({
      recipientId: currentUser.id,
      type: 'agreement',
      title: 'Agreement Version 2.0 Confirmed',
      message: `You successfully accepted the scope expansion proposal for ${proj.title}.`,
      linkTab: 'version-history',
      linkProjectId: projectId,
    });
  };

  // Client Rejects Proposal
  const rejectRevisedProposal = (requestId: string, reason?: string) => {
    const req = changeRequests.find((r) => r.id === requestId);
    if (!req) return;

    setChangeRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'rejected',
              clientReviewedAt: new Date().toISOString(),
              clientRejectionReason: reason || 'Client decided not to proceed with additional features at this time.',
            }
          : r
      )
    );

    const proj = projects.find((p) => p.id === req.projectId);
    if (proj) {
      updateProject(proj.id, { status: 'active' }); // restores active state with Version 1 preserved

      addNotification({
        recipientId: proj.freelancerId,
        type: 'proposal',
        title: 'Proposal Declined – Original Scope Maintained',
        message: `${currentUser.name} opted to proceed with original Version 1.0 specifications only. Original budget and timeline are intact.`,
        linkTab: 'agreements',
        linkProjectId: proj.id,
      });
    }
  };

  // Milestone updates
  const updateMilestoneStatus = (projectId: string, milestoneId: string, status: ProjectMilestone['status']) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          milestones: p.milestones.map((m) =>
            m.id === milestoneId
              ? {
                  ...m,
                  status,
                  releaseDate: status === 'released' ? new Date().toISOString().split('T')[0] : m.releaseDate,
                }
              : m
          ),
        };
      })
    );

    const targetProj = projects.find((p) => p.id === projectId);
    const targetMs = targetProj?.milestones.find((m) => m.id === milestoneId);

    if (status === 'released') {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}

      addNotification({
        recipientId: targetProj?.freelancerId || 'freelancer-a',
        type: 'milestone',
        title: `Milestone Payment Released ($${targetMs?.amount || 0})`,
        message: `Milestone "${targetMs?.title}" has been authorized and simulated payout recorded.`,
        linkTab: 'milestones',
        linkProjectId: projectId,
      });
    }
  };

  const addProjectMilestone = (
    projectId: string,
    milestoneData: Omit<ProjectMilestone, 'id' | 'projectId' | 'simulatedTxId'>
  ) => {
    const newMs: ProjectMilestone = {
      ...milestoneData,
      id: `ms-${projectId}-${Date.now()}`,
      projectId,
      simulatedTxId: `TX-SIM-${Math.floor(100000 + Math.random() * 900000)}-TB`,
    };

    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, milestones: [...p.milestones, newMs] } : p))
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Reset Demo Data
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.AGREEMENTS);
    localStorage.removeItem(STORAGE_KEYS.CHANGE_REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.WALKTHROUGH_STEP);

    setProjects(INITIAL_PROJECTS);
    setAgreements(INITIAL_AGREEMENTS);
    setChangeRequests(INITIAL_CHANGE_REQUESTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(DEMO_USERS[0]);
    setWalkthroughStep(0);
    setActiveTab('dashboard');
    setSelectedProjectId('proj-1');
  };

  // 19-Step Demo Walkthrough Automator
  const executeWalkthroughAction = async (step: number) => {
    setWalkthroughStep(step);
    switch (step) {
      case 0:
      case 1:
        // Login as Freelancer A
        switchUserById('freelancer-a');
        setActiveTab('dashboard');
        break;
      case 2:
      case 3:
      case 4:
        // Create / view website project ($200, 15 days)
        switchUserById('freelancer-a');
        setSelectedProjectId('proj-1');
        setActiveTab('projects');
        break;
      case 5:
        // Generate and view original agreement
        switchUserById('freelancer-a');
        setSelectedProjectId('proj-1');
        setActiveTab('agreements');
        break;
      case 6:
      case 7:
        // Switch to Client A and submit new requirements
        switchUserById('client-a');
        setSelectedProjectId('proj-1');
        setActiveTab('submit-scope');
        break;
      case 8:
      case 9:
      case 10:
        // Switch back to Freelancer A & Open ScopeGuard AI
        switchUserById('freelancer-a');
        setSelectedProjectId('proj-1');
        setActiveTab('scopeguard');
        break;
      case 11:
      case 12:
      case 13:
      case 14:
        // Show Gemini analysis, review cost, send proposal
        switchUserById('freelancer-a');
        setActiveTab('scopeguard');
        break;
      case 15:
        // Switch to Client A to review proposal
        switchUserById('client-a');
        setSelectedProjectId('proj-1');
        setActiveTab('proposals');
        break;
      case 16:
      case 17:
        // Client accepts proposal -> creates Version 2!
        switchUserById('client-a');
        acceptRevisedProposal('req-1');
        setActiveTab('version-history');
        break;
      case 18:
      case 19:
        // View Version 1 vs Version 2 side by side
        setActiveTab('version-history');
        break;
      default:
        break;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUserById,
        users,
        projects,
        agreements,
        changeRequests,
        notifications,
        activeTab,
        setActiveTab,
        selectedProjectId,
        setSelectedProjectId,
        createProject,
        updateProject,
        createAgreementDraft,
        sendAgreementToClient,
        submitChangeRequestByClient,
        runScopeGuardAnalysis,
        sendRevisedProposal,
        acceptRevisedProposal,
        rejectRevisedProposal,
        updateMilestoneStatus,
        addProjectMilestone,
        markNotificationRead,
        clearAllNotifications,
        resetDemoData,
        walkthroughStep,
        setWalkthroughStep,
        isWalkthroughOpen,
        setIsWalkthroughOpen,
        executeWalkthroughAction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
