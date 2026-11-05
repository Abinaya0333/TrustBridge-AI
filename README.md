# TrustBridge AI – Full-Stack Implementation Guide

TrustBridge AI is an AI-powered project and agreement management platform for high-trust freelancer-client collaborations. It provides automated scope creep detection (ScopeGuard AI), versioned agreement trails, backend-controlled escrow simulation, official Meta WhatsApp and Instagram message ingestion, and Gemini AI contract intelligence.

---

## 1. Architecture Overview

### Frontend
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: AppContext with live backend REST synchronization & offline sandbox store
- **Icons & Visuals**: Lucide Icons, Canvas Confetti, Recharts

### Backend
- **Server**: Node.js + Express.js (`server.ts`, `server/`)
- **API Contracts**: RESTful JSON endpoints (`/api/auth`, `/api/projects`, `/api/agreements`, `/api/milestones`, `/api/payments`, `/api/messages`, `/api/integrations`, `/api/ai`)
- **Middleware**: Bearer JWT authentication, Role-Based Access Control (`requireRole`), Meta webhook signature verification (`HMAC-SHA256`)

### Database & Security
- **Database**: Supabase PostgreSQL with 9 core relational tables
- **Row Level Security (RLS)**: Enforced on all sensitive tables (`supabase-schema.sql`)
- **Authentication**: Supabase Auth (email/password, session tokens) + demo persona switching

### AI Engine
- **Model**: Google Gemini 3.8 Flash via `@google/genai` (server-side only, `User-Agent: aistudio-build`)
- **Capabilities**: Conversational scope extraction, agreement parameter parsing, and ScopeGuard disparity analysis

### Social Ingestion
- **WhatsApp**: Official Meta WhatsApp Business Cloud API (`/api/integrations/whatsapp/webhook`)
- **Instagram**: Official Meta Instagram Messaging API (`/api/integrations/instagram/webhook`)
- **Testing**: Built-in interactive Webhook Testing Simulator with duplicate detection

### Escrow Sandbox Engine
- **States**: `CREATED` → `PENDING` → `AUTHORIZED` → `LOCKED` → `RELEASE_REQUESTED` → `RELEASED` (with `CANCELLED`, `REFUNDED`, `DISPUTED`)
- **Safety**: Cannot release before locked; freelancers cannot approve own work; clients cannot release funds for unauthorized projects; atomic balance updates.

---

## 2. Database Schema (Supabase PostgreSQL)

The file `supabase-schema.sql` contains the complete production schema:

1. `profiles`: `id (UUID)`, `full_name`, `email`, `role ('freelancer'|'client'|'admin')`, `profile_image`, `simulated_balance`, `created_at`
2. `projects`: `id (UUID)`, `client_id`, `freelancer_id`, `title`, `description`, `project_budget`, `status`, `current_version`, `start_date`, `deadline`
3. `agreements`: `id (UUID)`, `project_id`, `client_id`, `freelancer_id`, `version`, `title`, `agreement_terms`, `deliverables`, `total_amount`, `status`, `accepted_at`
4. `milestones`: `id (UUID)`, `project_id`, `agreement_id`, `title`, `description`, `amount`, `deadline`, `status`, `submitted_at`, `approved_at`
5. `escrow_transactions`: `id (UUID)`, `project_id`, `milestone_id`, `client_id`, `freelancer_id`, `amount`, `currency`, `transaction_reference`, `status`, `payment_method`
6. `messages`: `id (UUID)`, `project_id`, `sender_id`, `recipient_id`, `sender_identifier`, `platform ('whatsapp'|'instagram'|'meta')`, `external_message_id`, `message_content`, `processing_status`
7. `social_connections`: `id (UUID)`, `user_id`, `platform`, `platform_account_id`, `account_name`, `connection_status`
8. `ai_insights`: `id (UUID)`, `project_id`, `message_id`, `insight_type`, `extracted_data (JSONB)`, `confidence_score`, `review_status`
9. `notifications`: `id (UUID)`, `user_id`, `title`, `description`, `notification_type`, `is_read`

To deploy to Supabase:
1. Open your Supabase Project dashboard.
2. Navigate to **SQL Editor**.
3. Copy and run `supabase-schema.sql`.

---

## 3. Environment Variables Configuration

See `.env.example`:

```env
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key

# Meta Developer Platform
META_APP_ID=your-meta-app-id
META_APP_SECRET=your-meta-app-secret
META_WEBHOOK_VERIFY_TOKEN=trustbridge_meta_verify_token_2026

# WhatsApp Cloud API
WHATSAPP_PHONE_NUMBER_ID=your-whatsapp-phone-number-id
WHATSAPP_BUSINESS_ACCOUNT_ID=your-whatsapp-business-account-id
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token

# Instagram Messaging API
INSTAGRAM_ACCOUNT_ID=your-instagram-account-id
INSTAGRAM_ACCESS_TOKEN=your-instagram-access-token

# Escrow Mode
PAYMENT_MODE=sandbox
```

---

## 4. API Endpoints Reference

### Authentication
- `GET /api/auth/me`: Current authenticated user profile
- `POST /api/auth/login`: Email and password login
- `POST /api/auth/register`: Register new client or freelancer account
- `POST /api/auth/logout`: Sign out session
- `GET /api/auth/users`: List demo personas

### Projects
- `GET /api/projects`: List user's projects with milestones
- `POST /api/projects`: Create project baseline
- `GET /api/projects/:id`: Get project with milestones, agreements, and escrow transactions
- `PUT /api/projects/:id`: Update project details

### Agreements
- `GET /api/agreements`: List agreements (filter by `projectId`)
- `POST /api/agreements`: Create agreement draft or new version
- `GET /api/agreements/:id`: Agreement terms and metadata
- `PATCH /api/agreements/:id/status`: Update agreement status (`accepted`, `rejected`, `superseded`)

### Milestones
- `POST /api/milestones`: Create milestone
- `GET /api/milestones/:id`: Milestone details
- `PATCH /api/milestones/:id/submit`: Freelancer submits deliverable
- `PATCH /api/milestones/:id/approve`: Client approves deliverable and releases payment

### Escrow Sandbox Payments
- `POST /api/payments/initialize`: Initialize transaction (`CREATED`)
- `POST /api/payments/:id/lock`: Lock deposit in escrow (`LOCKED`)
- `POST /api/payments/:id/release`: Release locked funds to freelancer (`RELEASED`)
- `GET /api/payments/history`: Auditable transaction history
- `GET /api/payments/balance`: Current simulated balance
- `GET /api/payments/:id`: Receipt proof

### Social Integrations & Webhooks
- `GET /api/integrations/status`: Meta webhook configuration & connection status
- `GET /api/integrations/whatsapp/webhook`: Meta challenge verification
- `POST /api/integrations/whatsapp/webhook`: Official WhatsApp message receiver
- `GET /api/integrations/instagram/webhook`: Meta challenge verification
- `POST /api/integrations/instagram/webhook`: Official Instagram message receiver
- `POST /api/integrations/simulate-webhook`: Webhook test runner

### AI Intelligence
- `POST /api/ai/analyze-message`: Gemini 3.8 Flash conversational extraction
- `GET /api/ai/insights/:projectId`: Stored AI insights
- `POST /api/ai/convert-insight-to-agreement`: Convert extracted chat into Milestone / Agreement v2.0
- `POST /api/ai/analyze-scope`: ScopeGuard disparity analysis
