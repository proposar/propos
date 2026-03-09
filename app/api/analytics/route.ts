import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "30";
  const days = range === "all" ? 3650 : parseInt(range, 10) || 30;
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceIso = since.toISOString();

  const { data: proposals, error } = await supabase
    .from("proposals")
    .select("id, status, project_type, tone, budget_amount, budget_currency, sent_at, accepted_at, follow_up_sent, created_at")
    .eq("user_id", user.id)
    .neq("status", "draft")
    .gte("created_at", sinceIso);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const sent = proposals?.filter((p) => p.sent_at) ?? [];
  const accepted = sent.filter((p) => p.status === "accepted");
  const declined = sent.filter((p) => p.status === "declined");
  const pending = sent.filter((p) => ["sent", "viewed"].includes(p.status ?? ""));

  const winRate = sent.length > 0 ? (accepted.length / sent.length) * 100 : 0;
  const totalWon = accepted.reduce(
    (sum, p) => sum + (Number(p.budget_amount) || 0),
    0
  );
  const avgDealSize = accepted.length > 0 ? totalWon / accepted.length : 0;
  const timeToCloseArr = accepted
    .filter((p) => p.sent_at && p.accepted_at)
    .map((p) => {
      const sent = new Date(p.sent_at!).getTime();
      const acc = new Date(p.accepted_at!).getTime();
      return (acc - sent) / 86400000;
    });
  const avgDaysToClose =
    timeToCloseArr.length > 0
      ? timeToCloseArr.reduce((a, b) => a + b, 0) / timeToCloseArr.length
      : 0;

  const byProjectType: Record<string, { sent: number; won: number; value: number }> = {};
  for (const p of sent) {
    const t = p.project_type || "Other";
    if (!byProjectType[t]) byProjectType[t] = { sent: 0, won: 0, value: 0 };
    byProjectType[t].sent++;
    if (p.status === "accepted") {
      byProjectType[t].won++;
      byProjectType[t].value += Number(p.budget_amount) || 0;
    }
  }

  const byTone: Record<string, { sent: number; won: number }> = {};
  for (const p of sent) {
    const t = p.tone || "professional";
    if (!byTone[t]) byTone[t] = { sent: 0, won: 0 };
    byTone[t].sent++;
    if (p.status === "accepted") byTone[t].won++;
  }

  const buckets = ["<500", "500-2k", "2k-5k", "5k-10k", "10k+"];
  const byBucket: Record<string, { sent: number; won: number }> = {};
  for (const b of buckets) byBucket[b] = { sent: 0, won: 0 };
  for (const p of sent) {
    const amt = Number(p.budget_amount) || 0;
    let b: string;
    if (amt < 500) b = "<500";
    else if (amt < 2000) b = "500-2k";
    else if (amt < 5000) b = "2k-5k";
    else if (amt < 10000) b = "5k-10k";
    else b = "10k+";
    byBucket[b].sent++;
    if (p.status === "accepted") byBucket[b].won++;
  }

  const byDay: Record<number, { sent: number; won: number }> = {};
  for (let i = 0; i < 7; i++) byDay[i] = { sent: 0, won: 0 };
  for (const p of sent) {
    if (!p.sent_at) continue;
    const d = new Date(p.sent_at).getDay();
    byDay[d].sent++;
    if (p.status === "accepted") byDay[d].won++;
  }

  const withFollowUp = sent.filter((p) => p.follow_up_sent);
  const withoutFollowUp = sent.filter((p) => !p.follow_up_sent);
  const followUpImpact = {
    with: { count: withFollowUp.length, won: withFollowUp.filter((p) => p.status === "accepted").length },
    without: { count: withoutFollowUp.length, won: withoutFollowUp.filter((p) => p.status === "accepted").length },
  };

  const recentAccepted = accepted
    .slice()
    .sort((a, b) => new Date((b.accepted_at || b.created_at) ?? 0).getTime() - new Date((a.accepted_at || a.created_at) ?? 0).getTime())
    .slice(0, 5);

  return NextResponse.json({
    overall: {
      sent: sent.length,
      accepted: accepted.length,
      declined: declined.length,
      pending: pending.length,
      winRate,
      totalWon,
      avgDealSize,
      avgDaysToClose: Math.round(avgDaysToClose * 10) / 10,
    },
    byProjectType,
    byTone,
    byBucket,
    byDay,
    followUpImpact,
    timeToClose: {
      avg: avgDaysToClose,
      min: timeToCloseArr.length ? Math.min(...timeToCloseArr) : 0,
      max: timeToCloseArr.length ? Math.max(...timeToCloseArr) : 0,
      median:
        timeToCloseArr.length > 0
          ? [...timeToCloseArr].sort((a, b) => a - b)[Math.floor(timeToCloseArr.length / 2)]
          : 0,
    },
    recentAccepted,
  });
}
