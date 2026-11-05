export type UserRole = 'freelancer' | 'client' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  company?: string;
  hourlyRate?: number;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'escrow_funded' | 'in_review' | 'released';
  simulatedTxId: string;
  releaseDate?: string;
}

export interface Project {
  id: string;
  title: string;
  freelancerId: string;
  clientId: string;
  description: string;
  deliverables: string[];
  budget: number;
  timelineDays: number;
  startDate: string;
  deadline: string;
  status: 'active' | 'review' | 'completed' | 'scope_alert';
  currentVersion: number;
  milestones: ProjectMilestone[];
}

export interface Agreement {
  id: string;
  projectId: string;
  version: number;
  title: string;
  content: string;
  deliverables: string[];
  budget: number;
  timelineDays: number;
  status: 'draft' | 'sent_to_client' | 'accepted' | 'rejected' | 'superseded';
  createdAt: string;
  signedAt?: string;
  revisionLimit: number;
  notes?: string;
}

export type ScopeChangeType = 'added' | 'modified' | 'removed' | 'clarified' | 'unchanged';

export interface ScopeItemAnalysis {
  changeType: ScopeChangeType;
  originalRequirement: string;
  newRequirement: string;
  explanation: string;
  estimatedEffort: string;
  estimatedCost: number;
  estimatedDays: number;
}

export interface ScopeGuardAnalysis {
  summary: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  items: ScopeItemAnalysis[];
  totalAdditionalCost: number;
  totalAdditionalDays: number;
  revisedBudget: number;
  revisedTimelineDays: number;
  recommendations: string[];
  isSampleFallback?: boolean;
  source?: string;
}

export interface ScopeChangeRequest {
  id: string;
  projectId: string;
  clientId: string;
  freelancerId: string;
  title: string;
  requestedText: string;
  submittedAt: string;
  status: 'submitted' | 'analyzed' | 'proposal_sent' | 'accepted' | 'rejected';
  analysis?: ScopeGuardAnalysis;
  customAdditionalCost?: number;
  customAdditionalDays?: number;
  freelancerProposalNotes?: string;
  proposalSentAt?: string;
  clientReviewedAt?: string;
  clientRejectionReason?: string;
}

export interface NotificationItem {
  id: string;
  recipientId: string; // user id or 'all'
  type: 'project' | 'agreement' | 'scope_request' | 'analysis' | 'proposal' | 'milestone' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTab?: string;
  linkProjectId?: string;
  linkRequestId?: string;
}
