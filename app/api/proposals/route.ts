import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request): Promise<NextResponse<unknown[] | { error: string } | { count: number }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json([], { status: 401 });

  const url = new URL(request.url);
  const countOnly = url.searchParams.get("count") === "1";
  const summaryOnly = url.searchParams.get("summary") === "1";

  if (countOnly) {
    const { count, error } = await supabase
      .from("proposals")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ count: count ?? 0 });
  }

  const selectColumns = summaryOnly
    ? "id, share_id, title, project_type, status, client_name, budget_amount, budget_currency, sent_at, accepted_at, created_at"
    : "id, share_id, title, project_type, status, client_name, client_email, client_company, budget_amount, budget_currency, deliverables, sent_at, accepted_at, created_at";

  const { data, error } = await supabase
    .from("proposals")
    .select(selectColumns)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
