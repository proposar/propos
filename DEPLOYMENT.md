# Proposar — Deployment Checklist

## 1. Environment Variables (Vercel)

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server-only) |
| `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` | ✅ | AI API key (Claude or GPT) |
| `PADDLE_API_KEY` | ✅ | Paddle API secret key (payments – global with VAT/tax) |
| `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` | ✅ | Paddle client token (public) |
| `PADDLE_WEBHOOK_SECRET` | ✅ | Paddle webhook signing secret |
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

## 3. Paddle Production Setup (Payments – Global with VAT/Tax automatic)

- [ ] **Products**: Create Starter ($19/mo), Pro ($29/mo), Agency ($79/mo) in Paddle Dashboard
- [ ] **Price IDs**: Copy the price IDs to `/lib/paddle.ts` PADDLE_PLANS object
- [ ] **Webhook**: Create webhook pointing to `https://yourdomain.com/api/paddle/webhook`
  - Events to subscribe: `subscription.created`, `subscription.updated`, `subscription.canceled`
- [ ] **API Keys**: Copy API secret key and client token to env vars
  - `PADDLE_API_KEY`: Secret key from Paddle Dashboard → Settings → Authentication
  - `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`: Client token from same location
  - `PADDLE_WEBHOOK_SECRET`: Generate from Paddle Dashboard → Webhooks → New Webhook

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
