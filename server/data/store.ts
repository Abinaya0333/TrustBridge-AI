import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';

export interface ProfileRecord {
  id: string;
  full_name: string;
  email: string;
  role: 'freelancer' | 'client' | 'admin';
  profile_image?: string;
  company?: string;
  title?: string;
  simulated_balance: number;
  created_at: string;
}

export interface ProjectRecord {
  id: string;
  client_id: string;
  freelancer_id: string;
  title: string;
  description: string;
  project_budget: number;
  status: 'draft' | 'active' | 'scope_alert' | 'review' | 'completed' | 'cancelled';
  current_version: number;
  deliverables: string[];
  timeline_days: number;
  start_date: string;
  deadline: string;
  created_at: string;
}

export interface AgreementRecord {
  id: string;
  project_id: string;
  client_id: string;
  freelancer_id: string;
  version: number;
  title: string;
  agreement_terms: string;
  deliverables: string[];
  total_amount: number;
  timeline_days: number;
  revision_limit: number;
  status: 'draft' | 'sent_to_client' | 'accepted' | 'rejected' | 'superseded';
  accepted_at?: string;
  created_at: string;
  notes?: string;
}

export interface MilestoneRecord {
  id: string;
  project_id: string;
  agreement_id?: string;
  title: string;
  description: string;
  amount: number;
  deadline: string;
  status: 'pending' | 'escrow_funded' | 'in_review' | 'released' | 'disputed';
  deliverable_notes?: string;
  submitted_at?: string;
  approved_at?: string;
  created_at: string;
}

export type EscrowState =
  | 'CREATED'
  | 'PENDING'
  | 'AUTHORIZED'
  | 'LOCKED'
  | 'RELEASE_REQUESTED'
  | 'RELEASED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'DISPUTED';

export interface EscrowTransactionRecord {
  id: string;
  project_id: string;
  milestone_id: string;
  client_id: string;
  freelancer_id: string;
  amount: number;
  currency: string;
  transaction_reference: string;
  status: EscrowState;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface MessageRecord {
  id: string;
  project_id?: string;
  sender_id?: string;
  recipient_id?: string;
  sender_identifier: string;
  recipient_identifier?: string;
  platform: 'whatsapp' | 'instagram' | 'meta';
  external_message_id: string;
  message_content: string;
  message_timestamp: string;
  processing_status: 'received' | 'processed' | 'failed' | 'ignored';
  created_at: string;
  raw_payload?: any;
}

export interface SocialConnectionRecord {
  id: string;
  user_id: string;
  platform: 'whatsapp' | 'instagram' | 'meta';
  platform_account_id: string;
  account_name: string;
  connection_status: 'connected' | 'disconnected' | 'expired' | 'error';
  token_expiry?: string;
  created_at: string;
}

export interface AIInsightRecord {
  id: string;
  project_id?: string;
  message_id?: string;
  insight_type: string;
  extracted_data: {
    project_name?: string;
    client_reference?: string;
    freelancer_reference?: string;
    agreed_amount?: number;
    currency?: string;
    deliverables?: string[];
    milestones?: Array<{ title: string; amount: number; deadline?: string }>;
    deadline?: string;
    scope_changes?: string[];
    confidence_score?: number;
    requires_user_confirmation?: boolean;
    raw_summary?: string;
  };
  confidence_score: number;
  review_status: 'pending_review' | 'confirmed' | 'rejected';
  created_at: string;
}

export interface NotificationRecord {
  id: string;
  user_id: string;
  title: string;
  description: string;
  notification_type: string;
  is_read: boolean;
  link_tab?: string;
  link_resource_id?: string;
  created_at: string;
}

// Initial In-Memory Seed State
class DatabaseStore {
  profiles: ProfileRecord[] = [
    {
      id: 'freelancer-a',
      full_name: 'Alex Rivera',
      email: 'alex.rivera@trustbridge.demo',
      role: 'freelancer',
      profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: 'Senior Web Developer',
      simulated_balance: 80.0,
      created_at: '2026-11-01T00:00:00Z',
    },
    {
      id: 'freelancer-b',
      full_name: 'Elena Rostova',
      email: 'elena.rostova@trustbridge.demo',
      role: 'freelancer',
      profile_image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      title: 'Lead UI/UX Designer',
      simulated_balance: 500.0,
      created_at: '2026-11-01T00:00:00Z',
    },
    {
      id: 'client-a',
      full_name: 'Marcus Vance',
      email: 'marcus.vance@nexatech.demo',
      role: 'client',
      profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      company: 'NexaTech Solutions',
      title: 'CEO & Founder',
      simulated_balance: 5000.0,
      created_at: '2026-11-01T00:00:00Z',
    },
    {
      id: 'client-b',
      full_name: 'Sarah Jenkins',
      email: 'sarah.j@apexcommerce.demo',
      role: 'client',
      profile_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      company: 'Apex Commerce',
      title: 'Head of Growth',
      simulated_balance: 7500.0,
      created_at: '2026-11-01T00:00:00Z',
    },
    {
      id: 'admin-1',
      full_name: 'TrustBridge Admin',
      email: 'admin@trustbridge.ai',
      role: 'admin',
      profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      company: 'TrustBridge Global',
      title: 'Platform Compliance Officer',
      simulated_balance: 0.0,
      created_at: '2026-11-01T00:00:00Z',
    },
  ];

  projects: ProjectRecord[] = [
    {
      id: 'proj-1',
      client_id: 'client-a',
      freelancer_id: 'freelancer-a',
      title: 'Corporate Website & Lead Capture Portal',
      description: 'Modern, high-converting corporate website with responsive layouts and lead generation contact forms.',
      project_budget: 200,
      status: 'active',
      current_version: 1,
      deliverables: [
        'Website with 5 standard pages (Home, About, Services, Case Studies, Contact)',
        'Lead capture contact form with automated email dispatch',
        'Mobile-first responsive design for iOS and Android displays',
      ],
      timeline_days: 15,
      start_date: '2026-11-01',
      deadline: '2026-11-16',
      created_at: '2026-11-01T09:00:00Z',
    },
    {
      id: 'proj-2',
      client_id: 'client-b',
      freelancer_id: 'freelancer-b',
      title: 'E-Commerce Mobile Brand Kit & UI System',
      description: 'Design system, Figma component library, and high-fidelity mobile prototype for an online retail app.',
      project_budget: 1200,
      status: 'active',
      current_version: 1,
      deliverables: [
        'Comprehensive design system with typography and color tokens',
        '12 high-fidelity mobile screen flows in Figma',
        'Clickable prototype for user checkout testing',
      ],
      timeline_days: 20,
      start_date: '2026-10-25',
      deadline: '2026-11-14',
      created_at: '2026-10-25T09:00:00Z',
    },
  ];

  agreements: AgreementRecord[] = [
    {
      id: 'agr-1-v1',
      project_id: 'proj-1',
      client_id: 'client-a',
      freelancer_id: 'freelancer-a',
      version: 1,
      title: 'Services Agreement v1.0 – Corporate Website',
      agreement_terms: `MASTER FREELANCE SERVICES AGREEMENT – VERSION 1.0\n-----------------------------------------------------------------------------\nFREELANCER: Alex Rivera\nCLIENT: Marcus Vance (NexaTech Solutions)\nEFFECTIVE DATE: November 1, 2026\n\n1. SCOPE OF SERVICES & DELIVERABLES\nProvider agrees to deliver 5 standard pages, contact form, and responsive design.\n\n2. BUDGET & FINANCIAL TERMS\nTotal Fixed Fee: $200 USD\nPayment Method: TrustBridge Simulated Milestone Escrow\n\n3. SCOPEGUARD CLAUSE\nAny new requirements (admin dashboards, payment gateways, extra pages) must be evaluated via ScopeGuard AI and formalized in an addendum before implementation.`,
      deliverables: [
        'Website with 5 pages',
        'Contact form',
        'Responsive design',
      ],
      total_amount: 200,
      timeline_days: 15,
      revision_limit: 2,
      status: 'accepted',
      accepted_at: '2026-11-01T11:30:00Z',
      created_at: '2026-11-01T09:00:00Z',
      notes: 'Initial accepted contract with milestone breakdown.',
    },
  ];

  milestones: MilestoneRecord[] = [
    {
      id: 'ms-1-1',
      project_id: 'proj-1',
      agreement_id: 'agr-1-v1',
      title: 'Milestone 1: Wireframing & Page Structure',
      description: 'Design mockups and static HTML/Tailwind wireframes for 5 pages.',
      amount: 80,
      deadline: '2026-11-06',
      status: 'released',
      submitted_at: '2026-11-03T16:00:00Z',
      approved_at: '2026-11-04T10:00:00Z',
      created_at: '2026-11-01T09:00:00Z',
    },
    {
      id: 'ms-1-2',
      project_id: 'proj-1',
      agreement_id: 'agr-1-v1',
      title: 'Milestone 2: Final 5 Responsive Pages & Contact Form',
      description: 'Complete coding, testing, mobile responsiveness, and contact form setup.',
      amount: 120,
      deadline: '2026-11-16',
      status: 'escrow_funded',
      created_at: '2026-11-01T09:00:00Z',
    },
  ];

  escrow_transactions: EscrowTransactionRecord[] = [
    {
      id: 'tx-101',
      project_id: 'proj-1',
      milestone_id: 'ms-1-1',
      client_id: 'client-a',
      freelancer_id: 'freelancer-a',
      amount: 80,
      currency: 'USD',
      transaction_reference: 'TX-SIM-849102-TB',
      status: 'RELEASED',
      payment_method: 'SANDBOX_ESCROW',
      created_at: '2026-11-01T10:00:00Z',
      updated_at: '2026-11-04T10:00:00Z',
    },
    {
      id: 'tx-102',
      project_id: 'proj-1',
      milestone_id: 'ms-1-2',
      client_id: 'client-a',
      freelancer_id: 'freelancer-a',
      amount: 120,
      currency: 'USD',
      transaction_reference: 'TX-SIM-920144-TB',
      status: 'LOCKED',
      payment_method: 'SANDBOX_ESCROW',
      created_at: '2026-11-01T10:30:00Z',
      updated_at: '2026-11-01T10:30:00Z',
    },
  ];

  messages: MessageRecord[] = [
    {
      id: 'msg-1',
      project_id: 'proj-1',
      sender_id: 'client-a',
      recipient_id: 'freelancer-a',
      sender_identifier: '+14155552671',
      recipient_identifier: '+14155558899',
      platform: 'whatsapp',
      external_message_id: 'wamid.HBgLMTEwMTU1NTI2NzEVAgARGBI1R',
      message_content: 'Hi Alex! We loved the initial wireframes. Could we also add 3 extra pages, an admin dashboard, and payment gateway? Let us know if $150 extra works.',
      message_timestamp: '2026-11-04T14:30:00Z',
      processing_status: 'processed',
      created_at: '2026-11-04T14:30:00Z',
    },
    {
      id: 'msg-2',
      project_id: 'proj-1',
      sender_id: 'client-a',
      recipient_id: 'freelancer-a',
      sender_identifier: 'marcus_nexatech',
      recipient_identifier: 'alex_webdev',
      platform: 'instagram',
      external_message_id: 'ig_mid_88991244_tb',
      message_content: 'Checking in on the milestone 2 timeline. When ready, please submit the deliverable and we will authorize the release!',
      message_timestamp: '2026-11-04T16:00:00Z',
      processing_status: 'processed',
      created_at: '2026-11-04T16:00:00Z',
    },
  ];

  social_connections: SocialConnectionRecord[] = [
    {
      id: 'soc-1',
      user_id: 'freelancer-a',
      platform: 'whatsapp',
      platform_account_id: '109823487123982',
      account_name: 'Alex Rivera WebDev (WhatsApp Business)',
      connection_status: 'connected',
      created_at: '2026-11-01T00:00:00Z',
    },
    {
      id: 'soc-2',
      user_id: 'freelancer-a',
      platform: 'instagram',
      platform_account_id: '178414002349182',
      account_name: '@alex_webdev (Instagram Professional)',
      connection_status: 'connected',
      created_at: '2026-11-01T00:00:00Z',
    },
  ];

  ai_insights: AIInsightRecord[] = [
    {
      id: 'ins-1',
      project_id: 'proj-1',
      message_id: 'msg-1',
      insight_type: 'scope_expansion_detection',
      extracted_data: {
        project_name: 'Corporate Website & Lead Capture Portal',
        client_reference: 'Marcus Vance',
        freelancer_reference: 'Alex Rivera',
        agreed_amount: 150,
        currency: 'USD',
        deliverables: [
          '3 additional custom pages',
          'Role-based admin dashboard',
          'Secure payment gateway integration',
        ],
        milestones: [
          { title: 'Admin Dashboard & Payment Integration', amount: 150, deadline: '2026-11-23' },
        ],
        deadline: '2026-11-23',
        scope_changes: [
          'Pages increased from 5 to 8',
          'Admin portal added',
          'Checkout workflow integration added',
        ],
        confidence_score: 0.94,
        requires_user_confirmation: true,
        raw_summary: 'Client proposed adding 3 extra pages, an admin dashboard, and payment gateway with a proposed addition of $150.',
      },
      confidence_score: 0.94,
      review_status: 'confirmed',
      created_at: '2026-11-04T14:31:00Z',
    },
  ];

  notifications: NotificationRecord[] = [
    {
      id: 'notif-1',
      user_id: 'freelancer-a',
      title: 'Milestone 1 Payment Released ($80)',
      description: 'Client Marcus Vance approved Milestone 1. Funds credited to your simulated balance.',
      notification_type: 'milestone',
      is_read: false,
      link_tab: 'milestones',
      link_resource_id: 'proj-1',
      created_at: '2026-11-04T10:00:00Z',
    },
    {
      id: 'notif-2',
      user_id: 'freelancer-a',
      title: 'New WhatsApp Message Received',
      description: 'Marcus Vance sent new scope requirements via WhatsApp. Gemini analyzed the request.',
      notification_type: 'message',
      is_read: false,
      link_tab: 'scopeguard',
      link_resource_id: 'proj-1',
      created_at: '2026-11-04T14:31:00Z',
    },
    {
      id: 'notif-3',
      user_id: 'client-a',
      title: 'Milestone 2 Escrow Secured ($120)',
      description: 'Funds are locked in escrow for Milestone 2.',
      notification_type: 'escrow',
      is_read: true,
      link_tab: 'milestones',
      link_resource_id: 'proj-1',
      created_at: '2026-11-01T10:30:00Z',
    },
  ];
}

export const dbStore = new DatabaseStore();
