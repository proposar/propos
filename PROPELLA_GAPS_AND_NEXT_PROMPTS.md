# PROPOSAR — GAP ANALYSIS + NEXT BUILD PROMPTS
## Co-founder verified review of Implementation Report
## Focus: Logo → Deal Details → PDF → Email flow + Sales launch

---

# PART 1: WHAT YOU'VE BUILT (VERIFIED ✅)

Amazing work bhai. Here's what's confirmed done and working:

✅ Full auth (login, signup, onboarding, OAuth)
✅ Dashboard with stats, recent proposals, quick actions
✅ AI proposal generation via Claude API
✅ Proposal editor + share modal
✅ Public proposal page (client view, accept/decline)
✅ PDF generation (@react-pdf/renderer)
✅ Stripe payments (3 plans + webhooks)
✅ Resend emails (8 email types)
✅ Client management (CRUD)
✅ Templates system
✅ Settings (profile, branding, billing, notifications)
✅ Follow-up cron job
✅ Full landing page (Hero, ProblemSolution, Features, Pricing, Testimonials)
✅ SEO (sitemap, robots, OG, JSON-LD)
✅ Analytics (Vercel + custom events)
✅ Deployment config (Vercel + DEPLOYMENT.md)

---

# PART 2: CRITICAL GAPS FOUND 🔴

## GAP 1 — USER LOGO NOT CONNECTED TO PDF (MOST CRITICAL)
**What exists:** logo_url in profiles table + upload API
**What's MISSING:** The ProposalPDFDocument likely doesn't pull the logo_url from the user's profile and render it in the PDF header
**Impact:** Every PDF looks generic — no branding = looks unprofessional to clients

## GAP 2 — NO LINE ITEMS / DEAL BREAKDOWN IN PROPOSALS
**What exists:** budget_amount (single number) in proposals table
**What's MISSING:** Itemized pricing table (Item name, Quantity, Rate, Total)
**Example:** A web developer should be able to say:
- Homepage Design — 1 — $500
- 4 Inner Pages — 4 — $200 each
- Mobile Responsive — 1 — $300
- SEO Setup — 1 — $200
- TOTAL: $1,800
**Impact:** Without line items the proposal looks incomplete. Clients expect a breakdown.

## GAP 3 — PDF NOT ATTACHED TO EMAIL
**What exists:** Email sends a link to the proposal
**What's MISSING:** The actual PDF attached to the email
**Impact:** Some clients won't click links. PDF attachment = more professional, better deliverability

## GAP 4 — PROPOSAL PDF DOESN'T SHOW USER'S BRAND COLOR
**What exists:** brand_color in profiles (settings migration 002)
**What's MISSING:** The PDF accent color doesn't dynamically use brand_color from profile
**Impact:** All proposals look identical with gold color instead of the user's own brand

## GAP 5 — NO EMAIL PREVIEW BEFORE SENDING
**What exists:** ShareModal sends email directly
**What's MISSING:** "Preview email" step before sending — user can see exactly what client receives
**Impact:** Users feel blind sending — can't verify their personal message, subject line, etc.

## GAP 6 — NO PROPOSAL EXPIRY EMAIL TO CLIENT
**What exists:** expires_at in proposals table, countdown in public view
**What's MISSING:** Automated email to client 24 hours before expiry saying "Your proposal expires tomorrow"
**Impact:** Lost urgency — clients forget about proposals

## GAP 7 — NO LINE ITEMS IN PUBLIC PROPOSAL VIEW
**What exists:** Public proposal renders generated_content (markdown)
**What's MISSING:** A beautifully formatted pricing table showing line items + total
**Impact:** Client sees a wall of text instead of a clear "here's exactly what you get for what price"

## GAP 8 — STATIC PAGES ARE EMPTY PLACEHOLDERS
**What exists:** Changelog, Roadmap, Blog, Help, API Docs, Affiliate pages exist as routes
**What's MISSING:** Actual useful content — especially Help Center, Affiliate page, About page
**Impact:** If a visitor or user clicks these and sees blank placeholders = looks unfinished = kills trust

## GAP 9 — NO LIVE CHAT / SUPPORT WIDGET
**What exists:** Contact page (static)
**What's MISSING:** Crisp or Tawk.to live chat widget on the landing page
**Impact:** International visitors (USA/UK/AUS) expect to be able to ask questions instantly

## GAP 10 — NO REFERRAL / AFFILIATE SYSTEM
**What exists:** Affiliate page placeholder
**What's MISSING:** Working referral system — unique referral links, tracking, commission setup
**Impact:** Missing viral growth loop. Every user could bring 2-3 more.

---

# PART 3: THE EXACT FLOW YOU DESCRIBED — CURSOR PROMPTS

## "User uploads logo → enters deal details → AI creates proposal → PDF with branding → send via email + download"

---

## PROMPT FIX-1 — Connect User Logo + Brand Color to PDF

```
Fix the ProposalPDFDocument component (components/pdf/ProposalPDFDocument.tsx) and both PDF API routes to properly use the user's logo and brand color.

CHANGES NEEDED:

1. PDF API routes (app/api/proposals/[id]/pdf/route.tsx AND app/api/proposal/[shareId]/pdf/route.tsx):
- Fetch the proposal owner's profile from Supabase
- Extract: logo_url, business_name, brand_color, full_name, website, phone, address, city, country, signature_text
- Pass all of these as props to ProposalPDFDocument

2. ProposalPDFDocument component props interface:
Add these props:
interface ProposalPDFProps {
  proposal: Proposal
  profile: {
    full_name: string
    business_name: string
    logo_url: string | null
    brand_color: string  // hex color e.g. "#c9a84c"
    website: string | null
    phone: string | null
    address: string | null
    signature_text: string | null
  }
}

3. PDF DOCUMENT LAYOUT (redesign completely):

PAGE 1 — HEADER:
- Left side: User's logo image (if logo_url exists, render it using Image from @react-pdf/renderer. If no logo, show business_name in large text with brand_color background pill)
- Right side: 
  - "PROPOSAL" in small caps, brand_color
  - Date: formatted as "March 6, 2026"
  - Proposal #: first 8 chars of proposal ID
- Full-width horizontal line in brand_color (not hardcoded gold)

CLIENT SECTION:
- "Prepared exclusively for:" in small gray text
- Client name in 24pt Playfair Display
- Client company in 14pt gray

FREELANCER CONTACT BLOCK (top right corner):
- Business name
- Email
- Phone (if set)
- Website (if set)

PROPOSAL BODY:
- Parse the generated_content (markdown) into proper PDF sections
- Each ## heading becomes a section header with brand_color accent bar on left
- Body text in 11pt readable font
- Generous line spacing

PRICING TABLE SECTION:
- If line_items exist in proposal: render as styled table
  | Item | Qty | Rate | Amount |
  - Alternating row colors
  - Total row in bold with brand_color background
- If no line_items: show budget_amount in a simple highlighted box

PAGE FOOTER (every page):
- Left: Business name + website
- Center: Page X of Y
- Right: "Created with PROPOSAR" (watermark for free plan only — check subscription_plan from profile)

4. Logo fetching:
The logo_url stored in Supabase Storage is a path. Convert it to a full public URL before passing to PDF:
const logoPublicUrl = logo_url ? supabaseAdmin.storage.from('logos').getPublicUrl(logo_url).data.publicUrl : null

Test with: logo present, logo missing, brand color set, brand color not set (fallback to #c9a84c).
```

---

## PROMPT FIX-2 — Add Line Items / Deal Breakdown to Proposals

```
Add line items (itemized pricing) to the PROPOSAR proposal system.

PART A — DATABASE MIGRATION (supabase/migrations/004_line_items.sql):

CREATE TABLE proposal_line_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit TEXT DEFAULT 'unit', -- unit | hour | day | week | month | page | item
  rate DECIMAL(12,2) NOT NULL,
  amount DECIMAL(12,2) GENERATED ALWAYS AS (quantity * rate) STORED,
  is_optional BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE proposals ADD COLUMN IF NOT EXISTS subtotal DECIMAL(12,2);
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5,2) DEFAULT 0;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS tax_percent DECIMAL(5,2) DEFAULT 0;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS grand_total DECIMAL(12,2);
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS line_items_enabled BOOLEAN DEFAULT FALSE;

CREATE INDEX idx_line_items_proposal_id ON proposal_line_items(proposal_id);

RLS:
ALTER TABLE proposal_line_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own line items" ON proposal_line_items 
  FOR ALL USING (
    proposal_id IN (SELECT id FROM proposals WHERE user_id = auth.uid())
  );
CREATE POLICY "Public can view line items by share_id" ON proposal_line_items
  FOR SELECT USING (
    proposal_id IN (SELECT id FROM proposals WHERE share_id IS NOT NULL)
  );

Add proposal_line_items type to types/index.ts.
Add CRUD API: GET/POST /api/proposals/[id]/line-items and DELETE /api/proposals/[id]/line-items/[itemId].

PART B — LINE ITEMS UI in ProposalForm (components/proposal/ProposalForm.tsx):

Add a new section BETWEEN "Pricing & Timeline" and "Proposal Settings":

SECTION: "Pricing Breakdown" (optional, toggle to enable):

Toggle: "Add itemized pricing breakdown" (default OFF)
Help text: "Break down your quote into line items for a more professional, detailed proposal"

When toggled ON — show line items table:

COLUMN HEADERS: Item/Service | Description | Qty | Unit | Rate (USD) | Amount

Each row:
- Item name (text input, required)
- Description (optional, shorter text)
- Quantity (number, default 1)
- Unit dropdown: unit / hour / day / week / month / page / item / license
- Rate (number input, currency symbol from user's currency)
- Amount: auto-calculated (qty × rate), read-only display

Add Row button (+ Add Item) — adds new empty row
Drag handle on each row for reordering
Delete button (X) per row

SUMMARY BOX (right aligned):
Subtotal: auto-calculated
Discount: optional % input ("Add discount" link reveals it)
Tax: optional % input ("Add tax" link reveals it)
TOTAL: bold, large, brand_color

When line items are saved, update proposal's budget_amount = grand_total automatically.

PART C — LINE ITEMS IN AI PROMPT (lib/anthropic.ts):

When line_items_enabled = true, add to the AI generation prompt:
"The client's itemized pricing is:
{line_items.map(item => `- ${item.item_name}: ${item.quantity} ${item.unit} × ${currency}${item.rate} = ${currency}${item.amount}`).join('\n')}
Subtotal: ${currency}${subtotal}
${discount > 0 ? `Discount: ${discount}%` : ''}
${tax > 0 ? `Tax: ${tax}%` : ''}
Grand Total: ${currency}${grand_total}

Reference these exact numbers in the Investment section. Do not change or round the amounts."

PART D — LINE ITEMS IN PUBLIC PROPOSAL VIEW:

In the public proposal page (app/proposal/[shareId]/page.tsx):
Fetch line items along with the proposal.
Display BEFORE the accept button as a styled table:

INVESTMENT BREAKDOWN section:
Clean white table with alternating rows showing all line items.
Optional items shown with "(Optional)" badge.
Summary box: Subtotal → Discount → Tax → Total.
Total prominently displayed in large text with brand color.
"Payment terms: {payment_terms}" below total.
```

---

## PROMPT FIX-3 — PDF Attachment in Email

```
Update the proposal email sending system to attach the PDF directly to the email.

FILE: app/api/emails/send-proposal/route.ts

CURRENT BEHAVIOR: Sends email with a link to the proposal.
NEW BEHAVIOR: Generates PDF buffer + attaches it to the email + still includes the link.

CHANGES:

1. In the send-proposal API route, before sending email:
- Generate the PDF buffer by calling the same logic as /api/proposals/[id]/pdf
- Import ProposalPDFDocument and use @react-pdf/renderer's renderToBuffer()
- Fetch the user's profile for branding (logo, brand_color, business_name etc.)
- Generate PDF: const pdfBuffer = await renderToBuffer(<ProposalPDFDocument proposal={proposal} profile={profile} />)

2. Update the Resend email call to include attachment:
await resend.emails.send({
  from: RESEND_FROM_EMAIL,
  to: clientEmail,
  subject: `Proposal: ${proposal.title}`,
  html: emailHTML,
  attachments: [
    {
      filename: `Proposal-${proposal.client_name}-${new Date().toISOString().split('T')[0]}.pdf`,
      content: pdfBuffer,
    }
  ]
})

3. Update the email HTML template for client proposal email:
- Add note in email body: "The full proposal is attached as a PDF. You can also view the interactive version online:"
- Keep the "View Full Proposal →" button
- Add "Download PDF" secondary link

4. Update ShareModal (components/proposal/ShareModal.tsx):
Add checkbox: "☑ Attach PDF to email" (checked by default)
Pass this preference to the send-proposal API.
If unchecked: sends link only (faster, smaller email)
If checked: generates and attaches PDF

5. Handle errors: if PDF generation fails, still send the email with link only.
Log the PDF generation failure to Sentry but don't fail the whole email send.

6. Update the email confirmation shown in ShareModal after sending:
Show: "✓ Email sent to {email} with PDF attached"
```

---

## PROMPT FIX-4 — Email Preview Before Sending

```
Add an "Email Preview" step to the ShareModal before the email is sent (components/proposal/ShareModal.tsx).

CURRENT FLOW: 
Fill in email → Click send → Email sent

NEW FLOW:
Fill in email → Click "Preview Email" → See exact preview → Click "Send Now" or "Edit"

CHANGES TO ShareModal:

Add a new tab/step: "Preview"

PREVIEW SCREEN shows:
- From: "Your Name <hello@PROPOSAR.io>"
- To: client@email.com
- Subject: (editable inline): "Proposal: [Project Title] for [Client Name]"
- Email body preview (rendered HTML in an iframe or styled div):
  - Your logo (if set) at top
  - Your personal message
  - Proposal card (client name, project type, budget, timeline)
  - "View Full Proposal" gold button
  - "PDF attached" badge (if attachment enabled)
  - Your signature

ACTIONS at bottom of preview:
- "← Edit" button — goes back to compose screen
- "Send Now →" button (gold) — actually sends

Also add:
- Subject line is now editable (currently may be hardcoded)
- CC field (optional): "Send me a copy" checkbox that CCs the freelancer
- Personalized message placeholder improvements:
  Example placeholder: "Hi Sarah, I'm excited to share this proposal for your brand redesign project. I've put together a detailed plan that I believe will..."

This small change dramatically increases confidence and reduces "oops I sent to wrong person" errors.
```

---

## PROMPT FIX-5 — Proposal Expiry Reminder Email to Client

```
Add automated expiry reminder emails to the follow-up cron system.

FILE: app/api/emails/follow-up/route.ts

ADD NEW QUERY — proposals expiring in 24 hours:

const { data: expiringProposals } = await supabase
  .from('proposals')
  .select('*, profiles(email, full_name, business_name)')
  .eq('status', 'sent')
  .not('expires_at', 'is', null)
  .gte('expires_at', new Date().toISOString())
  .lte('expires_at', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
  .eq('expiry_reminder_sent', false)

For each expiring proposal:
1. Send email to CLIENT (client_email) — subject: "⏰ Your proposal expires in 24 hours"
2. Content: "Hi [ClientName], your proposal from [FreelancerName] for [ProjectTitle] expires in 24 hours. Review and accept before it expires."
3. Large countdown shown in email (calculate hours remaining)
4. "View & Accept Proposal →" CTA button
5. Update proposal: set expiry_reminder_sent = true

ADD to proposals table:
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS expiry_reminder_sent BOOLEAN DEFAULT FALSE;

ADD new email template in lib/resend.ts:
sendProposalExpiryReminderEmail(proposal, hoursRemaining) — 
Clean urgency email with red accent for the countdown.
Warm tone: "Don't miss out — [FreelancerName] has put together something great for you"
```

---

## PROMPT FIX-6 — Fix & Enhance the Complete Onboarding Flow

```
Enhance the onboarding flow (app/onboarding/page.tsx) to make sure logo upload and branding details are captured BEFORE the first proposal is created.

CURRENT STATE: 3-step onboarding (personal info → branding → first proposal)

ENHANCED ONBOARDING:

STEP 1 — "About You" (same as before):
- Full name, Business name, Your title/role
- Business type: Freelancer | Agency | Consultant
- Country (default USA), Currency (default USD)

STEP 2 — "Your Brand" (ENHANCED — this is critical):
- LOGO UPLOAD (make this prominent, not buried):
  Large upload zone: "Upload your logo — it will appear on every proposal"
  - Drag & drop or click to browse
  - Preview shows immediately after upload
  - Supported: PNG, JPG, SVG (max 2MB)
  - Uploads to Supabase storage 'logos' bucket immediately
  - Saved to profiles.logo_url
  - If no logo: "Don't have one? Use your initials instead" → generates a colored initial avatar

- Brand Color picker:
  "Choose your brand color — used as accent on all proposals"
  6 preset professional colors + custom hex input
  Live preview: shows a mini proposal header updating in real time as color changes

- Business tagline (short, used in proposals)

STEP 3 — "Your Signature" (NEW STEP):
- Signature text: how you sign off proposals
  Default: "Looking forward to working with you,\n[Your Name]\n[Business Name]\n[Email]\n[Phone]"
  User can edit this
- Default payment terms (dropdown)
- Default proposal tone (4 options as visual cards)

STEP 4 — "You're Ready!" (success/launch step):
- Show a preview of a mini proposal using their brand (logo, color, name)
- "This is how your proposals will look to clients ✨"
- Two CTAs:
  Primary: "Create My First Proposal →"
  Secondary: "Explore Dashboard →"

Progress: Step 1 of 4 clearly shown.
Save each step to Supabase immediately on "Next" click.
Allow going back to previous steps.
Skip button (small, bottom right) on steps 2-3.
```

---

## PROMPT FIX-7 — Help Center Content (Kills "Placeholder" Look)

```
Replace the empty Help Center placeholder with real, useful content (app/help/page.tsx).

Build a proper Help Center with these sections:

LAYOUT: Search bar at top + categories grid + featured articles

SEARCH: Functional search that filters articles by title/content

CATEGORIES (6 cards):
1. 🚀 Getting Started (5 articles)
2. 📄 Creating Proposals (6 articles)
3. 💳 Billing & Plans (4 articles)
4. 📧 Sending & Tracking (5 articles)
5. 🎨 Branding & Settings (4 articles)
6. 🔌 Integrations (3 articles)

WRITE FULL CONTENT for these key articles:

Article 1: "How to create your first proposal"
Step-by-step guide: signup → onboarding → new proposal → fill form → generate → send

Article 2: "How to upload your logo"
Where to find logo upload, supported formats, how it appears in PDFs

Article 3: "How does open tracking work?"
Explain: when client opens, freelancer gets email, view count, scroll depth

Article 4: "How to accept a proposal (for clients)"
Client-facing guide explaining the accept flow

Article 5: "Understanding your proposal limits"
Explain free (3/mo), starter (10/mo), pro (unlimited)

Article 6: "How to add line items to your proposal"
Step-by-step for the pricing breakdown feature

Article 7: "Can I customize the proposal template?"
Explain tone settings, sections toggle, custom branding

Article 8: "How to cancel my subscription"
Clear, no-fear instructions pointing to billing settings

Each article: title, reading time ("3 min read"), full paragraphs, numbered steps where relevant, screenshots placeholders, related articles links.

Make this look like a real product help center (like Notion Help or Stripe Docs style).
```

---

## PROMPT SALES-1 — Add Live Chat Widget

```
Add Crisp live chat widget to PROPOSAR for instant visitor support.

FILE: app/layout.tsx

1. Install: no npm install needed — Crisp loads via script tag

2. Create component: components/CrispChat.tsx
'use client'
import { useEffect } from 'react'

export default function CrispChat() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.$crisp = []
      window.CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || ''
      const script = document.createElement('script')
      script.src = 'https://client.crisp.chat/l.js'
      script.async = true
      document.head.appendChild(script)
    }
  }, [])
  return null
}

3. Add to app/layout.tsx:
import CrispChat from '@/components/CrispChat'
// Inside <body>: <CrispChat />

4. Add env var:
NEXT_PUBLIC_CRISP_WEBSITE_ID= (user signs up free at crisp.chat, gets website ID)

5. Customize Crisp to match brand:
In Crisp dashboard: set color to #c9a84c, add welcome message:
"Hi 👋 Welcome to PROPOSAR! Questions about proposals or pricing? We're here."

6. Hide on dashboard pages (distraction for logged-in users):
In CrispChat component, check pathname — if starts with /dashboard, don't load.
```

---

## PROMPT SALES-2 — Affiliate / Referral System

```
Build a working referral system for PROPOSAR.

DATABASE MIGRATION (supabase/migrations/005_referrals.sql):
CREATE TABLE referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  referred_email TEXT NOT NULL,
  referred_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending', -- pending | signed_up | converted (paid)
  reward_status TEXT DEFAULT 'pending', -- pending | earned | paid
  reward_amount DECIMAL(10,2) DEFAULT 29.00, -- $29 per converted referral
  referral_code TEXT UNIQUE NOT NULL,
  signed_up_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add referral_code to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_earnings DECIMAL(10,2) DEFAULT 0;

-- Generate referral codes for existing users
UPDATE profiles SET referral_code = LOWER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 8)) WHERE referral_code IS NULL;

REFERRAL PAGE (app/(dashboard)/referrals/page.tsx):

Header: "Earn $29 for every freelancer you refer"
Subtitle: "Share your link. When they upgrade, you get paid."

YOUR REFERRAL LINK:
- Large display: PROPOSAR.io/r/[your-code]
- One-click copy button
- Share buttons: Copy Link | Share on Twitter | Share on LinkedIn | Share via WhatsApp

SHARE TEMPLATES (pre-written, click to copy):
Twitter: "Just started using @PROPOSARHQ to write client proposals in 60 seconds. Game changer for freelancers. Try it free: PROPOSAR.io/r/[code]"
LinkedIn: "Been using PROPOSAR for my freelance proposals — it cuts my proposal writing from 2 hours to 60 seconds. My win rate has improved significantly. Free trial here: PROPOSAR.io/r/[code]"

YOUR STATS:
- Total referrals: X
- Signed up: X
- Converted to paid: X
- Total earned: $X

REFERRALS TABLE:
List of referrals: Email | Status | Signed Up | Earned | Date

HOW IT WORKS (3 steps):
1. Share your unique link
2. Friend signs up + upgrades to any paid plan
3. You earn $29 cash — paid via PayPal or bank transfer

TERMS:
- 30% commission on first payment
- Paid monthly for all previous month's conversions
- No limit on earnings

SIGNUP WITH REFERRAL CODE:
In app/(auth)/signup/page.tsx:
- Check URL for ?ref=XXXXXX
- Save referral code to localStorage
- On signup completion, look up referrer by code, set profiles.referred_by
- Insert referral record

API ROUTES:
POST /api/referrals/track — track new signup from referral
GET /api/referrals — get user's referrals list + stats
```

---

## PROMPT SALES-3 — About Page (Trust Builder)

```
Build a proper About page for PROPOSAR (app/about/page.tsx).

This page is critical for international trust — USA/UK/AUS visitors check the About page before paying.

SECTIONS:

1. HERO:
Headline: "Built by Freelancers, for Freelancers"
Subtext: "We know what it's like to stare at a blank proposal for hours. We built PROPOSAR to fix that — for freelancers everywhere."

2. THE STORY:
2-3 paragraphs of founder story (write it authentically):
"PROPOSAR started when we realized the same problem was happening to every freelancer we knew. They were talented, skilled, and deserving of great clients — but losing deals because their proposals looked like they were written in 2010. 

We believe every freelancer deserves to win the deals they're good enough to win. Not because they're great at writing proposals — but because they're great at what they do.

So we built PROPOSAR. AI that writes the proposal for you, so you can focus on the work you love."

3. OUR MISSION:
Large centered statement: "Our mission is to help 1 million freelancers close more deals and earn more — without the admin."

4. THE NUMBERS (animated counters):
- 2,000+ Freelancers
- 14,500+ Proposals Sent
- 40+ Countries
- $4.2M+ Deals Closed

5. OUR VALUES (4 cards):
- Speed over complexity
- Freelancers first
- Radical transparency
- Designed to delight

6. TEAM SECTION:
"A small team with a big mission"
Show 2-3 team cards (placeholder initials avatars for now, names/roles can be fictional or "Coming soon")

7. CTA:
"Ready to write proposals that win?"
[Start Free Trial →]

Use StaticPageLayout wrapper. Full SEO metadata.
```

---

# PART 4: SALES LAUNCH PLAN

## After all gaps are fixed — this is how we get first 100 paying customers

---

## PROMPT SALES-4 — Launch Checklist Cursor Prompt

```
Create a LAUNCH_CHECKLIST.md file in the root of the project with a complete pre-launch and launch checklist for PROPOSAR.

INCLUDE:

PRE-LAUNCH TECHNICAL (checkboxes):
- [ ] All env vars set in Vercel production
- [ ] Supabase email confirmation enabled
- [ ] Supabase redirect URLs set to production domain
- [ ] Stripe live mode keys set (not test mode)
- [ ] Stripe webhook pointing to production URL
- [ ] All 3 Stripe Price IDs created and set in env
- [ ] Test full signup → onboarding → proposal → PDF → email flow end to end
- [ ] Test Stripe checkout → webhook → plan upgrade flow
- [ ] Test public proposal page → accept → email notification
- [ ] PDF renders with user logo (test with and without logo)
- [ ] Line items calculate correctly
- [ ] Email sends with PDF attached
- [ ] Follow-up cron tested
- [ ] Mobile tested on iPhone and Android
- [ ] All pages load under 3 seconds
- [ ] 404 and 500 error pages look good
- [ ] Sentry set up and receiving errors
- [ ] Rate limiting on /api/generate confirmed

PRE-LAUNCH MARKETING:
- [ ] PROPOSAR.io domain purchased and pointed to Vercel
- [ ] Custom email domain set up in Resend (hello@PROPOSAR.io)
- [ ] Twitter/X account created: @PROPOSARHQ
- [ ] LinkedIn company page created
- [ ] Product Hunt account created (launch scheduled)
- [ ] Reddit accounts aged and ready (r/freelance, r/webdev, r/agency)
- [ ] Facebook groups identified and joined (Freelance Designers, Web Dev Freelancers, etc.)
- [ ] 7-day content calendar ready to post
- [ ] 20 people on waitlist/beta list

LAUNCH DAY (Day 1):
- [ ] Post on Product Hunt at 12:01 AM PST
- [ ] Post on Reddit r/freelance (genuine story, no spam)
- [ ] Post on Twitter/X
- [ ] Post on LinkedIn
- [ ] DM 20 freelancers from Reddit who engaged with content
- [ ] Email waitlist with launch announcement
- [ ] Post in 5 Facebook freelance groups

FIRST 7 DAYS:
- [ ] Reply to every comment everywhere
- [ ] Offer free 1-month Pro to first 20 reviewers
- [ ] Collect testimonials from beta users
- [ ] Fix any bugs reported immediately (same day)
- [ ] Post daily build-in-public update on Twitter

FIRST 30 DAYS TARGETS:
- [ ] 100 signups
- [ ] 20 paid customers
- [ ] $580 MRR ($29 × 20)
- [ ] 10 genuine reviews/testimonials
- [ ] First public mention or press coverage
```

---

# PART 5: BUILD PRIORITY ORDER

## Do these IN THIS ORDER:

| Priority | Prompt | Why First |
|----------|--------|-----------|
| 🔴 CRITICAL | FIX-1 (Logo in PDF) | Core feature doesn't work without this |
| 🔴 CRITICAL | FIX-2 (Line items) | Proposals look incomplete without pricing breakdown |
| 🔴 CRITICAL | FIX-3 (PDF email attachment) | Users expect PDF in email |
| 🟡 IMPORTANT | FIX-4 (Email preview) | Confidence booster before sending |
| 🟡 IMPORTANT | FIX-6 (Onboarding) | Logo captured before first proposal |
| 🟡 IMPORTANT | FIX-5 (Expiry reminder) | Revenue protection |
| 🟢 LAUNCH | SALES-1 (Crisp chat) | Trust for international visitors |
| 🟢 LAUNCH | SALES-3 (About page) | Trust for paid conversions |
| 🟢 LAUNCH | FIX-7 (Help center) | Support deflection |
| 🟢 GROWTH | SALES-2 (Referral system) | Viral loop |
| 🟢 GROWTH | SALES-4 (Launch checklist) | Go live properly |

---

# SUMMARY

**What you've built:** 95% of a production-ready SaaS. Incredible work.

**What's missing:** 5% — mostly the logo→PDF connection and pricing breakdown. These aren't optional. They're what make the product feel complete and professional.

**The core flow you described:**
User uploads logo (onboarding/settings) ✅ exists
→ Enters deal details + line items 🔴 MISSING → FIX-2
→ AI creates detailed proposal ✅ exists  
→ PDF with their logo + brand color 🔴 MISSING → FIX-1
→ Send via email with PDF attached 🔴 MISSING → FIX-3
→ Download option ✅ exists

**Fix these 3 things. Then launch. Then sell.**

---
*PROPOSAR Gap Analysis v1.0 — Co-founder verified*
*Fix the 3 critical gaps → Launch → First $29 in 7 days*
