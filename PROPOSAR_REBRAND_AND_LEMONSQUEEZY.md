# PROPOSAR — REBRAND + LEMON SQUEEZY SETUP
## Two Cursor Prompts. Run in order. Screenshot after each.

---

# ════════════════════════════════════
# PROMPT 1 — FULL REBRAND TO PROPOSAR
# ════════════════════════════════════

```
Rename and rebrand the entire Proposar codebase to "Proposar".
Do a complete find-and-replace across every file.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART A — TEXT REPLACEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Replace ALL occurrences of these strings across every .ts, .tsx, .md, .json file:

| Find                        | Replace With                          |
|-----------------------------|---------------------------------------|
| Proposar                    | Proposar                              |
| Proposar                    | proposar                              |
| Proposar                    | PROPOSAR                              |
| Proposar.io                 | proposar.com                          |
| Proposar.io                 | Proposar.com                          |
| hello@Proposar.io           | hello@proposar.com                    |
| @ProposarHQ                 | @ProposarHQ                           |
| "Powered by Proposar"       | "Powered by Proposar"                 |
| "Created with Proposar"     | "Created with Proposar"               |
| "Built for freelancers"     | "Propose. Win. Repeat."               |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART B — UPDATE THESE FILES EXACTLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. package.json:
{
  "name": "proposar",
  "description": "AI-powered proposal generator for freelancers and agencies"
}

2. app/layout.tsx — update metadata:
export const metadata = {
  title: {
    template: '%s | Proposar',
    default: 'Proposar — AI Proposal Generator for Freelancers & Agencies',
  },
  description: 'Generate winning client proposals in 60 seconds with AI. Used by 2,000+ freelancers across USA, UK, Australia & Canada. Track opens, close faster, earn more.',
  keywords: ['proposal generator', 'AI proposal writer', 'freelance proposal', 'client proposal tool', 'proposal software', 'Proposar'],
  metadataBase: new URL('https://proposar.com'),
  openGraph: {
    title: 'Proposar — AI Proposal Generator',
    description: 'Generate winning client proposals in 60 seconds.',
    url: 'https://proposar.com',
    siteName: 'Proposar',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proposar — AI Proposal Generator',
    description: 'Generate winning client proposals in 60 seconds.',
    site: '@ProposarHQ',
  },
}

3. lib/config.ts — update APP_METADATA:
export const APP_METADATA = {
  name: 'Proposar',
  tagline: 'Propose. Win. Repeat.',
  description: 'AI-powered proposal generator for freelancers and agencies',
  url: 'https://proposar.com',
  email: 'hello@proposar.com',
  twitter: '@ProposarHQ',
  logo: '/logo.png',
}

4. lib/resend.ts — update from email:
const FROM_EMAIL = 'Proposar <hello@proposar.com>'

-- All email subjects: replace "Proposar" with "Proposar"
-- All email footers: "© 2026 Proposar. All rights reserved."
-- All email unsubscribe text: "You received this from Proposar"

5. components/pdf/ProposalPDFDocument.tsx:
-- Watermark text: "Created with Proposar · proposar.com"
-- Footer branding: "Proposar"

6. app/sitemap.ts:
-- baseUrl = 'https://proposar.com'

7. app/robots.ts:
-- Host: https://proposar.com
-- Sitemap: https://proposar.com/sitemap.xml

8. vercel.json:
-- Update any name references to "proposar"

9. DEPLOYMENT.md and README.md:
-- Replace all Proposar references with Proposar

10. All landing page components (Hero, Footer, Navbar, AnnouncementBar):
-- "Proposar" → "Proposar" in all display text
-- Logo text: "Proposar"
-- Tagline everywhere: "Propose. Win. Repeat."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART C — UPDATE BRAND COPY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update Hero headline to:
Line 1: "Proposals That Win."
Line 2 (gold): "Every Single Time."

Update Hero subheadline to:
"Stop spending hours on proposals that get ignored.
Proposar writes professional, persuasive proposals in 60 seconds —
so you close faster and earn more."

Update Announcement bar to:
"🎉 Launch offer: 3 months free on any annual plan → Claim at proposar.com"

Update Footer tagline to:
"The AI proposal tool built for freelancers who want to win."
"© 2026 Proposar. All rights reserved."

Update Nav logo text: "Proposar" in Playfair Display font

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART D — .env.local.example UPDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update these env var values:
NEXT_PUBLIC_APP_URL=https://proposar.com
NEXT_PUBLIC_APP_NAME=Proposar
RESEND_FROM_EMAIL=hello@proposar.com

Remove all Stripe env vars (we are replacing with Lemon Squeezy):
# DELETE THESE:
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
# STRIPE_STARTER_PRICE_ID=
# STRIPE_PRO_PRICE_ID=
# STRIPE_AGENCY_PRICE_ID=

Add Lemon Squeezy env vars:
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=
NEXT_PUBLIC_LEMONSQUEEZY_STORE_LINK=https://proposar.lemonsqueezy.com
LEMONSQUEEZY_STARTER_VARIANT_ID=
LEMONSQUEEZY_PRO_VARIANT_ID=
LEMONSQUEEZY_AGENCY_VARIANT_ID=
LEMONSQUEEZY_STARTER_ANNUAL_VARIANT_ID=
LEMONSQUEEZY_PRO_ANNUAL_VARIANT_ID=
LEMONSQUEEZY_AGENCY_ANNUAL_VARIANT_ID=

After this prompt: search the ENTIRE codebase for "Proposar" 
(case insensitive) and confirm zero results remain.
```

---

# ════════════════════════════════════
# PROMPT 2 — REPLACE STRIPE WITH LEMON SQUEEZY
# ════════════════════════════════════

```
Replace the entire Stripe payment system with Lemon Squeezy in Proposar.
Lemon Squeezy is a Merchant of Record — they handle all global taxes automatically.
This allows an Indian founder to accept payments from USA, UK, AUS, Canada immediately.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — INSTALL DEPENDENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run:
npm install @lemonsqueezy/lemonsqueezy.js
npm uninstall stripe

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — CREATE lib/lemonsqueezy.ts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create file: lib/lemonsqueezy.ts

import {
  lemonSqueezySetup,
  createCheckout,
  getSubscription,
  cancelSubscription,
  updateSubscription,
  listProducts,
} from '@lemonsqueezy/lemonsqueezy.js'

// Initialize Lemon Squeezy
export function initLemonSqueezy() {
  lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY!,
    onError: (error) => console.error('Lemon Squeezy Error:', error),
  })
}

// Plan variant IDs from env
export const PLANS = {
  starter: {
    monthly: process.env.LEMONSQUEEZY_STARTER_VARIANT_ID!,
    annual: process.env.LEMONSQUEEZY_STARTER_ANNUAL_VARIANT_ID!,
    name: 'Starter',
    price: 19,
    annualPrice: 15,
  },
  pro: {
    monthly: process.env.LEMONSQUEEZY_PRO_VARIANT_ID!,
    annual: process.env.LEMONSQUEEZY_PRO_ANNUAL_VARIANT_ID!,
    name: 'Pro',
    price: 29,
    annualPrice: 23,
  },
  agency: {
    monthly: process.env.LEMONSQUEEZY_AGENCY_VARIANT_ID!,
    annual: process.env.LEMONSQUEEZY_AGENCY_ANNUAL_VARIANT_ID!,
    name: 'Agency',
    price: 79,
    annualPrice: 63,
  },
}

// Create a checkout URL for a given plan
export async function createCheckoutUrl({
  variantId,
  userId,
  userEmail,
  userName,
  redirectUrl,
}: {
  variantId: string
  userId: string
  userEmail: string
  userName: string
  redirectUrl?: string
}) {
  initLemonSqueezy()
  
  const storeId = process.env.LEMONSQUEEZY_STORE_ID!
  
  const checkout = await createCheckout(storeId, variantId, {
    checkoutOptions: {
      embed: false,
      media: true,
      logo: true,
    },
    checkoutData: {
      email: userEmail,
      name: userName,
      custom: {
        user_id: userId,
      },
    },
    productOptions: {
      enabledVariants: [Number(variantId)],
      redirectUrl: redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
      receiptButtonText: 'Go to Dashboard',
      receiptLinkUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    },
  })
  
  return checkout.data?.data.attributes.url
}

// Get subscription details
export async function getSubscriptionById(subscriptionId: string) {
  initLemonSqueezy()
  return await getSubscription(subscriptionId)
}

// Cancel subscription
export async function cancelSubscriptionById(subscriptionId: string) {
  initLemonSqueezy()
  return await cancelSubscription(subscriptionId)
}

// Map Lemon Squeezy variant ID to plan name
export function getPlanFromVariantId(variantId: string): string {
  for (const [planKey, planData] of Object.entries(PLANS)) {
    if (planData.monthly === variantId || planData.annual === variantId) {
      return planKey
    }
  }
  return 'free'
}

// Get customer portal URL
export function getCustomerPortalUrl(customerId: string): string {
  return `https://proposar.lemonsqueezy.com/billing`
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — REPLACE API ROUTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DELETE these old Stripe routes:
- app/api/stripe/ (entire folder)

CREATE new Lemon Squeezy routes:

--- FILE: app/api/lemonsqueezy/checkout/route.ts ---

import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createCheckoutUrl, PLANS } from '@/lib/lemonsqueezy'

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { plan, billing } = await request.json()
    // plan: 'starter' | 'pro' | 'agency'
    // billing: 'monthly' | 'annual'
    
    if (!PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }
    
    const planData = PLANS[plan as keyof typeof PLANS]
    const variantId = billing === 'annual' ? planData.annual : planData.monthly
    
    // Get user profile for email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single()
    
    const checkoutUrl = await createCheckoutUrl({
      variantId,
      userId: user.id,
      userEmail: profile?.email || user.email || '',
      userName: profile?.full_name || '',
    })
    
    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'Failed to create checkout' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ url: checkoutUrl })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

--- FILE: app/api/lemonsqueezy/portal/route.ts ---

import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Lemon Squeezy customer portal is accessed via their store URL
    const portalUrl = `${process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_LINK}/billing`
    
    return NextResponse.json({ url: portalUrl })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

--- FILE: app/api/lemonsqueezy/webhook/route.ts ---

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import crypto from 'crypto'

// Verify Lemon Squeezy webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  const digest = Buffer.from(hmac.update(payload).digest('hex'), 'utf8')
  const sig = Buffer.from(signature, 'utf8')
  if (digest.length !== sig.length) return false
  return crypto.timingSafeEqual(digest, sig)
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-signature') || ''
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
    
    // Verify signature
    if (!verifyWebhookSignature(rawBody, signature, secret)) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
    
    const event = JSON.parse(rawBody)
    const eventName = event.meta?.event_name
    const data = event.data
    const meta = event.meta
    
    console.log('Lemon Squeezy webhook:', eventName)
    
    const supabase = createAdminClient()
    
    // Extract user_id from custom data
    const userId = meta?.custom_data?.user_id || data?.attributes?.custom_data?.user_id
    
    if (!userId) {
      console.error('No user_id in webhook payload')
      return NextResponse.json({ error: 'No user ID' }, { status: 400 })
    }
    
    switch (eventName) {

      // ── NEW SUBSCRIPTION ──────────────────────────
      case 'subscription_created': {
        const variantId = String(data.attributes.variant_id)
        const plan = getPlanFromVariantId(variantId)
        const subscriptionId = String(data.id)
        const status = data.attributes.status // active | on_trial | paused | cancelled | expired
        const renewsAt = data.attributes.renews_at
        const trialEndsAt = data.attributes.trial_ends_at
        const customerId = String(data.attributes.customer_id)
        
        await supabase.from('profiles').update({
          lemonsqueezy_customer_id: customerId,
          lemonsqueezy_subscription_id: subscriptionId,
          subscription_plan: plan,
          subscription_status: status === 'active' || status === 'on_trial' ? 'active' : status,
          subscription_period_end: renewsAt || trialEndsAt,
          updated_at: new Date().toISOString(),
        }).eq('id', userId)
        
        console.log(`Subscription created: user=${userId} plan=${plan}`)
        break
      }

      // ── SUBSCRIPTION UPDATED ──────────────────────
      case 'subscription_updated': {
        const variantId = String(data.attributes.variant_id)
        const plan = getPlanFromVariantId(variantId)
        const status = data.attributes.status
        const renewsAt = data.attributes.renews_at
        const endsAt = data.attributes.ends_at
        
        let dbStatus = 'free'
        if (status === 'active' || status === 'on_trial') dbStatus = 'active'
        else if (status === 'paused') dbStatus = 'paused'
        else if (status === 'cancelled') dbStatus = 'canceled'
        else if (status === 'expired') dbStatus = 'expired'
        
        await supabase.from('profiles').update({
          subscription_plan: dbStatus === 'active' ? plan : 'free',
          subscription_status: dbStatus,
          subscription_period_end: endsAt || renewsAt,
          updated_at: new Date().toISOString(),
        }).eq('id', userId)
        
        console.log(`Subscription updated: user=${userId} plan=${plan} status=${dbStatus}`)
        break
      }

      // ── SUBSCRIPTION CANCELLED ────────────────────
      case 'subscription_cancelled': {
        const endsAt = data.attributes.ends_at
        
        await supabase.from('profiles').update({
          subscription_status: 'canceled',
          subscription_period_end: endsAt,
          updated_at: new Date().toISOString(),
        }).eq('id', userId)
        
        // Send cancellation email (optional — keep user engaged)
        console.log(`Subscription cancelled: user=${userId}`)
        break
      }

      // ── SUBSCRIPTION EXPIRED ──────────────────────
      case 'subscription_expired': {
        await supabase.from('profiles').update({
          subscription_plan: 'free',
          subscription_status: 'expired',
          proposals_used_this_month: 0,
          updated_at: new Date().toISOString(),
        }).eq('id', userId)
        
        console.log(`Subscription expired: user=${userId} → downgraded to free`)
        break
      }

      // ── PAYMENT SUCCESS ───────────────────────────
      case 'subscription_payment_success': {
        // Ensure subscription stays active
        await supabase.from('profiles').update({
          subscription_status: 'active',
          updated_at: new Date().toISOString(),
        }).eq('id', userId)
        
        console.log(`Payment success: user=${userId}`)
        break
      }

      // ── PAYMENT FAILED ────────────────────────────
      case 'subscription_payment_failed': {
        await supabase.from('profiles').update({
          subscription_status: 'past_due',
          updated_at: new Date().toISOString(),
        }).eq('id', userId)
        
        // Send payment failed email
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', userId)
          .single()
          
        if (profile?.email) {
          // Call your existing payment failed email function
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails/payment-failed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: profile.email,
              name: profile.full_name,
              portalUrl: `${process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_LINK}/billing`
            }),
          })
        }
        
        console.log(`Payment failed: user=${userId}`)
        break
      }

      // ── ORDER CREATED (one-time) ──────────────────
      case 'order_created': {
        console.log(`Order created: user=${userId}`)
        break
      }

      default:
        console.log(`Unhandled event: ${eventName}`)
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}

// Import this helper
function getPlanFromVariantId(variantId: string): string {
  const plans = {
    [process.env.LEMONSQUEEZY_STARTER_VARIANT_ID!]: 'starter',
    [process.env.LEMONSQUEEZY_STARTER_ANNUAL_VARIANT_ID!]: 'starter',
    [process.env.LEMONSQUEEZY_PRO_VARIANT_ID!]: 'pro',
    [process.env.LEMONSQUEEZY_PRO_ANNUAL_VARIANT_ID!]: 'pro',
    [process.env.LEMONSQUEEZY_AGENCY_VARIANT_ID!]: 'agency',
    [process.env.LEMONSQUEEZY_AGENCY_ANNUAL_VARIANT_ID!]: 'agency',
  }
  return plans[variantId] || 'free'
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — UPDATE DATABASE SCHEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create migration: supabase/migrations/006_lemonsqueezy.sql

-- Replace Stripe columns with Lemon Squeezy columns
ALTER TABLE profiles 
  RENAME COLUMN stripe_customer_id TO lemonsqueezy_customer_id;

ALTER TABLE profiles 
  RENAME COLUMN stripe_subscription_id TO lemonsqueezy_subscription_id;

-- Add new columns for LS-specific data  
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS lemonsqueezy_order_id TEXT,
  ADD COLUMN IF NOT EXISTS lemonsqueezy_variant_id TEXT;

-- Update any existing rows (set to null to reset)
UPDATE profiles SET
  lemonsqueezy_customer_id = NULL,
  lemonsqueezy_subscription_id = NULL
WHERE lemonsqueezy_customer_id IS NOT NULL;

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — UPDATE PRICING UI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update components/landing/Pricing.tsx:

The upgrade button onClick handler should now call:
const handleUpgrade = async (plan: string, billing: string) => {
  setLoading(plan)
  try {
    const res = await fetch('/api/lemonsqueezy/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, billing })
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
      // Opens Lemon Squeezy checkout page
    }
  } catch (err) {
    console.error('Checkout error:', err)
  } finally {
    setLoading(null)
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6 — UPDATE BILLING SETTINGS PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In app/(dashboard)/settings/page.tsx billing tab:

Change "Manage Billing" button to:
const handleManageBilling = async () => {
  const res = await fetch('/api/lemonsqueezy/portal', { method: 'POST' })
  const data = await res.json()
  window.open(data.url, '_blank')
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7 — UPDATE UPGRADE MODAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In components/UpgradeModal.tsx:
Replace all Stripe checkout calls with the new 
/api/lemonsqueezy/checkout endpoint.
Same request body format: { plan, billing }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 8 — UPDATE vercel.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update vercel.json:
{
  "regions": ["iad1"],
  "functions": {
    "app/api/generate/route.ts": { "maxDuration": 30 },
    "app/api/lemonsqueezy/webhook/route.ts": { "maxDuration": 10 }
  },
  "crons": [{
    "path": "/api/emails/follow-up",
    "schedule": "0 9 * * *"
  }]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 9 — DELETE OLD STRIPE FILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Delete these files completely:
- lib/stripe.ts
- app/api/stripe/ (entire folder and all contents)

Search codebase for any remaining "stripe" imports 
and remove them all.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 10 — FINAL VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After all changes, verify:
1. Search for "stripe" (case insensitive) — zero results
2. Search for "Proposar" (case insensitive) — zero results  
3. npm run build — should compile with zero errors
4. All TypeScript types still valid

If build errors exist — fix them before finishing.
```

---

# ════════════════════════════════════
# LEMON SQUEEZY SETUP GUIDE
# (Do this on lemonsqueezy.com BEFORE running Prompt 2)
# ════════════════════════════════════

## Step 1 — Create Account
Go to: lemonsqueezy.com
Sign up with your email
Approval usually takes 24–48 hours
(They approve almost all SaaS products)

## Step 2 — Create Your Store
Store name: Proposar
Store URL: proposar.lemonsqueezy.com
Currency: USD
Category: Software / SaaS

## Step 3 — Create 6 Products (3 plans × monthly + annual)

### PRODUCT 1: Proposar Starter Monthly
Type: Subscription
Price: $19.00 USD
Billing: Monthly
Trial: 14 days free
Copy the Variant ID → LEMONSQUEEZY_STARTER_VARIANT_ID

### PRODUCT 2: Proposar Starter Annual  
Type: Subscription
Price: $180.00 USD ($15/mo × 12)
Billing: Annual
Trial: 14 days free
Copy the Variant ID → LEMONSQUEEZY_STARTER_ANNUAL_VARIANT_ID

### PRODUCT 3: Proposar Pro Monthly
Type: Subscription
Price: $29.00 USD
Billing: Monthly
Trial: 14 days free
Copy the Variant ID → LEMONSQUEEZY_PRO_VARIANT_ID

### PRODUCT 4: Proposar Pro Annual
Type: Subscription
Price: $276.00 USD ($23/mo × 12)
Billing: Annual
Trial: 14 days free
Copy the Variant ID → LEMONSQUEEZY_PRO_ANNUAL_VARIANT_ID

### PRODUCT 5: Proposar Agency Monthly
Type: Subscription
Price: $79.00 USD
Billing: Monthly
Trial: 14 days free
Copy the Variant ID → LEMONSQUEEZY_AGENCY_VARIANT_ID

### PRODUCT 6: Proposar Agency Annual
Type: Subscription
Price: $756.00 USD ($63/mo × 12)
Billing: Annual
Trial: 14 days free
Copy the Variant ID → LEMONSQUEEZY_AGENCY_ANNUAL_VARIANT_ID

## Step 4 — Get API Key
Go to: Settings → API
Create new API key
Name it: "Proposar Production"
Copy → LEMONSQUEEZY_API_KEY

## Step 5 — Get Store ID
Go to: Settings → Store
Copy Store ID (a number like 12345)
→ LEMONSQUEEZY_STORE_ID

## Step 6 — Set Up Webhook
Go to: Settings → Webhooks → Add Webhook
URL: https://proposar.com/api/lemonsqueezy/webhook
Secret: generate a random 32-char string
→ LEMONSQUEEZY_WEBHOOK_SECRET

Select these events:
☑ subscription_created
☑ subscription_updated
☑ subscription_cancelled
☑ subscription_expired
☑ subscription_payment_success
☑ subscription_payment_failed
☑ order_created

## Step 7 — Set Up Payout (Get Your Money)
Go to: Settings → Payouts
Add your bank details OR PayPal
For Indian founders: Use Wise account
  - Sign up at wise.com
  - Get USD receiving account
  - Add Wise routing + account number to Lemon Squeezy
  - Lemon Squeezy pays out every 30 days

## Step 8 — Fill .env.local
Copy all the IDs you collected above into .env.local
Then run Prompt 2 above in Cursor.

---

# COMPLETE .env.local FOR PROPOSAR

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic (AI)
ANTHROPIC_API_KEY=

# Lemon Squeezy (Payments)
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=
NEXT_PUBLIC_LEMONSQUEEZY_STORE_LINK=https://proposar.lemonsqueezy.com
LEMONSQUEEZY_STARTER_VARIANT_ID=
LEMONSQUEEZY_PRO_VARIANT_ID=
LEMONSQUEEZY_AGENCY_VARIANT_ID=
LEMONSQUEEZY_STARTER_ANNUAL_VARIANT_ID=
LEMONSQUEEZY_PRO_ANNUAL_VARIANT_ID=
LEMONSQUEEZY_AGENCY_ANNUAL_VARIANT_ID=

# Resend (Email)
RESEND_API_KEY=
RESEND_FROM_EMAIL=hello@proposar.com

# Cron protection
CRON_SECRET=

# App
NEXT_PUBLIC_APP_URL=https://proposar.com
NEXT_PUBLIC_APP_NAME=Proposar

# Optional
SENTRY_DSN=
NEXT_PUBLIC_CRISP_WEBSITE_ID=

---

# ORDER TO DO EVERYTHING

| Step | Action | Time |
|------|--------|------|
| 1 | Buy proposar.com on Namecheap | 5 min |
| 2 | Sign up on lemonsqueezy.com | 10 min |
| 3 | Create 6 products on LS | 20 min |
| 4 | Copy all IDs to .env.local | 5 min |
| 5 | Run Prompt 1 in Cursor (rebrand) | 10 min |
| 6 | Run Prompt 2 in Cursor (LS setup) | 20 min |
| 7 | Run migration 006 on Supabase | 5 min |
| 8 | Deploy to Vercel | 10 min |
| 9 | Set webhook URL in LS dashboard | 5 min |
| 10 | Test full flow end to end | 30 min |

TOTAL: ~2 hours. Proposar is live and accepting payments. 🚀

---
*Proposar — Propose. Win. Repeat.*
*Your path to $29 × 700 users = $20,300/month = ₹1.7Cr MRR*
