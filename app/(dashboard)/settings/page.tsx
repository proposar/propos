"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  TONE_OPTIONS,
  PROPOSAL_SECTIONS,
  PAYMENT_TERMS,
  CURRENCIES,
} from "@/lib/constants";
import { PLANS, PLAN_LIMITS } from "@/lib/config";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "branding", label: "Business Branding" },
  { id: "defaults", label: "Proposal Defaults" },
  { id: "notifications", label: "Notifications" },
  { id: "billing", label: "Billing" },
  { id: "integrations", label: "Integrations" },
  { id: "account", label: "Account" },
];

type ProfileData = {
  full_name?: string | null;
  email?: string | null;
  business_name?: string | null;
  business_type?: string | null;
  website?: string | null;
  phone?: string | null;
  bio?: string | null;
  city?: string | null;
  country?: string | null;
  avatar_url?: string | null;
  logo_url?: string | null;
  signature_text?: string | null;
  address?: string | null;
  currency?: string | null;
  brand_color?: string | null;
  default_payment_terms?: string | null;
  default_tone?: string | null;
  default_expiry_days?: number | null;
  default_sections?: string[] | null;
  auto_follow_up_enabled?: boolean | null;
  auto_follow_up_days?: number | null;
  notify_proposal_viewed?: boolean | null;
  notify_proposal_accepted?: boolean | null;
  notify_proposal_declined?: boolean | null;
  notify_proposal_expired?: boolean | null;
  notify_weekly_summary?: boolean | null;
  notify_product_updates?: boolean | null;
  subscription_plan?: string | null;
  subscription_status?: string | null;
  subscription_period_end?: string | null;
  proposals_used_this_month?: number | null;
  stripe_subscription_id?: string | null;
  stripe_customer_id?: string | null;
  gdpr_compliant_mode?: boolean | null;
};

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [form, setForm] = useState<Partial<ProfileData>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        setProfile(d);
        setForm({
          full_name: d?.full_name ?? "",
          business_name: d?.business_name ?? "",
          business_type: d?.business_type ?? "",
          website: d?.website ?? "",
          phone: d?.phone ?? "",
          bio: d?.bio ?? "",
          city: d?.city ?? "",
          country: d?.country ?? "",
          address: d?.address ?? "",
          signature_text: d?.signature_text ?? "",
          currency: d?.currency ?? "USD",
          brand_color: d?.brand_color ?? "#D4AF37",
          default_payment_terms: d?.default_payment_terms ?? "",
          default_tone: d?.default_tone ?? "professional",
          default_expiry_days: d?.default_expiry_days ?? 30,
          default_sections: d?.default_sections ?? PROPOSAL_SECTIONS.slice(0, 8),
          auto_follow_up_enabled: d?.auto_follow_up_enabled ?? true,
          auto_follow_up_days: d?.auto_follow_up_days ?? 7,
          notify_proposal_viewed: d?.notify_proposal_viewed ?? true,
          notify_proposal_accepted: d?.notify_proposal_accepted ?? true,
          notify_proposal_declined: d?.notify_proposal_declined ?? true,
          notify_proposal_expired: d?.notify_proposal_expired ?? true,
          notify_weekly_summary: d?.notify_weekly_summary ?? true,
          notify_product_updates: d?.notify_product_updates ?? false,
          gdpr_compliant_mode: d?.gdpr_compliant_mode ?? false,
        });
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  async function saveProfile(updates: Partial<ProfileData>) {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("profile-updated"));
        }
      }
    } finally {
      setSaving(false);
    }
  }

  async function uploadFile(type: "avatar" | "logo", file: File) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    const res = await fetch("/api/profile/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      await saveProfile({ [type === "avatar" ? "avatar_url" : "logo_url"]: url });
      setProfile((p) => (p ? { ...p, [type === "avatar" ? "avatar_url" : "logo_url"]: url } : p));
    }
  }

  async function openPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/paddle/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setPortalLoading(false);
    }
  }

  const plan = (profile?.subscription_plan as keyof typeof PLAN_LIMITS) ?? "free";
  const limits = PLAN_LIMITS[plan];
  const used = profile?.proposals_used_this_month ?? 0;
  const limit = limits.proposalsPerMonth;
  const limitLabel = limit < 0 ? "Unlimited" : limit.toString();

  const toggleSection = (s: string) => {
    const sections = (form.default_sections ?? []) as string[];
    const next = sections.includes(s) ? sections.filter((x) => x !== s) : [...sections, s];
    setForm((f) => ({ ...f, default_sections: next }));
  };

  if (loading) {
    return <div className="p-8 text-[#888890]">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-2xl font-bold text-[#faf8f4]">Settings</h1>

      <div className="flex gap-2 border-b border-[#1e1e2e] overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
              tab === t.id ? "border-gold text-gold" : "border-transparent text-[#888890] hover:text-[#faf8f4]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 space-y-6">
          <h2 className="font-semibold text-[#faf8f4]">Profile</h2>
          <div
            className="relative w-24 h-24 rounded-full border-2 border-dashed border-[#1e1e2e] flex items-center justify-center overflow-hidden bg-[#0a0a14] cursor-pointer hover:border-gold/50"
            onClick={() => document.getElementById("avatar-input")?.click()}
          >
            {profile?.avatar_url ? (
              <Image src={profile.avatar_url || ""} alt="Avatar" className="object-cover" fill sizes="96px" />
            ) : (
              <span className="text-2xl text-[#888890]">+</span>
            )}
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile("avatar", f);
              }}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#888890] mb-1">Full name</label>
              <input
                value={form.full_name ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#888890] mb-1">Email (read-only)</label>
              <input value={profile?.email ?? ""} readOnly className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14]/50 px-3 py-2 text-[#888890] cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm text-[#888890] mb-1">Business name</label>
              <input value={form.business_name ?? ""} onChange={(e) => setForm((f) => ({ ...f, business_name: e.target.value }))} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
            </div>
            <div>
              <label className="block text-sm text-[#888890] mb-1">Business type</label>
              <input value={form.business_type ?? ""} onChange={(e) => setForm((f) => ({ ...f, business_type: e.target.value }))} placeholder="e.g. Freelancer, Agency" className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
            </div>
            <div>
              <label className="block text-sm text-[#888890] mb-1">Website</label>
              <input value={form.website ?? ""} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} type="url" className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
            </div>
            <div>
              <label className="block text-sm text-[#888890] mb-1">Phone</label>
              <input value={form.phone ?? ""} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-[#888890] mb-1">Bio (About Us in proposals)</label>
              <textarea value={form.bio ?? ""} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={3} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
            </div>
            <div>
              <label className="block text-sm text-[#888890] mb-1">City</label>
              <input value={form.city ?? ""} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
            </div>
            <div>
              <label className="block text-sm text-[#888890] mb-1">Country</label>
              <input value={form.country ?? ""} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} placeholder="e.g. United States, India" className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
            </div>
          </div>
          <div className="pt-4 border-t border-[#1e1e2e]">
             <label className="flex items-center gap-2 text-sm text-[#faf8f4] cursor-pointer group">
               <input 
                 type="checkbox" 
                 checked={form.gdpr_compliant_mode ?? false} 
                 onChange={(e) => setForm((f) => ({ ...f, gdpr_compliant_mode: e.target.checked }))}
                 className="rounded border-[#1e1e2e] bg-[#0a0a14] text-gold focus:ring-gold"
               />
               <span>Enable GDPR/Globalization Compliance Mode</span>
               <span className="text-xs text-[#888890] group-hover:text-gold/80 transition-colors">(Adds privacy notices & handles data as per international standards)</span>
             </label>
          </div>
          <button type="button" onClick={() => saveProfile(form)} disabled={saving} className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] disabled:opacity-50">Save</button>
        </div>
      )}

      {tab === "branding" && (
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 space-y-6">
          <h2 className="font-semibold text-[#faf8f4]">Business Branding</h2>
          <div>
            <label className="block text-sm text-[#888890] mb-2">Logo (shown on proposals)</label>
            <div
              className="w-32 h-20 rounded-lg border-2 border-dashed border-[#1e1e2e] flex items-center justify-center overflow-hidden bg-[#0a0a14] cursor-pointer hover:border-gold/50 relative"
              onClick={() => document.getElementById("logo-input")?.click()}
            >
              {profile?.logo_url ? (
                <Image key={profile.logo_url} src={profile.logo_url || ""} alt="Logo" className="object-contain" fill sizes="128px" />
              ) : (
                <span className="text-2xl text-[#888890]">+</span>
              )}
              <input id="logo-input" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile("logo", f); }} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#888890] mb-1">Brand color (accent on proposals)</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={form.brand_color ?? "#D4AF37"} onChange={(e) => setForm((f) => ({ ...f, brand_color: e.target.value }))} className="w-12 h-10 rounded cursor-pointer" />
              <input value={form.brand_color ?? "#D4AF37"} onChange={(e) => setForm((f) => ({ ...f, brand_color: e.target.value }))} className="w-24 rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-2 py-1 text-[#faf8f4] text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#888890] mb-1">Default signature text</label>
            <input value={form.signature_text ?? ""} onChange={(e) => setForm((f) => ({ ...f, signature_text: e.target.value }))} placeholder="Best regards, [Your Name]" className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
          </div>
          <div>
            <label className="block text-sm text-[#888890] mb-1">Business address (on proposals)</label>
            <textarea value={form.address ?? ""} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} rows={2} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
          </div>
          <div>
            <label className="block text-sm text-[#888890] mb-1">Default payment terms</label>
            <select value={form.default_payment_terms ?? ""} onChange={(e) => setForm((f) => ({ ...f, default_payment_terms: e.target.value }))} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]">
              <option value="">—</option>
              {PAYMENT_TERMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#888890] mb-1">Default currency</label>
            <select value={form.currency ?? "USD"} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]">
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button type="button" onClick={() => saveProfile(form)} disabled={saving} className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] disabled:opacity-50">Save</button>
        </div>
      )}

      {tab === "defaults" && (
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 space-y-6">
          <h2 className="font-semibold text-[#faf8f4]">Proposal Defaults</h2>
          <div>
            <label className="block text-sm text-[#888890] mb-2">Default tone</label>
            <div className="grid grid-cols-2 gap-2">
              {TONE_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, default_tone: t.value }))}
                  className={`rounded-lg border p-3 text-left text-sm ${form.default_tone === t.value ? "border-gold bg-gold/20 text-gold" : "border-[#1e1e2e] text-[#888890] hover:border-gold/30"}`}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#888890] mb-2">Default sections to include</label>
            <div className="space-y-2">
              {PROPOSAL_SECTIONS.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm text-[#888890]">
                  <input type="checkbox" checked={(form.default_sections ?? []).includes(s)} onChange={() => toggleSection(s)} />
                  {s}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#888890] mb-1">Default expiry days</label>
            <input type="number" min={1} max={365} value={form.default_expiry_days ?? 30} onChange={(e) => setForm((f) => ({ ...f, default_expiry_days: parseInt(e.target.value) || 30 }))} className="w-24 rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
            <p className="text-xs text-[#888890] mt-1">Proposals expire after this many days</p>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-[#888890]">
              <input type="checkbox" checked={form.auto_follow_up_enabled ?? true} onChange={(e) => setForm((f) => ({ ...f, auto_follow_up_enabled: e.target.checked }))} />
              Auto follow-up reminder
            </label>
            <div className="mt-2 ml-6">
              <label className="block text-xs text-[#888890] mb-1">Days to wait before reminder</label>
              <input type="number" min={1} max={30} value={form.auto_follow_up_days ?? 7} onChange={(e) => setForm((f) => ({ ...f, auto_follow_up_days: parseInt(e.target.value) || 7 }))} className="w-20 rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-2 py-1 text-[#faf8f4] text-sm" />
            </div>
          </div>
          <button type="button" onClick={() => saveProfile(form)} disabled={saving} className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] disabled:opacity-50">Save</button>
        </div>
      )}

      {tab === "notifications" && (
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 space-y-6">
          <h2 className="font-semibold text-[#faf8f4]">Notifications</h2>
          <div className="space-y-4">
            {[
              { key: "notify_proposal_viewed", label: "When client views my proposal" },
              { key: "notify_proposal_accepted", label: "When proposal is accepted" },
              { key: "notify_proposal_declined", label: "When proposal is declined" },
              { key: "notify_proposal_expired", label: "When proposal expires" },
              { key: "notify_weekly_summary", label: "Weekly summary email" },
              { key: "notify_product_updates", label: "Product updates & tips" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-sm text-[#faf8f4]">
                <input
                  type="checkbox"
                  checked={Boolean(form[key as keyof ProfileData] ?? (key === "notify_product_updates" ? false : true))}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                />
                {label}
              </label>
            ))}
          </div>
          <button type="button" onClick={() => saveProfile(form)} disabled={saving} className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] disabled:opacity-50">Save</button>
        </div>
      )}

      {tab === "billing" && (
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 space-y-6">
          <h2 className="font-semibold text-[#faf8f4]">Billing</h2>
          <div>
            <p className="text-sm text-[#888890]">Current plan</p>
            <p className="text-lg font-semibold text-[#faf8f4] capitalize">{plan}</p>
            {plan !== "free" && PLANS[plan as keyof typeof PLANS] && (
              <p className="text-sm text-[#888890] mt-1">
                {PLANS[plan as keyof typeof PLANS].proposalsPerMonth === -1 ? "Unlimited" : PLANS[plan as keyof typeof PLANS].proposalsPerMonth} proposals/month
              </p>
            )}
          </div>
          {profile?.subscription_period_end && (
            <div>
              <p className="text-sm text-[#888890]">Next billing date</p>
              <p className="text-[#faf8f4]">{new Date(profile.subscription_period_end).toLocaleDateString()}</p>
            </div>
          )}
          {limit >= 0 && (
            <div>
              <p className="text-sm text-[#888890] mb-2">Usage this month</p>
              <div className="h-2 rounded-full bg-[#0a0a14] overflow-hidden">
                <div className="h-full rounded-full bg-gold/60" style={{ width: `${Math.min(100, (used / limit) * 100)}%` }} />
              </div>
              <p className="text-xs text-[#888890] mt-1">{used} of {limitLabel} proposals</p>
            </div>
          )}
          {(profile?.stripe_subscription_id || profile?.stripe_customer_id || plan !== "free") ? (
            <>
              <button type="button" onClick={openPortal} disabled={portalLoading} className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] hover:bg-[#e8c76a] disabled:opacity-50">
                {portalLoading ? "Opening..." : "Manage Billing"}
              </button>
              <p className="text-xs text-[#888890]">Update payment, view invoices, or cancel.</p>
            </>
          ) : (
            <p className="text-sm text-[#888890]">
              <Link href="/#pricing" className="text-gold hover:underline">Upgrade</Link> for more proposals.
            </p>
          )}
        </div>
      )}

      {tab === "integrations" && (
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 space-y-6">
          <h2 className="font-semibold text-[#faf8f4]">Integrations</h2>
          <p className="text-sm text-[#888890]">Connect your tools. Use Zapier webhooks to automate proposals with your CRM or workflow.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/api-docs#zapier"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-lg border border-[#1e1e2e] bg-[#0a0a14] hover:border-gold/30 transition-colors"
            >
              <span className="font-medium text-[#faf8f4]">Zapier</span>
              <span className="text-xs text-gold px-2 py-1 rounded bg-gold/10">Webhooks →</span>
            </Link>
            {["Slack", "Google Calendar", "HubSpot", "Notion"].map((name) => (
              <div key={name} className="flex items-center justify-between p-4 rounded-lg border border-[#1e1e2e] bg-[#0a0a14]">
                <span className="font-medium text-[#faf8f4]">{name}</span>
                <span className="text-xs text-[#888890] px-2 py-1 rounded bg-[#1e1e2e]">Coming Soon</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "account" && (
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 space-y-6">
          <h2 className="font-semibold text-[#faf8f4]">Account</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-[#faf8f4] mb-2">Change password</h3>
              <p className="text-sm text-[#888890] mb-2">We&apos;ll send a reset link to {profile?.email}. Check your email after clicking below.</p>
              <button
                type="button"
                onClick={async () => {
                  const { createClient } = await import("@/lib/supabase/client");
                  const supabase = createClient();
                  const { error } = await supabase.auth.resetPasswordForEmail(profile?.email ?? "", { redirectTo: `${window.location.origin}/auth/callback` });
                  if (!error) alert("Check your email for the reset link.");
                }}
                className="text-gold text-sm hover:underline"
              >
                Send password reset email
              </button>
            </div>
            <div className="rounded-lg border border-red-900/20 bg-red-900/5 p-4">
              <h3 className="text-sm font-medium text-red-400 mb-2">Monitoring Test (PostHog)</h3>
              <p className="text-xs text-[#888890] mb-3">Click this button to trigger a test error and verify that our Iron Shield monitoring is working.</p>
              <button
                type="button"
                onClick={() => {
                  throw new Error("🚀 Proposar Monitoring Test: Success! PostHog is tracking errors.");
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded bg-red-900/20 text-red-400 border border-red-900/30 hover:bg-red-900/30 transition-all"
              >
                Trigger Test Error
              </button>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#faf8f4] mb-2">Change email</h3>
              <p className="text-sm text-[#888890]">Contact support to change your email address.</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#faf8f4] mb-2">Export data (GDPR)</h3>
              <p className="text-sm text-[#888890] mb-2">Download all your profile, proposals, clients, and templates as JSON.</p>
              <a
                href="/api/account/export"
                className="inline-block rounded-lg border border-gold/50 px-4 py-2 text-sm text-gold hover:bg-gold/10 transition-colors"
                download
              >
                Export my data
              </a>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-400 mb-2">Delete account</h3>
              <p className="text-sm text-[#888890] mb-2">Permanently delete your account and all data. This cannot be undone.</p>
              <input
                type="text"
                placeholder='Type "DELETE" to confirm'
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="w-full max-w-xs rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4] mb-2"
              />
              {deleteError && <p className="text-red-400 text-sm mb-2">{deleteError}</p>}
              <button
                type="button"
                disabled={deleteConfirm !== "DELETE"}
                onClick={async () => {
                  setDeleteError("");
                  const res = await fetch("/api/account/delete", { method: "POST" });
                  if (!res.ok) setDeleteError("Failed to delete account");
                  else window.location.href = "/";
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
