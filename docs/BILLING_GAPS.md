# Billing — Paddle (end-to-end)

Proposar uses **Paddle** for billing. This doc describes the flow and what you need in Supabase + Paddle.

---

## Where to add the webhook in Paddle

**Path:** Paddle Dashboard → **Developer tools** → **Notifications** → **New destination**.

- **URL to use:** `https://YOUR_DOMAIN/api/paddle/webhook`  
  Example: `https://proposar.com/api/paddle/webhook`
- **Secret:** After you create the destination, copy its **Secret key** and set it as `PADDLE_WEBHOOK_SECRET` in your env.

---

## Env vars (required for billing)

| Variable | Where to get it |
|----------|------------------|
| `PADDLE_API_KEY` | Paddle Dashboard → Developer Tools → Authentication → API keys |
| `PADDLE_WEBHOOK_SECRET` | Developer Tools → Notifications → Add destination → Secret key |
| `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` | Optional; only if you use Paddle.js overlay checkout |

Without `PADDLE_API_KEY` and `PADDLE_WEBHOOK_SECRET`, checkout and subscription updates will not work.

---

## Supabase (profiles)

The app uses existing columns on `profiles`:

- `subscription_plan` — `free` | `starter` | `pro` | `agency`
- `subscription_status` — `free` | `active` | `canceled` | `past_due` | etc.
- `subscription_period_end` — next billing date (from Paddle)
- `stripe_subscription_id` — **Paddle subscription ID** (e.g. `sub_xxx`)
- `stripe_customer_id` — **Paddle customer ID** (e.g. `ctm_xxx`)

No new migration is required; column names are reused for Paddle.

---

## Flow

1. **Checkout**  
   User clicks Upgrade (UpgradeModal or Pricing) → `POST /api/paddle/checkout` with `{ plan: "starter"|"pro"|"agency" }` → server creates a Paddle **transaction** with `custom_data: { user_id }` → response has `checkout.url` → user is redirected to Paddle checkout.

2. **Webhook**  
   After payment, Paddle sends `subscription.created` (and later `subscription.updated`, `subscription.canceled`) to `POST /api/paddle/webhook`. The handler:
   - Verifies `Paddle-Signature` (or `x-paddle-signature`).
   - Reads `data.custom_data.user_id` and `data.items[0].price.id` (to map to plan).
   - Updates `profiles`: `subscription_plan`, `stripe_subscription_id`, `stripe_customer_id`, `subscription_status`, `subscription_period_end`.

3. **Portal**  
   Settings → Billing → “Manage Billing” → `POST /api/paddle/portal` → server loads `stripe_subscription_id` from profile, calls Paddle API for that subscription’s `management_urls`, returns e.g. `update_payment_method` URL → user is redirected to Paddle customer portal.

---

## Paddle dashboard setup

### 1. Products & prices
Create products/prices for Starter, Pro, Agency. The app uses **price IDs** in `lib/paddle.ts` (`PADDLE_PLANS`). Replace those with your real Paddle price IDs (e.g. `pri_01...`) or set env vars `PADDLE_STARTER_PRICE_ID`, `PADDLE_PRO_PRICE_ID`, `PADDLE_AGENCY_PRICE_ID`.

### 2. Webhook (notification destination) — detailed guide

You're on **Notifications** with the **New destination** sidebar open. Fill it in as below.

#### General settings (top of the form)

| Field | What to enter |
|-------|----------------|
| **Description*** | `Proposar webhook` (or any name you like) |
| **Notification type** | Leave as **Webhook** (already selected) |
| **URL*** | `https://YOUR_DOMAIN/api/paddle/webhook` — use your real domain (e.g. `proposar.com`) |
| **API version** | Leave as **1** (default) |
| **Usage type** | Leave as **Platform only** (real events) |

#### Events (scroll down in the sidebar)

Do **not** click "Select all events". Tick only:

- **subscription.created**
- **subscription.updated**
- **subscription.canceled**

Optional: **subscription.activated**, **subscription.past_due**. Leave all Transaction, Product, and Price events **unchecked**.

#### Save and get the secret

1. Click the blue **Save destination** (top right of the sidebar).
2. After it saves, click the new destination in the list to open it.
3. Copy the **Secret key** and set it in your env as `PADDLE_WEBHOOK_SECRET`.
4. Redeploy or restart the app.

#### Checklist

- [ ] Description filled in
- [ ] URL = `https://YOUR_DOMAIN/api/paddle/webhook`
- [ ] Events: subscription.created, subscription.updated, subscription.canceled
- [ ] Saved destination; Secret key → `PADDLE_WEBHOOK_SECRET`

---

You add the webhook under **Developer Tools → Notifications** (not under “Webhooks” or “Integrations” by name in some dashboards).

**Step-by-step:**

1. Log in to **Paddle** (vendors.paddle.com or your Paddle dashboard).
2. Open **Developer tools** in the left sidebar (or from the main menu).
3. Click **Notifications** (or **Notification destinations**).
4. Click **New destination** (or **Add destination**).
5. Fill in:
   - **Description:** e.g. `Proposar production`
   - **Notification type:** **URL** (webhook), not email.
   - **URL:** `https://yourdomain.com/api/paddle/webhook`  
     (use your real domain, e.g. `https://proposar.com/api/paddle/webhook`).
   - **API version:** leave default (e.g. 2024-01).
   - **Usage type:** **Platform** (real events) or **Platform and test** if you want to test with simulated events.
6. Under **Events**, select at least:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
7. Click **Save destination** (or **Create**).
8. After saving, open the new destination and copy the **Secret key** (sometimes “Endpoint secret” or “Signing secret”). Put it in your env as **`PADDLE_WEBHOOK_SECRET`**.

If you don’t see **Developer tools** or **Notifications**:

- Try the main menu (☰) or **Settings** and look for **Developer** / **Integrations** / **Webhooks**.
- In **Paddle Billing**, it’s usually **Developer tools → Notifications**.
- Direct link (replace with your region if needed):  
  `https://vendors.paddle.com/notification-destinations` or under **Developer tools**.

### 3. Default payment link
In **Checkout** (or **Checkout settings**), set a **default payment link** domain and get it approved so transaction checkout URLs work.

---

## Plan limits (app)

Enforced in `lib/config.ts` and `/api/generate`:

- **free**: 3 proposals/month  
- **starter**: 10/month  
- **pro** / **agency**: unlimited  

`subscription_plan` on `profiles` is the source of truth and is updated only via the Paddle webhook.

---

## Troubleshooting

| Issue | Check |
|-------|--------|
| Checkout returns “No checkout URL” | Paddle API key, price IDs in `lib/paddle.ts`, and default payment link domain. |
| Plan never upgrades after payment | Webhook URL and secret; `custom_data.user_id` in transaction (and that it appears on subscription in webhook payload). |
| “Manage Billing” fails | User has `stripe_subscription_id`; Paddle API returns `management_urls` for that subscription. |
| Webhook 401 Invalid signature | Use raw body for verification; header format `ts=...;h1=...` and HMAC over `ts:body`. |
