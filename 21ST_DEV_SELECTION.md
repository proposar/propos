# 21st.dev Component Selection for Propella

**Propella design:** Dark (#0a0a14, #12121e), gold accent (#c9a84c, #e8c76a), SaaS proposal tool for freelancers.

**Selection rule:** Pick components that work on dark backgrounds and accept a gold/amber accent. Prefer clean, professional, minimal over flashy.

---

## 1. Backgrounds

**Category:** https://21st.dev/s/background

**Use for:** Landing page, onboarding, login/signup, dashboard main area.

**What to pick:**
- Dark or neutral base (not bright white)
- Subtle gradients or grain (not distracting)
- Optional: mesh/grid that supports `#0a0a14` + gold glow
- Avoid: very busy, neon, or gaming-style shaders

**Propella pages:** `app/page.tsx`, `app/onboarding/page.tsx`, `app/login/page.tsx`, `app/(dashboard)/dashboard/page.tsx`

---

## 2. Hero

**Category:** https://21st.dev/s/hero

**Use for:** Main landing hero (headline, CTA, trust line).

**What to pick:**
- Left-aligned copy + right visual (or centered)
- Works with dark bg (`#0a0a14`)
- Headline + subtext + CTA
- Optional: 3D/abstract visual on the right
- Fits: "Write Proposals That Win Deals"

---

## 3. Features

**Category:** https://21st.dev/s/features

**Use for:** Landing Features section.

**What to pick:**
- Card/grid layout (3–6 items)
- Icon + title + description
- Dark or dark-friendly
- Matches icons: AI, templates, PDF, tracking, branding

---

## 4. Pricing

**Category:** https://21st.dev/s/pricing

**Use for:** Landing Pricing section (Starter, Pro, Agency).

**What to pick:**
- 3-column layout (Free / Starter / Pro / Agency)
- Toggle: monthly vs annual
- Dark theme or dark-compatible
- "Most Popular" badge for Pro

---

## 5. Testimonials

**Category:** https://21st.dev/s/testimonials

**Use for:** Landing Testimonials section.

**What to pick:**
- Card or carousel
- Quote + name + role + optional avatar
- Dark-friendly
- Professional, B2B feel

---

## 6. Calls to Action (CTA)

**Category:** https://21st.dev/s/calls-to-action

**Use for:** Floating CTA, hero CTAs, bottom-of-page CTAs.

**What to pick:**
- Primary: gold/amber accent
- Text: "Start Free", "Get Started", "Create Proposal"
- Simple, high-contrast on dark

---

## 7. Dashboards

**Category:** https://21st.dev/s/dashboard

**Use for:** Dashboard layout, stats cards, proposal list, charts.

**What to pick:**
- Stats cards (Total Proposals, Win Rate, Viewed, Value Won)
- Table/list for proposals
- Optional: charts, activity feed
- Dark sidebar + main content
- Keep existing sidebar, replace main content layout if helpful

---

## 8. Onboarding

**Category:** https://21st.dev/s/onboarding

**Use for:** Multi-step onboarding (business, branding, complete).

**What to pick:**
- Step indicator (1–2–3)
- Form layout with labels and inputs
- Logo upload area
- Color picker for brand color
- Progress bar or stepper

---

## 9. Buttons

**Category:** https://21st.dev/s/buttons

**Use for:** Primary/secondary buttons across app.

**What to pick:**
- Primary: gold/amber, filled
- Secondary: outline or subtle
- Hover states
- Works on dark bg

---

## 10. Inputs / Form elements

**21st.dev:** Check Forms or Inputs if available.

**Use for:** Login, signup, onboarding, settings, proposal form.

**What to pick:**
- Text input, select, textarea
- Dark bg + light text
- Focus ring (e.g. gold)

---

## Quick links

| Propella component | 21st.dev category      | URL                          |
|--------------------|------------------------|------------------------------|
| Landing background | Backgrounds            | https://21st.dev/s/background |
| Hero               | Heros                  | https://21st.dev/s/hero       |
| Features           | Features               | https://21st.dev/s/features   |
| Pricing            | Pricing Sections       | https://21st.dev/s/pricing    |
| Testimonials       | Testimonials           | https://21st.dev/s/testimonials |
| CTA                | Calls to Action        | https://21st.dev/s/calls-to-action |
| Dashboard layout   | Dashboards             | https://21st.dev/s/dashboard  |
| Onboarding flow    | Onboarding             | https://21st.dev/s/onboarding |
| Buttons            | Buttons                | https://21st.dev/s/buttons    |

---

## Color mapping when copying

Replace 21st.dev colors with Propella palette:

| 21st.dev (example) | Propella         |
|--------------------|------------------|
| `white` / `#fff`   | `#faf8f4`        |
| `black` / dark     | `#0a0a14`        |
| `gray-800`         | `#12121e`        |
| `gray-700`         | `#1e1e2e`        |
| `amber` / `yellow` | `#c9a84c` (gold) |
| `amber-400`        | `#e8c76a`        |
| `gray-500`         | `#888890`        |
