# Pricing vs. Delivery Checklist

Use this to keep the pricing page honest and to plan feature gating.

## What we enforce today

| Feature | Enforced? | Where |
|--------|-----------|--------|
| Proposals per month (10 Starter, unlimited Pro/Agency) | ✅ Yes | `app/api/generate/route.ts` — checks `proposals_used_this_month` vs plan limit |
| Analytics (Pro+ only) | ✅ Yes | `app/(dashboard)/analytics/page.tsx` — free plan sees blurred content |

## What we promise but don’t gate (everyone gets it)

| Pricing promise | Reality |
|-----------------|--------|
| Starter: no custom branding | Everyone can set logo & brand color in Settings. |
| Starter: no follow-up reminders | Follow-up sequence is available to all users; no plan check. |
| Starter: 3 templates | Template count is not limited by plan in `app/api/templates/`. |
| Pro: “Priority AI” | Same AI queue/model for all; no priority tier. |

## What we promise but don’t have (or are human-only)

| Pricing promise | Reality |
|-----------------|--------|
| Pro: “Chat support” | No in-app chat; only email support. |
| Agency: 5 team members | Team/multi-user not implemented. |
| Agency: Team proposal sharing | Not implemented. |
| Agency: API access | No public API. |
| Agency: Custom domain for proposal links | Links use app domain only. |
| Agency: Dedicated account manager / 1hr support / onboarding call | Human-delivered; OK if you offer these manually. |

## Recommendations

1. **Pricing page copy**  
   - Use “Email support” (not “Chat support”) for Pro.  
   - Use “AI proposal generation” for Pro (drop “priority” unless you add a priority queue).  
   - For Agency, either mark “Team members”, “API access”, “Custom domain” as “Coming soon” or remove until built.

2. **Optional: add plan gating**  
   - **Custom branding:** In Settings (or PDF/email), hide or disable logo/brand color for `subscription_plan === 'free' | 'starter'` unless you want to give it to everyone.  
   - **Follow-up reminders:** In the sequence UI/API, allow only `pro` and `agency` to create or run sequences.  
   - **Templates:** In `POST /api/templates` and template list, enforce 3 for Starter, unlimited for Pro/Agency.

3. **Pricing levels**  
   $19 / $29 / $79 is reasonable for the space; ensure the listed features either exist and are gated, or are clearly “Coming soon” / human-delivered.
