# Proposar / Propella — Setup Audit Report

**Date:** March 2026  
**Scope:** Templates page, dashboard, Sidebar, TopBar, APIs, and related flows

---

## ✅ What’s Working

| Component | Status |
|-----------|--------|
| **Templates page** | Renders built-in templates (8), My templates (from DB), Premium templates (locked for Free) |
| **Built-in templates** | Web Design, Brand Identity, Social Media, SEO, App Development, Content Writing, Consulting, Video Production — all link to `/proposals/new?template=...&projectType=...` |
| **My templates** | Fetches from `GET /api/templates`; shows “No saved templates yet” when empty |
| **Premium templates** | Shows 8 locked templates with “Upgrade to unlock” for Free plan |
| **Save as template** | ProposalPreview has ⋮ → Save as template; modal POSTs to `/api/templates` |
| **Template API** | GET (list) and POST (create) with auth, validation, Supabase |
| **Profile API** | GET and PATCH with auth |
| **Dashboard** | Stats, recent proposals, welcome modal, PDF links |
| **Database** | profiles, clients, proposals, templates, proposal_views, activity_log + RLS |
| **Storage** | avatars, logos buckets with policies |
| **Auth** | Login, signup, OAuth callback, `handle_new_user` trigger fixed |

---

## 🔧 Fixes Applied

| Issue | Fix |
|-------|-----|
| **Sidebar static data** | Fetches `/api/profile` and `/api/proposals` for plan, proposal count, used count, user name |
| **Sign out not wired** | TopBar calls `supabase.auth.signOut()` and redirects to `/login` |
| **Upgrade link** | Changed from `#pricing` to `/#pricing` for correct pricing section |
| **Help & Support** | Changed from `#` to `/help` |
| **Template create missing project_type** | Added `project_type` to schema and API insert |

---

## ⚠️ Known Gaps / Placeholders

| Item | Notes |
|------|-------|
| **Premium templates “Use Template”** | When Pro/Agency, button is a placeholder (no navigation yet) |
| **Dashboard Share button** | “Share” in recent proposals table does nothing |
| **Search (⌘K)** | Opens input but no search logic |
| **Notifications** | Badge shows 0; no backend |
| **Proposals badge** | Uses `proposalsCount` from API |
| **ProposalForm template** | Uses `?template=` and `?templateId=` from URL; need to verify `templateId` flow |

---

## 📋 Checklist

- [x] Database migrations applied
- [x] Storage buckets + policies
- [x] Auth trigger fixed
- [x] `.env.local` with correct Supabase URL
- [x] Sidebar shows real plan and count
- [x] Sign out works
- [x] Save as template stores `project_type`
- [x] Upgrade link goes to pricing
- [ ] Premium templates: wire “Use Template” for Pro/Agency
- [ ] Dashboard Share: wire to ShareModal or open proposal

---

## 🧪 Test Flow

1. **Login** → `/login` with 2022auradigital@gmail.com
2. **Dashboard** → See stats, recent proposals, welcome modal
3. **Templates** → Use built-in template → creates proposal with prefilled project type
4. **Create proposal** → Fill form → AI generates → Save as template
5. **My templates** → Saved template appears in list
6. **Settings** → Profile, avatar/logo upload
7. **Sign out** → TopBar → Sign out → redirects to login
