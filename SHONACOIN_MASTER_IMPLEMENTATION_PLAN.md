# ShonaCoin Master Implementation Plan
**Version:** 2.0  
**Last Updated:** December 2024  
**Aligned with:** KnowledgeBase2 (#ContributionRules, #Adders, #ContributionProcedure, #UsabilityPrompt)

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Implementation Status](#implementation-status)
4. [Detailed Phase Breakdown](#detailed-phase-breakdown)
5. [Database Schema Specification](#database-schema-specification)
6. [API Integration Roadmap](#api-integration-roadmap)
7. [Security & Compliance](#security-compliance)
8. [Testing Strategy](#testing-strategy)
9. [Deployment & DevOps](#deployment-devops)
10. [Success Metrics & KPIs](#success-metrics-kpis)
11. [Timeline & Milestones](#timeline-milestones)
12. [Risk Management](#risk-management)

---

<a name="executive-summary"></a>
## 🎯 Executive Summary

### Vision
ShonaCoin is an AI-powered platform enabling individuals and teams to fulfill their Prime Timelines through flexible contribution flows spanning Financial, Intellectual, Marketing, and Asset categories.

### Current Status
- **Overall Progress:** 35% Complete (Phases 1-3 of 10)
- **MVP Timeline:** 3-4 weeks remaining
- **Full Launch:** 5-6 weeks remaining

### Key Deliverables
1. ✅ Complete contribution wizard (14 steps)
2. ✅ Database schema with RLS policies
3. ✅ Display and management system
4. 🚧 Negotiation system (In Progress)
5. ⏳ Payment processing (M-Pesa, cards, banks)
6. ⏳ Marketing channel integrations
7. ⏳ AI-powered matching and assistance
8. ⏳ Security audit and compliance
9. ⏳ Mobile optimization
10. ⏳ Production launch

---

<a name="architecture-overview"></a>
## 🏗️ Architecture Overview

### Technology Stack
```
Frontend:
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Shadcn/ui (component library)
- React Router (navigation)
- React Hook Form + Zod (validation)
- TanStack Query (data fetching)

Backend:
- Supabase (PostgreSQL database)
- Row-Level Security (RLS)
- Supabase Edge Functions (Deno runtime)
- Supabase Realtime (WebSockets)
- Supabase Storage (file uploads)

External Integrations:
- M-Pesa Daraja API (payments)
- Stripe/PayPal (card payments)
- Bank APIs (KCB, Equity, NCBA)
- Meta Graph API (Facebook/Instagram)
- Google Ads API
- TikTok Business API
- LinkedIn Ads API
- Twitter/X API
- YouTube Data API
- Lovable AI Gateway (AI features)
```

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      ShonaCoin Platform                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Portfolio   │  │  Assistant   │  │    Wallet    │      │
│  │  (Timeline)  │  │  (AI Chat)   │  │  (Payments)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Contribution Wizard (14 Steps)               │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ 1. Subscription → 2. Timeline → 3. Subtypes →       │   │
│  │ 4. Confirm → 5-13. Configure → 14. Publish          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Negotiation System                      │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ • Strict Mode (Accept/Reject)                        │   │
│  │ • Flexible Mode (Propose/Counter)                    │   │
│  │ • Comparison View (Side-by-side)                     │   │
│  │ • Real-time Chat & Messaging                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Payment Processing                      │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ • M-Pesa STK Push                                    │   │
│  │ • Card Payments (Stripe/PayPal)                      │   │
│  │ • Bank Transfers (KCB, Equity, NCBA)                 │   │
│  │ • Escrow & Distribution                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Marketing Integrations                     │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ • Social Media APIs (FB, TikTok, LinkedIn, X)        │   │
│  │ • Google Ads & YouTube                               │   │
│  │ • Outcome Tracking (Clicks, Conversions)             │   │
│  │ • ShonaCoin Native Posts                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
              │                    │                    │
              ▼                    ▼                    ▼
        ┌──────────┐         ┌──────────┐        ┌──────────┐
        │ Supabase │         │  Edge    │        │    AI    │
        │ Database │         │Functions │        │ Gateway  │
        └──────────┘         └──────────┘        └──────────┘
```

---

<a name="implementation-status"></a>
## 📊 Implementation Status

### Phase Completion Matrix

| Phase | Name | Status | Progress | Duration | Priority | Dependencies |
|-------|------|--------|----------|----------|----------|--------------|
| 1 | Foundation | ✅ Complete | 100% | 5 days | 🔴 CRITICAL | - |
| 2 | Wizard Steps 5-14 | ✅ Complete | 100% | 7 days | 🔴 CRITICAL | Phase 1 |
| 3 | Display & Management | ✅ Complete | 100% | 4 days | 🔴 CRITICAL | Phase 2 |
| 4 | Negotiation System | 🚧 In Progress | 0% | 4-5 days | 🔴 CRITICAL | Phase 3 |
| 5 | Payment Processing | 📋 Planned | 0% | 5-6 days | 🔴 CRITICAL | Phase 3 |
| 6 | Marketing Integrations | 📋 Planned | 0% | 6-7 days | 🟡 HIGH | Phase 5 |
| 7 | AI Assistant | 📋 Planned | 0% | 4-5 days | 🟢 MEDIUM | Phase 3 |
| 8 | Security & Compliance | 📋 Planned | 0% | 3-4 days | 🔴 CRITICAL | All |
| 9 | Mobile Optimization | 📋 Planned | 0% | 3-4 days | 🟡 HIGH | Phase 8 |
| 10 | Launch Preparation | 📋 Planned | 0% | 3-4 days | 🔴 CRITICAL | Phase 9 |

**Overall MVP Progress:** 35% (3 of 10 phases complete)  
**Estimated Days to MVP:** 23-31 days (3-4 weeks remaining)  
**Estimated Days to Full Launch:** 33-43 days (5-6 weeks remaining)

---

<a name="detailed-phase-breakdown"></a>
## 📝 Detailed Phase Breakdown

---

### ✅ Phase 1: Foundation (COMPLETED)

**Duration:** 5 days  
**Status:** 100% Complete  
**Alignment:** #ContributionRules, #ContributionTypesAndSubtypes

#### Deliverables
- ✅ Database schema (12 tables)
- ✅ TypeScript types (`src/types/contribution.ts`)
- ✅ Core hooks (`useContributionWizard`, `useContributionStatus`)
- ✅ Wizard UI structure (responsive)
- ✅ Enum types (7 enums)
- ✅ RLS policies on all tables

#### Database Tables Created
1. `timelines` - Root container
2. `contributions` - Main records
3. `contribution_subtypes` - Selected subtypes
4. `contribution_setup_steps` - Step tracking
5. `contribution_valuations` - Valuation data
6. `contribution_insights` - Insights config
7. `contribution_followups` - Follow-up records
8. `contribution_smart_rules` - Smart rules
9. `contribution_ratings` - Ratings
10. `contribution_files` - File attachments
11. `contribution_knots` - Linked timelines
12. `contribution_contributors` - Participants

#### Key Files
```
src/
├── types/contribution.ts
├── hooks/
│   ├── useContributionWizard.ts
│   └── useContributionStatus.ts
└── components/contributions/
    └── ContributionWizard.tsx
```

---

### ✅ Phase 2: Wizard Steps 5-14 (COMPLETED)

**Duration:** 7 days  
**Status:** 100% Complete  
**Alignment:** #AddContributionProcedure, #SharedContributionStepsSetup, #ReusableFeatures

#### All 14 Steps Implemented

**Steps 1-4 (Always Visible):**
- ✅ Step 1: Subscription Access Check
- ✅ Step 2: Timeline Toggle (Single vs Timeline)
- ✅ Step 3: Subtype Selection (To Give / To Receive)
- ✅ Step 4: Confirmation & Database Save

**Steps 5-13 (Conditional & Skippable):**
- ✅ Step 5: Expected Insights
- ✅ Step 6: Expected Valuation
- ✅ Step 7: Expected Follow-up
- ✅ Step 8: Smart Rules
- ✅ Step 9: Custom Ratings
- ✅ Step 10: Expected Files
- ✅ Step 11: Expected Knots
- ✅ Step 12: Expected Contributors
- ✅ Step 13: Users and Admins

**Step 14 (Final):**
- ✅ Step 14: Preview & Publish

#### Adders Created (All Reusable)
```
src/components/contributions/adders/
├── InsightsAdder.tsx        # Multi-type insight config
├── ValuationAdder.tsx        # Fixed/Formula/Percentage
├── FollowupAdder.tsx         # Status, dates, reminders
├── SmartRulesAdder.tsx       # If-then logic
├── RatingsAdder.tsx          # Custom rating scales
├── FilesAdder.tsx            # File requirements
├── KnotsAdder.tsx            # Timeline linking
├── ContributorsAdder.tsx     # User roles/permissions
└── AdminUsersAdder.tsx       # Admin permissions
```

#### Features Implemented
- ✅ To Give / To Receive tabs in all steps
- ✅ Per-subtype configuration
- ✅ Skip functionality
- ✅ Complete later toggle
- ✅ Database persistence
- ✅ Schema preview
- ✅ Template system
- ✅ Responsive (modal on desktop, drawer on mobile)

---

### ✅ Phase 3: Display & Management (COMPLETED)

**Duration:** 4 days  
**Status:** 100% Complete  
**Alignment:** #ContributionTimelineTabs, #PresentationUIStyles

#### 3.1 Status Management
**Files Created:**
- ✅ `src/hooks/useContributionStatus.ts`
- ✅ `src/components/contributions/ContributionStatusBadge.tsx`

**Status Flow:**
```
draft → setup_incomplete → ready_to_receive/ready_to_give → 
negotiating → active → completed/cancelled
```

#### 3.2 List Views
**Files Created:**
- ✅ `src/pages/Contributions.tsx`
- ✅ `src/components/contributions/ContributionsList.tsx`
- ✅ `src/components/contributions/ContributionCard.tsx`
- ✅ `src/components/contributions/ContributionFilters.tsx`

**Features:**
- ✅ Filter by category, status, direction
- ✅ Sort by date, valuation, status
- ✅ Search functionality
- ✅ Card-based responsive display

#### 3.3 Detail Views
**Files Created:**
- ✅ `src/pages/ContributionDetail.tsx`
- ✅ 9 tab components:
  - `OverviewTab.tsx`
  - `InsightsTabView.tsx`
  - `ValuationTabView.tsx`
  - `FollowupTabView.tsx`
  - `SmartRulesTabView.tsx`
  - `RatingsTabView.tsx`
  - `FilesTabView.tsx`
  - `KnotsTabView.tsx`
  - `ContributorsTabView.tsx`

**Features:**
- ✅ Tab-based navigation
- ✅ Display all configured data
- ✅ Smart rule enable/disable toggle
- ✅ Delete contribution with confirmation
- ✅ Route integration (`/contributions/:id`)

---

### 🚧 Phase 4: Negotiation System (IN PROGRESS)

**Duration:** 4-5 days  
**Status:** 0% - Starting  
**Priority:** 🔴 CRITICAL  
**Alignment:** #ContributionRules (items 3, 4, 10), #ReusableFeatures (Negotiation Adder)

#### 4.1 Database Schema

**Tables to Create:**

```sql
-- Negotiation Sessions
CREATE TABLE negotiation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES contributions(id) ON DELETE CASCADE,
  giver_user_id UUID NOT NULL,
  receiver_user_id UUID NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('strict', 'flexible')),
  status TEXT NOT NULL CHECK (status IN ('proposed', 'revised', 'agreed', 'rejected', 'cancelled')),
  current_proposal_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_negotiation_contribution ON negotiation_sessions(contribution_id);
CREATE INDEX idx_negotiation_users ON negotiation_sessions(giver_user_id, receiver_user_id);

-- Negotiation Proposals
CREATE TABLE negotiation_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES negotiation_sessions(id) ON DELETE CASCADE,
  proposed_by UUID NOT NULL,
  proposal_data JSONB NOT NULL, -- All #SharedContributionStepsSetup fields
  message TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'superseded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Negotiation Messages
CREATE TABLE negotiation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES negotiation_sessions(id) ON DELETE CASCADE,
  sender_user_id UUID NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('text', 'call_recording', 'file')),
  content TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Negotiation Audit Log
CREATE TABLE negotiation_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES negotiation_sessions(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'proposed', 'accepted', 'rejected', 'revised', 'message_sent'
  actor_user_id UUID NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**RLS Policies:**
```sql
-- Users can view negotiations they're part of
CREATE POLICY "Users can view own negotiations"
ON negotiation_sessions FOR SELECT
USING (auth.uid() IN (giver_user_id, receiver_user_id));

-- Users can create negotiations for their contributions
CREATE POLICY "Users can create negotiations"
ON negotiation_sessions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM contributions
    WHERE id = contribution_id
    AND creator_user_id = auth.uid()
  )
  OR auth.uid() IN (giver_user_id, receiver_user_id)
);

-- Similar policies for proposals, messages, and audit log
```

#### 4.2 Components to Build

**Core Components:**
```
src/components/contributions/negotiation/
├── NegotiationAdder.tsx          # Main modal/drawer (entry point)
├── NegotiationDashboard.tsx      # Overview of all negotiations
├── NegotiationDetail.tsx         # Full negotiation view
├── ProposalCard.tsx              # Display single proposal
├── ProposalForm.tsx              # Create/edit proposals
├── ComparisonView.tsx            # Side-by-side giver vs receiver
├── ChatInterface.tsx             # Real-time messaging
├── MismatchHighlighter.tsx       # Highlight differences
├── NegotiationStatusFlow.tsx     # Status timeline
└── AcceptRejectActions.tsx       # Action buttons
```

**Hooks:**
```
src/hooks/
├── useNegotiation.ts             # Negotiation state management
├── useNegotiationMessages.ts     # Real-time messaging with Realtime
└── useNegotiationProposals.ts    # Proposal CRUD
```

**Pages:**
```
src/pages/
└── NegotiationDetail.tsx         # Full page view (/negotiations/:id)
```

#### 4.3 Features to Implement

**Strict Mode:**
- [ ] Giver sets non-negotiable terms
- [ ] Receiver can only accept or decline
- [ ] No counter-proposals allowed
- [ ] Clear Accept/Reject UI
- [ ] Automatic contribution status update on acceptance

**Flexible Mode:**
- [ ] Proposal/counter-proposal flow
- [ ] Side-by-side comparison (giver vs receiver)
- [ ] Highlight mismatches (red for conflicts, green for aligned)
- [ ] In-app chat with real-time updates
- [ ] Call recording upload support
- [ ] File attachments in messages
- [ ] Negotiation history timeline
- [ ] Audit trail

**Comparison View (All #SharedContributionStepsSetup fields):**
- [ ] Expected Contributions comparison
- [ ] Valuation comparison
- [ ] Insights comparison
- [ ] Files comparison
- [ ] Follow-up comparison
- [ ] Knots comparison
- [ ] Smart Rules comparison
- [ ] Ratings comparison
- [ ] Contributors comparison
- [ ] Admin Users comparison

**Real-time Features:**
- [ ] Supabase Realtime subscriptions
- [ ] Live message updates
- [ ] Typing indicators
- [ ] Online/offline status
- [ ] Push notifications for proposals
- [ ] Status change notifications

#### 4.4 Integration Points
- [ ] Add "Negotiate" button to contribution detail page
- [ ] Add "Matched Contributions" section showing negotiation-ready matches
- [ ] Notification system for negotiation events
- [ ] Update contribution status when negotiation finalizes

---

### ⏳ Phase 5: Payment Processing (PLANNED)

**Duration:** 5-6 days  
**Priority:** 🔴 CRITICAL (Revenue blocker)  
**Alignment:** #PaymentsProcessing

#### 5.1 Database Schema

**Tables to Create:**

```sql
-- Payment Methods
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  method_type TEXT NOT NULL CHECK (method_type IN ('mpesa', 'card', 'bank')),
  provider TEXT, -- 'safaricom', 'stripe', 'kcb', 'equity', 'ncba'
  credentials JSONB NOT NULL, -- Encrypted
  is_default BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID REFERENCES contributions(id),
  payer_user_id UUID NOT NULL,
  payee_user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  payment_method_id UUID REFERENCES payment_methods(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('payment', 'refund', 'payout', 'distribution')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  external_reference TEXT, -- M-Pesa CheckoutRequestID, Stripe PaymentIntent ID
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Escrows
CREATE TABLE escrows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  release_condition TEXT NOT NULL, -- 'manual', 'smart_rule', 'time_based'
  release_date TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('held', 'released', 'refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payouts
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  payment_method_id UUID REFERENCES payment_methods(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  external_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
```

#### 5.2 Edge Functions

**M-Pesa Integration:**
```typescript
// supabase/functions/process-mpesa-payment/index.ts
// - STK Push initiation
// - Generate access token
// - Call Safaricom API
// - Return CheckoutRequestID

// supabase/functions/mpesa-callback/index.ts
// - Receive M-Pesa callbacks
// - Update transaction status
// - Trigger smart rules if applicable
// - Send notifications
```

**Card Payment Integration:**
```typescript
// supabase/functions/process-card-payment/index.ts
// - Stripe/PayPal integration
// - Create payment intent
// - Handle 3D Secure
// - Return client secret
```

**Escrow Management:**
```typescript
// supabase/functions/release-escrow/index.ts
// - Check release conditions
// - Execute smart rules
// - Release funds to payee
// - Log audit trail
```

**Payout Processing:**
```typescript
// supabase/functions/process-payout/index.ts
// - Validate user balance
// - Process withdrawal to M-Pesa/Bank
// - Update payout status
// - Send confirmation
```

#### 5.3 Components to Build

```
src/components/wallet/
├── PaymentMethodSetup.tsx        # Add/edit payment methods
├── MpesaSetup.tsx                # M-Pesa configuration
├── CardSetup.tsx                 # Card configuration
├── BankSetup.tsx                 # Bank configuration
├── TransactionHistory.tsx        # List all transactions
├── TransactionDetail.tsx         # Single transaction view
├── WalletBalance.tsx             # Display balance
├── WithdrawFunds.tsx             # Withdrawal UI
└── PaymentConfirmation.tsx       # Payment confirmation modal

src/components/contributions/payments/
├── PaymentProcessor.tsx          # Main payment flow
├── PaymentMethodSelector.tsx     # Choose payment method
├── EscrowSetup.tsx               # Configure escrow
└── DistributionRules.tsx         # Revenue/profit sharing rules
```

#### 5.4 Features to Implement

**M-Pesa Integration:**
- [ ] Daraja API integration (OAuth, STK Push)
- [ ] M-Pesa callback handling
- [ ] Transaction status tracking
- [ ] Sandbox and live mode support
- [ ] Phone number validation

**Card Payments:**
- [ ] Stripe integration
- [ ] PayPal integration (alternative)
- [ ] 3D Secure support
- [ ] Saved card management
- [ ] PCI compliance

**Bank Transfers:**
- [ ] KCB Bank API integration
- [ ] Equity Bank API integration
- [ ] NCBA Bank API integration
- [ ] Account verification
- [ ] Transfer confirmation

**Escrow System:**
- [ ] Hold funds until conditions met
- [ ] Smart rule-based release
- [ ] Time-based release
- [ ] Manual release with approval
- [ ] Refund mechanism

**Distributions:**
- [ ] Revenue sharing (parent to child timelines)
- [ ] Profit splitting
- [ ] Custom distribution rules
- [ ] Exclude subtimelines from distribution
- [ ] Automated payouts

**Wallet Features:**
- [ ] Balance tracking (per currency)
- [ ] Transaction history with filters
- [ ] Withdrawal to M-Pesa/Bank
- [ ] Currency conversion
- [ ] Fee calculation and display

---

### ⏳ Phase 6: Marketing Integrations (PLANNED)

**Duration:** 6-7 days  
**Priority:** 🟡 HIGH  
**Alignment:** Marketing Contribution Channels & Integrations (KnowledgeBase2)

#### 6.1 Database Schema

```sql
-- Channel Integrations
CREATE TABLE channel_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  platform TEXT NOT NULL, -- 'facebook', 'instagram', 'tiktok', 'google_ads', 'linkedin', 'twitter', 'youtube'
  access_token TEXT NOT NULL, -- Encrypted
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  account_id TEXT,
  account_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Campaign Posts
CREATE TABLE campaign_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID REFERENCES contributions(id),
  channel_integration_id UUID REFERENCES channel_integrations(id),
  external_post_id TEXT NOT NULL, -- Platform-specific ID
  post_url TEXT,
  post_content TEXT,
  post_type TEXT, -- 'ad', 'organic', 'sponsored'
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'paused', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- Campaign Outcomes
CREATE TABLE campaign_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_post_id UUID NOT NULL REFERENCES campaign_posts(id),
  outcome_type TEXT NOT NULL, -- 'click', 'view', 'like', 'share', 'comment', 'conversion', 'signup'
  outcome_value NUMERIC DEFAULT 1, -- For conversions, can be monetary value
  metadata JSONB, -- Platform-specific data
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### 6.2 Edge Functions

**Platform Sync Functions:**
```typescript
// supabase/functions/sync-facebook-outcomes/index.ts
// supabase/functions/sync-instagram-outcomes/index.ts
// supabase/functions/sync-tiktok-outcomes/index.ts
// supabase/functions/sync-google-ads/index.ts
// supabase/functions/sync-linkedin-outcomes/index.ts
// supabase/functions/sync-twitter-outcomes/index.ts
// supabase/functions/sync-youtube-outcomes/index.ts

// Each function:
// - Authenticate with platform API
// - Fetch campaign metrics
// - Parse and store outcomes
// - Trigger smart rules if applicable
```

**Webhook Handlers:**
```typescript
// supabase/functions/facebook-webhook/index.ts
// supabase/functions/google-ads-webhook/index.ts
// - Receive real-time updates from platforms
// - Validate webhook signatures
// - Store outcomes in database
```

#### 6.3 Components to Build

```
src/components/marketing/
├── ChannelIntegrations.tsx       # List all connected platforms
├── ConnectPlatform.tsx           # OAuth flow for new platform
├── PlatformSelector.tsx          # Choose platform to integrate
├── CampaignCreator.tsx           # Create cross-platform campaign
├── CampaignList.tsx              # List all campaigns
├── CampaignDetail.tsx            # Single campaign view
├── OutcomesDashboard.tsx         # Aggregated outcomes
├── OutcomesChart.tsx             # Visualize outcomes
├── LeadsPipeline.tsx             # Lead onboarding → follow-up → conversion → retention
└── ROICalculator.tsx             # Calculate ROI per platform
```

#### 6.4 Platform-Specific Features

**Facebook/Instagram (Meta Graph API):**
- [ ] OAuth integration
- [ ] Ad account selection
- [ ] Campaign creation
- [ ] Outcome tracking (impressions, clicks, conversions)
- [ ] Audience insights
- [ ] Post to ShonaCoin timeline

**TikTok Business API:**
- [ ] OAuth integration
- [ ] Ad group management
- [ ] Video ad creation
- [ ] Outcome tracking (views, clicks, engagement)
- [ ] Creator marketplace integration

**Google Ads API:**
- [ ] OAuth integration
- [ ] Campaign creation (Search, Display, Video)
- [ ] Keyword targeting
- [ ] Conversion tracking
- [ ] Cost per acquisition (CPA) tracking

**LinkedIn Ads API:**
- [ ] OAuth integration
- [ ] Sponsored content
- [ ] Lead gen forms
- [ ] Audience targeting (job titles, industries)
- [ ] B2B lead tracking

**Twitter/X API:**
- [ ] OAuth integration
- [ ] Promoted tweets
- [ ] Engagement tracking
- [ ] Follower growth tracking

**YouTube Data API:**
- [ ] OAuth integration
- [ ] Video upload
- [ ] View and watch time tracking
- [ ] Subscriber tracking
- [ ] Comment engagement

**ShonaCoin Native Posts:**
- [ ] Create timeline posts with CTA buttons
- [ ] Custom outcome buttons (Signup, Download, Call, Message)
- [ ] Track outcomes directly in ShonaCoin
- [ ] Consolidate external + native outcomes

#### 6.5 Lead Flow Implementation

**A. Leads Onboarding:**
- [ ] Multi-channel lead capture
- [ ] Lead deduplication
- [ ] Source attribution
- [ ] Custom fields per channel
- [ ] Lead scoring

**B. Leads Follow-up:**
- [ ] Automated follow-up workflows
- [ ] Status tracking (Pending, In Progress, Done)
- [ ] Reminder notifications
- [ ] Follow-up templates

**C. Leads Conversion:**
- [ ] Conversion criteria definition
- [ ] Conversion tracking
- [ ] Conversion attribution
- [ ] Revenue per lead

**D. Leads Retention:**
- [ ] Retention campaigns
- [ ] Re-engagement workflows
- [ ] Churn prediction
- [ ] Retention rate tracking

---

### ⏳ Phase 7: AI Assistant Integration (PLANNED)

**Duration:** 4-5 days  
**Priority:** 🟢 MEDIUM

#### 7.1 Enable Lovable AI Gateway

**Edge Function:**
```typescript
// supabase/functions/ai-assistant-chat/index.ts
import { createClient } from '@supabase/supabase-js'

Deno.serve(async (req) => {
  const { message, context } = await req.json()
  
  // Call Lovable AI Gateway
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: 'You are ShonaCoin AI assistant...' },
        { role: 'user', content: message }
      ],
      temperature: 0.7
    })
  })
  
  const data = await response.json()
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

#### 7.2 Components to Build

```
src/components/assistant/
├── AIChatInterface.tsx           # Main chat UI
├── AIMessageBubble.tsx           # Message display
├── AISuggestions.tsx             # Quick action suggestions
├── AIContributionHelper.tsx      # Setup assistance
├── AIMatchRecommendations.tsx    # AI-powered matching
└── AIValuationHelper.tsx         # Valuation recommendations
```

#### 7.3 Features to Implement

**Contribution Setup Assistance:**
- [ ] Natural language contribution creation
- [ ] Auto-fill form fields from conversation
- [ ] Template suggestions based on intent
- [ ] Smart defaults based on user history

**AI Matching:**
- [ ] Semantic matching (beyond keyword)
- [ ] Compatibility scoring
- [ ] Match reasoning explanation
- [ ] Proactive match suggestions

**Valuation Recommendations:**
- [ ] Market rate suggestions
- [ ] Historical data analysis
- [ ] Comparative valuation
- [ ] Custom formula generation

**Smart Rule Generation:**
- [ ] Natural language → smart rule conversion
- [ ] Template suggestions
- [ ] Rule validation and testing

**Context-Aware Assistance:**
- [ ] User timeline awareness
- [ ] Contribution history context
- [ ] Preference learning
- [ ] Personalized suggestions

---

### ⏳ Phase 8: Security & Compliance (CRITICAL)

**Duration:** 3-4 days  
**Priority:** 🔴 CRITICAL (Launch blocker)

#### 8.1 Security Audit Checklist

**Row-Level Security (RLS):**
- [ ] Audit all RLS policies
- [ ] Test with different user roles
- [ ] Verify no data leaks between users
- [ ] Test permission boundaries
- [ ] Use security definer functions for recursive policy checks

**Input Validation:**
- [ ] All form inputs validated with Zod
- [ ] Server-side validation in Edge Functions
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS prevention (sanitize user inputs)
- [ ] CSRF protection (Supabase handles this)

**Authentication & Authorization:**
- [ ] Implement proper user roles table (NOT on profiles)
- [ ] Server-side role checks
- [ ] Never trust client-side auth
- [ ] Rate limiting on auth endpoints
- [ ] Password strength requirements
- [ ] Email verification required

**Data Encryption:**
- [ ] Encrypt PII at rest (payment methods, phone numbers)
- [ ] Use Supabase Vault for sensitive data
- [ ] HTTPS everywhere
- [ ] Secure cookie settings

**API Security:**
- [ ] API key rotation
- [ ] Webhook signature verification
- [ ] Rate limiting on all endpoints
- [ ] CORS configuration
- [ ] IP whitelisting for admin endpoints

#### 8.2 Compliance Requirements

**GDPR Compliance:**
- [ ] Data export functionality
- [ ] Right to be forgotten (delete user data)
- [ ] Consent management
- [ ] Privacy policy
- [ ] Cookie consent
- [ ] Data processing agreements

**PCI Compliance (Payments):**
- [ ] Never store full card numbers
- [ ] Use tokenization (Stripe/PayPal)
- [ ] Encrypt payment credentials
- [ ] Audit logging of payment events
- [ ] Secure transmission (TLS 1.2+)

**Data Retention:**
- [ ] Define retention policies
- [ ] Automated data cleanup
- [ ] Archive vs delete strategies
- [ ] Backup and recovery

#### 8.3 Monitoring & Logging

**Error Monitoring:**
- [ ] Sentry or equivalent
- [ ] Error grouping and prioritization
- [ ] Alert thresholds

**Performance Monitoring:**
- [ ] Page load times
- [ ] API response times
- [ ] Database query performance
- [ ] Real-user monitoring

**Audit Logging:**
- [ ] Log all sensitive actions
- [ ] User authentication logs
- [ ] Payment transaction logs
- [ ] Admin action logs
- [ ] Data access logs

---

### ⏳ Phase 9: Mobile Optimization (HIGH PRIORITY)

**Duration:** 3-4 days  
**Priority:** 🟡 HIGH  
**Alignment:** #UsabilityPrompt

#### 9.1 Responsive Design Refinement

**Wizard Optimization:**
- [ ] Ensure drawer works smoothly on all devices
- [ ] Touch-friendly button sizes (min 44px)
- [ ] Proper keyboard handling
- [ ] Smooth transitions
- [ ] Progress indicator visibility

**Navigation:**
- [ ] Bottom navigation bar for mobile
- [ ] Hamburger menu optimization
- [ ] Back button handling
- [ ] Deep linking support

**Forms:**
- [ ] Autofocus on mobile
- [ ] Proper input types (tel, email, number)
- [ ] Date/time pickers optimized
- [ ] File upload from camera/gallery
- [ ] Autocomplete support

#### 9.2 Performance Optimization

**Code Splitting:**
- [ ] Route-based code splitting
- [ ] Lazy load heavy components
- [ ] Preload critical resources

**Image Optimization:**
- [ ] Responsive images (srcset)
- [ ] WebP format support
- [ ] Lazy loading images
- [ ] Image compression

**Bundle Size:**
- [ ] Analyze bundle with vite-bundle-visualizer
- [ ] Remove unused dependencies
- [ ] Tree shaking
- [ ] Minification

**Caching:**
- [ ] Service worker setup (basic)
- [ ] Cache API responses
- [ ] Offline fallback pages

#### 9.3 Touch Gestures

**Swipe Actions:**
- [ ] Swipe to delete on lists
- [ ] Swipe between tabs
- [ ] Pull to refresh
- [ ] Swipe to go back

**Touch Feedback:**
- [ ] Haptic feedback on actions
- [ ] Visual touch feedback (ripples)
- [ ] Loading states

#### 9.4 Device Testing

**iOS:**
- [ ] Safari testing (latest)
- [ ] PWA installation
- [ ] Notch/Dynamic Island handling
- [ ] Safe area insets
- [ ] iOS keyboard issues

**Android:**
- [ ] Chrome testing (latest)
- [ ] PWA installation
- [ ] Back button behavior
- [ ] Different screen sizes
- [ ] Android keyboard issues

**Tablets:**
- [ ] iPad layouts
- [ ] Android tablet layouts
- [ ] Responsive breakpoints
- [ ] Multi-column layouts

---

### ⏳ Phase 10: Launch Preparation (CRITICAL)

**Duration:** 3-4 days  
**Priority:** 🔴 CRITICAL

#### 10.1 Testing

**End-to-End Testing:**
- [ ] All contribution flows (Financial, Intellectual, Marketing, Assets)
- [ ] Negotiation flows (Strict and Flexible modes)
- [ ] Payment flows (M-Pesa, cards, banks)
- [ ] Marketing integrations
- [ ] AI assistant interactions

**Cross-Browser Testing:**
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

**Performance Testing:**
- [ ] Lighthouse scores (aim for 90+)
- [ ] Load time under 3 seconds
- [ ] Time to interactive under 5 seconds
- [ ] First contentful paint under 1.5 seconds

**Load Testing:**
- [ ] Simulate 100 concurrent users
- [ ] Database performance under load
- [ ] Edge Function scaling
- [ ] Payment processing under load

**User Acceptance Testing (UAT):**
- [ ] Beta user group testing
- [ ] Feedback collection
- [ ] Bug fixing
- [ ] Usability improvements

#### 10.2 Documentation

**User Guides:**
- [ ] Getting started guide
- [ ] Contribution creation guide (per category)
- [ ] Negotiation guide
- [ ] Payment setup guide
- [ ] Marketing integration guide
- [ ] Troubleshooting guide

**Video Tutorials:**
- [ ] Platform overview (5 min)
- [ ] Creating your first contribution (3 min)
- [ ] Negotiating contributions (5 min)
- [ ] Setting up payments (3 min)
- [ ] Connecting marketing channels (5 min)

**Developer Documentation:**
- [ ] API documentation
- [ ] Database schema documentation
- [ ] Edge Function documentation
- [ ] Contributing guidelines

**Help Center:**
- [ ] FAQ page
- [ ] Searchable knowledge base
- [ ] Contact support form

#### 10.3 Onboarding

**First-Time User Experience:**
- [ ] Welcome modal
- [ ] Interactive tutorial
- [ ] Sample contributions
- [ ] Guided first contribution creation
- [ ] Tooltips on key features

**Guided Tours:**
- [ ] Dashboard tour
- [ ] Wizard tour
- [ ] Wallet tour
- [ ] Marketing integrations tour

#### 10.4 Analytics & Monitoring

**Event Tracking:**
- [ ] User signup events
- [ ] Contribution creation events
- [ ] Negotiation events
- [ ] Payment events
- [ ] Marketing sync events
- [ ] Error events

**Dashboards:**
- [ ] User growth dashboard
- [ ] Contribution metrics dashboard
- [ ] Revenue dashboard
- [ ] Error monitoring dashboard
- [ ] Performance dashboard

#### 10.5 Support Channels

**Customer Support:**
- [ ] Email support (support@shonacoin.com)
- [ ] In-app chat (optional)
- [ ] Help center
- [ ] Community forum (optional)

**Feedback Collection:**
- [ ] In-app feedback form
- [ ] NPS surveys
- [ ] Feature request board
- [ ] Bug report form

#### 10.6 Marketing Materials

**Website:**
- [ ] Landing page
- [ ] Features page
- [ ] Pricing page (if applicable)
- [ ] About page
- [ ] Blog setup

**Social Media:**
- [ ] Social media accounts setup
- [ ] Launch announcement posts
- [ ] Demo videos
- [ ] User testimonials

---

<a name="database-schema-specification"></a>
## 🗄️ Database Schema Specification

### Existing Tables (Implemented)

#### Core Tables
1. **timelines** - Root timeline containers
2. **contributions** - Main contribution records
3. **contribution_subtypes** - Selected subtypes per contribution
4. **contribution_setup_steps** - Tracks step completion
5. **contribution_valuations** - Valuation data
6. **contribution_insights** - Insights configuration
7. **contribution_followups** - Follow-up records
8. **contribution_smart_rules** - Smart rules engine
9. **contribution_ratings** - Rating system
10. **contribution_files** - File attachments
11. **contribution_knots** - Linked timelines
12. **contribution_contributors** - Participants/roles

### New Tables (To Be Created)

#### Negotiation Tables (Phase 4)
- `negotiation_sessions`
- `negotiation_proposals`
- `negotiation_messages`
- `negotiation_audit_log`

#### Payment Tables (Phase 5)
- `payment_methods`
- `transactions`
- `escrows`
- `payouts`

#### Marketing Tables (Phase 6)
- `channel_integrations`
- `campaign_posts`
- `campaign_outcomes`

### Database Diagrams

```
┌─────────────────────────────────────────────────────────────┐
│                    Core Contribution Flow                    │
└─────────────────────────────────────────────────────────────┘

timelines (1) ──┬──▶ (N) contributions (1) ──┬──▶ (N) contribution_subtypes
                │                              │
                │                              ├──▶ (N) contribution_valuations
                │                              │
                │                              ├──▶ (N) contribution_insights
                │                              │
                │                              ├──▶ (N) contribution_followups
                │                              │
                │                              ├──▶ (N) contribution_smart_rules
                │                              │
                │                              ├──▶ (N) contribution_ratings
                │                              │
                │                              ├──▶ (N) contribution_files
                │                              │
                │                              ├──▶ (N) contribution_knots
                │                              │
                │                              ├──▶ (N) contribution_contributors
                │                              │
                │                              └──▶ (N) negotiation_sessions (1) ──┬──▶ (N) negotiation_proposals
                │                                                                    │
                │                                                                    ├──▶ (N) negotiation_messages
                │                                                                    │
                │                                                                    └──▶ (N) negotiation_audit_log
                │
                └──▶ (N) transactions (1) ──▶ (N) escrows

users (1) ──┬──▶ (N) payment_methods
            │
            ├──▶ (N) channel_integrations (1) ──▶ (N) campaign_posts (1) ──▶ (N) campaign_outcomes
            │
            └──▶ (N) payouts
```

---

<a name="api-integration-roadmap"></a>
## 🔌 API Integration Roadmap

### Payment APIs

| Provider | Priority | Complexity | Timeline | Status |
|----------|----------|------------|----------|--------|
| M-Pesa (Safaricom Daraja) | 🔴 Critical | High | Phase 5 | ⏳ Planned |
| Stripe | 🔴 Critical | Medium | Phase 5 | ⏳ Planned |
| PayPal | 🟡 High | Medium | Phase 5 | ⏳ Planned |
| KCB Bank | 🟡 High | High | Phase 5 | ⏳ Planned |
| Equity Bank | 🟡 High | High | Phase 5 | ⏳ Planned |
| NCBA Bank | 🟢 Medium | High | Phase 5 | ⏳ Planned |

### Marketing APIs

| Platform | Priority | Complexity | Timeline | Status |
|----------|----------|------------|----------|--------|
| Meta (Facebook/Instagram) | 🔴 Critical | High | Phase 6 | ⏳ Planned |
| Google Ads | 🔴 Critical | High | Phase 6 | ⏳ Planned |
| TikTok Business | 🟡 High | Medium | Phase 6 | ⏳ Planned |
| LinkedIn Ads | 🟡 High | Medium | Phase 6 | ⏳ Planned |
| Twitter/X | 🟢 Medium | Low | Phase 6 | ⏳ Planned |
| YouTube Data | 🟢 Medium | Medium | Phase 6 | ⏳ Planned |

### AI APIs

| Provider | Priority | Complexity | Timeline | Status |
|----------|----------|------------|----------|--------|
| Lovable AI Gateway | 🟡 High | Low | Phase 7 | ⏳ Planned |

---

<a name="security-compliance"></a>
## 🔐 Security & Compliance

### Security Measures

**Authentication:**
- ✅ Supabase Auth (email, phone, Google)
- ⏳ User roles table (separate from profiles)
- ⏳ Server-side role validation
- ⏳ Rate limiting on auth endpoints

**Authorization:**
- ✅ Row-Level Security (RLS) on all tables
- ⏳ Security definer functions for recursive policies
- ⏳ Permission-based access control

**Data Protection:**
- ⏳ PII encryption (payment methods, phone numbers)
- ⏳ Supabase Vault for secrets
- ✅ HTTPS everywhere
- ⏳ Secure cookie settings

**API Security:**
- ⏳ API key rotation
- ⏳ Webhook signature verification
- ⏳ Rate limiting on all endpoints
- ⏳ CORS configuration

### Compliance Checklist

**GDPR:**
- [ ] Data export functionality
- [ ] Right to be forgotten
- [ ] Consent management
- [ ] Privacy policy
- [ ] Cookie consent
- [ ] Data processing agreements

**PCI DSS (Payments):**
- [ ] Never store full card numbers
- [ ] Use tokenization
- [ ] Encrypt payment credentials
- [ ] Audit logging
- [ ] Secure transmission (TLS 1.2+)

**Data Retention:**
- [ ] Retention policies defined
- [ ] Automated cleanup
- [ ] Backup and recovery

---

<a name="testing-strategy"></a>
## 🧪 Testing Strategy

### Unit Testing
- [ ] Test all utility functions
- [ ] Test all hooks
- [ ] Test validation schemas

### Integration Testing
- [ ] Test API endpoints
- [ ] Test database operations
- [ ] Test Edge Functions

### End-to-End Testing
- [ ] Test complete user flows
- [ ] Test wizard completion
- [ ] Test negotiation flows
- [ ] Test payment flows

### Performance Testing
- [ ] Load testing (100+ concurrent users)
- [ ] Stress testing
- [ ] Database query performance
- [ ] API response times

### Security Testing
- [ ] Penetration testing
- [ ] RLS policy testing
- [ ] Input validation testing
- [ ] XSS/CSRF testing

---

<a name="deployment-devops"></a>
## 🚀 Deployment & DevOps

### Environments
- **Development:** Local Supabase + Vite dev server
- **Staging:** Lovable staging URL
- **Production:** Custom domain (to be configured)

### CI/CD Pipeline
- ✅ Automatic deployment on push (Lovable)
- ⏳ Database migration automation
- ⏳ Edge Function deployment
- ⏳ Automated testing

### Monitoring
- ⏳ Sentry (error tracking)
- ⏳ Supabase Analytics
- ⏳ Custom dashboards

### Backup & Recovery
- ✅ Supabase automatic backups
- ⏳ Disaster recovery plan
- ⏳ Data export procedures

---

<a name="success-metrics-kpis"></a>
## 📊 Success Metrics & KPIs

### Launch Criteria (Must Have)
- ✅ All 14 wizard steps functional
- ✅ Data persistence works
- ⏳ Negotiation flows complete
- ⏳ At least M-Pesa payment working
- ⏳ Mobile responsive (all critical flows)
- ⏳ Security audit passed
- ⏳ Basic documentation ready
- ⏳ No critical bugs

### Product Metrics
- **User Growth:** Target 100 users in first month
- **Contribution Creation Rate:** Target 50% of users create a contribution
- **Negotiation Success Rate:** Target 70% of negotiations result in agreement
- **Payment Success Rate:** Target 95% of payments succeed
- **User Retention:** Target 60% monthly retention

### Technical Metrics
- **Page Load Time:** < 3 seconds
- **API Response Time:** < 500ms (p95)
- **Uptime:** 99.5%
- **Error Rate:** < 1%

---

<a name="timeline-milestones"></a>
## ⏱️ Timeline & Milestones

### Completed Milestones
- ✅ **Dec 2024 Week 1-2:** Foundation & Wizard Steps 1-14
- ✅ **Dec 2024 Week 3:** Display & Management

### Upcoming Milestones
- 🚧 **Dec 2024 Week 4:** Negotiation System + Payment Processing Start
- 📋 **Jan 2025 Week 1:** Payment Processing Complete + Marketing Integrations Start
- 📋 **Jan 2025 Week 2:** Marketing Integrations Complete + AI Assistant
- 📋 **Jan 2025 Week 3:** Security Audit + Mobile Optimization
- 📋 **Jan 2025 Week 4:** Launch Preparation + Production Deployment

### Critical Path
```
Phase 1-3 (✅ Complete) → Phase 4 (Negotiation) → Phase 5 (Payments) → 
Phase 8 (Security) → Phase 9 (Mobile) → Phase 10 (Launch)

Parallel: Phase 6 (Marketing) & Phase 7 (AI) can run in parallel with Phase 5
```

---

<a name="risk-management"></a>
## ⚠️ Risk Management

### High-Risk Items

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| M-Pesa API downtime | High | Medium | Implement retry logic, fallback to card payments |
| Payment security breach | Critical | Low | Thorough security audit, PCI compliance, never store full card numbers |
| RLS policy misconfiguration | High | Medium | Comprehensive testing, security definer functions |
| Marketing API rate limits | Medium | High | Implement caching, batch requests, respect rate limits |
| Database performance issues | High | Medium | Indexing, query optimization, connection pooling |
| User data leak | Critical | Low | RLS policies, encryption, audit logging |

### Contingency Plans

**Payment Failure:**
- Display clear error messages
- Offer alternative payment methods
- Retry mechanism with exponential backoff
- Support team intervention

**API Downtime:**
- Graceful degradation
- Cached data display
- Offline mode (basic)
- Status page for users

**Security Incident:**
- Incident response plan
- User notification procedures
- Data breach procedures
- Post-mortem analysis

---

## 📞 Support & Contact

### Development Team
- **Project Lead:** [Name]
- **Backend Developer:** [Name]
- **Frontend Developer:** [Name]
- **QA Engineer:** [Name]

### External Resources
- **Supabase Support:** support@supabase.io
- **Lovable Support:** Discord community
- **M-Pesa Support:** Safaricom developer portal

---

## 📚 References

- [KnowledgeBase2](./SHONACOIN_KNOWLEDGE_BASE.md)
- [Implementation Status](./IMPLEMENTATION_STATUS.md)
- [Contribution Implementation Phases](./CONTRIBUTION_IMPLEMENTATION_PHASES.md)
- [Remaining Phases](./REMAINING_PHASES.md)

---

**Document Version:** 2.0  
**Last Updated:** December 2024  
**Next Review:** Weekly during active development

---

## ✅ Sign-Off

This master plan is aligned with KnowledgeBase2 and represents the complete roadmap for ShonaCoin implementation from current state to production launch.

**Approved by:**
- [ ] Project Lead
- [ ] Technical Architect
- [ ] Product Owner

**Next Action:** Begin Phase 4 (Negotiation System) implementation.
