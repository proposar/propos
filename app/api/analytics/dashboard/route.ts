import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all proposals for this user
    const { data: proposals } = await supabase
      .from("proposals")
      .select(
        "id, status, budget_amount, created_at, sent_at, accepted_at, declined_at, viewed_at, project_type, template_id"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!proposals || proposals.length === 0) {
      return NextResponse.json({
        total_proposals: 0,
        proposals_this_month: 0,
        accepted_count: 0,
        declined_count: 0,
        pending_count: 0,
        acceptance_rate: 0,
        total_value: 0,
        avg_response_time: 0,
        top_template: null,
        revenue_pipeline: 0,
        trend: [],
      });
    }

    // Calculations
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const total_proposals = proposals.length;
    const proposals_this_month = proposals.filter(
      (p) => new Date(p.created_at) >= thisMonth
    ).length;

    const accepted_count = proposals.filter(
      (p) => p.status === "accepted"
    ).length;
    const declined_count = proposals.filter(
      (p) => p.status === "declined"
    ).length;
    const pending_count = proposals.filter(
      (p) => p.status === "sent" || p.status === "viewed"
    ).length;

    const sent_count =
      accepted_count + declined_count + pending_count;
    const acceptance_rate =
      sent_count > 0 ? Math.round((accepted_count / sent_count) * 100) : 0;

    const total_value = proposals.reduce(
      (sum, p) => sum + (p.budget_amount ?? 0),
      0
    );

    // Average response time (from sent to accept/decline)
    const responseTimes: number[] = [];
    proposals.forEach((p) => {
      if (p.sent_at) {
        const sentDate = new Date(p.sent_at).getTime();
        let responseDate: number | null = null;

        if (p.accepted_at) {
          responseDate = new Date(p.accepted_at).getTime();
        } else if (p.declined_at) {
          responseDate = new Date(p.declined_at).getTime();
        }

        if (responseDate) {
          const diffMs = responseDate - sentDate;
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          responseTimes.push(diffDays);
        }
      }
    });

    const avg_response_time =
      responseTimes.length > 0
        ? Math.round(
            responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
          )
        : 0;

    // Top template (most used template that got accepted)
    const templateAcceptance: Record<string, { count: number; accepted: number }> = {};
    proposals.forEach((p) => {
      const tid = p.template_id || "default";
      if (!templateAcceptance[tid]) {
        templateAcceptance[tid] = { count: 0, accepted: 0 };
      }
      templateAcceptance[tid].count++;
      if (p.status === "accepted") {
        templateAcceptance[tid].accepted++;
      }
    });

    let top_template = null;
    let highest_acceptance_rate = 0;
    Object.entries(templateAcceptance).forEach(([tid, stats]) => {
      const rate =
        stats.count > 0
          ? (stats.accepted / stats.count) * 100
          : 0;
      if (rate > highest_acceptance_rate) {
        highest_acceptance_rate = rate;
        top_template = tid === "default" ? "Default Template" : tid;
      }
    });

    // Revenue pipeline (sum of all pending proposals)
    const revenue_pipeline = proposals
      .filter((p) => p.status === "sent" || p.status === "viewed")
      .reduce((sum, p) => sum + (p.budget_amount ?? 0), 0);

    // 30-day trend
    const trend: Array<{ date: string; count: number; value: number }> = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayProposals = proposals.filter(
        (p) => new Date(p.created_at).toISOString().split("T")[0] === dateStr
      );

      trend.push({
        date: dateStr,
        count: dayProposals.length,
        value: dayProposals.reduce((sum, p) => sum + (p.budget_amount ?? 0), 0),
      });
    }

    return NextResponse.json({
      total_proposals,
      proposals_this_month,
      accepted_count,
      declined_count,
      pending_count,
      acceptance_rate,
      total_value,
      avg_response_time,
      top_template,
      revenue_pipeline,
      trend,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to calculate analytics" },
      { status: 500 }
    );
  }
}
