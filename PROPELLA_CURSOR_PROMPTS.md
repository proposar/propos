# Proposar — MASTER CURSOR BUILD PROMPTS
## AI-Powered Proposal Generator for Freelancers & Agencies
## Built to target USA, UK, AUS, Canada — Dollar Revenue
## Co-founder verified. Build in order. Screenshot after each step.

---

> **HOW TO USE THIS DOCUMENT**
> - Copy each prompt EXACTLY into Cursor AI chat
> - Build one step at a time — don't skip
> - Screenshot after each step and share with your co-founder to verify
> - Each prompt builds on the previous one
> - Total estimated build time: 5–7 days

---

# ═══════════════════════════════════════════
# PHASE 0 — PROJECT SETUP
# ═══════════════════════════════════════════

## PROMPT 0.1 — Initialize Full Project Structure

```
Create a full-stack Next.js 14 project called "Proposar" with the following complete setup:

TECH STACK:
- Next.js 14 with App Router
- TypeScript (strict mode)
- Tailwind CSS
- Supabase (auth + database)
- Stripe (payments)
- Anthropic Claude API (proposal generation)
- Resend (transactional emails)
- Shadcn/ui components
- Framer Motion (animations)
- React Hook Form + Zod (form validation)

FOLDER STRUCTURE to create:
Proposar/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── proposals/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── templates/page.tsx
│   │   ├── clients/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   ├── proposal/[shareId]/page.tsx  (public proposal view)
│   ├── api/
│   │   ├── generate/route.ts
│   │   ├── proposals/route.ts
│   │   ├── proposals/[id]/route.ts
│   │   ├── proposals/[id]/track/route.ts
│   │   ├── stripe/webhook/route.ts
│   │   ├── stripe/checkout/route.ts
│   │   └── stripe/portal/route.ts
│   ├── layout.tsx
│   └── page.tsx  (landing page)
├── components/
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Features.tsx
│   │   ├── Pricing.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQ.tsx
│   │   └── Footer.tsx
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── StatsCard.tsx
│   │   └── ProposalCard.tsx
│   ├── proposal/
│   │   ├── ProposalForm.tsx
│   │   ├── ProposalPreview.tsx
│   │   ├── ProposalEditor.tsx
│   │   └── ShareModal.tsx
│   └── ui/ (shadcn components)
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── stripe.ts
│   ├── anthropic.ts
│   ├── resend.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── hooks/
│   ├── useProposals.ts
│   ├── useUser.ts
│   └── useSubscription.ts
├── .env.local (template)
└── middleware.ts

Create every file with proper TypeScript types, imports, and placeholder content. Install all dependencies. Set up tailwind.config.ts with a custom dark premium color palette. Set up the .env.local template with all required environment variable names.
```

---

## PROMPT 0.2 — Environment Variables & Config

```
Create the complete .env.local file template and a lib/config.ts file for Proposar:

.env.local should include ALL of these:
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_STARTER_PRICE_ID=
STRIPE_PRO_PRICE_ID=
STRIPE_AGENCY_PRICE_ID=

# Resend (email)
RESEND_API_KEY=
RESEND_FROM_EMAIL=hello@Proposar.io

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Proposar

Create lib/config.ts that exports:
- All plan details (Starter $19/mo, Pro $29/mo, Agency $79/mo)
- Plan limits (proposals per month, templates, clients)
- App metadata (name, description, social links)
- Feature flags

Create lib/constants.ts with:
- All project types (20 types covering web, mobile, design, marketing, etc.)
- Proposal sections list
- Currency options
- Timeline options
```

---

# ═══════════════════════════════════════════
# PHASE 1 — DATABASE SETUP (SUPABASE)
# ═══════════════════════════════════════════

## PROMPT 1.1 — Complete Supabase Schema

```
Create the complete Supabase SQL schema for Proposar. Write this as a migration file at supabase/migrations/001_initial_schema.sql

Create ALL these tables with proper relationships, indexes, and RLS policies:

-- 1. PROFILES TABLE (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  business_name TEXT,
  business_type TEXT, -- freelancer | agency | consultant
  avatar_url TEXT,
  website TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'America/New_York',
  bio TEXT, -- used in proposals
  signature_text TEXT, -- closing signature in proposals
  logo_url TEXT,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'free', -- free | active | canceled | past_due
  subscription_plan TEXT DEFAULT 'free', -- free | starter | pro | agency
  subscription_period_end TIMESTAMPTZ,
  proposals_used_this_month INTEGER DEFAULT 0,
  proposals_reset_date DATE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CLIENTS TABLE
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  industry TEXT,
  country TEXT,
  notes TEXT,
  tags TEXT[],
  total_proposals INTEGER DEFAULT 0,
  won_proposals INTEGER DEFAULT 0,
  total_value DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROPOSALS TABLE
CREATE TABLE proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  share_id TEXT UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
  
  -- Basic Info
  title TEXT NOT NULL,
  project_type TEXT NOT NULL,
  status TEXT DEFAULT 'draft', -- draft | sent | viewed | accepted | declined | expired
  
  -- Client Info (snapshot at time of creation)
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_company TEXT,
  
  -- Project Details (input)
  project_scope TEXT NOT NULL,
  budget_amount DECIMAL(12,2),
  budget_currency TEXT DEFAULT 'USD',
  timeline TEXT,
  deliverables TEXT[],
  additional_notes TEXT,
  
  -- AI Generated Content
  generated_content TEXT, -- full markdown proposal
  executive_summary TEXT,
  
  -- Customization
  tone TEXT DEFAULT 'professional', -- professional | friendly | formal | bold
  template_id UUID,
  custom_sections JSONB DEFAULT '[]',
  
  -- Tracking
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  viewer_ip TEXT,
  accepted_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  -- Follow-up
  follow_up_sent BOOLEAN DEFAULT FALSE,
  follow_up_at TIMESTAMPTZ,
  
  -- Meta
  is_template BOOLEAN DEFAULT FALSE,
  template_name TEXT,
  generation_model TEXT DEFAULT 'claude-sonnet-4-20250514',
  generation_tokens INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROPOSAL VIEWS TABLE (analytics)
CREATE TABLE proposal_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  duration_seconds INTEGER, -- how long they read it
  scrolled_to_percent INTEGER -- how far they scrolled
);

-- 5. TEMPLATES TABLE
CREATE TABLE templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT,
  content TEXT NOT NULL, -- markdown template
  is_public BOOLEAN DEFAULT FALSE, -- Proposar built-in templates
  is_premium BOOLEAN DEFAULT FALSE,
  use_count INTEGER DEFAULT 0,
  thumbnail_url TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ACTIVITY LOG TABLE
CREATE TABLE activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- proposal_created | proposal_sent | proposal_viewed | proposal_accepted | proposal_declined
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for performance
CREATE INDEX idx_proposals_user_id ON proposals(user_id);
CREATE INDEX idx_proposals_share_id ON proposals(share_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_client_id ON proposals(client_id);
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_proposal_views_proposal_id ON proposal_views(proposal_id);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES (users can only see their own data)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users manage own clients" ON clients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own proposals" ON proposals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can view proposals by share_id" ON proposals FOR SELECT USING (share_id IS NOT NULL);
CREATE POLICY "Users manage own activity" ON activity_log FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own views" ON proposal_views FOR ALL USING (
  proposal_id IN (SELECT id FROM proposals WHERE user_id = auth.uid())
);
CREATE POLICY "Anyone can view public templates" ON templates FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);
CREATE POLICY "Users manage own templates" ON templates FOR ALL USING (auth.uid() = user_id);

-- TRIGGERS for updated_at
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- FUNCTION: Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

Also create all the TypeScript types in types/index.ts matching this schema exactly.
```

---

# ═══════════════════════════════════════════
# PHASE 2 — AUTH SYSTEM
# ═══════════════════════════════════════════

## PROMPT 2.1 — Complete Auth Pages

```
Build the complete authentication system for Proposar with these pages and features:

DESIGN LANGUAGE for all auth pages:
- Dark background: #0a0a14
- Gold accent: #c9a84c
- Premium feel like a high-end SaaS (think Linear, Vercel, Raycast)
- Left side: Full-height brand panel with animated gradient, logo, quote from happy user
- Right side: Clean form
- Font: Playfair Display for headings, DM Sans for body
- Smooth entrance animations with Framer Motion

1. SIGNUP PAGE (app/(auth)/signup/page.tsx):
Fields:
- Full Name
- Email
- Password (with strength indicator)
- Business Type: dropdown (Freelancer | Agency | Consultant | Other)
- Agree to Terms checkbox

Features:
- Google OAuth button (prominent, above form)
- "Or continue with email" divider
- Show/hide password toggle
- Password strength bar (weak/fair/strong/excellent)
- Real-time email validation
- Error messages below each field
- Loading state on submit button
- After signup → redirect to /onboarding

2. LOGIN PAGE (app/(auth)/login/page.tsx):
Fields:
- Email
- Password

Features:
- Google OAuth button
- Remember me checkbox
- Forgot password link → modal (not new page)
- Error: "Invalid credentials" message
- Loading state
- After login → redirect to /dashboard

3. ONBOARDING PAGE (app/onboarding/page.tsx):
3-step wizard:
Step 1 - "Tell us about you":
  - Business name
  - Your role/title
  - Country (dropdown, default USA)
  - Currency preference (USD/GBP/EUR/AUD/CAD)

Step 2 - "Set up your brand":
  - Logo upload (drag and drop, stored in Supabase storage)
  - Brand color picker
  - Business tagline
  - Website URL

Step 3 - "Your first proposal":
  - Mini preview of what a proposal looks like
  - "Create my first proposal" CTA button → /proposals/new

Progress bar at top, skip button bottom right.
Save each step to Supabase profiles table immediately.

4. FORGOT PASSWORD FLOW:
- Modal that opens from login
- Email input → sends reset link via Supabase Auth
- Success state: "Check your email"

5. MIDDLEWARE (middleware.ts):
- Protect all /dashboard/* routes → redirect to /login if not authenticated
- Redirect authenticated users away from /login and /signup → /dashboard
- Allow public access to /proposal/[shareId] (public proposal view)

Use Supabase Auth for everything. Handle all error states. Make it production-ready.
```

---

# ═══════════════════════════════════════════
# PHASE 3 — LANDING PAGE
# ═══════════════════════════════════════════

## PROMPT 3.1 — Hero Section

```
Build the Hero section for Proposar's landing page (components/landing/Hero.tsx).

AESTHETIC: Dark luxury SaaS. Think Stripe meets Notion. Dark background with gold accents. NOT purple gradients. NOT generic AI look.

Color palette:
- Background: #0a0a14 (near black with slight blue tint)
- Primary text: #faf8f4 (warm white)
- Secondary text: #888890
- Gold accent: #c9a84c
- Gold light: #e8c76a
- Surface: #12121e
- Border: #1e1e2e

Fonts:
- Heading: Playfair Display (serif, elegant)
- Body: DM Sans (clean, modern)
Import both from Google Fonts.

HERO CONTENT:

Top badge (pill shaped, animated shimmer):
"✦ Trusted by 2,000+ freelancers worldwide"

Headline (large, split into 2 lines):
"Write Proposals That"
"Win Deals." ← this line in gold gradient

Subheadline:
"Stop spending 3 hours on proposals that get ignored. Proposar uses AI to generate professional, persuasive proposals in 60 seconds — so you close faster and earn more."

TWO CTA buttons:
Primary: "Generate Free Proposal →" (gold background, dark text, bouncy hover)
Secondary: "See How It Works" (ghost button, plays demo video modal)

Social proof row below buttons:
- "★★★★★ 4.9/5 from 800+ reviews"
- Avatar stack (5 overlapping user avatars)
- "Join 2,000+ freelancers closing more deals"

HERO VISUAL (right side or below on mobile):
Animated mockup of a proposal being generated:
- Show a "typing" animation inside a dark card
- Card has: client name, project type, budget
- Below it: a beautiful proposal document appearing line by line
- Use CSS animation to simulate the typewriter effect
- Add a subtle "View count: 3 views" notification popup animating in

ANIMATIONS:
- Staggered fade-up entrance for all elements (Framer Motion)
- Floating animation on the mockup card
- Shimmer effect on the badge
- Gradient mesh background (animated, subtle)

LAYOUT: Full viewport height on desktop, centered. Responsive for mobile.
```

---

## PROMPT 3.2 — How It Works Section

```
Build the "How It Works" section for Proposar (components/landing/HowItWorks.tsx).

DESIGN: Same dark luxury palette. Section has a subtle grid pattern background.

Section label: "THE PROCESS" (small caps, gold, letter-spaced)
Section title: "From Brief to Deal in 60 Seconds"
Subtitle: "No templates to fight with. No blank page anxiety. Just results."

THREE STEPS (horizontal on desktop, vertical on mobile):

Step 1 — "Fill in the Details" 
Icon: A sleek form icon (gold outlined)
Description: "Enter your client's name, project type, budget, and a few bullet points about what you'll deliver. Takes 30 seconds."
Visual: Animated form filling itself in

Step 2 — "AI Writes Your Proposal"
Icon: Sparkle/AI icon
Description: "Proposar's AI crafts a complete, persuasive proposal — with executive summary, deliverables, timeline, pricing, and a compelling close."
Visual: Animated text generating in a document

Step 3 — "Send & Get Notified"
Icon: Send + notification bell
Description: "Share a beautiful proposal link. You'll know the exact moment your client opens it — and how long they spent reading."
Visual: Phone notification mockup "🔔 Sarah just opened your proposal!"

Between steps: animated dotted line connector
Each step: numbered (01, 02, 03) in large faded gold text behind

Add a "Watch 2-min Demo" button at the bottom (ghost style, with play icon).
```

---

## PROMPT 3.3 — Features Section

```
Build the Features section for Proposar (components/landing/Features.tsx).

Layout: 2-column bento grid on desktop (like Linear's feature page). Each feature is a dark card.

Section label: "EVERYTHING YOU NEED"
Title: "Built for Freelancers Who Want to Win"

FEATURE CARDS (8 features, varying sizes in bento grid):

LARGE CARD (spans 2 columns):
Feature: "AI That Writes Like You"
Description: "Choose your tone — Professional, Friendly, Bold, or Formal. The AI adapts to your voice and your client's industry. Every proposal feels handwritten, not generated."
Visual: Toggle between 4 tone options showing text preview changing

REGULAR CARDS:

1. "Open Tracking"
Description: "Know the second your client opens your proposal. See how long they read it and how far they scrolled."
Icon: 👁️ Eye with pulse animation

2. "One-Click Accept"
Description: "Clients can accept your proposal directly from the link — no back and forth, no printing, no signing PDFs."
Icon: ✅ Checkmark

3. "Beautiful PDF Export"
Description: "Download any proposal as a pixel-perfect PDF — your branding, your logo, your colors."
Icon: 📄 Document

4. "Client Dashboard"
Description: "Track all your proposals in one place. See which deals are hot, which need follow-up, and your overall win rate."
Icon: 📊 Chart

5. "Follow-Up Reminders"
Description: "Never let a proposal go cold. Set automatic follow-up reminders that go out if the client hasn't responded in X days."
Icon: 🔔 Bell

6. "Reusable Templates"
Description: "Save your best proposals as templates. Spin up new proposals for similar projects in under 10 seconds."
Icon: ⚡ Lightning

MINI STAT CARDS (at the bottom):
- "3 hrs → 60 sec" (time saved)
- "42% higher win rate" (avg improvement)
- "2,000+ freelancers" (community)
- "$2.4M in deals closed" (social proof)

All cards have hover effects: subtle gold border glow, slight lift.
Framer Motion scroll-triggered entrance animations.
```

---

## PROMPT 3.4 — Pricing Section

```
Build the complete Pricing section for Proposar (components/landing/Pricing.tsx).

IMPORTANT: This targets USA/UK/AUS/Canada users. Prices in USD.

Toggle at top: "Monthly / Annual" (Annual shows "Save 20%" badge)

THREE PLANS:

STARTER — $19/month ($15/mo annual)
Badge: "Get Started"
Color: Default dark card
Features:
✓ 10 proposals per month
✓ AI proposal generation
✓ Shareable proposal links
✓ Open tracking (basic)
✓ 3 proposal templates
✓ PDF export
✓ Email support
✗ Custom branding
✗ Follow-up reminders
✗ Client dashboard
✗ Priority AI
CTA: "Start Free Trial"

PRO — $29/month ($23/mo annual) ← MOST POPULAR
Badge: "Most Popular" (gold badge, this card is slightly larger, gold border)
Color: Slightly elevated, gold accent border
Features:
✓ Unlimited proposals
✓ AI proposal generation (priority)
✓ Shareable proposal links
✓ Advanced open tracking + scroll depth
✓ Unlimited templates
✓ PDF export with your branding
✓ Follow-up reminders
✓ Client dashboard
✓ Custom logo & colors
✓ Chat support
✗ Team members
✗ API access
CTA: "Start Free Trial" (gold button)

AGENCY — $79/month ($63/mo annual)
Badge: "For Teams"
Color: Premium dark card, subtle gradient
Features:
✓ Everything in Pro
✓ 5 team members
✓ Team proposal sharing
✓ White-label proposals (remove Proposar branding)
✓ API access
✓ Custom domain for proposal links
✓ Dedicated account manager
✓ Priority support (1hr response)
✓ Custom onboarding call
✓ Usage analytics
CTA: "Start Free Trial"

Below plans:
- "All plans include 14-day free trial. No credit card required."
- "Cancel anytime. No contracts. No surprises."

FAQ mini section below pricing (4 questions):
Q: "Is there really a free trial?"
A: "Yes — every plan starts with a 14-day free trial. No credit card needed to get started."

Q: "Can I upgrade or downgrade anytime?"
A: "Absolutely. Switch plans whenever you want. Changes take effect immediately."

Q: "Do you offer refunds?"
A: "Yes. If you're not happy in the first 30 days, we'll give you a full refund. No questions asked."

Q: "What counts as a 'proposal'?"
A: "Each AI-generated proposal counts as one. Duplicating or editing existing proposals doesn't count."

Add a comparison table that shows all features across all 3 plans in detail.
```

---

## PROMPT 3.5 — Testimonials + Social Proof

```
Build the Testimonials section for Proposar (components/landing/Testimonials.tsx).

DESIGN: Dark cards with subtle gradient borders. Auto-scrolling horizontal carousel (infinite loop, smooth).

Section label: "WHAT FREELANCERS SAY"
Title: "They Were Skeptical. Now They're Closing."

CREATE 12 testimonials (realistic, specific, from different freelancer types):

1. Name: Sarah Chen | Role: Brand Designer, New York
Stars: ★★★★★
Quote: "I used to dread writing proposals. Now I generate one in literally 60 seconds and my win rate went from maybe 30% to almost 60%. The AI somehow writes better than I do."
Avatar: initials SC, blue gradient

2. Name: Marcus Webb | Role: Web Developer, London
Stars: ★★★★★
Quote: "The open tracking alone is worth the subscription. I know exactly when to follow up because I can see when they read it. Closed a £8,000 project this way last week."

3. Name: Priya Sharma | Role: Digital Marketing Agency, Toronto
Stars: ★★★★★
Quote: "We send 20+ proposals a month. Proposar saves my team at least 40 hours a month. That's basically a full week of work back. The ROI is insane."

4. Name: Jake Morrison | Role: Freelance Copywriter, Austin TX
Stars: ★★★★★
Quote: "I was spending Sunday nights writing proposals. Now I do it in the Uber to my client meeting. No joke."

5. Name: Amelia Foster | Role: UX Designer, Sydney
Stars: ★★★★★
Quote: "The tone selector is brilliant. I switched to 'Bold' for a startup client and the proposal felt completely different — more exciting. Won the project."

6. Name: David Park | Role: SEO Consultant, Chicago
Stars: ★★★★
Quote: "Honestly I thought AI-written proposals would sound robotic. They don't. They sound better than what I wrote manually. Still slightly embarrassed about that."

7. Name: Lucia Fernandez | Role: Social Media Manager, Miami
Stars: ★★★★★
Quote: "Proposar paid for itself with literally the first proposal. $2,400 project, closed in 2 days. The client said my proposal was 'the most professional' they received."

8. Name: Tom Bradley | Role: Video Producer, Manchester
Stars: ★★★★★
Quote: "I've tried every proposal tool. Proposify was too complex, Google Docs was too basic. Proposar is the Goldilocks. Simple, powerful, beautiful output."

9. Name: Nina Kowalski | Role: Graphic Designer, Toronto
Stars: ★★★★★
Quote: "The follow-up reminder saved a $5k project. I forgot about it completely, Proposar reminded me to follow up, client had just been busy and said yes immediately."

10. Name: Alex Rivera | Role: Full Stack Developer, San Francisco
Stars: ★★★★★
Quote: "Closed $47k in projects in my first 2 months using Proposar. I'm not saying it's all because of the tool but my proposals are unrecognisably better now."

11. Name: Chloe Thompson | Role: Brand Strategist, Melbourne
Stars: ★★★★★  
Quote: "My clients keep complimenting my proposals before they even see my portfolio. That used to never happen. First impressions matter so much."

12. Name: Ryan Okafor | Role: Motion Designer, Lagos
Stars: ★★★★★
Quote: "Using Proposar from Nigeria to close clients in the US and UK. The proposals look completely professional. Nobody knows I'm a team of one."

Display as 2-row infinite scroll carousel.
Add a "Wall of Love" Twitter/X-style posts section below (6 fake tweet cards with real-looking formatting).

Also add key stats bar:
- 2,000+ Active Users
- 14,500+ Proposals Sent  
- 42% Average Win Rate Increase
- $4.2M+ In Deals Closed
Animate these numbers counting up when scrolled into view.
```

---

## PROMPT 3.6 — FAQ + Footer

```
Build the FAQ and Footer sections for Proposar.

FAQ SECTION (components/landing/FAQ.tsx):
- Accordion style, smooth open/close animation
- Section title: "Everything You Need to Know"
- 10 questions covering: pricing, free trial, how AI works, data privacy, integrations, cancellation, team features, proposal limits, PDF quality, support

FOOTER (components/landing/Footer.tsx):
4-column layout:

Column 1: Brand
- Proposar logo + tagline
- "The proposal tool built for freelancers who want to win."
- Social icons: Twitter/X, LinkedIn, Instagram, YouTube (all link to #)

Column 2: Product
- Features
- Pricing  
- Templates
- Changelog
- Roadmap

Column 3: Resources
- Blog
- Help Center
- Video Tutorials
- API Docs
- Affiliate Program

Column 4: Company
- About
- Careers (We're hiring badge)
- Privacy Policy
- Terms of Service
- Contact

Bottom bar:
- © 2026 Proposar. All rights reserved.
- "Made with ♥ for freelancers everywhere"
- Payment icons: Visa, Mastercard, PayPal, Stripe badge

ALSO: Build a sticky announcement bar at the very top of the page:
"🎉 Launch offer: Get 3 months free on any annual plan — ends soon → Claim offer"
(dismissible with X button, gold background, dark text)

ALSO: Add a floating "Try Proposar Free" button that appears after scrolling 50% down the page. Sticky bottom right, gold, with sparkle icon. Smooth entrance animation.
```

---

# ═══════════════════════════════════════════
# PHASE 4 — DASHBOARD
# ═══════════════════════════════════════════

## PROMPT 4.1 — Dashboard Layout + Sidebar

```
Build the complete dashboard layout for Proposar (app/(dashboard)/layout.tsx and components/dashboard/Sidebar.tsx).

DESIGN: Dark sidebar SaaS like Linear or Vercel dashboard. Premium, minimal, fast-feeling.

SIDEBAR (240px wide, fixed):
Top:
- Proposar logo
- User avatar + name + plan badge (Free/Starter/Pro/Agency)

Navigation items with icons:
- 📊 Dashboard (overview)
- 📄 Proposals (with count badge)
- ➕ New Proposal (highlighted in gold)
- 👥 Clients
- 📋 Templates
- ⚙️ Settings

Bottom of sidebar:
- Upgrade banner (if on free plan): "You're on Free. Upgrade to Pro →" with mini progress bar showing proposals used/limit
- Help & Support link
- Keyboard shortcuts hint

TOPBAR (full width, 60px height):
- Page title (dynamic based on current page)
- Search bar (CMD+K shortcut)
- Notification bell with badge
- "New Proposal" quick action button (gold)
- User menu dropdown (profile, billing, sign out)

MOBILE: Sidebar collapses to bottom navigation bar (5 icons).

Make layout responsive. Animate sidebar entrance. Active states for nav items.
```

---

## PROMPT 4.2 — Dashboard Overview Page

```
Build the main Dashboard overview page for Proposar (app/(dashboard)/dashboard/page.tsx).

This is what users see first when they log in. Make it feel powerful and useful.

TOP ROW — 4 Stat Cards (components/dashboard/StatsCard.tsx):
1. "Total Proposals" — count, "+3 this week" subtext, trend arrow
2. "Win Rate" — percentage, comparison to last month  
3. "Proposals Viewed" — count, "clients are reading" subtext
4. "Total Value Won" — dollar amount, change from last month

Each card: dark background, icon, large number, trend indicator, subtle hover animation.

MIDDLE SECTION — 2 columns:

Left (60%): "Recent Proposals"
- Table/list of last 5 proposals
- Columns: Client, Project Type, Value, Status badge, Sent date, Actions
- Status badges with colors: Draft (gray), Sent (blue), Viewed (yellow), Accepted (green), Declined (red)
- Quick actions: View, Share, Duplicate, Delete
- "View all proposals →" link at bottom

Right (40%): "Quick Actions"
Card 1: "Create New Proposal" — large gold CTA
Card 2: "Proposal Win Rate" — donut chart (accepted vs declined vs pending)
Card 3: "This Week's Activity" — mini timeline of events

BOTTOM SECTION:
"Proposals Needing Attention" section:
- Proposals sent 3+ days ago with no response
- Each shows: client name, days since sent, "Send Follow-up" button
- Empty state: "🎉 All caught up! No proposals need follow-up."

WELCOME MODAL (first login only):
- "Welcome to Proposar, [Name]!"
- 3 quick-start steps with checkboxes
- "Create your first proposal" CTA

Fetch all data from Supabase. Handle loading states with skeleton UI. Handle empty states with helpful CTAs.
```

---

# ═══════════════════════════════════════════
# PHASE 5 — PROPOSAL GENERATION (CORE)
# ═══════════════════════════════════════════

## PROMPT 5.1 — New Proposal Form

```
Build the New Proposal creation page for Proposar (app/(dashboard)/proposals/new/page.tsx and components/proposal/ProposalForm.tsx).

This is the MOST IMPORTANT page — make it exceptional.

LAYOUT: Two-column. Left side: form. Right side: live preview (updates as user types).

FORM — 4 sections with smooth step transitions:

SECTION 1: "About the Client"
- Client Name* (text input, autocomplete from saved clients)
- Client Company (optional)
- Client Email (optional, used for sending)
- Select Existing Client (dropdown) OR "Add as new client" toggle
- Industry (dropdown: Technology, Healthcare, Real Estate, E-commerce, Education, Finance, Creative Agency, Legal, Hospitality, Other)

SECTION 2: "About the Project"  
- Project Title* (text, e.g. "Brand Identity for TechStartup")
- Project Type* (dropdown with 20 options: Web Design, Mobile App, SEO, Content Writing, Social Media, Brand Identity, UI/UX Design, Video Production, Copywriting, Email Marketing, PPC Management, WordPress Site, Shopify Store, Logo Design, Photography, Illustration, App Development, Data Analysis, Consulting, Custom Software)
- Project Scope* (large textarea: "Describe what you'll deliver. The more detail, the better the proposal.")
  - Placeholder: "Example: Design and develop a 5-page website with homepage, about, services, portfolio, and contact pages. Includes mobile responsive design, basic SEO setup, and 2 rounds of revisions."
  - Character count shown
  - "Need inspiration? See examples →" expandable tips

SECTION 3: "Pricing & Timeline"
- Budget Amount* (number input with currency selector: USD/GBP/EUR/AUD/CAD)
- Budget Type: (Fixed Price | Hourly Rate | Monthly Retainer)
- Project Timeline* (dropdown: 1 week, 2 weeks, 3 weeks, 1 month, 6 weeks, 2 months, 3 months, 6 months, Custom)
- Start Date (date picker, optional)
- Payment Terms (dropdown: 50% upfront / 50% on completion | 100% upfront | Monthly | Net 30 | Custom)

SECTION 4: "Proposal Settings"
- Proposal Tone* (4 options shown as cards):
  🤝 Professional — "Formal, polished, enterprise-ready"
  😊 Friendly — "Warm, personable, relationship-first"  
  💪 Bold — "Confident, punchy, results-focused"
  📊 Formal — "Conservative, detailed, corporate"

- Include Sections (checkboxes, all checked by default):
  ☑ Executive Summary
  ☑ Understanding Your Challenge  
  ☑ Proposed Solution
  ☑ Deliverables
  ☑ Timeline & Milestones
  ☑ Investment / Pricing
  ☑ About Us / Why Choose Us
  ☑ Next Steps
  ☐ Case Studies / Past Work (optional)
  ☐ Testimonials (optional)
  ☐ Terms & Conditions (optional)

- Additional Context (optional textarea): "Anything else the AI should know? Special requirements, competitor names to avoid, specific language to use?"

- Expiry Date (optional): "Set a date when this proposal expires to create urgency"

GENERATE BUTTON:
Large, gold, full width: "✨ Generate My Proposal"
- Show proposals remaining (e.g., "7 of 10 proposals remaining this month")
- If limit reached → show upgrade modal instead

LIVE PREVIEW (right panel):
- As user fills form, show a realtime preview card
- Show: client name, project type, budget, timeline
- "Your proposal will include X sections"
- Mini template preview based on selected tone

VALIDATION: All required fields, show inline errors. Prevent submit if incomplete.

Connect to /api/generate endpoint. Show loading state during generation (animated loader with progress messages: "Crafting your opening...", "Writing deliverables...", etc.)
```

---

## PROMPT 5.2 — AI Generation API

```
Build the complete AI proposal generation API for Proposar (app/api/generate/route.ts and lib/anthropic.ts).

ANTHROPIC SETUP (lib/anthropic.ts):
- Use claude-sonnet-4-20250514 model
- Max tokens: 2000
- Temperature: 0.7
- Build a master prompt function that takes all form inputs and generates a complete proposal

THE MASTER PROMPT (this is critical — build this exactly):

The system prompt should be:
"You are an elite business proposal writer with 20 years of experience helping freelancers and agencies win high-value contracts. You have studied thousands of winning proposals. You write proposals that are persuasive, professional, and make clients feel completely understood. Your proposals have helped win over $50M in contracts. You write in clear, confident English targeting US, UK, AUS, and Canadian clients."

The user prompt should dynamically build from all inputs:

"Write a complete, professional business proposal with the following details:

FREELANCER/AGENCY INFORMATION:
- Name: {yourName}
- Business: {businessName}  
- Title: {yourTitle}

CLIENT INFORMATION:
- Client Name: {clientName}
- Company: {clientCompany}
- Industry: {industry}

PROJECT DETAILS:
- Project Title: {projectTitle}
- Project Type: {projectType}
- Scope: {projectScope}
- Budget: {currency}{amount} ({budgetType})
- Timeline: {timeline}
- Payment Terms: {paymentTerms}
- Start Date: {startDate}

TONE: {tone} — {toneDescription}

SECTIONS TO INCLUDE: {selectedSections}

ADDITIONAL CONTEXT: {additionalContext}

WRITING RULES:
1. Open with the CLIENT'S problem — not your credentials
2. Use the client's name {clientName} at least 3 times naturally
3. Make them feel understood before selling anything
4. Quantify benefits wherever possible (save X hours, increase Y by Z%)
5. Use confident language — avoid "I think", "maybe", "possibly"
6. The investment section should list what's included clearly with your pricing
7. End with ONE clear next step — not multiple options
8. Write in {tone} voice throughout
9. Total length: 600-800 words (not counting headers)
10. Format in clean markdown with ## headers for each section

Write the complete proposal now. This is a final, ready-to-send document."

API ROUTE (app/api/generate/route.ts):
- POST endpoint
- Authenticate user (check Supabase session)
- Check proposal usage limits based on plan
- Call Anthropic API with built prompt
- Save generated proposal to Supabase
- Increment user's proposals_used_this_month
- Log activity
- Return proposal content + proposal ID
- Handle errors gracefully (API timeout, rate limit, etc.)
- Return proper error messages for each failure case

STREAMING SUPPORT:
- Implement streaming response so proposal text appears word by word
- Use Vercel AI SDK or manual streaming
- This makes the generation feel fast and magical

Usage check logic:
- Free plan: 3 proposals/month
- Starter: 10 proposals/month  
- Pro: Unlimited
- Agency: Unlimited

Return 402 Payment Required with upgrade URL if limit exceeded.
```

---

## PROMPT 5.3 — Proposal View & Editor

```
Build the Proposal view and editing page (app/(dashboard)/proposals/[id]/page.tsx and components/proposal/ProposalPreview.tsx).

This is where users see their generated proposal and can edit/send it.

LAYOUT: Full screen editor. Top toolbar. Left: editor. Right: preview.

TOP TOOLBAR:
- Back button "← Proposals"
- Proposal title (editable inline)
- Status badge (Draft/Sent/Viewed/Accepted)
- Action buttons:
  - "Edit" / "Preview" toggle
  - "Download PDF" button
  - "Share Proposal" button (opens ShareModal)
  - "..." more menu: Duplicate, Archive, Delete

EDITOR (left panel):
- Rich text editor (use TipTap or similar)
- The generated markdown converted to editable rich text
- Toolbar: Bold, Italic, Heading, Bullet list, Table, Divider
- Auto-saves every 30 seconds (show "Saved" status)
- Manual save button

PREVIEW (right panel):
Shows the proposal exactly how the client will see it:

PROPOSAL DOCUMENT DESIGN:
- Clean white background (this is a document, not dark UI)
- Your logo top left, date top right
- Client name and company prominent
- Beautiful typography: headings in Playfair Display
- Gold accent line under the header
- Sections clearly separated
- Pricing shown in a clean table/box
- "Accept This Proposal" button at bottom (client-facing)
- Your signature/contact at very bottom
- "Powered by Proposar" small footer (removable on Agency plan)

The preview should look like a $10,000 proposal document.

PROPOSAL ANALYTICS SIDEBAR (slide in from right):
Show when "View Analytics" clicked:
- Total views
- Last viewed: "2 hours ago"
- Average reading time
- Scroll depth percentage
- View timeline chart
- Client location (if tracked)

SHARE MODAL (components/proposal/ShareModal.tsx):
- Proposal link: Proposar.io/p/abc123 (copy button)
- "Send via Email" form: to email, subject, personal message
- "Send via WhatsApp" button (opens wa.me link)
- QR code for the proposal link
- Link settings: Enable/disable link, Set expiry date, Require email to view
- Preview of the email that will be sent
```

---

## PROMPT 5.4 — Public Proposal Page

```
Build the public proposal page (app/proposal/[shareId]/page.tsx) — this is what the CLIENT sees.

This page is critical. The client opens a link and sees a stunning proposal. Make it exceptional.

REQUIREMENTS:
- No authentication needed (public page)
- Mobile-first (client might open on phone)
- Track the view (call /api/proposals/[id]/track on page load)
- Track scroll depth (send update every 10% scrolled)
- Track time spent (send on page unload)

PAGE LAYOUT:

TOP BANNER (thin, elegant):
- "📄 Business Proposal from [Freelancer Name]"
- Date sent
- PDF download button

PROPOSAL DOCUMENT (centered, max-width 800px, white background):

HEADER:
- Freelancer/agency logo (left)
- "PROPOSAL" label (small caps, gold)
- Date (right)
- Horizontal gold line

CLIENT SECTION:
"Prepared exclusively for:"
[Client Name] in large Playfair Display
[Client Company]

BODY:
- All proposal sections beautifully formatted
- Clean typography, generous spacing
- Section dividers
- Pricing shown in elegant table
  
INVESTMENT BOX (special styled section):
Large bordered box showing:
- Line items if multiple deliverables
- Subtotal, any discounts, total
- Payment terms
- Currency and amount prominently displayed

ACCEPT SECTION (bottom of proposal, very prominent):
Big section with:
"Ready to Move Forward?"
"Click the button below to accept this proposal. We'll be in touch within 24 hours to get started."

[ACCEPT THIS PROPOSAL] — Large gold button, full width almost
"By clicking accept, you agree to the terms outlined above."

After clicking accept:
- Show a confirmation modal: "Confirm acceptance of proposal for [Project] at [Amount]?"
- On confirm: update proposal status to 'accepted' in DB, send email to freelancer
- Show success page: "🎉 Proposal Accepted! [Freelancer] will contact you shortly."

DECLINE option (small text link below button): "Not the right fit? Let us know →" → small form asking reason

FOOTER:
- Freelancer contact details
- "Questions? Reply to this email or contact us directly"
- "This proposal was created with Proposar"

EXPIRY WARNING:
If proposal has expiry date, show a countdown banner at top:
"⏰ This proposal expires in 2 days and 14 hours"
Red countdown timer for urgency.

Make this page load extremely fast (static generation where possible).
```

---

# ═══════════════════════════════════════════
# PHASE 6 — STRIPE PAYMENTS
# ═══════════════════════════════════════════

## PROMPT 6.1 — Stripe Integration

```
Build the complete Stripe payment integration for Proposar.

PLANS:
- Starter: $19/month or $180/year (save 20%)
- Pro: $29/month or $276/year (save 20%)
- Agency: $79/month or $756/year (save 20%)

CREATE:
1. lib/stripe.ts — Stripe client, helper functions

2. app/api/stripe/checkout/route.ts — POST endpoint:
- Authenticate user
- Create/retrieve Stripe customer
- Create checkout session with:
  - Correct price ID (from env vars)
  - Success URL: /dashboard?upgrade=success
  - Cancel URL: /pricing
  - Customer email prefilled
  - Trial period: 14 days
  - Metadata: userId, plan
- Return checkout URL
- Redirect user to Stripe checkout

3. app/api/stripe/webhook/route.ts — POST endpoint:
- Verify Stripe webhook signature
- Handle these events:
  - checkout.session.completed → activate subscription, update Supabase profile
  - customer.subscription.updated → update plan/status in Supabase
  - customer.subscription.deleted → downgrade to free in Supabase
  - invoice.payment_failed → update status to past_due, send email
  - invoice.payment_succeeded → ensure subscription is active
- Log all events

4. app/api/stripe/portal/route.ts — POST endpoint:
- Create Stripe billing portal session
- Return portal URL (user can manage subscription, cancel, update card)

5. Upgrade Modal (components/UpgradeModal.tsx):
- Shows when user hits plan limit
- Display what they're missing
- All 3 plan cards
- Monthly/annual toggle
- "Upgrade Now" → calls checkout API
- "Maybe later" → close

6. Billing Settings page (inside /settings):
- Current plan display
- Next billing date
- "Manage Billing" button → Stripe portal
- Plan usage (proposals used vs limit)
- "Cancel Plan" link (goes to portal)

7. Middleware check:
- On every API call that uses AI, check subscription status
- Return appropriate limits based on plan
```

---

# ═══════════════════════════════════════════
# PHASE 7 — CLIENTS + TEMPLATES
# ═══════════════════════════════════════════

## PROMPT 7.1 — Clients Page

```
Build the Clients management page (app/(dashboard)/clients/page.tsx).

FEATURES:
- List all clients in a table with columns: Name, Company, Email, Proposals Sent, Win Rate, Total Value, Last Activity, Actions
- Search and filter clients
- Sort by any column
- Add new client (modal form)
- Edit client (slide-over panel)
- Delete client (confirmation dialog)
- Click on client → client detail page showing all proposals for that client

CLIENT DETAIL PAGE:
- Client info header with edit button
- All proposals for this client (timeline view)
- Client stats: Total proposals, Won, Value
- Notes section (free text, auto-saves)
- Quick action: "New Proposal for [Client]"

All connected to Supabase clients table with full CRUD operations.
```

---

## PROMPT 7.2 — Templates Page

```
Build the Templates page (app/(dashboard)/templates/page.tsx).

TWO SECTIONS:

1. Proposar BUILT-IN TEMPLATES (top section):
Pre-built templates for common project types:
- Web Design Package
- Brand Identity Project
- Social Media Management
- SEO Campaign
- App Development
- Content Writing Package
- Consulting Engagement
- Video Production

Each shown as a card with: template name, project type, preview thumbnail, "Use Template" button.

When "Use Template" clicked → goes to new proposal form pre-filled with template content.

2. MY TEMPLATES (saved by user):
- Proposals the user saved as templates
- Same card layout
- "Save current proposal as template" option on every proposal
- Edit, duplicate, delete actions

PREMIUM TEMPLATES section (Pro/Agency only):
- 10 more advanced templates (locked behind upgrade for free/starter users)
- Shows blurred preview with "Upgrade to unlock" overlay
```

---

# ═══════════════════════════════════════════
# PHASE 8 — SETTINGS
# ═══════════════════════════════════════════

## PROMPT 8.1 — Settings Page

```
Build the complete Settings page (app/(dashboard)/settings/page.tsx).

Tabbed layout with these sections:

TAB 1: Profile
- Avatar upload (drag & drop, Supabase storage)
- Full name, email (read-only, change email separate flow)
- Business name, business type
- Website, phone
- Bio (used in proposals "About Us" section)
- Location: City, Country
- Save button

TAB 2: Business Branding (for proposals)
- Logo upload (shown on all proposals)
- Brand color (color picker — used as accent on proposals)
- Default signature text
- Business address (shown on proposals)
- Default payment terms
- Default currency

TAB 3: Proposal Defaults
- Default tone (Professional/Friendly/Bold/Formal)
- Default sections to include
- Default expiry days (e.g., "Proposals expire after 30 days")
- Auto follow-up: enabled/disabled, days to wait

TAB 4: Notifications
- Email notification toggles:
  ☑ When client views my proposal
  ☑ When proposal is accepted
  ☑ When proposal is declined
  ☑ When proposal expires
  ☑ Weekly summary email
  ☐ Product updates & tips

TAB 5: Billing
- Current plan with features list
- Usage: proposals used / limit this month, progress bar
- Next billing date + amount
- "Manage Billing / Cancel" → Stripe portal
- Invoice history (fetch from Stripe)
- Upgrade/downgrade options

TAB 6: Integrations (future-ready, show as "Coming Soon"):
- Zapier
- Slack notifications
- Google Calendar
- HubSpot
- Notion
(Each shows connect button — for now shows "Coming Soon" tooltip)

TAB 7: Account
- Change password
- Change email
- Export all data (GDPR)
- Delete account (with confirmation: type "DELETE" to confirm)
```

---

# ═══════════════════════════════════════════
# PHASE 9 — EMAILS
# ═══════════════════════════════════════════

## PROMPT 9.1 — Transactional Emails

```
Build the complete email system for Proposar using Resend (lib/resend.ts).

Create beautiful HTML email templates for:

1. WELCOME EMAIL (sent on signup):
Subject: "Welcome to Proposar — let's win your first deal 🚀"
Content: Welcome message, 3 quick-start steps, link to dashboard, founder note

2. PROPOSAL SENT CONFIRMATION (to freelancer):
Subject: "Proposal sent to [Client Name] ✓"
Content: Confirmation, proposal link, "You'll be notified when they open it"

3. PROPOSAL VIEWED ALERT (to freelancer):
Subject: "🔔 [Client Name] just opened your proposal"
Content: Time of view, which proposal, how long they read, CTA: "Follow up now →"

4. PROPOSAL ACCEPTED 🎉 (to freelancer):
Subject: "🎉 [Client Name] accepted your proposal! [$Amount]"
Content: Celebration, accepted proposal details, suggested next steps, "View details →"

5. PROPOSAL DECLINED (to freelancer):
Subject: "[Client Name] declined your proposal"
Content: Sympathetic tone, reason if provided, "Create a new proposal →"

6. FOLLOW-UP REMINDER (to freelancer):
Subject: "⏰ Time to follow up with [Client Name]"
Content: It's been X days, quick follow-up tips, "View proposal →"

7. PROPOSAL EMAIL TO CLIENT (from freelancer via Proposar):
Subject: "Business Proposal: [Project Title]"
Content: Personal message from freelancer, proposal preview card, "View Full Proposal →" CTA button

8. PAYMENT FAILED (to user):
Subject: "Action needed — payment failed for Proposar"
Content: What happened, update billing CTA

All emails:
- Mobile responsive HTML
- Proposar branding (logo, gold accents)
- Plain text fallback
- Unsubscribe link
- Professional but warm tone
- From: "Proposar <hello@Proposar.io>"

Create email trigger functions that can be called from API routes.
```

---

# ═══════════════════════════════════════════
# PHASE 10 — FINAL POLISH
# ═══════════════════════════════════════════

## PROMPT 10.1 — PDF Generation

```
Build PDF export for Proposar proposals.

Use @react-pdf/renderer to generate pixel-perfect PDFs.

PDF should match the visual proposal preview exactly:
- Logo top left
- Professional header with gold accent
- Client name prominent
- All sections with proper headings
- Pricing in a bordered table
- Footer with freelancer contact details
- "Created with Proposar" small watermark (removable for Agency plan)

API route: /api/proposals/[id]/pdf
- Generate PDF server-side
- Return as download
- File name: "Proposal-[ClientName]-[Date].pdf"

Add download button to:
- Dashboard proposal list (per row)
- Proposal detail page toolbar
- Public proposal page (client can download)
```

---

## PROMPT 10.2 — SEO + Performance

```
Implement complete SEO and performance optimization for Proposar:

1. METADATA (app/layout.tsx and all pages):
- Title: "Proposar — AI Proposal Generator for Freelancers & Agencies"
- Description: "Generate winning client proposals in 60 seconds with AI. Trusted by 2,000+ freelancers. Track opens, close faster, earn more."
- OG image (1200x630) — build a beautiful branded image
- Twitter card
- Canonical URLs
- Structured data (SoftwareApplication schema)

2. LANDING PAGE SEO:
- Target keywords: "proposal generator", "freelance proposal software", "AI proposal writer", "client proposal tool"
- H1, H2 hierarchy correct
- Alt text on all images
- Page load < 2 seconds

3. PERFORMANCE:
- All images in Next.js Image component
- Lazy load below-fold components
- Minimize JS bundle
- Implement loading.tsx skeleton screens for all dashboard pages
- Error.tsx error boundaries for all pages

4. SITEMAP (app/sitemap.ts):
- All public pages
- Auto-generated

5. ROBOTS.TXT:
- Allow all public pages
- Disallow all /dashboard/* routes

6. ANALYTICS (privacy-first):
- Add Vercel Analytics
- Add custom event tracking for: proposal_generated, proposal_sent, proposal_accepted, user_upgraded
```

---

## PROMPT 10.3 — Mobile Responsiveness

```
Audit and fix all mobile responsiveness issues across Proposar. Go through every page and component:

LANDING PAGE mobile (375px - 768px):
- Hero: single column, smaller text, CTA full width
- How it works: vertical stack
- Features: single column cards
- Pricing: vertical stack, most popular highlighted
- Testimonials: single carousel

DASHBOARD mobile:
- Sidebar: becomes bottom nav bar (5 icons)
- Stats: 2x2 grid instead of 4 columns
- Proposal list: card layout instead of table
- New proposal form: full screen, one section at a time

PROPOSAL PAGE mobile:
- Single column (no side-by-side preview)
- Preview hidden during editing, toggle to see
- Share button prominent at top

PUBLIC PROPOSAL mobile:
- Full width document
- Large readable text
- Accept button sticky at bottom

Test at: 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), 1024px (iPad Pro), 1440px (desktop).
Fix any overflow, clipping, or layout issues.
```

---

# ═══════════════════════════════════════════
# DEPLOYMENT CHECKLIST
# ═══════════════════════════════════════════

## PROMPT 11.1 — Deploy to Vercel

```
Prepare Proposar for production deployment on Vercel:

1. vercel.json configuration:
- Region: iad1 (US East) for lowest latency to USA users
- Function timeout: 30s for AI generation route
- Environment variables list

2. Production environment variables checklist — write the complete list of every env var needed

3. Supabase production setup:
- Enable email confirmation
- Set up custom SMTP (Resend)
- Configure auth redirect URLs for production domain
- Set up database backups
- Enable connection pooling (Supavisor)

4. Stripe production setup:
- Live mode keys
- Webhook endpoint pointing to production URL
- Test all webhook events

5. Pre-launch checklist (write as a markdown checklist):
- [ ] All env vars set in Vercel
- [ ] Supabase RLS policies tested
- [ ] Stripe webhooks verified
- [ ] Email sending tested end-to-end
- [ ] All pages mobile tested
- [ ] Error pages (404, 500) look great
- [ ] Loading states on all async operations
- [ ] Rate limiting on AI generation API
- [ ] CORS configured
- [ ] SSL verified

6. Post-launch:
- Set up Vercel Analytics
- Set up error monitoring (Sentry - add basic config)
- Set up uptime monitoring
```

---

# ═══════════════════════════════════════════
# QUICK REFERENCE
# ═══════════════════════════════════════════

## BUILD ORDER (follow this exactly):

| Phase | What | Time Estimate |
|-------|------|--------------|
| 0 | Project setup + config | Day 1 Morning |
| 1 | Supabase schema | Day 1 Afternoon |
| 2 | Auth (login/signup/onboarding) | Day 2 |
| 3 | Landing page | Day 3 |
| 4 | Dashboard layout + overview | Day 4 Morning |
| 5 | Proposal generation (CORE) | Day 4 Afternoon + Day 5 |
| 6 | Stripe payments | Day 5 Afternoon |
| 7 | Clients + Templates | Day 6 Morning |
| 8 | Settings | Day 6 Afternoon |
| 9 | Emails | Day 7 Morning |
| 10 | Polish + SEO + Mobile | Day 7 Afternoon |
| 11 | Deploy | End of Day 7 |

## KEY DECISIONS ALREADY MADE:
- Name: Proposar
- Domain: Proposar.io
- Target market: USA, UK, AUS, Canada (dollar revenue)
- Pricing: $19 / $29 / $79 per month
- Primary differentiator: Fastest, most beautiful proposals + open tracking
- AI model: claude-sonnet-4-20250514
- Database: Supabase
- Payments: Stripe
- Emails: Resend
- Hosting: Vercel

## AFTER EACH PHASE:
Screenshot → Share with co-founder → Get feedback → Continue

---
*Proposar Master Build Document v1.0 | Your path to ₹2Cr*
