"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { PLAN_LIMITS } from "@/lib/config";
import { useProfile } from "@/contexts/ProfileContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { type Translations } from "@/lib/i18n/dict";

const getNavItems = (t: Translations) => [
  { href: "/dashboard", label: t.dashboard.sidebar.dashboard, icon: "📊" },
  { href: "/proposals", label: t.dashboard.sidebar.proposals, icon: "📄", showBadge: true },
  { href: "/proposals/new", label: t.dashboard.sidebar.newProposal, icon: "➕" },
  { href: "/pipeline", label: t.dashboard.sidebar.pipeline, icon: "🔄" },
  { href: "/clients", label: t.dashboard.sidebar.clients, icon: "👥" },
  { href: "/analytics", label: t.dashboard.sidebar.analytics, icon: "📈" },
  { href: "/contracts", label: t.dashboard.sidebar.contracts, icon: "📝" },
  { href: "/invoices", label: t.dashboard.sidebar.invoices, icon: "💰" },
  { href: "/templates", label: t.dashboard.sidebar.templates, icon: "📋" },
  { href: "/referrals", label: t.dashboard.sidebar.referrals, icon: "🎁" },
  { href: "/feedback", label: t.dashboard.sidebar.feedback, icon: "💬" },
  { href: "/billing", label: t.dashboard.sidebar.billing, icon: "💳" },
  { href: "/settings", label: t.dashboard.sidebar.settings, icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { profile } = useProfile();
  const { t } = useLanguage();
  const [proposalsCount, setProposalsCount] = useState(0);

  const navItems = getNavItems(t);

  const plan = (profile?.subscription_plan as "free" | "starter" | "pro" | "agency") || "free";
  const proposalsUsed = profile?.proposals_used_this_month ?? 0;
  const userName = profile?.full_name || "User";
  const userInitial = profile?.full_name
    ? profile.full_name.charAt(0).toUpperCase()
    : profile?.email
      ? profile.email.charAt(0).toUpperCase()
      : "U";
  const avatarUrl = profile?.avatar_url ?? null;
  const logoUrl = profile?.logo_url ?? null;

  useEffect(() => {
    fetch("/api/proposals?count=1")
      .then((r) => r.json())
      .then((d) => setProposalsCount(typeof d?.count === "number" ? d.count : 0))
      .catch(() => {});
  }, []);

  const proposalsLimit = PLAN_LIMITS[plan]?.proposalsPerMonth ?? 3;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed left-0 top-0 h-full w-60 border-r border-[#1e1e2e] bg-[#12121e] hidden md:flex flex-col z-30"
    >
      <div className="p-5 border-b border-[#1e1e2e]">
        <Link href="/dashboard" className="flex items-center gap-2 font-serif font-bold text-[#faf8f4] text-xl">
          {logoUrl ? (
            <div className="h-8 w-auto max-w-[120px]">
              <Image src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" width={120} height={32} unoptimized />
            </div>
          ) : (
            <>
              <Image
                src="/landscape.svg"
                alt="Proposar Professional Services"
                width={120}
                height={40}
                className="h-8 w-auto"
                unoptimized
              />
              <span className="hidden sm:inline ml-2">Proposar</span>
            </>
          )}
        </Link>
      </div>

      <div className="p-3 border-b border-[#1e1e2e]">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="relative h-9 w-9 rounded-full bg-gold/30 border border-gold flex items-center justify-center text-[#faf8f4] font-medium text-sm overflow-hidden flex-shrink-0">
            {avatarUrl ? (
              <Image src={avatarUrl || ""} alt="Avatar" className="object-cover" fill sizes="36px" />
            ) : (
              userInitial
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#faf8f4] truncate">{userName}</p>
            <p className="text-xs text-[#888890] capitalize">{plan}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-[#0a0a14] text-[#faf8f4] font-medium"
                  : "text-[#888890] hover:text-[#faf8f4] hover:bg-[#0a0a14]"
              }`}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.showBadge && (
                <span className="rounded-full bg-[#1e1e2e] px-2 py-0.5 text-xs text-[#888890]">
                  {proposalsCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {plan === "free" && (
        <div className="p-3 border-t border-[#1e1e2e]">
          <Link
            href="/billing"
            className="block rounded-lg border border-gold/50 bg-gold/10 p-3 text-sm text-gold hover:bg-gold/20 transition-colors"
          >
            <p className="font-medium">{t.dashboard.sidebar.freePlanMsg}</p>
            <p className="text-xs mt-1">{t.dashboard.sidebar.upgradePro}</p>
            <div className="mt-2 h-1.5 rounded-full bg-[#1e1e2e] overflow-hidden">
              <div
                className="h-full rounded-full bg-gold/50"
                style={{ width: `${Math.min(100, (proposalsUsed / proposalsLimit) * 100)}%` }}
              />
            </div>
          </Link>
        </div>
      )}

      <div className="p-3 border-t border-[#1e1e2e] space-y-1">
        <Link href="/help" className="block text-xs text-[#888890] hover:text-gold transition-colors" prefetch>
          {t.dashboard.sidebar.helpSupport}
        </Link>
        <p className="text-xs text-[#888890]/70">{t.dashboard.sidebar.searchHint}</p>
      </div>
    </motion.aside>
  );
}
