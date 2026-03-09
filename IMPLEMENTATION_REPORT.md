# Proposar — Implementation Report

**Product:** AI-powered proposal generator for freelancers and agencies  
**Target markets:** USA, UK, Australia, Canada (dollar revenue)  
**Report date:** March 2026  
**Status:** Full implementation per master build prompts + Problem & Solution + footer pages

---

## 1. Executive Summary

Proposar is a full-stack SaaS application that lets freelancers and agencies create, share, and track professional client proposals. Users sign up, complete onboarding, create proposals with AI (Anthropic Claude), share them via link or email, and clients can view, accept, or decline. Subscriptions are managed via Stripe; transactional emails (welcome, proposal sent/viewed/accepted/declined, payment failed, follow-up) are sent via Resend. The app includes a marketing landing page, authenticated dashboard, client management, templates, settings, PDF export, and public proposal views with accept/decline and analytics.

---

## 2. Tech Stack

### 2.1 Core Framework & Language

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.18 | App Router, SSR, API routes, middleware |
| **React** | 18.3.x | UI components |
| **TypeScript** | 5.6.x | Strict mode, type safety |

### 2.2 Styling & UI

| Technology | Purpose |
|------------|---------|
| **Tailwind CSS** | 3.4.x — Utility-first styling, custom dark palette |
| **Radix UI** | Accordion, Dialog, Dropdown, Label, Slot, Tabs, Toast (headless primitives) |
| **Shadcn/ui** | Button and shared UI patterns (class-variance-authority, clsx, tailwind-merge) |
| **Framer Motion** | 11.x — Animations (landing sections, counters, scroll effects) |
| **Lucide React** | Icons |

### 2.3 Backend & Data

| Technology | Purpose |
|------------|---------|
| **Supabase** | Auth (email + OAuth), PostgreSQL database, Row Level Security (RLS), Storage |
| **@supabase/ssr** | Server-side auth with cookies for Next.js |

### 2.4 External Services

| Service | Purpose |
|---------|---------|
| **Anthropic Claude API** | AI proposal generation (e.g. `claude-sonnet-4-20250514`) |
| **Stripe** | Checkout, Customer Portal, webhooks (subscription lifecycle, payment failed) |
| **Resend** | Transactional emails (HTML templates, base layout) |
| **Vercel Analytics** | Custom event tracking (proposal_generated, proposal_sent, proposal_accepted, user_upgraded) |

### 2.5 Forms & Validation

| Technology | Purpose |
|------------|---------|
| **React Hook Form** | Form state and submission |
| **Zod** | Schema validation |
| **@hookform/resolvers** | Zod + React Hook Form integration |

### 2.6 PDF & Docs

| Technology | Purpose |
|------------|---------|
| **@react-pdf/renderer** | Server-side PDF generation for proposals (authenticated and public) |

### 2.7 Dev & Tooling

| Technology | Purpose |
|------------|---------|
| **ESLint** | Linting (eslint-config-next) |
| **PostCSS / Autoprefixer** | CSS processing |
| **Sentry (@sentry/nextjs)** | Error monitoring (optional; wizard-based setup documented) |

---

## 3. Project Structure (Implemented)

```
Proposar/
├── app/
│   ├── (auth)/                    # Auth route group
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/              # Protected dashboard group
│   │   ├── dashboard/page.tsx
│   │   ├── proposals/page.tsx, proposals/new/page.tsx, proposals/[id]/page.tsx
│   │   ├── templates/page.tsx
│   │   ├── clients/page.tsx, clients/[id]/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── proposal/[shareId]/page.tsx   # Public proposal view (accept/decline)
│   ├── onboarding/page.tsx
│   ├── auth/callback/route.ts
│   ├── api/
│   │   ├── generate/route.ts
│   │   ├── proposals/route.ts, proposals/[id]/route.ts, proposals/[id]/track/route.ts
│   │   ├── proposals/[id]/pdf/route.tsx
│   │   ├── proposal/[shareId]/route.ts, accept/route.ts, decline/route.ts, pdf/route.tsx
│   │   ├── stripe/checkout/route.ts, stripe/portal/route.ts, stripe/webhook/route.ts
│   │   ├── profile/route.ts, profile/upload/route.ts
│   │   ├── clients/route.ts, clients/[id]/route.ts, clients/[id]/proposals/route.ts
│   │   ├── templates/route.ts, templates/[id]/route.ts
│   │   ├── emails/welcome/route.ts, emails/send-proposal/route.ts, emails/follow-up/route.ts
│   │   ├── account/delete/route.ts
│   │   └── ...
│   ├── changelog, roadmap, blog, help, video-tutorials, api-docs, affiliate/
│   ├── about, careers, privacy, terms, contact/
│   ├── layout.tsx
│   ├── page.tsx                   # Landing page
│   ├── error.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   └── opengraph-image.tsx
├── components/
│   ├── landing/                   # Hero, HowItWorks, ProblemSolution, Features, Pricing,
│   │   ├── ...                    # Testimonials, FAQ, Footer, FloatingCTA, AnnouncementBar,
│   │   └── StaticPageLayout.tsx   # reusable layout for static pages
│   ├── dashboard/                 # Sidebar, TopBar, BottomNav, StatsCard, ProposalCard
│   ├── proposal/                  # ProposalForm, ProposalPreview, ProposalEditor, ShareModal,
│   │   └── PublicProposalView.tsx
│   ├── pdf/                       # ProposalPDFDocument.tsx
│   ├── auth/                      # AuthBrandPanel, PasswordStrength, ForgotPasswordModal
│   ├── ui/                        # button (shadcn)
│   └── UpgradeModal.tsx
├── lib/
│   ├── supabase/client.ts, server.ts, middleware.ts
│   ├── stripe.ts
│   ├── anthropic.ts
│   ├── resend.ts
│   ├── analytics.ts
│   ├── config.ts
│   ├── constants.ts
│   └── utils.ts
├── hooks/
│   ├── useUser.ts
│   ├── useProposals.ts
│   └── useSubscription.ts
├── types/
│   └── index.ts
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       ├── 002_profile_settings.sql
│       └── 003_storage_buckets.sql
├── middleware.ts
├── vercel.json
├── DEPLOYMENT.md
└── .env.local.example
```

---

## 4. Database Schema (Supabase / PostgreSQL)

### 4.1 Tables

- **profiles** — Extends `auth.users`: email, full_name, business_name, business_type, avatar_url, logo_url, website, phone, address, city, country, currency, timezone, bio, signature_text, Stripe fields (customer_id, subscription_id, status, plan, period_end), proposal usage (proposals_used_this_month, proposals_reset_date), onboarding_completed, plus settings columns from migration 002 (brand_color, default_payment_terms, default_tone, default_expiry_days, default_sections, auto_follow_up_*, notify_*).
- **clients** — user_id, name, company, email, phone, website, industry, country, notes, tags[], total_proposals, won_proposals, total_value.
- **proposals** — user_id, client_id (optional), share_id (unique), title, project_type, status (draft/sent/viewed/accepted/declined/expired), client_name, client_email, client_company, project_scope, budget_amount/currency, timeline, deliverables[], additional_notes, generated_content, executive_summary, tone, template_id, custom_sections (JSONB), sent_at, viewed_at, view_count, last_viewed_at, viewer_ip, accepted_at, declined_at, expires_at, follow_up_sent, follow_up_at, is_template, template_name, generation_model, generation_tokens.
- **proposal_views** — proposal_id, viewed_at, ip_address, user_agent, country, city, duration_seconds, scrolled_to_percent (analytics).
- **templates** — user_id, name, description, project_type, content, is_public, is_premium, use_count, thumbnail_url, tags[].
- **activity_log** — user_id, proposal_id, event_type, metadata (JSONB).

### 4.2 Security

- RLS enabled on all tables. Policies: users manage own profile, clients, proposals, templates, activity_log; public can SELECT proposals by share_id; proposal_views restricted by proposal ownership.
- Triggers: `update_updated_at` on profiles, proposals, clients; `handle_new_user` creates profile on signup (SECURITY DEFINER).

### 4.3 Storage

- Migration 003 defines storage buckets (e.g. avatars, logos) with appropriate policies.

---

## 5. Authentication & Authorization

- **Supabase Auth:** Email/password and OAuth; session via cookies (SSR).
- **Middleware:** Protects `/dashboard`, `/proposals`, `/templates`, `/clients`, `/settings`, `/onboarding`; redirects unauthenticated users to `/login`; redirects authenticated users from `/login` and `/signup` to `/dashboard`.
- **Auth callback:** `app/auth/callback/route.ts` handles OAuth/email redirect and forwards to `/onboarding` or `/dashboard`.
- **Server vs admin client:** Authenticated CRUD uses standard Supabase client (RLS). Public proposal fetch, accept, decline, and server-only operations (e.g. emails, webhooks) use `createAdminClient()` (service role) where RLS must be bypassed.

---

## 6. Features Implemented

### 6.1 Landing & Marketing

- **Landing page (`app/page.tsx`):** AnnouncementBar, Hero, HowItWorks, ProblemSolution (8-part section with animations, counters, tickers), Features, Pricing, Testimonials, FAQ, Footer, FloatingCTA.
- **Static pages (shared layout via `StaticPageLayout`):** Changelog, Roadmap, Blog, Help Center, Video Tutorials, API Docs, Affiliate Program, About, Careers, Privacy Policy, Terms of Service, Contact. Each has metadata and placeholder content; all linked from Footer.
- **SEO & share:** Root layout metadata (title template, description, keywords, Open Graph, Twitter, robots, canonical); JSON-LD (SoftwareApplication); dynamic `opengraph-image.tsx`; `robots.ts`; `sitemap.ts` (home, login, signup, and all static pages).

### 6.2 Auth & Onboarding

- Login and signup pages (auth layout, brand panel, password strength, forgot-password modal).
- Post-signup onboarding (multi-step); on completion, welcome email triggered via `POST /api/emails/welcome` (checks onboarding_completed).

### 6.3 Dashboard

- **Dashboard home:** Stats (proposals, clients, etc.), recent proposals with links to view and PDF download, quick actions.
- **Proposals:** List with filters, PDF download per row; **Proposals New:** ProposalForm with live preview; **Proposals [id]:** ProposalPreview with edit, share, “Save as template,” and “Download PDF.”
- **Templates:** List and manage saved templates (create from proposals).
- **Clients:** List and client detail page (with proposals for that client).
- **Settings:** Tabbed UI — Profile, Branding, Proposal defaults, Notifications, Billing (Stripe portal), Integrations, Account (e.g. delete). Profile and avatar/logo upload via `PATCH /api/profile` and `POST /api/profile/upload`.

### 6.4 Proposals & AI

- **Create flow:** ProposalForm collects client/project/budget/timeline/tone/sections; optional client picker; submits to `POST /api/generate`. AI uses `lib/anthropic.ts` (system + user prompt from constants); response stored in `proposals` with `client_id` when selected. Analytics: `trackProposalGenerated()`.
- **Preview/editor:** ProposalPreview shows generated content (markdown), toolbar (Share, Save as template, Download PDF). ShareModal sends proposal via `POST /api/emails/send-proposal` (Resend); confirmation and “proposal sent” emails; status set to sent; `trackProposalSent()`.

### 6.5 Public Proposal View

- **Route:** `app/proposal/[shareId]/page.tsx` — server fetches proposal by share_id (admin client for public access).
- **PublicProposalView:** Renders proposal; “Accept” calls `POST /api/proposal/[shareId]/accept` (status update, optional email to freelancer); “Decline” calls `POST /api/proposal/[shareId]/decline` (optional reason, optional email). View tracking via `POST /api/proposals/[id]/track` (view count, last_viewed_at; optional “proposal viewed” email). PDF download: `GET /api/proposal/[shareId]/pdf` (watermark for free plan when applicable).

### 6.6 PDF Generation

- **Authenticated:** `GET /api/proposals/[id]/pdf` — uses `ProposalPDFDocument` (@react-pdf/renderer), proposal + profile data.
- **Public:** `GET /api/proposal/[shareId]/pdf` — same document; plan-based watermark. Both return PDF buffer with correct headers.

### 6.7 Billing (Stripe)

- **Checkout:** `POST /api/stripe/checkout` creates Stripe Checkout Session (price IDs from env: Starter, Pro, Agency; optional annual).
- **Portal:** `POST /api/stripe/portal` returns Stripe Customer Portal URL for managing subscription.
- **Webhook:** `app/api/stripe/webhook/route.ts` handles subscription created/updated/deleted, invoice paid/failed. Syncs subscription and usage to `profiles`; on `invoice.payment_failed` sends Resend “payment failed” email with portal link; on upgrade, `trackUserUpgraded(plan)`.

### 6.8 Emails (Resend)

- **Templates:** Shared `baseLayout()` (branded HTML); all emails use it.
- **Triggers:** Welcome (post-onboarding); Proposal sent confirmation (to freelancer); Proposal viewed alert (to freelancer); Proposal accepted (to freelancer); Proposal declined (to freelancer); Payment failed (with portal link); Proposal sent to client (with link). Follow-up: `POST /api/emails/follow-up` (cron) for automated reminders; protected by `CRON_SECRET` when set.

### 6.9 Analytics & Monitoring

- **Vercel Analytics:** `Analytics` in root layout; custom events in `lib/analytics.ts`: proposal_generated, proposal_sent, proposal_accepted, user_upgraded.
- **Sentry:** Optional; setup via `npx @sentry/wizard@latest -i nextjs`; documented in DEPLOYMENT.md.

### 6.10 Error & Loading

- **Global:** `app/error.tsx` (client boundary).
- **Dashboard:** `app/(dashboard)/loading.tsx` (skeleton), `app/(dashboard)/error.tsx` (client boundary).

### 6.11 Configuration & Constants

- **Plans:** Free (3 proposals/mo, 1 template, 10 clients); Starter $19/mo (10, 3, 50); Pro $29/mo (unlimited); Agency $79/mo (unlimited). Stored in `lib/config.ts` (PLANS, PLAN_LIMITS, APP_METADATA, FEATURE_FLAGS).
- **Constants:** Project types (20), proposal sections, currencies (USD, GBP, EUR, AUD, CAD), timelines, tone options, industries, budget types, payment terms (`lib/constants.ts`).

---

## 7. API Routes Summary

| Method | Route | Purpose |
|--------|--------|---------|
| POST | `/api/generate` | AI proposal generation, insert proposal, optional client_id |
| GET/POST/PATCH/DELETE | `/api/proposals`, `/api/proposals/[id]` | CRUD proposals |
| POST | `/api/proposals/[id]/track` | Track public view, optional “viewed” email |
| GET | `/api/proposals/[id]/pdf` | Authenticated PDF download |
| GET | `/api/proposal/[shareId]` | Public proposal by share_id |
| POST | `/api/proposal/[shareId]/accept` | Client accept; update status; optional email |
| POST | `/api/proposal/[shareId]/decline` | Client decline; optional reason and email |
| GET | `/api/proposal/[shareId]/pdf` | Public PDF download |
| POST | `/api/stripe/checkout` | Create Stripe Checkout session |
| POST | `/api/stripe/portal` | Stripe Customer Portal URL |
| POST | `/api/stripe/webhook` | Stripe webhooks (subscription, invoice) |
| GET/PATCH | `/api/profile` | Get/update profile |
| POST | `/api/profile/upload` | Avatar/logo upload to Supabase Storage |
| GET/POST | `/api/clients`, `/api/clients/[id]`, `/api/clients/[id]/proposals` | Clients CRUD and proposals by client |
| GET/POST/DELETE | `/api/templates`, `/api/templates/[id]` | Templates CRUD |
| POST | `/api/emails/welcome` | Send welcome email (post-onboarding) |
| POST | `/api/emails/send-proposal` | Send proposal to client + confirmation to freelancer |
| POST | `/api/emails/follow-up` | Cron: follow-up reminders (CRON_SECRET) |
| POST | `/api/account/delete` | Account deletion (when implemented) |

---

## 8. Environment Variables

Documented in `.env.local.example` and DEPLOYMENT.md:

- **Supabase:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Anthropic:** `ANTHROPIC_API_KEY`
- **Stripe:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_*_PRICE_ID` (and optional annual)
- **Resend:** `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- **Cron:** `CRON_SECRET` (optional, for follow-up)
- **App:** `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_NAME`
- **Optional:** `SENTRY_DSN` after Sentry wizard

Build-time placeholders are used for Resend and Stripe where needed so `next build` succeeds without keys.

---

## 9. Deployment (Vercel)

- **vercel.json:** Regions (e.g. `iad1`); `app/api/generate/route.ts` `maxDuration: 30`; cron `0 9 * * *` for `/api/emails/follow-up`.
- **DEPLOYMENT.md:** Checklists for env vars, Supabase production (SMTP, redirect URLs, backups), Stripe (live mode, webhooks), pre-launch (RLS, emails, mobile, rate limiting), post-launch (Vercel Analytics, Sentry, uptime).

---

## 10. Design System (Tailwind)

- **Colors:** background `#0a0a14`, foreground `#faf8f4`, surface `#12121e`, border `#1e1e2e`, gold (DEFAULT, light, muted), muted `#888890`.
- **Fonts:** Playfair Display (serif), DM Sans (sans) via next/font; CSS variables `--font-playfair`, `--font-dm-sans`.
- **Animations:** Custom keyframes (e.g. scroll-left, scroll-right) in `globals.css` for tickers/carousels.

---

## 11. What’s Included vs Optional / Future

- **Included:** All features above (auth, onboarding, dashboard, proposals, AI, share, public view, accept/decline, PDF, Stripe, Resend emails, follow-up cron, settings, clients, templates, static pages, SEO, analytics, error/loading).
- **Optional:** Sentry (wizard); annual Stripe prices; “Sales team” page (not in current footer; can be added like other static pages).
- **Placeholder content:** Static pages (changelog, roadmap, blog, help, video-tutorials, api-docs, affiliate, about, careers, privacy, terms, contact) use `StaticPageLayout` with titles and short placeholder text ready for copy.
- **Footer:** Product (Features → `/#how-it-works`, Pricing → `/#pricing`, Templates, Changelog, Roadmap); Resources (Blog, Help, Video Tutorials, API Docs, Affiliate); Company (About, Careers, Privacy, Terms, Contact). Social links still `#` until real URLs are set.

---

## 12. Summary

Proposar is a production-ready SaaS app with a defined tech stack (Next.js 14, TypeScript, Tailwind, Supabase, Stripe, Anthropic, Resend, Framer Motion, React Hook Form + Zod, @react-pdf/renderer, Vercel Analytics). It implements the full user journey from landing and signup through onboarding, proposal creation with AI, sharing and tracking, client accept/decline, PDF export, subscription management, and transactional emails, plus a full set of marketing and legal static pages and deployment documentation.
