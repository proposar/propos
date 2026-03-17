"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslations } from "@/lib/i18n/dict";

type ProposalStatus = "draft" | "sent" | "viewed" | "accepted" | "declined";

const statusStyles: Record<ProposalStatus, string> = {
  draft: "bg-[#1e1e2e] text-[#888890]",
  sent: "bg-blue-500/20 text-blue-400",
  viewed: "bg-amber-500/20 text-amber-400",
  accepted: "bg-emerald-500/20 text-emerald-400",
  declined: "bg-red-500/20 text-red-400",
};

export default function DashboardPage() {
  const { locale } = useLanguage();
  const t = getTranslations(locale);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<Array<{
    id: string;
    client_name: string;
    project_type: string;
    status: ProposalStatus;
    budget_amount: number | null;
    sent_at: string | null;
  }>>([]);
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    winRate: 0,
    viewed: 0,
    valueWon: 0,
    valueChange: 0,
  });
  const [needingAttention, setNeedingAttention] = useState<Array<{ id: string; client_name: string; daysSince: number }>>([]);

  useEffect(() => {
    const seen = typeof window !== "undefined" && localStorage.getItem("Proposar_welcome_seen");
    if (!seen) setWelcomeOpen(true);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/proposals?summary=1");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProposals(data.slice(0, 5));
          const accepted = data.filter((p: { status: string }) => p.status === "accepted").length;
          const total = data.filter((p: { status: string }) => ["accepted", "declined"].includes(p.status)).length;
          const valueWon = data
            .filter((p: { status: string }) => p.status === "accepted")
            .reduce((s: number, p: { budget_amount?: number }) => s + (p.budget_amount || 0), 0);
          setStats({
            total: data.length,
            thisWeek: 0,
            winRate: total > 0 ? Math.round((accepted / total) * 100) : 0,
            viewed: data.filter((p: { status: string }) => p.status === "viewed" || p.status === "accepted").length,
            valueWon,
            valueChange: 0,
          });
        }
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function closeWelcome() {
    setWelcomeOpen(false);
    if (typeof window !== "undefined") localStorage.setItem("Proposar_welcome_seen", "1");
  }

  const acceptedCount = proposals.filter((p) => p.status === "accepted").length;
  const declinedCount = proposals.filter((p) => p.status === "declined").length;
  const pendingCount = proposals.filter((p) => ["draft", "sent", "viewed"].includes(p.status)).length;
  const totalForRate = acceptedCount + declinedCount;
  const winRatePct = totalForRate > 0 ? Math.round((acceptedCount / totalForRate) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={t.dashboard.stats.totalProposals}
          value={loading ? "—" : String(stats.total)}
          subtext={stats.thisWeek > 0 ? `+${stats.thisWeek} ${t.dashboard.stats.thisWeek}` : t.dashboard.stats.createFirst}
          icon="📄"
          trend={stats.thisWeek > 0 ? "up" : undefined}
        />
        <StatsCard
          title={t.dashboard.stats.winRate}
          value={loading ? "—" : (stats.winRate > 0 ? `${stats.winRate}%` : "—")}
          subtext={stats.winRate > 0 ? t.dashboard.stats.vsLastMonth : t.dashboard.stats.noData}
          icon="📊"
        />
        <StatsCard
          title={t.dashboard.stats.viewed}
          value={loading ? "—" : String(stats.viewed)}
          subtext={t.dashboard.stats.reading}
          icon="👁️"
        />
        <StatsCard
          title={t.dashboard.stats.valueWon}
          value={loading ? "—" : `$${stats.valueWon.toLocaleString()}`}
          subtext={stats.valueChange !== 0 ? `${stats.valueChange > 0 ? "+" : ""}$${stats.valueChange}` : t.dashboard.stats.vsLastMonth}
          icon="💰"
          trend={stats.valueChange > 0 ? "up" : stats.valueChange < 0 ? "down" : undefined}
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#faf8f4]">{t.dashboard.recentProposals.title}</h2>
            <Link href="/proposals" className="text-sm text-gold hover:underline">
              {t.dashboard.recentProposals.viewAll}
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-lg bg-[#0a0a14]/50 animate-pulse" />
              ))}
            </div>
          ) : proposals.length === 0 ? (
            <p className="text-[#888890] text-sm py-8 text-center">{t.dashboard.recentProposals.empty}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#888890] border-b border-[#1e1e2e]">
                    <th className="pb-3 pr-4">{t.dashboard.recentProposals.headers.client}</th>
                    <th className="pb-3 pr-4">{t.dashboard.recentProposals.headers.type}</th>
                    <th className="pb-3 pr-4">{t.dashboard.recentProposals.headers.value}</th>
                    <th className="pb-3 pr-4">{t.dashboard.recentProposals.headers.status}</th>
                    <th className="pb-3 pr-4">{t.dashboard.recentProposals.headers.sent}</th>
                    <th className="pb-3">{t.dashboard.recentProposals.headers.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {proposals.map((p) => (
                    <tr key={p.id} className="border-b border-[#1e1e2e]/50">
                      <td className="py-3 pr-4 text-[#faf8f4]">{p.client_name}</td>
                      <td className="py-3 pr-4 text-[#888890]">{p.project_type}</td>
                      <td className="py-3 pr-4 text-[#888890]">{p.budget_amount != null ? `$${p.budget_amount}` : "—"}</td>
                      <td className="py-3 pr-4">
                        <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusStyles[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-[#888890]">{p.sent_at ? new Date(p.sent_at).toLocaleDateString() : "—"}</td>
                      <td className="py-3">
                        <Link href={`/proposals/${p.id}`} className="text-gold hover:underline text-xs">View</Link>
                        <span className="mx-1 text-[#1e1e2e]">|</span>
                        <a href={`/api/proposals/${p.id}/pdf`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline text-xs">PDF</a>
                        <span className="mx-1 text-[#1e1e2e]">|</span>
                        <button type="button" className="text-gold hover:underline text-xs">Share</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Link
            href="/proposals/new"
            className="block rounded-xl border border-gold bg-gold/20 p-6 text-center hover:bg-gold/30 transition-colors"
          >
            <span className="text-3xl block mb-2">➕</span>
            <span className="font-semibold text-[#faf8f4]">{t.dashboard.sidebar.newProposal}</span>
          </Link>
          <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-5">
            <h3 className="font-medium text-[#faf8f4] mb-4">{t.dashboard.stats.winRate}</h3>
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 rounded-full border-4 border-[#1e1e2e] flex items-center justify-center">
                <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                  <path
                    fill="none"
                    stroke="#1e1e2e"
                    strokeWidth="3"
                    d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
                  />
                  <path
                    fill="none"
                    stroke="#c9a84c"
                    strokeWidth="3"
                    strokeDasharray={`${winRatePct}, 100`}
                    d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
                  />
                </svg>
                <span className="absolute text-lg font-bold text-[#faf8f4]">{winRatePct}%</span>
              </div>
              <div className="text-sm text-[#888890]">
                <p>Accepted: {acceptedCount}</p>
                <p>Declined: {declinedCount}</p>
                <p>Pending: {pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-5">
            <h3 className="font-medium text-[#faf8f4] mb-4">{t.dashboard.topbar.titles["/analytics"]}</h3>
            <p className="text-sm text-[#888890]">{t.dashboard.stats.noData}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6">
        <h2 className="font-semibold text-[#faf8f4] mb-4">{t.dashboard.attention.title}</h2>
        {needingAttention.length === 0 ? (
          <p className="text-[#888890] text-sm">{t.dashboard.attention.allCaughtUp}</p>
        ) : (
          <ul className="space-y-3">
            {needingAttention.map((n) => (
              <li key={n.id} className="flex items-center justify-between">
                <span className="text-[#faf8f4]">{n.client_name}</span>
                <span className="text-sm text-[#888890]">{n.daysSince} {t.dashboard.attention.daysSince}</span>
                <button type="button" className="rounded-lg bg-gold/20 text-gold px-3 py-1.5 text-sm hover:bg-gold/30">
                  {t.dashboard.attention.followUp}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AnimatePresence>
        {welcomeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={closeWelcome}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-8 max-w-md w-full"
            >
              <h2 className="font-serif text-2xl font-bold text-[#faf8f4] mb-2">
                {t.dashboard.welcome.title}
              </h2>
              <p className="text-[#888890] mb-6">{t.dashboard.welcome.subtitle}</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-sm text-[#faf8f4]">
                  <span className="rounded-full border border-gold w-6 h-6 flex items-center justify-center text-gold">1</span>
                  {t.dashboard.welcome.step1}
                </li>
                <li className="flex items-center gap-3 text-sm text-[#faf8f4]">
                  <span className="rounded-full border border-gold w-6 h-6 flex items-center justify-center text-gold">2</span>
                  {t.dashboard.welcome.step2}
                </li>
                <li className="flex items-center gap-3 text-sm text-[#faf8f4]">
                  <span className="rounded-full border border-gold w-6 h-6 flex items-center justify-center text-gold">3</span>
                  {t.dashboard.welcome.step3}
                </li>
              </ul>
              <div className="flex gap-3">
                <Link
                  href="/proposals/new"
                  onClick={closeWelcome}
                  className="flex-1 rounded-lg bg-gold py-3 text-center font-medium text-[#0a0a14] hover:bg-[#e8c76a]"
                >
                  {t.dashboard.welcome.cta}
                </Link>
                <button
                  type="button"
                  onClick={closeWelcome}
                  className="rounded-lg border border-[#1e1e2e] px-4 py-3 text-[#888890] hover:text-[#faf8f4]"
                >
                  {t.dashboard.welcome.later}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
