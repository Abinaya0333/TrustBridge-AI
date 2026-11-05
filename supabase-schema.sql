-- ============================================================================
-- TRUSTBRIDGE AI – SUPABASE POSTGRESQL SCHEMA & RLS POLICIES
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('freelancer', 'client', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('draft', 'active', 'scope_alert', 'review', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE agreement_status AS ENUM ('draft', 'sent_to_client', 'accepted', 'rejected', 'superseded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE milestone_status AS ENUM ('pending', 'escrow_funded', 'in_review', 'released', 'disputed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE escrow_status AS ENUM (
        'CREATED',
        'PENDING',
        'AUTHORIZED',
        'LOCKED',
        'RELEASE_REQUESTED',
        'RELEASED',
        'CANCELLED',
        'REFUNDED',
        'DISPUTED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE social_platform AS ENUM ('whatsapp', 'instagram', 'meta');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE connection_status AS ENUM ('connected', 'disconnected', 'expired', 'error');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLES DEFINITION

-- Table 1: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'client',
    profile_image TEXT,
    company TEXT,
    title TEXT,
    simulated_balance NUMERIC(12, 2) DEFAULT 0.00 CHECK (simulated_balance >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    freelancer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    description TEXT,
    project_budget NUMERIC(12, 2) NOT NULL CHECK (project_budget >= 0),
    status project_status NOT NULL DEFAULT 'active',
    current_version INT NOT NULL DEFAULT 1,
    start_date DATE DEFAULT CURRENT_DATE,
    deadline DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 3: agreements
CREATE TABLE IF NOT EXISTS public.agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    freelancer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    version INT NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    agreement_terms TEXT NOT NULL,
    deliverables JSONB DEFAULT '[]'::jsonb,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    timeline_days INT DEFAULT 15,
    revision_limit INT DEFAULT 2,
    status agreement_status NOT NULL DEFAULT 'draft',
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (project_id, version)
);

-- Table 4: milestones
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    agreement_id UUID REFERENCES public.agreements(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    deadline DATE,
    status milestone_status NOT NULL DEFAULT 'pending',
    deliverable_notes TEXT,
    submitted_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 5: escrow_transactions
CREATE TABLE IF NOT EXISTS public.escrow_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE RESTRICT,
    milestone_id UUID REFERENCES public.milestones(id) ON DELETE RESTRICT,
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    freelancer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    transaction_reference VARCHAR(64) UNIQUE NOT NULL,
    status escrow_status NOT NULL DEFAULT 'CREATED',
    payment_method VARCHAR(50) DEFAULT 'SANDBOX_ESCROW',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 6: messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sender_identifier TEXT, -- External phone or Instagram handle
    recipient_identifier TEXT,
    platform social_platform NOT NULL DEFAULT 'whatsapp',
    external_message_id TEXT UNIQUE,
    message_content TEXT NOT NULL,
    message_timestamp TIMESTAMPTZ DEFAULT NOW(),
    processing_status VARCHAR(30) DEFAULT 'received',
    raw_payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 7: social_connections
CREATE TABLE IF NOT EXISTS public.social_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    platform social_platform NOT NULL,
    platform_account_id TEXT NOT NULL,
    account_name TEXT,
    connection_status connection_status NOT NULL DEFAULT 'connected',
    access_token TEXT,
    token_expiry TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, platform, platform_account_id)
);

-- Table 8: ai_insights
CREATE TABLE IF NOT EXISTS public.ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    insight_type VARCHAR(50) NOT NULL DEFAULT 'scope_extraction',
    extracted_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    confidence_score NUMERIC(3, 2) CHECK (confidence_score >= 0 AND confidence_score <= 1.0),
    review_status VARCHAR(30) DEFAULT 'pending_review',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 9: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL DEFAULT 'system',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link_tab VARCHAR(50),
    link_resource_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_freelancer_id ON public.projects(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_agreements_project_id ON public.agreements(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON public.milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_escrow_project_id ON public.escrow_transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_escrow_milestone_id ON public.escrow_transactions(milestone_id);
CREATE INDEX IF NOT EXISTS idx_escrow_ref ON public.escrow_transactions(transaction_reference);
CREATE INDEX IF NOT EXISTS idx_messages_external_id ON public.messages(external_message_id);
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON public.messages(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_project_id ON public.ai_insights(project_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- 5. ATOMIC ESCROW SETTLEMENT FUNCTION (PostgreSQL)
CREATE OR REPLACE FUNCTION release_escrow_funds(
    p_transaction_id UUID,
    p_client_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_tx RECORD;
    v_milestone RECORD;
BEGIN
    -- 1. Lock transaction row
    SELECT * INTO v_tx 
    FROM public.escrow_transactions 
    WHERE id = p_transaction_id FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Transaction not found');
    END IF;

    -- 2. Authorization check: Only project client can release
    IF v_tx.client_id <> p_client_id THEN
        RETURN jsonb_build_object('success', false, 'error', 'Unauthorized client');
    END IF;

    -- 3. State transition check: Can only release from LOCKED or RELEASE_REQUESTED
    IF v_tx.status NOT IN ('LOCKED', 'RELEASE_REQUESTED') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Payment cannot be released from current state: ' || v_tx.status);
    END IF;

    -- 4. Update transaction status
    UPDATE public.escrow_transactions
    SET status = 'RELEASED', updated_at = NOW()
    WHERE id = p_transaction_id;

    -- 5. Update milestone status
    IF v_tx.milestone_id IS NOT NULL THEN
        UPDATE public.milestones
        SET status = 'released', approved_at = NOW(), updated_at = NOW()
        WHERE id = v_tx.milestone_id;
    END IF;

    -- 6. Credit freelancer simulated balance atomically
    UPDATE public.profiles
    SET simulated_balance = simulated_balance + v_tx.amount, updated_at = NOW()
    WHERE id = v_tx.freelancer_id;

    RETURN jsonb_build_object(
        'success', true, 
        'transaction_id', v_tx.id,
        'released_amount', v_tx.amount,
        'freelancer_id', v_tx.freelancer_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read profiles, can only update own profile
CREATE POLICY "Public profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects: Only client or freelancer on the project (or admin) can access
CREATE POLICY "Users can view projects they are part of" 
ON public.projects FOR SELECT 
USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

CREATE POLICY "Clients can create projects" 
ON public.projects FOR INSERT 
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Members can update their projects" 
ON public.projects FOR UPDATE 
USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

-- Agreements: Only project members
CREATE POLICY "Members can view agreements" 
ON public.agreements FOR SELECT 
USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

CREATE POLICY "Members can create or update agreements" 
ON public.agreements FOR ALL 
USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

-- Milestones: Only project members
CREATE POLICY "Members can view milestones" 
ON public.milestones FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = milestones.project_id 
    AND (p.client_id = auth.uid() OR p.freelancer_id = auth.uid())
));

-- Escrow transactions: Viewable by client and freelancer
CREATE POLICY "Members can view their escrow transactions" 
ON public.escrow_transactions FOR SELECT 
USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

-- Messages: Sender or recipient
CREATE POLICY "Users can view messages they sent or received" 
ON public.messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Notifications: Only owner
CREATE POLICY "Users can view own notifications" 
ON public.notifications FOR ALL 
USING (auth.uid() = user_id);
