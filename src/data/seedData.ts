import { User, Project, Agreement, ScopeChangeRequest, NotificationItem } from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'freelancer-a',
    name: 'Alex Rivera',
    email: 'alex.rivera@trustbridge.demo',
    role: 'freelancer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Web Developer',
    hourlyRate: 65,
  },
  {
    id: 'freelancer-b',
    name: 'Elena Rostova',
    email: 'elena.rostova@trustbridge.demo',
    role: 'freelancer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: 'Lead UI/UX Designer',
    hourlyRate: 75,
  },
  {
    id: 'client-a',
    name: 'Marcus Vance',
    email: 'marcus.vance@nexatech.demo',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'CEO & Founder',
    company: 'NexaTech Solutions',
  },
  {
    id: 'client-b',
    name: 'Sarah Jenkins',
    email: 'sarah.j@apexcommerce.demo',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Head of Growth',
    company: 'Apex Commerce',
  },
  {
    id: 'admin-1',
    name: 'TrustBridge Admin',
    email: 'admin@trustbridge.ai',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Platform Compliance Officer',
    company: 'TrustBridge Global',
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Corporate Website & Lead Capture Portal',
    freelancerId: 'freelancer-a',
    clientId: 'client-a',
    description: 'Modern, high-converting corporate website with responsive layouts and lead generation contact forms.',
    deliverables: [
      'Website with 5 standard pages (Home, About, Services, Case Studies, Contact)',
      'Lead capture contact form with automated email dispatch',
      'Mobile-first responsive design for iOS and Android displays',
    ],
    budget: 200,
    timelineDays: 15,
    startDate: '2026-11-01',
    deadline: '2026-11-16',
    status: 'active',
    currentVersion: 1,
    milestones: [
      {
        id: 'ms-1-1',
        projectId: 'proj-1',
        title: 'Milestone 1: Wireframing & Page Structure',
        description: 'Design mockups and static HTML/Tailwind wireframes for 5 pages.',
        amount: 80,
        dueDate: '2026-11-06',
        status: 'released',
        simulatedTxId: 'TX-SIM-849102-TB',
        releaseDate: '2026-11-04',
      },
      {
        id: 'ms-1-2',
        projectId: 'proj-1',
        title: 'Milestone 2: Final 5 Responsive Pages & Contact Form',
        description: 'Complete coding, testing, mobile responsiveness, and contact form setup.',
        amount: 120,
        dueDate: '2026-11-16',
        status: 'escrow_funded',
        simulatedTxId: 'TX-SIM-920144-TB',
      },
    ],
  },
  {
    id: 'proj-2',
    title: 'E-Commerce Mobile Brand Kit & UI System',
    freelancerId: 'freelancer-b',
    clientId: 'client-b',
    description: 'Design system, Figma component library, and high-fidelity mobile prototype for an online retail app.',
    deliverables: [
      'Comprehensive design system with typography and color tokens',
      '12 high-fidelity mobile screen flows in Figma',
      'Clickable prototype for user checkout testing',
    ],
    budget: 1200,
    timelineDays: 20,
    startDate: '2026-10-25',
    deadline: '2026-11-14',
    status: 'active',
    currentVersion: 1,
    milestones: [
      {
        id: 'ms-2-1',
        projectId: 'proj-2',
        title: 'Brand Tokens & Core Component Specs',
        description: 'Figma token library and baseline atomic components.',
        amount: 500,
        dueDate: '2026-11-03',
        status: 'released',
        simulatedTxId: 'TX-SIM-312988-TB',
        releaseDate: '2026-11-03',
      },
      {
        id: 'ms-2-2',
        projectId: 'proj-2',
        title: 'Mobile Screens & Interactive Prototype',
        description: '12 screen UI kit and interactive handoff assets.',
        amount: 700,
        dueDate: '2026-11-14',
        status: 'escrow_funded',
        simulatedTxId: 'TX-SIM-481920-TB',
      },
    ],
  },
];

export const INITIAL_AGREEMENTS: Agreement[] = [
  {
    id: 'agr-1-v1',
    projectId: 'proj-1',
    version: 1,
    title: 'Services Agreement v1.0 – Corporate Website',
    content: `MASTER FREELANCE SERVICES AGREEMENT – VERSION 1.0
-----------------------------------------------------------------------------
FREELANCER: Alex Rivera (Senior Web Developer)
CLIENT: Marcus Vance (NexaTech Solutions)
EFFECTIVE DATE: November 1, 2026

1. SCOPE OF SERVICES & DELIVERABLES
Provider agrees to deliver the following:
   1.1 Website with 5 pages (Home, About, Services, Case Studies, Contact)
   1.2 Working contact form with validation and email notifications
   1.3 Clean, responsive design optimized for mobile and desktop browsers

2. BUDGET & FINANCIAL TERMS
Total Fixed Fee: $200 USD
Timeline: 15 business days
Payment Method: TrustBridge Simulated Milestone Escrow

3. REVISION POLICY
Includes up to 2 rounds of standard visual and copy adjustments. Additional page templates or architectural modifications are not included.

4. SCOPEGUARD™ CLAUSE
Any subsequent features (including admin dashboards, payment integrations, or extra pages) must be evaluated via ScopeGuard AI and formalized in an addendum before implementation.`,
    deliverables: [
      'Website with 5 pages',
      'Contact form',
      'Responsive design',
    ],
    budget: 200,
    timelineDays: 15,
    status: 'accepted',
    createdAt: '2026-11-01T09:00:00Z',
    signedAt: '2026-11-01T11:30:00Z',
    revisionLimit: 2,
    notes: 'Signed and active. Initial milestone funded in simulated escrow.',
  },
];

export const INITIAL_CHANGE_REQUESTS: ScopeChangeRequest[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    recipientId: 'freelancer-a',
    type: 'milestone',
    title: 'Milestone 1 Released ($80)',
    message: 'Client Marcus Vance approved Milestone 1. Simulated funds released to your demo balance.',
    timestamp: '2 hours ago',
    read: false,
    linkTab: 'milestones',
    linkProjectId: 'proj-1',
  },
  {
    id: 'notif-2',
    recipientId: 'client-a',
    type: 'agreement',
    title: 'Agreement v1.0 Activated',
    message: 'Your project agreement with Alex Rivera is active with milestone protection.',
    timestamp: '3 days ago',
    read: true,
    linkTab: 'agreements',
    linkProjectId: 'proj-1',
  },
  {
    id: 'notif-3',
    recipientId: 'freelancer-a',
    type: 'info',
    title: 'TrustBridge ScopeGuard AI Ready',
    message: 'ScopeGuard AI is active. Run a scope scan anytime your client requests additional features.',
    timestamp: '1 day ago',
    read: false,
    linkTab: 'scopeguard',
    linkProjectId: 'proj-1',
  },
];
