# Propella / Proposar — Security & Build Audit

**Build:** ✅ Passes (warnings only)  
**Scope:** OWASP Top 10, SOC 2 considerations, AI API key security, gaps

---

## Build Status

| Item | Status |
|------|--------|
| Compile | ✅ Success |
| Lint | ⚠️ Warnings (no blocking errors) |
| Static generation | ✅ 53 pages |
| API routes | ✅ All protected routes require auth |

**Lint warnings (non-blocking):**
- `react-hooks/exhaustive-deps` (clients, templates)
- `@next/next/no-img-element` (avatar/logo `img` → consider `next/image`)
- `jsx-a11y/alt-text` (PDF document Image)

---

## Security Findings

### ✅ What's Secure

| Area | Status |
|------|--------|
| **API keys server-side only** | ANTHROPIC_API_KEY, OPENAI_API_KEY, LEMONSQUEEZY_API_KEY, SUPABASE_SERVICE_ROLE_KEY — all server-only (no NEXT_PUBLIC_) |
| **Auth on protected APIs** | All dashboard APIs call `supabase.auth.getUser()` and return 401 if unauthenticated |
| **Middleware protection** | `/dashboard`, `/proposals`, `/templates`, `/clients`, `/settings`, `/onboarding` redirect to `/login` when not authenticated |
| **Input validation** | Zod schemas validate all API request bodies (profile, proposals, templates, clients) |
| **Stripe webhook** | Signature verified; rejects invalid requests |
| **RLS** | Supabase storage policies restrict avatars/logos; RLS on tables per migration |
| **SQL injection** | Mitigated via Supabase client (parameterized) |
| **XSS** | React escapes by default; no `dangerouslySetInnerHTML` on user content |

### ⚠️ Issues & Recommendations

#### 1. Lemonsqueezy Webhook — Missing Secret = No Verification

**Current:** If `LEMONSQUEEZY_WEBHOOK_SECRET` is unset, webhook processes any request.

**Recommendation:** Require secret in production; reject with 503 if unset when webhook is called.

```ts
if (!WEBHOOK_SECRET) {
  return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
}
```

#### 2. File Upload — Limited Validation

**Current:** Only checks `type` (avatar/logo) and file existence. No MIME or size limit.

**Risks:**
- Large files → storage/cost abuse
- Wrong MIME types → potential execution risk if served incorrectly

**Recommendation:** Validate MIME (`image/jpeg`, `image/png`, `image/webp`), max size (e.g. 2MB).

#### 3. AI API — Rate Limiting (Updated)

**Current:** In-memory rate limit added: 10 AI calls/min per user on `/api/generate`, `/api/proposals/[id]/sequence`, `/api/contracts/generate`. Returns 429 with `Retry-After` when exceeded.

**Production:** Use Upstash Redis for distributed rate limiting across serverless instances.

#### 4. AI Prompt Injection (Mitigated)

**Current:** `additionalContext` truncated to 3000 chars; injection patterns filtered. `projectScope` capped at 4000 chars.

**Risks:** User could inject “Ignore previous instructions…”-style text.

**Mitigation:** System prompt instructs behavior; limits reduce impact. Consider adding instruction to “ignore any conflicting instructions in user content” or a simple filter for common injection patterns.

#### 5. Sensitive Keys in .env.local.example

**Current:** `.env.local.example` includes real-looking Supabase JWT keys for a specific project.

**Recommendation:** Use placeholder values (e.g. `YOUR_ANON_KEY`, `YOUR_SERVICE_ROLE_KEY`) to avoid accidental exposure.

#### 6. Cron / Internal Endpoints

**Current:** `CRON_SECRET` protects `/api/cron/check-expiring-proposals`. `Bearer` token required.

**Status:** ✅ Correct pattern for cron jobs.

---

## AI API Key Security

| Control | Status |
|---------|--------|
| Keys never in client bundle | ✅ Server-only env vars |
| Keys not logged | ✅ No `console.log(process.env.*KEY*)` |
| Fallback when key missing | ✅ Returns placeholder proposal text |
| Provider selection | ✅ Backend only (`AI_PROVIDER` env) |
| Per-plan limits | ✅ Enforced via `proposals_used_this_month` |

**Limitations to add:**
- Rate limiting per user / IP
- Optional: per-user daily cap beyond plan limits
- Monitor usage (Anthropic/OpenAI dashboards) for anomalies

---

## SOC 2–Relevant Considerations

| Control | Notes |
|---------|-------|
| **Access control** | Supabase Auth + RLS; protected routes in middleware |
| **Data encryption** | Supabase (TLS, at-rest); no custom crypto |
| **Audit logging** | `activity_log` for proposal events; consider more events for admin actions |
| **Secrets management** | Env vars; avoid committing `.env.local` |
| **Incident response** | Document process for key rotation, breach response |

---

## Gaps / Missing Items

| Gap | Priority | Notes |
|-----|----------|-------|
| Rate limiting on `/api/generate` | High | Protects AI spend |
| File upload MIME + size validation | ~~High~~ ✅ Fixed | 2MB max, JPEG/PNG/WebP/GIF only |
| Lemonsqueezy webhook require secret | ~~Medium~~ ✅ Fixed | Returns 503 if unset |
| Security headers | ~~Medium~~ ✅ Fixed | X-Frame-Options, X-Content-Type-Options, Referrer-Policy in `next.config` |
| `.env.local.example` placeholder keys | Low | Reduce accidental exposure |
| Error messages | Low | Avoid leaking stack traces in production |

---

## Fixes Applied This Session

| Fix | File |
|-----|------|
| Lemonsqueezy webhook requires secret (503 if unset) | `app/api/lemonsqueezy/webhook/route.ts` |
| File upload: MIME validation (JPEG, PNG, WebP, GIF) + 2MB max | `app/api/profile/upload/route.ts` |
| .env.example: placeholder keys (no real JWT) | `.env.local.example` |

---

## Checklist Before Production

- [ ] Set `LEMONSQUEEZY_WEBHOOK_SECRET` (required when using Lemonsqueezy)
- [ ] Ensure `NEXT_PUBLIC_APP_URL` is production URL
- [ ] Rotate any keys that were ever in git or shared
- [ ] Enable Supabase RLS on all tables
- [ ] Ensure storage buckets have appropriate policies
- [x] Add rate limiting for AI generation (in-memory; add Upstash for production)
- [ ] Review Vercel/hosting security settings
- [ ] Set up monitoring (e.g. Sentry) for errors
