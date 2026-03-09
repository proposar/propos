# Proposar — Deployment Checklist

## 1. Environment Variables (Vercel)

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server-only) |
| `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` | ✅ | AI API key (Claude or GPT) |
| `LEMONSQUEEZY_API_KEY` | ✅ | Lemon Squeezy API key (payments – works in India) |
| `LEMONSQUEEZY_STORE_ID` | ✅ | Lemon Squeezy store ID |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | ✅ | Lemon Squeezy webhook signing secret |
| `NEXT_PUBLIC_LEMONSQUEEZY_STORE_LINK` | ✅ | Store URL (e.g. https://yourstore.lemonsqueezy.com) |
| `LEMONSQUEEZY_*_VARIANT_ID` | ✅ | Variant IDs for Starter, Pro, Agency (monthly + annual) |
| `RESEND_API_KEY` | ✅ | Resend API key for emails |
| `RESEND_FROM_EMAIL` | Optional | From address (e.g. `hello@Proposar.io`) |
| `CRON_SECRET` | Optional | For follow-up email cron job |
| `NEXT_PUBLIC_APP_URL` | ✅ | Production URL (e.g. `https://Proposar.io`) |
| `NEXT_PUBLIC_APP_NAME` | Optional | App name (default: Proposar) |
| `SENTRY_DSN` | Optional | Sentry DSN (after running Sentry wizard) |

---

## 2. Supabase Production Setup

- [ ] **Email confirmation**: Enable in Supabase Dashboard → Authentication → Providers → Email
- [ ] **Custom SMTP (Resend)**: Configure in Authentication → SMTP Settings
  - Host: `smtp.resend.com`, Port: 465
  - User: `resend`, Password: your Resend API key
- [ ] **Auth redirect URLs**: Add production URL to Authentication → URL Configuration
  - Site URL: `https://Proposar.io`
  - Redirect URLs: `https://Proposar.io/**`, `https://Proposar.io/auth/callback`
- [ ] **Database backups**: Enable in Supabase Dashboard → Database → Backups
- [ ] **Connection pooling**: Use Supavisor (Supabase Pooler) for serverless
  - Connection string: `postgresql://...@...pooler.supabase.com:6543/postgres`

---

## 3. Lemon Squeezy Production Setup (Payments – India & global)

- [ ] **Products**: Create Starter ($19), Pro ($29), Agency ($79) in Lemon Squeezy
- [ ] **Variants**: Monthly + annual for each; copy variant IDs to env vars
- [ ] **Webhook**: Create webhook pointing to `https://yourdomain.com/api/lemonsqueezy/webhook`
- [ ] **Store link**: Set `NEXT_PUBLIC_LEMONSQUEEZY_STORE_LINK` to your store URL

---

## 4. Pre-Launch Checklist

- [ ] All env vars set in Vercel (Production)
- [ ] Supabase RLS policies tested
- [ ] Lemon Squeezy webhook verified
- [ ] Email sending tested end-to-end (welcome, proposal sent, etc.)
- [ ] All pages mobile tested (375px, 768px, 1024px)
- [ ] Error pages (404, 500) look correct
- [ ] Loading states on all async operations
- [ ] Rate limiting on AI generation API (consider Upstash or Vercel KV)
- [ ] CORS configured if using custom domains
- [ ] SSL verified (automatic with Vercel)

---

## 5. Post-Launch

- [ ] **Vercel Analytics**: Already integrated; enable in Vercel Dashboard
- [ ] **Error monitoring**: Run `npx @sentry/wizard@latest -i nextjs` for Sentry setup (creates config files, source maps)
- [ ] **Uptime monitoring**: Use Vercel Monitoring or external (e.g. Better Uptime)

---

## 6. Follow-Up Email Cron

To send follow-up reminders, call this endpoint daily (e.g. via Vercel Cron or external cron):

```
POST https://Proposar.io/api/emails/follow-up
Authorization: Bearer <CRON_SECRET>
```

Add to `vercel.json` for Vercel Cron:

```json
{
  "crons": [{
    "path": "/api/emails/follow-up",
    "schedule": "0 9 * * *"
  }]
}
```

Then set `CRON_SECRET` and add middleware to verify the header.
