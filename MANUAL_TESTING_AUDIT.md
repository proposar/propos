# Propella / Proposar — Manual Testing Audit

**As Co-founder** — Flow, Performance, Validators, Security, Logo, Templates, Profile, Pro Plan

---

## Test Run (2025-03-06) — Gaps Found & Fixed

### Test Account: 2022auradigital@gmail.com (Pro)

**What Worked:**
- Login (email/password) → Dashboard
- Pro plan shown in sidebar
- Templates page loads (built-in, My templates, Premium)
- Free template "Use Template" → navigates to /proposals/new with correct params
- New proposal form: client, project, pricing, sections, INR in currency
- Settings page loads; Profile, Business Branding tabs
- Clients page loads
- "10 proposals remaining this month" shown

**Gaps Found & Fixed:**

| Gap | Cause | Fix |
|-----|-------|-----|
| **Profile PATCH 400** | `website: ""` fails `z.string().url()` | `z.preprocess` to treat empty string as null |
| **Clients API 400** | `page`, `limit` null from URL fail `z.coerce.number()` | `z.preprocess` for null/empty → defaults |
| **Premium "Use Template" does nothing** | Button had no `onClick` / no navigation | Replaced with `<Link>` to `/proposals/new?template=...&projectType=...` |

**Still to verify:**
- Profile save success (retest after website fix)
- Sidebar/TopBar update after profile save (`profile-updated` event)
- Clients list (retest after schema fix)
- Avatar/logo upload
- AI proposal generation (requires ANTHROPIC_API_KEY)
- Share/PDF flows

---

## Fixes Applied (This Session)

### 1. Pro Account — Premium Templates Not Visible
- **Cause:** API response could be cached; profile fetch used default cache.
- **Fix:**
  - `export const dynamic = "force-dynamic"` on `/api/profile` to prevent static/cache.
  - `cache: "no-store"` on all profile fetches (Templates page, Sidebar).
- **Verify:** Sign out, sign in again, go to Templates. Premium section should show “Use Template” (not “Upgrade to unlock”) for Pro.

### 2. Profile Edits Not Reflecting in Sidebar/TopBar
- **Cause:** Sidebar and TopBar fetched profile once on mount; Settings did not notify them.
- **Fix:**
  - On Settings save: `window.dispatchEvent(new CustomEvent("profile-updated"))`.
  - Sidebar and TopBar listen for `profile-updated` and refetch profile.
- **Verify:** Change full name in Settings → Save. Sidebar and TopBar avatar/name should update without refresh.

### 3. Avatar Display
- Sidebar and TopBar now show `avatar_url` when present, or initials.
- Both refetch profile on `profile-updated`.

### 5. Logo Not Visible in PDF
- **Cause:** Profile stores full public URL in `logo_url`; PDF routes called `getPublicUrl(profile.logo_url)` treating it as a path → broken URL.
- **Fix:** If `logo_url` starts with `http`, use as-is; else `getPublicUrl(path)`.
- **Files:** `app/api/proposals/[id]/pdf/route.tsx`, `app/api/proposal/[shareId]/pdf/route.tsx`, `app/api/emails/send-proposal/route.tsx`

### 6. Billing — Lemonsqueezy
- **Added:** Lemonsqueezy integration. When `LEMONSQUEEZY_API_KEY` + `LEMONSQUEEZY_STORE_ID` are set, checkout/portal use Lemonsqueezy; else Stripe.
- **New:** `lib/lemonsqueezy.ts`, `app/api/lemonsqueezy/checkout`, `portal`, `webhook`
- **Config:** Set variant IDs, webhook URL `.../api/lemonsqueezy/webhook`

### 7. AI Provider — Anthropic + ChatGPT
- **Added:** AI provider dropdown in New Proposal (Claude / ChatGPT).
- **New:** `lib/openai.ts`, `OPENAI_API_KEY` in .env, `aiProvider` in `/api/generate`

### 4. Onboarding Logo Not Stored
- **Cause:** Logo area was static; no file input or upload.
- **Fix:**
  - Real file input; click opens file picker.
  - On Next from step 2: upload via `/api/profile/upload`, then save `logo_url` to profile.
  - Tagline stored in `bio` (no separate tagline column).
- **Verify:** Complete onboarding step 2, upload logo, click Next. Check Settings → Business Branding; logo should appear.

---

## Manual Test Checklist

### Auth Flow
- [ ] Sign up — new user created, profile created by trigger
- [ ] Login — email/password works
- [ ] Logout — Sign out clears session, redirects to /login
- [ ] OAuth (Google) — if configured

### Onboarding
- [ ] Step 1 — Business name, role, country, currency saved
- [ ] Step 2 — Brand color, tagline, website, phone, city, address saved
- [ ] Step 2 — Logo upload saves to storage and `logo_url` in profile
- [ ] Step 3 — Complete → redirect to /proposals/new

### Dashboard
- [ ] Stats load (Total Proposals, Win Rate, Viewed, Value Won)
- [ ] Recent proposals table
- [ ] PDF link works
- [ ] Share button (if wired)
- [ ] Welcome modal shows once, closes, persists in localStorage

### Proposals
- [ ] New proposal — form validation
- [ ] AI generation — works with ANTHROPIC_API_KEY
- [ ] Save as template — appears under My templates
- [ ] Share modal — send email (RESEND_API_KEY)
- [ ] PDF download — authenticated and public

### Templates
- [ ] Built-in — “Use Template” links to /proposals/new with correct params
- [ ] My templates — list from DB; Use links to new proposal with templateId
- [ ] Premium — Free: “Upgrade to unlock”; Pro/Agency: “Use Template”
- [ ] Plan detection — refreshes on mount and on profile-updated

### Settings
- [ ] Profile — Full name, business name, email (read-only)
- [ ] Avatar upload — works, Sidebar/TopBar update
- [ ] Logo upload — works
- [ ] Branding — brand color, defaults
- [ ] Proposal defaults — tone, expiry, sections
- [ ] Notifications — toggles
- [ ] Billing — Stripe portal (if configured)

### Clients
- [ ] List clients
- [ ] Add client
- [ ] Client detail with proposals

### Public Proposal
- [ ] View by share link
- [ ] Accept / Decline
- [ ] PDF download

---

## Performance Notes

- Profile API: `force-dynamic` so no static caching
- Fetch: `cache: "no-store"` for profile
- Sidebar/TopBar: refetch only on `profile-updated` or mount

---

## Security Notes

- RLS on all tables
- Service role used only for public proposal fetch, accept/decline, webhooks
- Auth required for /api/profile, /api/proposals, /api/templates, etc.
- File upload: type checked (avatar/logo), path = `userId.ext`

---

## Validators

- Profile: Zod schema in `lib/validators.ts`
- Proposals: `proposalGenerateSchema`, `proposalUpdateSchema`
- Templates: `templateCreateSchema`, `templateSearchSchema`
- All PATCH/POST bodies validated before DB
