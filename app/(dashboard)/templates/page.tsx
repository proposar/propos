"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const BUILT_IN_TEMPLATES = [
  { name: "Web Design Package", projectType: "Web Design", slug: "web-design" },
  { name: "Brand Identity Project", projectType: "Brand Identity", slug: "brand-identity" },
  { name: "Social Media Management", projectType: "Social Media", slug: "social-media" },
  { name: "SEO Campaign", projectType: "SEO", slug: "seo" },
  { name: "App Development", projectType: "App Development", slug: "app-development" },
  { name: "Content Writing Package", projectType: "Content Writing", slug: "content-writing" },
  { name: "Consulting Engagement", projectType: "Consulting", slug: "consulting" },
  { name: "Video Production", projectType: "Video Production", slug: "video-production" },
];

const PREMIUM_TEMPLATES = [
  "Enterprise Proposal", "RFP Response", "Retainer Agreement", "SOW Template",
  "Partnership Proposal", "Pitch Deck Outline", "Case Study Proposal", "Multi-Phase Project",
  "International Client", "High-Value Deal",
];

interface Template {
  id: string;
  name: string;
  description: string | null;
  project_type: string | null;
  is_public: boolean;
  is_premium: boolean;
  use_count: number;
  created_at: string;
}

export default function TemplatesPage() {
  const [myTemplates, setMyTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<"free" | "starter" | "pro" | "agency">("free");

  useEffect(() => {
    const templatesPromise = fetch("/api/templates").then((r) => r.json());
    const profilePromise = fetch("/api/profile", { cache: "no-store" }).then((r) => r.json());
    Promise.all([templatesPromise, profilePromise])
      .then(([templatesData, profileData]) => {
        setMyTemplates(Array.isArray(templatesData) ? templatesData.filter((t: Template) => !t.is_public) : []);
        setPlan((profileData?.subscription_plan as typeof plan) ?? "free");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadPlan = useCallback(() => {
    fetch("/api/profile", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setPlan((d?.subscription_plan as typeof plan) ?? "free"))
      .catch(() => {});
  }, []);
  useEffect(() => {
    function onProfileUpdated() {
      loadPlan();
    }
    window.addEventListener("profile-updated", onProfileUpdated);
    return () => window.removeEventListener("profile-updated", onProfileUpdated);
  }, [loadPlan]);

  const canAccessPremium = plan === "pro" || plan === "agency";

  return (
    <div className="space-y-10">
      <h1 className="font-serif text-2xl font-bold text-[#faf8f4]">Templates</h1>

      <section>
        <h2 className="text-lg font-semibold text-[#faf8f4] mb-4">Proposar built-in templates</h2>
        <p className="text-sm text-[#888890] mb-6">Pre-built templates for common project types. Use one to start a new proposal quickly.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BUILT_IN_TEMPLATES.map((t) => (
            <div
              key={t.slug}
              className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-5 hover:border-gold/30 transition-colors"
            >
              <div className="h-20 rounded-lg bg-[#0a0a14]/50 mb-3 flex items-center justify-center text-2xl">📄</div>
              <h3 className="font-medium text-[#faf8f4]">{t.name}</h3>
              <p className="text-xs text-[#888890] mt-1">{t.projectType}</p>
              <Link
                href={`/proposals/new?template=${t.slug}&projectType=${encodeURIComponent(t.projectType)}`}
                className="mt-4 block w-full rounded-lg border border-gold/50 text-gold py-2 text-center text-sm font-medium hover:bg-gold/10"
              >
                Use Template
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#faf8f4] mb-4">My templates</h2>
        <p className="text-sm text-[#888890] mb-6">Templates you’ve saved from your proposals.</p>
        {loading ? (
          <div className="text-[#888890]">Loading...</div>
        ) : myTemplates.length === 0 ? (
          <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-8 text-center text-[#888890]">
            <p>No saved templates yet.</p>
            <p className="text-sm mt-2">Save a proposal as a template from the proposal editor (⋮ → Save as template).</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {myTemplates.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-5 hover:border-gold/30 transition-colors"
              >
                <div className="h-20 rounded-lg bg-[#0a0a14]/50 mb-3 flex items-center justify-center text-2xl">📋</div>
                <h3 className="font-medium text-[#faf8f4]">{t.name}</h3>
                <p className="text-xs text-[#888890] mt-1">{t.project_type ?? "—"} · Used {t.use_count}×</p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/proposals/new?templateId=${t.id}`}
                    className="flex-1 rounded-lg border border-gold/50 text-gold py-2 text-center text-sm font-medium hover:bg-gold/10"
                  >
                    Use
                  </Link>
                  <button type="button" className="rounded-lg border border-[#1e1e2e] px-3 py-2 text-sm text-[#888890] hover:text-[#faf8f4]">
                    ⋮
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#faf8f4] mb-4">Premium templates</h2>
        <p className="text-sm text-[#888890] mb-6">Advanced templates for Pro and Agency plans.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PREMIUM_TEMPLATES.slice(0, 8).map((name, i) => (
            <div
              key={name}
              className={`rounded-xl border border-[#1e1e2e] bg-[#12121e] p-5 relative overflow-hidden ${!canAccessPremium ? "opacity-80" : ""}`}
            >
              {!canAccessPremium && (
                <div className="absolute inset-0 bg-[#0a0a14]/80 flex items-center justify-center z-10">
                  <div className="text-center p-4">
                    <p className="text-sm font-medium text-[#faf8f4] mb-2">Upgrade to unlock</p>
                    <Link href="/#pricing" className="text-gold text-sm hover:underline">Upgrade to Pro →</Link>
                  </div>
                </div>
              )}
              <div className="h-20 rounded-lg bg-[#0a0a14]/50 mb-3 flex items-center justify-center text-2xl blur-sm">📄</div>
              <h3 className="font-medium text-[#faf8f4]">{name}</h3>
              <p className="text-xs text-[#888890] mt-1">Pro / Agency</p>
              {canAccessPremium && (
                <Link
                  href={`/proposals/new?template=${encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"))}&projectType=${encodeURIComponent(name)}`}
                  className="mt-4 block w-full rounded-lg border border-gold/50 text-gold py-2 text-center text-sm font-medium hover:bg-gold/10"
                >
                  Use Template
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
