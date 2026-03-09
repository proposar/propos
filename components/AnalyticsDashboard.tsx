"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface AnalyticsData {
  total_proposals: number;
  proposals_this_month: number;
  accepted_count: number;
  declined_count: number;
  pending_count: number;
  acceptance_rate: number;
  total_value: number;
  avg_response_time: number;
  top_template: string | null;
  revenue_pipeline: number;
  trend: Array<{
    date: string;
    count: number;
    value: number;
  }>;
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/dashboard")
      .then((r) => r.json())
      .then((d) => setAnalytics(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-3xl font-bold text-[#faf8f4]">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 animate-pulse"
            >
              <div className="h-8 bg-[#1e1e2e] rounded mb-2 w-1/3"></div>
              <div className="h-6 bg-[#1e1e2e] rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-8 text-center">
        <p className="text-[#888890]">Failed to load analytics</p>
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Prepare trend data for chart
  const chartData = analytics.trend.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    proposals: item.count,
    value: item.value,
  }));

  const MetricCard = ({
    label,
    value,
    subtitle,
    trend,
    color = "text-gold",
  }: {
    label: string;
    value: string | number;
    subtitle?: string;
    trend?: "up" | "down";
    color?: string;
  }) => (
    <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 hover:border-gold/40 transition-colors">
      <p className="text-[#888890] text-sm font-medium mb-2">{label}</p>
      <p className={`text-3xl font-bold ${color} mb-2`}>{value}</p>
      {subtitle && <p className="text-xs text-[#888890]">{subtitle}</p>}
      {trend && (
        <p className="text-xs mt-2 flex items-center gap-1">
          <span className={trend === "up" ? "text-emerald-500" : "text-red-500"}>
            {trend === "up" ? "↑" : "↓"}
          </span>
          <span className={trend === "up" ? "text-emerald-500" : "text-red-500"}>
            {trend === "up" ? "Trending up" : "Needs attention"}
          </span>
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#faf8f4] mb-2">Analytics</h1>
        <p className="text-[#888890]">Your proposal performance at a glance</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          label="Total Proposals Sent"
          value={analytics.total_proposals}
          subtitle={`${analytics.proposals_this_month} this month`}
          trend="up"
        />
        <MetricCard
          label="Acceptance Rate"
          value={`${analytics.acceptance_rate}%`}
          subtitle={`${analytics.accepted_count} accepted of ${analytics.accepted_count + analytics.declined_count + analytics.pending_count} sent`}
          trend={analytics.acceptance_rate > 40 ? "up" : "down"}
          color={analytics.acceptance_rate > 40 ? "text-emerald-400" : "text-amber-400"}
        />
        <MetricCard
          label="Pipeline Value"
          value={formatCurrency(analytics.revenue_pipeline)}
          subtitle={`${analytics.pending_count} proposals pending`}
          color="text-emerald-400"
        />
        <MetricCard
          label="Total Proposal Value"
          value={formatCurrency(analytics.total_value)}
          subtitle="All proposals (accepted + pending + declined)"
        />
        <MetricCard
          label="Avg Response Time"
          value={`${analytics.avg_response_time}d`}
          subtitle="Days until client responds"
        />
        <MetricCard
          label="Top Performing"
          value={analytics.top_template || "—"}
          subtitle="Your best template by acceptance rate"
          color="text-blue-400"
        />
      </div>

      {/* Status Breakdown */}
      <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-8">
        <h2 className="text-xl font-semibold text-[#faf8f4] mb-6">Proposal Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-emerald-400 text-2xl font-bold">{analytics.accepted_count}</p>
            <p className="text-[#888890] text-sm">Accepted</p>
          </div>
          <div>
            <p className="text-amber-400 text-2xl font-bold">{analytics.pending_count}</p>
            <p className="text-[#888890] text-sm">Pending Review</p>
          </div>
          <div>
            <p className="text-red-400 text-2xl font-bold">{analytics.declined_count}</p>
            <p className="text-[#888890] text-sm">Declined</p>
          </div>
          <div>
            <p className="text-blue-400 text-2xl font-bold">{analytics.total_proposals - (analytics.accepted_count + analytics.pending_count + analytics.declined_count)}</p>
            <p className="text-[#888890] text-sm">Not Sent Yet</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Volume Trend */}
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-8">
          <h2 className="text-xl font-semibold text-[#faf8f4] mb-6">Proposals Created (30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#888890", fontSize: 12 }}
                stroke="#1e1e2e"
              />
              <YAxis tick={{ fill: "#888890", fontSize: 12 }} stroke="#1e1e2e" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#12121e",
                  border: "1px solid #1e1e2e",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#faf8f4" }}
              />
              <Bar dataKey="proposals" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Value Trend */}
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-8">
          <h2 className="text-xl font-semibold text-[#faf8f4] mb-6">Proposal Value (30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#888890", fontSize: 12 }}
                stroke="#1e1e2e"
              />
              <YAxis tick={{ fill: "#888890", fontSize: 12 }} stroke="#1e1e2e" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#12121e",
                  border: "1px solid #1e1e2e",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#faf8f4" }}
                formatter={(value) => formatCurrency(value as number)}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#D4AF37"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="rounded-xl border border-gold/30 bg-gold/5 p-8">
        <h2 className="text-xl font-semibold text-[#faf8f4] mb-4">💡 Insights</h2>
        <div className="space-y-3 text-[#c4c4cc]">
          {analytics.acceptance_rate >= 50 && (
            <p>✓ Your acceptance rate is excellent (50%+). Keep using what works!</p>
          )}
          {analytics.acceptance_rate < 30 && (
            <p>
              ⚠ Your acceptance rate is below average (30%). Try refining your proposal tone or adding more details.
            </p>
          )}
          {analytics.avg_response_time > 7 && (
            <p>
              💬 Clients take ~{analytics.avg_response_time} days to respond. Consider automated follow-ups.
            </p>
          )}
          {analytics.revenue_pipeline > 10000 && (
            <p>
              🚀 You have ${(analytics.revenue_pipeline / 1000).toFixed(0)}K in pipeline. Great momentum!
            </p>
          )}
          {analytics.total_proposals < 5 && (
            <p>
              📈 Start sending more proposals to build data. Aim for 5-10 per month.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
