# ShonaCoin Contribution Procedure Implementation Plan

## Overview
This document outlines the phased implementation plan for the ShonaCoin contribution procedure, following the **13-step #AddContributionProcedure** defined in the knowledge base.

---

## Implementation Phases

### Phase 1: Foundation & Database Schema (Week 1)
**Goal:** Establish the core database structure for timelines and contributions.

#### Tasks:
1. **Create Core Tables**
   - `timelines` table (id, user_id, title, description, type, status, created_at, updated_at)
   - `contributions` table (id, timeline_id, contributor_id, type, status, created_at)
   - `contribution_subtypes` table (id, contribution_id, subtype, category, config)
   - `contribution_setup` table (id, contribution_id, step_name, step_data, completed)

2. **Create Supporting Tables**
   - `contribution_valuations` (id, contribution_id, amount, currency, formula, type)
   - `contribution_insights` (id, contribution_id, insight_type, data, source)
   - `contribution_files` (id, contribution_id, file_url, file_type, metadata)
   - `contribution_follow_ups` (id, contribution_id, status, due_date, notes)
   - `contribution_ratings` (id, contribution_id, rated_by, rating, criteria, comments)
   - `contribution_smart_rules` (id, contribution_id, rule_name, conditions, actions)
   - `contribution_knots` (id, source_contribution_id, target_timeline_id, knot_type)
   - `contribution_contributors` (id, contribution_id, user_id, role, permissions)

3. **Enable RLS Policies**
   - Users can view own contributions and timelines
   - Contributors can view shared contributions based on permissions
   - Public contributions visible to all

4. **Create Enums**
   - `contribution_type`: 'financial', 'intellectual', 'marketing', 'asset'
   - `contribution_status`: 'draft', 'active', 'completed', 'cancelled'
   - `subtype_status`: 'pending', 'configured', 'negotiating', 'agreed'

#### Success Metrics:
- All tables created with proper relationships
- RLS policies functioning correctly
- Sample data insertable without errors

---

### Phase 2: Core Contribution Flow UI (Week 2)
**Goal:** Build the 13-step contribution wizard UI structure.

#### Tasks:
1. **Create Base Components**
   - `ContributionWizard.tsx` - Main wizard container
   - `WizardHeader.tsx` - Title and progress indicator
   - `WizardFooter.tsx` - Next, Prev, Skip, Complete buttons
   - `WizardStep.tsx` - Generic step wrapper

2. **Implement Steps 1-4 (Always Visible)**
   - `Step1_SubscriptionCheck.tsx` - Verify subscription access
   - `Step2_ContributionTypeToggle.tsx` - Single vs Timeline toggle
   - `Step3_ExpectedContributions.tsx` - To Give / To Receive tabs with subtype selector
   - `Step4_SaveAndContinue.tsx` - Save handler with "Complete Later" option

3. **Create Subtype Selector Components**
   - `SubtypeSelector.tsx` - Modal/drawer for selecting subtypes
   - `SelectedSubtypesBox.tsx` - Display selected subtypes with remove option
   - `SubtypeCategoryTabs.tsx` - Financial, Marketing, Intellectual, Asset tabs

4. **State Management**
   - Create `useContributionWizard` hook for managing wizard state
   - Implement step navigation logic
   - Handle skip functionality for steps 5-13
   - Persist draft contributions to database

#### Success Metrics:
- Steps 1-4 render correctly on desktop and mobile
- Subtype selection works smoothly
- State persists across navigation
- "Complete Later" saves draft to database

---

### Phase 3: Conditional Steps 5-13 (Adder Integration) (Week 3-4)
**Goal:** Implement the 9 configurable steps that appear when subtypes are selected.

#### Tasks:
1. **Create Step Components (Steps 5-13)**
   - `Step5_Insights.tsx` - Insights Adder integration
   - `Step6_Valuation.tsx` - Valuation Adder integration
   - `Step7_FollowUp.tsx` - Follow-up Adder integration
   - `Step8_SmartRules.tsx` - Smart Rules Adder integration
   - `Step9_Ratings.tsx` - Ratings Adder integration
   - `Step10_Files.tsx` - Files Adder integration
   - `Step11_Knots.tsx` - Knots Adder integration
   - `Step12_Contributors.tsx` - Contributors Adder integration
   - `Step13_UsersAdmins.tsx` - Admin Users Adder integration

2. **Create Adder Components**
   - `InsightsAdder.tsx` - Configure custom insights per subtype
   - `ValuationAdder.tsx` - Fixed amount, formula, or custom rule
   - `FollowUpAdder.tsx` - Follow-up workflow configuration
   - `SmartRulesAdder.tsx` - Condition and action builder
   - `RatingsAdder.tsx` - Custom rating criteria (1-10 scale)
   - `FilesAdder.tsx` - File upload and attachment manager
   - `KnotsAdder.tsx` - Link to other timelines
   - `ContributorsAdder.tsx` - Invite and manage contributors
   - `AdminUsersAdder.tsx` - Role and permission management

3. **Conditional Rendering Logic**
   - Show steps 5-13 only when subtypes are selected in step 3
   - Organize steps by selected subtypes
   - Display "To Give" and "To Get" tabs for each step
   - Enable skip functionality for all steps 5-13

4. **Data Persistence**
   - Save adder configurations to respective database tables
   - Link all configurations to contribution_id and subtype_id
   - Support partial saves (when "Skip" is clicked)

#### Success Metrics:
- Steps 5-13 only appear after subtypes are selected
- All adders functional with proper data saving
- Skip functionality works for each step
- Configurations correctly linked to contribution and subtypes

---

### Phase 4: Negotiation System (Week 5)
**Goal:** Build the negotiation workflow between givers and receivers.

#### Tasks:
1. **Create Database Tables**
   - `negotiations` (id, contribution_id, initiator_id, status, created_at, updated_at)
   - `negotiation_proposals` (id, negotiation_id, proposer_id, field_name, proposed_value, status)
   - `negotiation_messages` (id, negotiation_id, sender_id, message, timestamp)
   - `negotiation_recordings` (id, negotiation_id, recording_url, type, duration)

2. **Build Negotiation UI**
   - `NegotiationAdder.tsx` - Main negotiation interface
   - `NegotiationDashboard.tsx` - View all active negotiations
   - `ProposalCard.tsx` - Display individual proposals with accept/reject/counter
   - `NegotiationChat.tsx` - In-app messaging within negotiation
   - `RecordingUploader.tsx` - Upload call/chat recordings as proof

3. **Implement Negotiation Logic**
   - Strict mode: receiver must accept or decline (no counter-offers)
   - Flexible mode: allow counter-proposals and iterative negotiation
   - Auto-match when giver and receiver setups align
   - Trigger negotiation when mismatches detected
   - Lock contribution settings once negotiation is "agreed"

4. **Real-time Updates**
   - Use Supabase real-time subscriptions for negotiation updates
   - Notify parties when proposals are made/accepted/rejected

#### Success Metrics:
- Negotiation triggered correctly on setup mismatch
- Proposals can be accepted, rejected, or countered
- Final agreement locks contribution settings
- Real-time updates working smoothly

---

### Phase 5: Timeline Tabs & Contribution Views (Week 6)
**Goal:** Create the timeline detail view with all contribution tabs.

#### Tasks:
1. **Create Timeline Detail Page**
   - `TimelineDetailView.tsx` - Main timeline page with tab navigation
   - Reorder tabs via drag-and-drop
   - Show/hide tabs based on configuration

2. **Implement Contribution Timeline Tabs**
   - `ContributionsInTab.tsx` - Sub-tabs: Received, Matched
   - `ContributionsOutTab.tsx` - List of given contributions
   - `InsightsTab.tsx` - View configured insights, organized by subtype
   - `FollowUpTab.tsx` - Follow-up logs and schedules
   - `ValuationTab.tsx` - Valuation breakdowns by subtype
   - `SmartRulesTab.tsx` - View and manage smart rules
   - `RatingsTab.tsx` - View ratings and reviews
   - `FilesTab.tsx` - Browse and manage files
   - `KnotsTab.tsx` - View linked timelines (knots)
   - `ContributorsTab.tsx` - Manage contributors and leads
   - `UsersTab.tsx` - Manage users and roles

3. **Create Contribution Cards**
   - `FinancialContributionCard.tsx` - Display financial contributions
   - `MarketingContributionCard.tsx` - Display marketing contributions
   - `IntellectualContributionCard.tsx` - Display intellectual contributions
   - `AssetContributionCard.tsx` - Display asset contributions
   - Customize based on subtype and expected outcomes

4. **Filtering and Sorting**
   - Filter contributions by type, status, date
   - Sort by date, amount, rating
   - Search across all contributions

#### Success Metrics:
- All tabs render with correct data
- Drag-and-drop reordering works
- Cards display contribution details correctly
- Filtering and sorting functional

---

### Phase 6: Payment Integration (Wallet) (Week 7)
**Goal:** Integrate payment processing for financial contributions.

#### Tasks:
1. **Create Database Tables**
   - `payment_methods` (id, user_id, type, provider, credentials, is_default)
   - `transactions` (id, contribution_id, payer_id, payee_id, amount, currency, status, provider, transaction_ref, timestamp)
   - `escrows` (id, transaction_id, amount, release_conditions, status, release_date)
   - `payouts` (id, timeline_id, recipient_id, amount, currency, status, payout_date)

2. **Build Wallet UI**
   - `WalletPage.tsx` - Main wallet dashboard
   - `PaymentMethodsManager.tsx` - Add/edit M-Pesa, cards, bank accounts
   - `TransactionHistory.tsx` - View all incoming/outgoing transactions
   - `EscrowManager.tsx` - View and manage escrow holds
   - `WithdrawModal.tsx` - Withdraw funds to bank/M-Pesa

3. **Integrate Payment Providers**
   - M-Pesa (Daraja API integration) via edge function
   - Card payments (Stripe or similar)
   - Bank transfers (Kenya banks APIs if available)
   - Create edge functions: `process-payment`, `mpesa-callback`, `release-escrow`

4. **Financial Contribution Flow**
   - When financial contribution is confirmed, trigger payment
   - Support recurring payments for subscriptions
   - Handle escrow releases based on smart rules
   - Process profit/revenue sharing distributions

#### Success Metrics:
- Payment methods can be added and managed
- Transactions processed successfully
- Escrows released per conditions
- Subscriptions auto-charge at intervals

---

### Phase 7: Marketing Channel Integrations (Week 8)
**Goal:** Integrate external APIs for marketing contribution tracking.

#### Tasks:
1. **Create Database Tables**
   - `channel_integrations` (id, user_id, channel, credentials, config, status)
   - `campaign_posts` (id, contribution_id, channel, post_id, post_url, created_at)
   - `campaign_outcomes` (id, post_id, outcome_type, value, timestamp)

2. **Build Integration UI**
   - `IntegrationsManager.tsx` - Add/manage API connections
   - `ChannelSelector.tsx` - Select channels when creating marketing contributions
   - `CampaignDashboard.tsx` - View outcomes from all channels

3. **Integrate Channels via Edge Functions**
   - Facebook/Instagram (Meta Graph API)
   - TikTok (TikTok Business API)
   - Google Ads (Google Ads API)
   - LinkedIn (LinkedIn Ads API)
   - Twitter/X (Twitter API)
   - YouTube (YouTube Data API)
   - Create edge functions: `sync-facebook-outcomes`, `sync-google-ads`, etc.

4. **ShonaCoin Native Posts**
   - Create native timeline posts for marketing contributions
   - Add CTA buttons (signup, download, subscribe)
   - Track outcomes natively (clicks, conversions)

5. **Outcome Consolidation**
   - Mirror external posts to ShonaCoin timeline
   - Aggregate outcomes from all channels
   - Display unified analytics in Insights tab

#### Success Metrics:
- API integrations working for major platforms
- Outcomes syncing correctly
- Native ShonaCoin posts trackable
- Unified analytics dashboard functional

---

### Phase 8: AI Assistant Integration (Week 9)
**Goal:** Integrate AI assistant to guide users through contribution procedures.

#### Tasks:
1. **Enable Lovable AI Gateway**
   - Use `ai_gateway--enable_ai_gateway` tool
   - Configure edge function with LOVABLE_API_KEY

2. **Create Assistant UI**
   - `AssistantChat.tsx` - Chat interface with AI
   - `AssistantSuggestions.tsx` - Contextual suggestions based on user actions
   - `AssistantOnboarding.tsx` - Guided onboarding flows

3. **Build AI Edge Functions**
   - `assistant-chat` - Handle AI conversations
   - `generate-contribution-suggestions` - Suggest contribution setups
   - `analyze-timeline` - Provide insights and recommendations

4. **Contextual AI Assistance**
   - Suggest subtypes based on user's timeline type
   - Auto-fill valuation formulas based on industry standards
   - Recommend smart rules based on contribution type
   - Generate follow-up templates

#### Success Metrics:
- AI assistant responds correctly to queries
- Suggestions are contextually relevant
- Auto-fill features save user time
- Onboarding flows are smooth

---

### Phase 9: Matching System (Week 10)
**Goal:** Build the system that matches givers with receivers based on aligned expectations.

#### Tasks:
1. **Create Database Tables**
   - `match_criteria` (id, contribution_id, criteria_type, value, weight)
   - `matches` (id, giver_contribution_id, receiver_contribution_id, score, status, created_at)
   - `match_history` (id, match_id, action, performed_by, timestamp)

2. **Build Matching Algorithm**
   - Score contributions based on aligned criteria (location, amount, timing, subtype)
   - Prioritize high-scoring matches
   - Filter out incompatible matches
   - Create edge function: `generate-matches`

3. **Build Matching UI**
   - `MatchedOpportunities.tsx` - View suggested matches
   - `MatchCard.tsx` - Display match details and score
   - `AcceptMatchModal.tsx` - Accept or decline match
   - `MatchFilters.tsx` - Filter matches by type, score, location

4. **Auto-Negotiation Trigger**
   - When match is accepted, trigger negotiation if needed
   - If aligned, skip directly to contribution confirmation

#### Success Metrics:
- Matches generated with relevant scores
- Users can accept/decline matches
- Negotiation triggered automatically when needed
- Filtering works correctly

---

### Phase 10: Advanced Features & Polish (Week 11-12)
**Goal:** Implement advanced features and polish the entire system.

#### Tasks:
1. **Smart Rules Engine**
   - Build rule executor edge function
   - Support scheduled triggers (time-based rules)
   - Support event-based triggers (on contribution completion, on payment received)
   - Execute actions: send notification, release escrow, trigger follow-up

2. **Outcome Sharing**
   - Implement parent-to-child timeline distribution rules
   - Support percentage-based and fixed-amount distributions
   - Automate payouts via smart rules
   - Track distribution history

3. **Knots System**
   - Allow timelines to be linked (merged or referenced)
   - Value-sharing between knotted timelines
   - Display knot relationships in timeline view

4. **Analytics & Reporting**
   - Build analytics dashboard for each timeline
   - Show contribution volume, conversion rates, ROI
   - Generate exportable reports
   - Provide trend analysis

5. **Notifications**
   - Real-time notifications for new contributions, matches, negotiations
   - Email/SMS notifications for important events
   - In-app notification center

6. **Mobile Optimization**
   - Ensure all modals become bottom drawers on mobile
   - Optimize touch gestures
   - Test on various screen sizes

7. **Testing & Bug Fixes**
   - End-to-end testing of contribution flows
   - Fix any bugs discovered
   - Performance optimization

#### Success Metrics:
- Smart rules execute correctly
- Outcome sharing distributes funds accurately
- Analytics provide valuable insights
- Notifications delivered reliably
- Mobile experience is smooth

---

## Success Criteria Summary

### Phase 1-2 (Foundation)
✅ Database schema complete and functional  
✅ Steps 1-4 of contribution wizard working  
✅ State management and persistence functional  

### Phase 3-4 (Core Features)
✅ Steps 5-13 conditional rendering working  
✅ All adders functional and saving data  
✅ Negotiation system operational  

### Phase 5-6 (Views & Payments)
✅ Timeline tabs displaying contributions correctly  
✅ Payment processing working for M-Pesa and cards  
✅ Wallet managing transactions accurately  

### Phase 7-8 (Integrations)
✅ Marketing channel APIs integrated  
✅ AI assistant providing helpful guidance  

### Phase 9-10 (Advanced)
✅ Matching system suggesting relevant opportunities  
✅ Smart rules executing automatically  
✅ Analytics providing valuable insights  
✅ Mobile experience optimized  

---

## Risk Mitigation

1. **API Rate Limits:** Implement caching and batch processing for external API calls
2. **Payment Security:** Use Supabase edge functions with proper encryption for sensitive data
3. **Complex Negotiation Logic:** Start with simple accept/reject, iterate to advanced features
4. **Performance:** Optimize database queries, use indexes, implement pagination
5. **User Confusion:** Provide clear tooltips, guided tours, and AI assistance throughout

---

## Next Steps

We'll start with **Phase 1: Foundation & Database Schema** in the next conversation. This involves creating all necessary database tables, RLS policies, and enums to support the contribution system.

**Ready to begin Phase 1?**
