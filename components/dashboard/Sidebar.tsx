"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { PLAN_LIMITS } from "@/lib/config";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/proposals", label: "Proposals", icon: "📄", showBadge: true },
  { href: "/proposals/new", label: "New Proposal", icon: "➕" },
  { href: "/pipeline", label: "Pipeline", icon: "🔄" },
  { href: "/clients", label: "Clients", icon: "👥" },
  { href: "/analytics", label: "Analytics", icon: "📈" },
  { href: "/contracts", label: "Contracts", icon: "📝" },
  { href: "/invoices", label: "Invoices", icon: "💰" },
  { href: "/templates", label: "Templates", icon: "📋" },
  { href: "/referrals", label: "Earn with Referrals", icon: "🎁" },
  { href: "/feedback", label: "User Feedback", icon: "💬" },
  { href: "/billing", label: "Billing & Plans", icon: "💳" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [plan, setPlan] = useState<"free" | "starter" | "pro" | "agency">("free");
  const [proposalsCount, setProposalsCount] = useState(0);
  const [proposalsUsed, setProposalsUsed] = useState(0);
  const [userName, setUserName] = useState("User");
  const [userInitial, setUserInitial] = useState("U");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  function loadProfile() {
    fetch("/api/profile", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setPlan((d?.subscription_plan as "free"|"starter"|"pro"|"agency") || "free");
        if (d?.proposals_used_this_month != null) setProposalsUsed(d.proposals_used_this_month);
        if (d?.full_name) {
          setUserName(d.full_name);
          setUserInitial(d.full_name.charAt(0).toUpperCase());
        } else if (d?.email) setUserInitial(d.email.charAt(0).toUpperCase());
        setAvatarUrl(d?.avatar_url ?? null);
        setLogoUrl(d?.logo_url ?? null);
      })
      .catch(() => {});
  }

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    function onProfileUpdated() {
      loadProfile();
    }
    window.addEventListener("profile-updated", onProfileUpdated);
    return () => window.removeEventListener("profile-updated", onProfileUpdated);
  }, []);

  useEffect(() => {
    fetch("/api/proposals")
      .then((r) => r.json())
      .then((d) => setProposalsCount(Array.isArray(d) ? d.length : 0))
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
            href="/#pricing"
            className="block rounded-lg border border-gold/50 bg-gold/10 p-3 text-sm text-gold hover:bg-gold/20 transition-colors"
          >
            <p className="font-medium">You&apos;re on Free.</p>
            <p className="text-xs mt-1">Upgrade to Pro →</p>
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
          Help & Support
        </Link>
        <p className="text-xs text-[#888890]/70">⌘K to search</p>
      </div>
    </motion.aside>
  );
}
