# Proposar — Final Audit (Code Freeze for Sales)

**Purpose**: Confirm everything is correct so you can focus on sales with no further code changes.

---

## Auth Flow ✅

| Flow | Path | Status |
|------|------|--------|
| **Password signup** | Signup → OTP → Account → `/onboarding` (new) | ✅ |
| **Google signup** | Signup → OAuth callback (`next=/onboarding`) → `/onboarding` | ✅ |
| **Password login** | Login → `/dashboard` → OnboardingGuard redirects to `/onboarding` if not completed | ✅ |
| **Google login** | Login → OAuth callback → `/dashboard` → same guard | ✅ |
| **Returning user** | OnboardingGuard checks `onboarding_completed`; sessionStorage cache skips API when cached | ✅ |
| **Protected routes** | `/dashboard`, `/proposals`, `/billing`, `/settings`, etc. require auth | ✅ (billing added) |

---

## Onboarding ✅

- New users land on `/onboarding` first
- Guard in dashboard layout redirects users with `onboarding_completed = false`
- Onboarding page sets `sessionStorage.Proposar_onboarding_completed` on completion
- Users who already completed get redirected from `/onboarding` to `/dashboard`

---

## Performance ✅

- **Onboarding**: sessionStorage cache avoids extra API for returning users
- **Profile**: ProfileContext — single profile fetch shared by Sidebar, TopBar, Billing
- **Recharts**: Lazy loaded only on `/analytics`
- **Paddle**: Loads only when user clicks Upgrade / Manage
- **Proposals/Invoices APIs**: Limits (200 default, 500 max) + composite indexes

---

## Billing ✅

- Uses ProfileContext (profile + plan)
- Paddle loads on Upgrade click
- Portal opens via `/api/paddle/portal`

---

## PostHog

PostHog needs env vars to work. See **POSTHOG_ACCESS.md** for setup and troubleshooting.

---

## Env Vars Summary

| Var | Required for | Notes |
|-----|--------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Auth, DB | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth, DB | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server (profile creation, etc.) | Never expose |
| `RESEND_API_KEY` | OTP emails | Signup emails |
| `PADDLE_*` | Billing | API key, webhook secret, price IDs |
| `NEXT_PUBLIC_POSTHOG_KEY` | Analytics | Project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | Analytics | `https://us.i.posthog.com` |

---

## Migrations

Run before deploy: `supabase db push` (or run 001–015 in order via SQL Editor).
