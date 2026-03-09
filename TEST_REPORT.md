# Propella / Proposar — Full Test Report

**Date:** March 9, 2026  
**Scope:** Security, AI abuse protection, performance, end-to-end flow

---

## 1. Security Testing

### Implemented

| Control | Status | Details |
|---------|--------|---------|
| **AI rate limiting** | ✅ Added | 10 calls/min per user on `/api/generate`, sequence, contracts/generate |
| **Prompt injection mitigation** | ✅ Added | `additionalContext` & `projectScope` sanitized; "ignore instructions" patterns filtered |
| **Input length caps** | ✅ Existing | Zod: `projectScope` 10–5000 chars, `additionalContext` max 5000, now further trimmed |
| **File upload** | ✅ Existing | MIME (JPEG/PNG/WebP/GIF), 2MB max |
| **API keys server-side** | ✅ Existing | No `NEXT_PUBLIC_` for keys |
| **Protected routes** | ✅ Extended | `/analytics`, `/pipeline`, `/contracts`, `/invoices` in middleware |

### API Key / Model Abuse Protection

- **Plan limits:** Free 3 proposals/month, enforced via `proposals_used_this_month`
- **Per-minute rate limit:** 10 AI calls/user (in-memory; use Upstash for production)
- **429 response:** `Retry-After` header when rate limited

### Recommendations for Production

- Use **Upstash Redis** or **Vercel KV** + `@upstash/ratelimit` for distributed rate limiting
- Set **budget alerts** in Anthropic/OpenAI dashboards
- Consider **per-user daily cap** (e.g. 50/day) beyond plan limits

---

## 2. AI (GPT / Claude) Security

| Item | Status |
|------|--------|
| Keys never in client | ✅ Server-only env |
| Provider selection | ✅ `AI_PROVIDER` env, backend-only |
| Fallback when key missing | ✅ Placeholder content returned |
| Rate limiting | ✅ 10 req/min per user |

---

## 3. Performance Notes

| Concern | Recommendation |
|---------|----------------|
| **Many users** | Supabase scales; ensure DB indexes on `proposals.user_id`, `proposals.status`, `follow_up_steps.scheduled_for` |
| **Cold starts** | Vercel serverless; keep functions lean; consider Edge for public proposal view |
| **PDF generation** | Heavy; consider background job or queue for high volume |
| **In-memory rate limit** | Not shared across instances; use Redis in production |

---

## 4. E2E Flow Test Results

### Login
- **Result:** Session was already active; redirect to `/dashboard` confirmed

### Profile (Settings)
- **Result:** Content may load slowly; `/api/profile` should be checked for latency

### Photo / Logo Upload
- **UI:** Avatar and logo upload in Profile + Business Branding tabs
- **API:** `POST /api/profile/upload` with FormData (`file`, `type`)

### Proposal Creation
- **Form:** Loads correctly at `/proposals/new`
- **Issue:** Proposal creation failed; likely missing `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` in env

### Dashboard Navigation
- **Result:** All routes load: `/pipeline`, `/analytics`, `/contracts`, `/invoices`

### API Routes Used in Flow

| Route | Purpose |
|-------|---------|
| `POST /api/generate` | Create proposal (AI) |
| `POST /api/emails/send-proposal` | Send proposal email |
| `POST /api/proposals/[id]/sequence` | Activate chase sequence |
| `GET /proposal/[shareId]` | Public proposal view |
| `POST /api/proposal/[shareId]/accept` | Client accepts |
| `POST /api/proposal/[shareId]/decline` | Client declines |
| `GET /api/track/open?proposal=` | Open tracking pixel |

---

## 5. Pre-Production Checklist

- [ ] `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` set for proposal generation
- [ ] `RESEND_API_KEY` for email
- [ ] `CRON_SECRET` for follow-up cron
- [ ] Upstash Redis for production rate limiting
- [ ] Monitor AI usage in provider dashboards
