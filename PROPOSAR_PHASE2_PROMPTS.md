# PROPOSAR — PHASE 2 BUILD PROMPTS
## Smart Follow-Up + WhatsApp + Chase Sequence + Analytics
## Co-founder verified. Build in order. Screenshot after each.

---

# ════════════════════════════════════
# PROMPT A — WHATSAPP SEND BUTTON
# ════════════════════════════════════

```
Add WhatsApp sharing to the Proposar proposal send flow.

This is a one-click button that opens WhatsApp with a pre-written 
message containing the proposal link — no API needed, uses wa.me.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 1 — SHARE MODAL WHATSAPP TAB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update components/proposal/ShareModal.tsx to have 3 tabs:
Tab 1: Email (existing)
Tab 2: WhatsApp (NEW)
Tab 3: Copy Link (existing)

WHATSAPP TAB UI:

Phone number input:
Label: "Client's WhatsApp number"
Placeholder: "+1 234 567 8900"
Help text: "Include country code. USA: +1, UK: +44, AUS: +61, India: +91"
Pre-fill from client.phone if available.

Message preview (editable textarea):
Default message auto-generated:
"Hi [ClientName] 👋

I've put together a proposal for [ProjectTitle].

You can view it here:
[ProposalLink]

It covers:
- [First deliverable from proposal]
- [Second deliverable]
- Total investment: [Currency][Amount]

Happy to answer any questions. Looking forward to working together!

[YourName]
[YourBusiness]"

Two buttons:
PRIMARY: "Open WhatsApp →" 
  → Opens: https://wa.me/[phone]?text=[encodeURIComponent(message)]
  → Opens WhatsApp Web or WhatsApp app on mobile
  → Proposal status updated to 'sent' in Supabase

SECONDARY: "Copy Message"
  → Copies the message text to clipboard
  → User can paste manually

Below buttons:
Small note: "This opens WhatsApp. Your message is pre-written — 
just hit send."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 2 — WHATSAPP BUTTON ON PROPOSAL LIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In app/(dashboard)/proposals/page.tsx proposal table/list:
Add WhatsApp icon button per row (green WhatsApp icon).
On click → opens ShareModal directly on WhatsApp tab.
Tooltip: "Send via WhatsApp"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 3 — WHATSAPP FOLLOW-UP TEMPLATES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In the follow-up reminder emails sent to freelancers 
(when client hasn't responded), add a WhatsApp section:

"📱 Send a WhatsApp nudge:"
Show a pre-written WhatsApp message they can copy:

Day 3 template:
"Hi [Name], just checking you had a chance to look at 
the proposal I sent? Happy to answer any questions 🙂
[Link]"

Day 7 template:
"Hey [Name], I wanted to follow up on the proposal. 
Is this still something you'd like to move forward with? 
[Link]"

Day 14 template:
"Hi [Name], the proposal expires in 48 hours. 
Let me know if you'd like to proceed or if the 
timing doesn't work right now. [Link]"

Add "Copy for WhatsApp" button next to each template.
These appear in:
1. Follow-up reminder emails (as a section at bottom)
2. The proposal detail page sidebar
3. Dashboard "Needs Follow-up" section
```

---

# ════════════════════════════════════
# PROMPT B — SMART CHASE SEQUENCE
# ════════════════════════════════════

```
Build the complete smart follow-up chase sequence for Proposar.
This is our #1 differentiator vs all competitors.

When a proposal is sent, Proposar automatically schedules a 
4-step follow-up sequence. Each step is AI-personalised.
User can pause, edit, or cancel the sequence anytime.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 1 — DATABASE MIGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create: supabase/migrations/007_chase_sequence.sql

CREATE TABLE follow_up_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active', -- active | paused | completed | cancelled
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE follow_up_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID REFERENCES follow_up_sequences(id) ON DELETE CASCADE,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL, -- 1, 2, 3, 4
  day_offset INTEGER NOT NULL,  -- 3, 7, 14, 21
  status TEXT DEFAULT 'scheduled', -- scheduled | sent | skipped | cancelled
  channel TEXT DEFAULT 'email',    -- email | whatsapp_suggestion
  subject TEXT,
  body TEXT,
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  opened BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE proposals 
  ADD COLUMN IF NOT EXISTS sequence_active BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sequence_paused BOOLEAN DEFAULT FALSE;

RLS on both tables: users manage own sequences only.
Indexes: on proposal_id, sequence_id, scheduled_for, status.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 2 — SEQUENCE CREATION API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create: app/api/proposals/[id]/sequence/route.ts

POST — Create/activate sequence for a proposal:

Logic:
1. Check if sequence already exists for this proposal
2. Generate all 4 follow-up email bodies using Claude API
3. Insert follow_up_sequences row
4. Insert 4 follow_up_steps rows with scheduled dates:
   - Step 1: sent_at + 3 days (if not opened)
   - Step 2: sent_at + 7 days (if no response)
   - Step 3: sent_at + 14 days (re-engagement)
   - Step 4: sent_at + 21 days (final nudge + expiry warning)
5. Update proposal.sequence_active = true

AI GENERATION for each step (call Claude API):

System prompt:
"You are writing follow-up emails for a freelancer 
chasing a client who hasn't responded to a proposal.
Write short, warm, non-pushy emails that get replies.
Never sound desperate. Always sound confident and busy.
Maximum 4 sentences per email."

Step 1 (Day 3) prompt:
"Write a short follow-up email from [FreelancerName] to [ClientName]
about a proposal for [ProjectType] worth [Currency][Amount].
The client hasn't opened it yet. Be casual and check if it arrived.
Subject line first, then email body."

Step 2 (Day 7) prompt:
"Write a follow-up email from [FreelancerName] to [ClientName].
They sent a proposal 7 days ago. Client hasn't responded.
Acknowledge they're probably busy. Offer to answer questions.
Include a 3-bullet summary of what's included.
Subject line first, then email body."

Step 3 (Day 14) prompt:
"Write a re-engagement email from [FreelancerName] to [ClientName].
2 weeks since proposal. No response. Be brief and direct.
Ask a simple yes/no question: 'Is this still something 
you'd like to explore?' Give them an easy out if timing is bad.
Subject line first, then email body."

Step 4 (Day 21) prompt:
"Write a final follow-up email. It's been 3 weeks.
Create gentle urgency — proposal expires soon.
Keep it 2 sentences max. No hard sell.
Make it easy to reply with just one word.
Subject line first, then email body."

PATCH — Pause/resume sequence:
Updates follow_up_sequences.status = 'paused' or 'active'

DELETE — Cancel sequence:
Updates all scheduled steps to 'cancelled'
Updates proposal.sequence_active = false

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 3 — SEQUENCE CRON JOB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update: app/api/emails/follow-up/route.ts

Add this query at the TOP of the existing cron:

// SMART SEQUENCE STEPS
const now = new Date()
const { data: dueSteps } = await supabase
  .from('follow_up_steps')
  .select(`
    *,
    proposals (
      id, title, share_id, client_name, client_email,
      project_type, budget_amount, budget_currency,
      status, generated_content
    ),
    follow_up_sequences (status)
  `)
  .eq('status', 'scheduled')
  .eq('channel', 'email')
  .eq('follow_up_sequences.status', 'active')
  .lte('scheduled_for', now.toISOString())
  .neq('proposals.status', 'accepted')
  .neq('proposals.status', 'declined')

For each due step:
1. Skip if proposal already accepted/declined → mark step 'skipped'
2. Skip if sequence is paused → do nothing
3. Send the email using Resend
4. Update step.status = 'sent', step.sent_at = now
5. If this was step 4 → mark sequence as 'completed'

EMAIL FORMAT for sequence steps:
- Clean, minimal — no heavy HTML, reads like a personal email
- Plain text feel (not marketing email look)
- No Proposar logo in these (looks like direct email from freelancer)
- Reply-to: freelancer's email
- From: freelancer's name <hello@proposar.com>
- Unsubscribe link at very bottom (tiny, GDPR)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 4 — SEQUENCE UI IN DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update components/proposal/ShareModal.tsx:

After email is sent successfully, show a NEW step:
"🔔 Set up auto follow-ups?"

Card showing:
"Proposar will automatically follow up with [ClientName] 
if they don't respond:"

Timeline visual:
Day 0  ● Proposal sent (now)
Day 3  ○ "Hey, did you get a chance to look at this?"
Day 7  ○ "Quick summary of what's included..."
Day 14 ○ "Is this still something you'd like to explore?"
Day 21 ○ "Final reminder — proposal expires soon"

Toggle: "Enable smart follow-ups" (ON by default for Pro/Agency)
"Emails stop automatically if client responds or accepts."

[Activate Sequence] button → calls POST /api/proposals/[id]/sequence
[Skip] link → closes without activating

Update Proposal Detail Page (app/(dashboard)/proposals/[id]/page.tsx):

Add "Follow-Up Sequence" sidebar panel showing:
- Sequence status: Active / Paused / Completed / Not started
- Timeline of all 4 steps with status indicators:
  ✅ Step 1 sent (Day 3) — Opened ✓
  🕐 Step 2 scheduled (Day 7) — Sends in 2 days
  ⏸ Step 3 paused
  ○ Step 4 not sent yet
- [Pause Sequence] button
- [Cancel Sequence] button  
- [Edit Step] — lets user edit the AI-generated email before it sends
- [Send Now] — skip the scheduled date and send immediately

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 5 — SMART SKIP LOGIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The sequence must STOP automatically when:
1. Proposal status changes to 'accepted' → cancel all remaining steps
2. Proposal status changes to 'declined' → cancel all remaining steps
3. Proposal is viewed after a step is sent → skip next step 
   (they're reading it, give them space)
4. User manually pauses → hold all future steps
5. User cancels sequence → mark all remaining as 'cancelled'

Add database triggers:
CREATE OR REPLACE FUNCTION cancel_sequence_on_close()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('accepted', 'declined') THEN
    UPDATE follow_up_steps 
    SET status = 'cancelled'
    WHERE proposal_id = NEW.id 
    AND status = 'scheduled';
    
    UPDATE follow_up_sequences
    SET status = 'completed'
    WHERE proposal_id = NEW.id
    AND status = 'active';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_cancel_sequence
  AFTER UPDATE OF status ON proposals
  FOR EACH ROW EXECUTE FUNCTION cancel_sequence_on_close();
```

---

# ════════════════════════════════════
# PROMPT C — WIN RATE ANALYTICS DASHBOARD
# ════════════════════════════════════

```
Build the Win Rate Analytics page for Proposar.
This helps freelancers understand what's working and repeat it.

Route: app/(dashboard)/analytics/page.tsx
Add to sidebar nav: 📈 Analytics (between Clients and Settings)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 1 — DATABASE QUERIES NEEDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All queries filter by user_id and date range (last 30/90/180 days).

Query 1: Overall stats
- Total proposals sent
- Total accepted
- Total declined
- Total pending
- Overall win rate %
- Average time to close (accepted_at - sent_at in days)
- Total value won ($)
- Average deal size ($)

Query 2: Win rate by project type
- GROUP BY project_type
- Count sent, accepted, win_rate per type

Query 3: Win rate by tone
- GROUP BY tone
- Count sent, accepted, win_rate per tone

Query 4: Win rate by budget range
- Bucket budgets: <$500 | $500-$2k | $2k-$5k | $5k-$10k | $10k+
- Win rate per bucket

Query 5: Best day to send
- GROUP BY day_of_week(sent_at)
- Win rate per day (Mon-Sun)

Query 6: Follow-up impact
- Proposals won WITHOUT follow-up vs WITH follow-up
- Win rate comparison

Query 7: Time to close distribution
- Average days per status
- Fastest close, slowest close, median

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 2 — ANALYTICS PAGE UI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE HEADER:
Title: "Analytics"
Subtitle: "Understand what wins. Do more of it."
Date range selector: Last 30 days | 90 days | 6 months | All time

ROW 1 — TOP STATS (5 cards):
1. Win Rate: Large % with trend arrow vs previous period
2. Total Won: $ amount
3. Proposals Sent: count
4. Avg Deal Size: $
5. Avg Days to Close: number

ROW 2 — TWO CHARTS side by side:

Chart 1 (left): "Win Rate Over Time" (line chart)
- X axis: weeks/months
- Y axis: win rate %
- Shows trend line
- Tooltip: "Week of March 3: 67% win rate (4 of 6)"

Chart 2 (right): "Proposals by Status" (donut chart)
- Accepted (green) | Pending (yellow) | Declined (red) | Expired (gray)
- Center: total sent count
- Legend with counts and %

ROW 3 — INSIGHTS CARDS (gold-bordered, special section):
Title: "💡 What's Working For You"
AI-generated insights based on the data:

Show 3 insight cards:

Insight 1 (best project type):
"Your [Web Design] proposals have a [72%] win rate —
higher than any other project type.
Send more of these."
[Create Web Design Proposal →]

Insight 2 (best tone):
"[Bold] tone proposals close [2.3x faster] than 
[Formal] tone on average.
Consider using Bold for new clients."

Insight 3 (follow-up impact):
"Proposals with follow-ups have a [58%] win rate
vs [31%] without.
Always activate the chase sequence."

These are generated by querying the actual data,
not hardcoded — dynamic based on real user stats.

ROW 4 — BREAKDOWN TABLES:

Table 1: "Win Rate by Project Type"
Columns: Project Type | Sent | Won | Win Rate | Avg Value
Sorted by win rate descending
Color-code win rate: green >60%, yellow 40-60%, red <40%

Table 2: "Win Rate by Day Sent"
Visual: 7-day heatmap (Mon-Sun)
Shows which day gets best response rate
Insight below: "💡 Your best day to send is Tuesday"

Table 3: "Recent Accepted Deals"
Last 5 won deals: Client | Project | Value | Days to Close | Tone Used

ROW 5 — FOLLOW-UP ANALYTICS:
"Follow-Up Performance"
Bar chart: Win rate for proposals with 0, 1, 2, 3, 4 follow-ups
Insight: "Proposals that received 2 follow-ups closed X% more"

Show which follow-up step triggers the most responses:
Pie chart: "Which step got a reply?"
- Proposal send: 40%
- Day 3 follow-up: 28%
- Day 7 follow-up: 18%
- Day 14 re-engagement: 10%
- Day 21 final: 4%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 3 — LOCKED FOR FREE USERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Free plan users see the analytics page but:
- Top stats row is visible (teaser)
- All charts are blurred with overlay:
  "Unlock Analytics — Upgrade to Pro"
  "See exactly what's winning you deals"
  [Upgrade to Pro — $29/month →]

Starter plan: Basic stats only (top row + win rate chart)
Pro + Agency: Full analytics
```

---

# ════════════════════════════════════
# PROMPT D — ACCEPT → CONTRACT → INVOICE FLOW
# ════════════════════════════════════

```
Build the post-acceptance flow: Accept → Contract → Invoice → Payment.
This is what makes Proposar a complete deal-closing tool, not just a proposal tool.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 1 — DATABASE MIGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

supabase/migrations/008_contracts_invoices.sql

CREATE TABLE contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  share_id TEXT UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- markdown contract body
  status TEXT DEFAULT 'draft', -- draft | sent | signed | declined
  client_name TEXT NOT NULL,
  client_email TEXT,
  freelancer_signature TEXT,
  client_signature TEXT,
  freelancer_signed_at TIMESTAMPTZ,
  client_signed_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  share_id TEXT UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
  invoice_number TEXT NOT NULL, -- INV-001, INV-002...
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  status TEXT DEFAULT 'draft', -- draft | sent | paid | overdue | cancelled
  line_items JSONB DEFAULT '[]',
  subtotal DECIMAL(12,2),
  discount_percent DECIMAL(5,2) DEFAULT 0,
  tax_percent DECIMAL(5,2) DEFAULT 0,
  total DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  due_date DATE,
  paid_at TIMESTAMPTZ,
  payment_link TEXT, -- Lemon Squeezy or external link
  notes TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 2 — POST-ACCEPT FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When client clicks "Accept" on public proposal page:
CURRENT: Shows success message
NEW: Shows a 3-option next steps modal:

"🎉 [ClientName] accepted your proposal!"

"What would you like to do next?"

Option 1: [Send Contract →]
"Generate a simple contract from this proposal"

Option 2: [Send Invoice →] 
"Create and send an invoice for deposit or full payment"

Option 3: [Do this later]
"I'll handle this from my dashboard"

FREELANCER gets notification email:
Subject: "🎉 [ClientName] accepted your proposal!"
Body shows the 3 same options as action buttons in email.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 3 — CONTRACT GENERATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Route: app/(dashboard)/contracts/new/page.tsx
API: POST /api/contracts/generate

AI generates contract from proposal data using Claude:

System prompt:
"You are a professional contract writer for freelancers.
Write clear, simple, legally-sensible contracts.
Not overly legal. Plain English. Protects both parties fairly."

User prompt:
"Generate a freelance contract for:
Freelancer: [name, business]
Client: [name, company]
Project: [type, scope]
Value: [amount, currency]
Timeline: [start, end dates from proposal]
Payment terms: [from proposal]
Deliverables: [from proposal line items]

Include sections:
1. Project scope and deliverables
2. Timeline and milestones
3. Payment terms and schedule
4. Revision policy (max 2 rounds)
5. Intellectual property (client owns final work)
6. Confidentiality (basic)
7. Termination (14 days notice)
8. Signature block (freelancer + client)"

Contract page shows:
- Contract content (editable rich text)
- [Sign as Freelancer] → captures typed name + timestamp
- [Send to Client] → sends email with signing link
- [Download PDF] → contract as PDF

Client signing page (public): /contract/[shareId]
- Shows contract content
- [Sign] button → text input for name + checkbox "I agree"
- On sign → updates contract.client_signature, status = 'signed'
- Both parties receive signed copy via email

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 4 — INVOICE GENERATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Route: app/(dashboard)/invoices/page.tsx (new page)
Route: app/(dashboard)/invoices/new/page.tsx

Auto-populate from proposal:
- Client name, email
- Line items (from proposal_line_items table)
- Total amount
- Invoice number (auto-increment: INV-001, INV-002...)
- Due date (default: 7 days from today, editable)

Invoice UI:
- Same premium design as proposals
- Add deposit option: "Request deposit only" → % selector
- Add milestone invoices: Split into multiple payments
- Payment link field: paste Lemon Squeezy / PayPal / bank details

Public invoice page: /invoice/[shareId]
- Shows professional invoice
- Payment details clearly shown
- [Mark as Paid] button for freelancer (manual tracking)
- Status updates automatically

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 5 — DEAL PIPELINE VIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add to dashboard sidebar: "Pipeline" (between Proposals and Analytics)

Kanban-style board with columns:
DRAFT | SENT | VIEWED | NEGOTIATING | ACCEPTED | CLOSED-WON | CLOSED-LOST

Each proposal shown as a card:
- Client name
- Project type  
- Value ($)
- Days in current stage
- Quick actions: Move stage, Follow up, View

Drag and drop between columns to update status.

Summary bar at top:
Total pipeline value | Won this month | Conversion rate
```

---

# ════════════════════════════════════
# BUILD ORDER + LAUNCH PLAN
# ════════════════════════════════════

## Build Priority

| Order | Prompt | Revenue Impact |
|-------|--------|---------------|
| 1st | Prompt A (WhatsApp) | 🔥🔥🔥🔥🔥 Launch day feature |
| 2nd | Prompt B (Chase Sequence) | 🔥🔥🔥🔥🔥 Core differentiator |
| 3rd | Prompt C (Analytics) | 🔥🔥🔥🔥 Upsell to Pro |
| 4th | Prompt D (Contract/Invoice) | 🔥🔥🔥 Retention + ARPU |

## After These 4 Prompts — Proposar Has:

✅ AI proposal generation
✅ Email send + WhatsApp send  
✅ 4-step smart chase sequence
✅ Win rate analytics with AI insights
✅ Accept → Contract → Invoice → Pipeline
✅ Lemon Squeezy payments
✅ PDF with user branding

## That Is A Complete, Unbeatable Product.

No competitor has ALL of this together.
Proposar is now the only tool that takes you from 
WRITE → SEND → CHASE → WIN → GET PAID.

## Positioning After These Builds:

"Proposar is the only proposal tool that follows up for you, 
tells you what's working, and takes you from proposal to 
payment in one place."

---
*Proposar Phase 2 — Own the full deal loop*
*Build this → Launch → Get first $29 → Build rest with revenue*
