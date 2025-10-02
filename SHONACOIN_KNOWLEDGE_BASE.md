# ShonaCoin Knowledge Base Reference

This document serves as the **single source of truth** for all ShonaCoin implementation work.

---

## Table of Contents

1. [Usability Prompt](#usabilityprompt)
2. [Contribution Types and Subtypes](#contributiontypesandsubtypes)
3. [Presentation UI Styles](#presentationuistyles)
4. [Shared Contribution Steps Setup](#sharedcontributionstepssetup)
5. [Contributions Rules](#contributionsrules)
6. [Flexible Give/Receive Procedure Steps Setup](#flexiblegivereceiveprocedurestepssetup)
7. [Add Contribution Procedure](#addcontributionprocedure)
8. [Payments Processing](#paymentsprocessing)
9. [Contribution Timeline Tabs](#contributiontimelinetabs)
10. [Reusable Features (Adders)](#reusablefeatures)
11. [Main Pages Navigation](#main-pages-app-navigation)
12. [Financial Contributions](#financial-contributions)
13. [Marketing/Networking Contributions](#marketingnetworking-contributions)
14. [Asset Contributions](#asset-contributions)
15. [Advanced Contributions Rules](#advanced-contributionsrules)
16. [Adders Framework](#adders-framework)

---

<a name="usabilityprompt"></a>
## #UsabilityPrompt

1. Always make everything highly responsive to all screen sizes and gestures and perfectly aligned with margins, paddings, spacing and fontings.
2. Always make pages, modal, popovers and bottom drawers responsive and well adapted to screen sizes, use modals on desktop and bottom drawers on mobile and small screens and pages where navigation demand effectively for effective flow of procedures and navigation. Avoid double or nested action on clicks especially on components with multiple buttons or actions to be taken.
3. Always ensure inputs and gestures are highly responsive and working effectively everywhere.
4. Effectively use colors and them reducing color noise and keep the whole experience comfortable to the eye.
5. Keep use of sounds and haptics with ability to control them in settings.
6. Use less code to achieve the most and reuse features and components effectively for heavy usage.

**Important:** ALWAYS CONSIDER #ContributionRules, custom #Adders listed, #ContributionProcedure as defined all contributions types alignment as defined below.

---

<a name="contributiontypesandsubtypes"></a>
## #ContributionTypesAndSubtypes

### 1. Financial Contributions
**Purpose:** Give and receive financial contributions, and configure how to give and receive them. Set valuation, follow-up procedures, insights, matching, and outcome sharing for each subtype.

**Subtypes:**
- Cash
- Debt
- Equity share
- Revenue share
- Profit share
- Pledges

### 2. Marketing, Networking, and Advertising Contributions
**Purpose:** Give and receive marketing contributions, and configure how to give and receive them. Set valuation, follow-up, insights, matching, and outcome sharing for each subtype.

**Subtypes & Features:**

**A. Leads Onboarding**
- Setup: Configure how to receive or give leads by multi-selecting expected contribution options
- Outcomes: Comments, likes, views, clicks, shares, follower gains, link traffic, signups, downloads, subscriptions, calls, messages, mentions, introductions, referrals, awareness, watch time, read time
- Measurement: Capture new and repeat views, traffic, mentions, calls, clicks, and shares
- Channels: All social networks, Google Ads, ShonaCoin timeline posts, third-party software/app APIs, billboards (#onbillboardtoo), TV and radio references, personal introductions

**B. Leads Follow-up**
- Configure follow-ups as contributions using shared contribution features

**C. Leads Conversion**
- Define conversion triggers (signup, payment, contribution, follow-up stage)
- Configure conversion as a contribution with shared features

**D. Leads Retention**
- Configure retention as a contribution with shared features
- Can accept other contributions as sub-contributions

### 3. Intellectual Contributions
**Purpose:** Give and receive intellectual contributions. Set valuation, follow-up, insights, matching, and outcome sharing.

**Subtypes:**
- Coaching and tutoring
- Project development
- Project planning
- Mentorship and counseling programs
- Consultation
- Research
- Perspectives and strategies
- Customer support
- Capacity building

### 4. Asset Contributions
**Purpose:** Give and receive asset contributions. Set valuation, follow-up, insights, matching, and outcome sharing.

**Subtypes:**
- Farm tools
- Land
- Livestock
- Seeds
- Construction tools and machinery
- Houses, rooms, and buildings
- Office tools
- Office spaces
- Digital assets (hosting resources, domains, tokens, NFTs, etc.)
- Software (apps, AI tools, agents)
- Data assets
- Vehicles and trucks
- Other custom options (set using the custom inputs adder)

---

<a name="presentationuistyles"></a>
## #PresentationUIStyles

There are **four highly customizable timeline presentation card types** for Financial, Intellectual, Marketing, and Asset contributions. Each card has custom elements, details, and action buttons based on expected outcomes set during subtype configuration.

- Cards must be **reusable, flexible, and consistent** in style to build familiarity
- Cards are used to preview contributions before publishing
- Additional custom cards for contacts and other contribution subtypes
- Allow user to customize details and actions on each card from available options

---

<a name="sharedcontributionstepssetup"></a>
## #SharedContributionStepsSetup

**Important:** Use the **negotiation adder** effectively to negotiate and confirm setup between giver and receiver. Giver or receiver can set custom steps and negotiate with each other, or a party can strictly set them for full control (the other party may only accept or request negotiation). Leverage the timeline structure and schema properties to configure these options.

**Custom setup options (examples):**
- Expected contributions (to give and to get) tab
- Valuation
- Insights
- Files
- Follow-up
- Knots
- Smart rules
- Ratings
- Contributors
- Admin users

---

<a name="contributionsrules"></a>
## #ContributionsRules

**Important rules and behaviors:**

1. There are four **#ContributionTypes**: financial, intellectual, network/marketing, and assets (physical/digital), each with defined subtypes.

2. For each subtype, contributors (giver and receiver) can:
   - Configure how to give
   - Configure how to receive
   - Receive contributions as configured
   - Give contributions as configured

3. Contributors can configure these options alone or together using the **negotiation adder**.

4. A giver can set custom requirements for giving; the receiver may align or negotiate. A receiver can set custom requirements for receiving; the giver may align or negotiate.

5. A subtype setup can be reused as a template in other contribution subtypes if agreed.

6. Any contribution subtype can be an expected outcome of any other subtype and can reuse custom setups. Use the negotiation adder when two parties must agree on setup.

7. Subtypes retain references for aggregated analysis and referencing from the root timeline.

8. Each subtype should provide custom procedure steps for setup and allow adding new custom fields using **#CustomInputsFieldsAdder**, with defaults where applicable.

9. A user can use a timeline alone to set how they give, receive, access, browse, and manage contributions and logs.

10. A user can use a timeline with others and negotiate or agree on how to give and receive contributions using the negotiation adder during setup.

11. Contributors can set permissions for viewing contributions in shared contexts (e.g., only me, all members, paying members only, non-paying members, public).

12. Support nested browsing when a contribution accepts sub-contributions; allow contributors to receive contributions from others to fulfill parent timeline expectations.

13. Opened contributions must expose **#ContributionTimelineTabs** according to configured features and permissions.

14. Custom valuation, insights, follow-ups, ratings, knots, smart rules, files, users, and contributors can be applied per-subtype or grouped when configuring how to give or receive.

15. Contributions may optionally follow or negotiate the default **#SharedContributionStepsSetup**.

16. For financial contributions, include durations, interest rates where applicable, distribution rules (parent to child or child to parent), and options to exclude specific subtimelines from distribution rules.

---

<a name="flexiblegiverecieveprocedurestepssetup"></a>
## #FlexibleGiveReceiveProcedureStepsSetup

**Purpose:** Support custom subtypes not listed or implemented. Allow highly custom configurations using **#CustomInputsFieldsAdder** (add input fields) and **#CustomApiAdder** (link APIs and test).

**Guidelines:**
- Provide default adders to keep procedures within expected scope
- Position configuration so AI can be trained to actualize procedures
- Ensure negotiation adder flow supports both simple and advanced collaboration patterns
- Allow step-by-step progressive definitions in horizontal or vertical slides
- Preview how the setup looks to the other party when published

---

<a name="addcontributionprocedure"></a>
## #AddContributionProcedure

### UI Structure
- **Header:** Contribution title
- **Body:** Contribution steps
- **Sticky Footer:** Shared control buttons (Next, Prev, Skip, Complete) and progress indicator

### Launch
Click the **Contribute button** on a timeline to launch #contributionsAdder in a full page (or modal/drawer as appropriate).

### Step Flow (13 Steps Total)

**Steps 1-4: Always Visible (Initial Setup)**

**Step 1: Confirm Subscription Access**
- If the contribution requires a subscription, confirm access first

**Step 2: Single Contribution vs Timeline Toggle**
- Toggle: contribute as a single contribution or as a timeline
- If timeline is enabled:
  - Enter optional title, description
  - Select timeline types the contribution can accept or hold (personal, profile/contact, project, financial, intellectual, etc.)

**Step 3: Expected Contributions - Two Tabs View**
- **"To give" tab** and **"To receive" tab**
- Each tab starts with an empty **#selectedSubtypesBox**
- Use "Select contribution" button to open modal/drawer and pick subtypes (financial, marketing, intellectual, assets)
- Multiple subtypes can be set in both "To give" and "To receive"
- At the bottom: **Complete later toggle** (disabled by default)
- If Complete later is enabled, user can save and return later

**Step 4: Save and Continue**
- On clicking Next: save to database and push the contribution to the selected timeline's contributions tab
- If Complete later is enabled: close the adder and open the saved contribution timeline to continue later
- Each added subtype becomes a sub-timeline/sub-contribution

---

**Steps 5-13: Conditional (Only When Subtypes Selected) - All Skippable**

These steps are organized by the selected subtypes in the **#selectedSubtypesBox**. Each step displays:
- Title
- Short description
- Two tabs: **"To give"** and **"To get"**

**Step 5: Expected Insights**
- Configure insights per selected subtype using the **insights adder**
- List and section insights by subtype

**Step 6: Expected Valuation**
- Configure valuation per subtype using the **valuation adder**
- Include breakdowns and totals for the timeline

**Step 7: Expected Follow-up Setup**
- Configure follow-up flows per subtype using the **follow-up adder**

**Step 8: Smart Rules**
- Configure executable conditions per subtype using the **smart rules adder**

**Step 9: Custom Ratings**
- Set rating schemes per subtype using the **ratings adder**

**Step 10: Expected Files**
- Attach and configure file expectations using the **files adder**

**Step 11: Expected Knots**
- Configure knots (knowledge nodes) per subtype using the **knots adder**

**Step 12: Expected Contributors**
- Configure contributors and their access rights using the **contributors adder**
- Options: me only, all members, subscribed members, public

**Step 13: Users and Admins**
- Configure user and admin roles per subtype using the **admin users adder**

### Additional Behaviors
- Load and present these steps from the database
- Allow reordering via drag-and-drop and persist the saved state
- Negotiation occurs in negotiation adders and updates subtype configurations accordingly

---

<a name="paymentsprocessing"></a>
## #PaymentsProcessing

Where applicable, payment flows are configured in the **wallet** and used when processing is required to receive or give contributions.

**Supported payment types:**
- **M-Pesa:** Shared M-Pesa integration (Daraja API)
- **Card / Bank APIs:** KCB, Equity, NCBA, or other major banks with APIs

**Considerations:**
- Callbacks sent to ShonaCoin user profile endpoint and any webhook endpoints provided by user
- Reuse wallet setup in financial contributions
- Wallet logs all transaction statuses
- Support sandbox and live modes with setup guides
- Timelines hold transactions related to their contribution subtypes
- Provide summaries of transactions in and out per card and M-Pesa setup
- Keep payment flows simple and reliable

---

<a name="contributiontimelinetabs"></a>
## #ContributionTimelineTabs

Tabs can be reordered by drag-and-drop. Tabs are visible only if configured. Tabs expose relevant adders when allowed by the receiver.

**Suggested tabs (examples):**
- **Contributions In** (with sub-tabs: Received and Matched)
- **Contributions Out** (list expected or already-given contributions)
- **Insights** (organized by contributed subtypes)
- **Follow-up** (logs and setup, organized by subtypes)
- **Valuation** (organized by subtypes)
- **Smart Rules** (executable conditions for contribution/sub-timelines)
- **Rating** (custom ratings and reviews linked with negotiation)
- **Files** (linked files)
- **Knots** (linked timelines or attachments, organized by subtypes)
- **Contributors** (list and manage contributors/leads)
- **Users** (link and manage timeline users and roles)

---

<a name="reusablefeatures"></a>
## #ReusableFeatures

### Contribution Adder
Launches a modal (desktop) or bottom drawer (mobile) to add a contribution or sub-contributions to a timeline. Follows **#AddContributionProcedure** UI and behavior.

### Negotiation Adder
Any subtype setup step can tie into the negotiation adder to negotiate variables between giver and receiver. Features:
- Define custom negotiation steps/statuses with title, description, and smart rule conditions
- Both receiver and giver can grant permissions to use the negotiation adder
- Support in-app call and live-chat recordings with ability to export conversations
- Allow negotiation over all **#SharedContributionStepsSetup** fields

### Valuation Adder
Launches in a bottom drawer (mobile) or modal (desktop) for contributors to add or suggest valuations and negotiate. Includes:
- Timeline summary
- Valuation type selection: Fixed amount (suggested token/amount tags or direct entry), or Custom formula/rule (e.g., $10/lead)
- Available in giving and receiving procedures as a configured step

### Rating Adder
Configure custom rating schemes and apply ratings (1–10) with optional comments/reviews. Features:
- Launch in modal (desktop) or bottom drawer (mobile)
- Allow contributors to suggest rating options for approval
- Parent timeline aggregates average scores and provides distribution reports

### Insights Adder
Configure and request custom reports from the timeline schema, APIs, or uploaded reports. Use negotiation to agree on expected insights. Added insights appear dynamically in the Insights tab and support likes to measure usefulness.

### Knots Adder
Add knots (merges or portions) into a timeline to share value or link related timelines.

### Files Adder
Add and link files with previews and playback into timeline/contribution files tabs. Files can be organized and searched through nested timelines.

### Follow-ups Adder
Configure follow-up statuses and manage follow-up workflows within a timeline. Useful for lead processing.

### Smart Rules Adder
Define executable conditions and behaviors that run automatically when conditions are met.

### Contributors Adder
Invite, add, and manage contributors to a timeline.

### Subscriptions Adder
Configure recurring cash contributions as subscriptions. Define a checklist of subscriber expectations, amounts, and durations. Track subscriptions as revenue and share according to timeline settings.

### Custom Fields Adder
Add custom input fields, custom API adders, labels, paragraphs, and headings. Default inputs: title and description.

---

<a name="main-pages-app-navigation"></a>
## Main Pages (App Navigation)

- **Portfolio:** Root timeline (profile timeline) and entrypoint
- **Assistant:** AI assistant chat for new conversations, intents, and procedures
- **Wallet:** Payment processing, collective transactions, withdrawals, and gains management
- **Profile:** Profile information, authentication, summary of timelines and contributions, logout
- **Timeline view:** View a timeline with summary, tabs, and features
- **Contribute:** Contribution procedure screens (follows #AddContributionProcedure)
- **Onboarding:** On-boarding flow with persistent About and Assistant buttons

**Notes & Localization:**
- Complete assistant integration after core features and pages are implemented
- Language settings: English, Swahili, Hindi, Arabic, and the five most popular additional languages (configurable)

---

<a name="financial-contributions"></a>
## 💰 Financial Contributions – Structure & Alignment

Financial contributions follow the same **#ContributionRules**, **#Adders**, **#ContributionProcedures**, and **#PaymentProcessor**.

**Purpose:** Enable contributors (givers & receivers) to give and receive financial value in flexible formats (one-time, recurring, investment, credit, pooled funding).

### 🔹 1. Direct Cash (One-time Payments)
- **For Givers:** Configure payment method, amount, currency, distribution rules
- **For Receivers:** Align on accepted payment channels, conversion currency, settlement frequency
- **Timeline Schema:** Logs transaction_id, amount, currency, channel, giver_id, receiver_id, timestamp, status

### 🔹 2. Subscriptions (Recurring Contributions)
- **For Givers:** Configure recurring payment plan (weekly, monthly, quarterly)
- **For Receivers:** Align expected deliverables per cycle
- **Timeline Schema:** Logs subscription_id, start_date, interval, next_due, fulfilled_deliverables

### 🔹 3. Loans / Credit Contributions
- **For Givers (Lenders):** Define loan type, principal, interest rate, repayment schedule
- **For Receivers (Borrowers):** Align repayment structure and reporting obligations
- **Timeline Schema:** Logs loan_id, principal, interest, repayment_due_dates, paid_amounts

### 🔹 4. Equity / Investment Contributions
- **For Givers (Investors):** Configure equity type (revenue share, equity %, tokenized shares)
- **For Receivers (Founders/Projects):** Align on valuation, rights, reporting frequency
- **Timeline Schema:** Logs investment_id, %ownership, entry_valuation, exit_triggers, distributions

### 🔹 5. Revenue-Sharing / Profit Split
- **For Givers:** Define contribution model (e.g., 20% of monthly revenue)
- **For Receivers:** Align distribution frequency, proof-of-revenue sources
- **Timeline Schema:** Logs revenue_id, gross_revenue, split %, distribution logs

### 🔹 6. Pooled / Crowdfunding Contributions
- **For Givers:** Join a pool with fixed or flexible contribution
- **For Receivers:** Align on usage of funds
- **Timeline Schema:** Logs pool_id, contributors_list, target, raised, refund_rules

### 🔹 7. Grants / Donations
- **For Givers:** Contribute freely with or without expectations
- **For Receivers:** Align only on visibility & reporting transparency
- **Timeline Schema:** Logs grant_id, donor, amount, conditions

---

<a name="marketingnetworking-contributions"></a>
## 📌 Marketing / Networking / Advertising Contributions

**Purpose:** Enable contributors to give or receive marketing/networking efforts in standardized or custom ways.

### 🔹 Subtype A: Leads Onboarding
- **Giver setup:** Define how they will provide leads (ads, referrals, mentions, APIs, traffic)
- **Receiver setup:** Define how they want to receive leads (manual uploads, API integration, ShonaCoin posts)
- **Outcomes:** Comments, likes, shares, clicks, link traffic, subscriptions, calls, messages
- **Channels:** Facebook Ads, Instagram, TikTok, LinkedIn, Google Ads, ShonaCoin posts, billboards

### 🔹 Subtype B: Leads Follow-up
- **Giver setup:** Provide follow-ups as scheduled messages, calls, or nudges
- **Receiver setup:** Configure how they expect follow-ups (frequency, channel, automation)

### 🔹 Subtype C: Leads Conversion
- **Giver setup:** Define what counts as conversion (purchase, signup, deposit)
- **Receiver setup:** Define how conversion data should be captured (API callback, manual confirmation)

### 🔹 Subtype D: Leads Retention
- **Giver setup:** Define retention actions (discounts, loyalty campaigns, reactivation ads)
- **Receiver setup:** Configure expected metrics (retention period, repeat actions, renewals)

### 🔹 Channel Integrations
- **Social Networks:** Facebook, Instagram, TikTok, LinkedIn, Twitter/X, YouTube
- **Google Ads / Search / Display**
- **Billboards / Outdoor Ads (#onbillboardtoo)**
- **TV & Radio Mentions**
- **ShonaCoin Native Timeline Posts**
- **Websites & Apps (Custom Integrations)**

---

<a name="asset-contributions"></a>
## Asset Contributions

All asset subtypes follow the same give/receive/negotiation/fulfillment cycle with custom setup fields per subtype but governed by **#ContributionRules** and **#SharedContributionStepsSetup**.

### Asset Subtypes:
1. **Farm tools** (implements, hand tools, tractors, irrigation kits)
2. **Land** (leases/sales, require title & geodata)
3. **Livestock** (animal transfers, vet certificates required)
4. **Seeds** (batch quality & germination guarantees)
5. **Construction tools and machinery** (operator certification & insurance)
6. **Houses, rooms, buildings** (tenancy terms, deposits, inspection)
7. **Office tools & Office spaces** (booking, hotdesk rules, access control)
8. **Digital assets** (hosting resources, domains, tokens, NFTs) - credential transfer & license terms
9. **Software** (apps, AI tools, agents) - deliverables, acceptance tests, SLAs
10. **Data assets** (schema, privacy, provenance)
11. **Vehicles & trucks** (odometer, insurance, driver logs)
12. **Other custom options** (use #CustomInputsFieldsAdder & #CustomApiAdder)

### Asset Procedure Flow:
**A) Set to RECEIVE** → **B) Set to GIVE** → **C) Negotiation & Alignment** → **D) Actual Receiving** → **E) Actual Giving**

---

<a name="advanced-contributionsrules"></a>
## ⚖️ Advanced #ContributionsRules

### 1. Contribution Types & Subtypes
- Four default types: Financial, Intellectual, Network/Marketing, Assets
- Custom subtypes can be created and treated as first-class citizens

### 2. Configurable Giving & Receiving
- Contributors can configure how to give and receive for every subtype
- Negotiation Adder invoked when giver/receiver settings differ

### 3. Alignment & Negotiation
- System auto-matches aligned setups
- Triggers Negotiation Adder on mismatch

### 4. Templates & Reusability
- Subtype setups can be saved as reusable templates
- Templates can be shared between contributors if allowed

### 5. Cross-Subtype Outcome Flow
- Any subtype can be the expected outcome of another subtype

### 6. Referencing & Aggregation
- All subtypes retain references to parent timeline, child/sub-contributions, and related knots

### 7. Custom Procedure Steps
- Every subtype can declare its own procedure steps
- Can extend with custom fields or reuse steps from other subtypes

### 8. Solo & Collaborative Use
- Solo mode: user sets up independently
- Collaborative mode: multiple contributors negotiate

### 9. Permissions & Visibility
- Contributors define visibility rules (only me, all members, paying members, public)

### 10. Nested Browsing & Sub-Contributions
- Contributions can contain sub-contributions (mini-timelines)

---

<a name="adders-framework"></a>
## #Adders

Each **Adder** is:
- Modal (desktop) / Bottom drawer (mobile) UI
- Schema-driven: auto-fills defaults per subtype
- Reusable hooks: can be launched from any #AddContributionProcedure step
- Negotiation-ready: integrates with Negotiation Adder
- Outcome-shared: affects valuation, tracking, ratings, and reporting

### 1. Contribution Adder
Add a new contribution or sub-contributions to a timeline. Parent of all other adders.

### 2. Negotiation Adder
Structured negotiation system between giver & receiver. Variables include all #SharedContributionStepsSetup fields.

### 3. Valuation Adder
Suggest or apply valuations. Types: Fixed Amount, Formula, Rule-Based.

### 4. Rating Adder
Apply qualitative/quantitative ratings (1-10 scale, customizable).

### 5. Insights Adder
Add or request analytical insights from timeline schema, API, or uploaded report.

### 6. Knots Adder
Link or merge related timelines.

### 7. Files Adder
Attach/manage files inside timeline with auto-preview.

### 8. Follow-ups Adder
Manage follow-up tasks/statuses.

### 9. Smart Rules Adder
Automate behaviors inside timelines with conditions and actions.

### 10. Contributors Adder
Invite, add, and manage collaborators.

### 11. Subscriptions Adder
Configure recurring contributions with amount, frequency, duration.

### 12. Custom Fields Adder
Extend any adder with custom inputs.

---

## End of Knowledge Base

This reference document contains all the knowledge needed to implement ShonaCoin's contribution system correctly.
