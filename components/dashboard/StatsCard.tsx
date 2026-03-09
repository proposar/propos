"use client";

import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string;
  subtext?: string;
  icon?: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
}

export function StatsCard({ title, value, subtext, icon, trend, trendLabel }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-5 hover:border-gold/20 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#888890]">{title}</p>
          <p className="text-2xl font-bold text-[#faf8f4] mt-1">{value}</p>
          {subtext && (
            <p className="text-xs text-[#888890] mt-1 flex items-center gap-1">
              {trend === "up" && <span className="text-emerald-400">↑</span>}
              {trend === "down" && <span className="text-red-400">↓</span>}
              {subtext}
              {trendLabel && <span className="text-[#888890]">({trendLabel})</span>}
            </p>
          )}
        </div>
        {icon && <span className="text-2xl opacity-80">{icon}</span>}
      </div>
    </motion.div>
  );
}
