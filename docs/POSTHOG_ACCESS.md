# PostHog Access & Setup

If you **can't access** the PostHog dashboard or events aren't showing, check these:

---

## 1. Dashboard Access (app.posthog.com)

- **URL**: https://app.posthog.com (or https://eu.posthog.com if EU cloud)
- **Login**: Use the email you signed up with at posthog.com
- **Forgot password**: Click "Forgot password" on login
- **New project**: If you never created a project, sign up at https://posthog.com/signup

---

## 2. Environment Variables (Required for events to flow)

Add to `.env.local` (and Vercel env vars for production):

```
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

- **NEXT_PUBLIC_POSTHOG_KEY**: Project API Key (Settings → Project → Project API Key)
- **NEXT_PUBLIC_POSTHOG_HOST**: Use `https://us.i.posthog.com` (US) or `https://eu.i.posthog.com` (EU)

**If either is missing**, PostHog will not initialize and no events are sent.

---

## 3. Using a Reverse Proxy (optional, e.g. ph.proposar.com)

To avoid ad blockers blocking PostHog, some teams use a reverse proxy. Then:

```
NEXT_PUBLIC_POSTHOG_HOST=https://ph.proposar.com
```

You must configure your proxy (e.g. Vercel rewrites) to forward to `https://us.i.posthog.com`.  
If the proxy is misconfigured, events will fail and PostHog will be inaccessible.

---

## 4. Verify PostHog is Loading

1. Open your app (e.g. proposar.io)
2. Open DevTools → Network
3. Filter by "posthog" or "i.posthog.com"
4. You should see requests to PostHog when you navigate

If you see no requests:
- Check `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` are set
- Restart dev server / redeploy after adding env vars
- Disable ad blockers for your domain to test

---

## 5. Events May Be Delayed

PostHog batches events. New events can take 1–2 minutes to appear in the dashboard.
