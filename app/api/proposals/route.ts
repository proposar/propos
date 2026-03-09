import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Proposal } from "@/types";

export async function GET(): Promise<NextResponse<Proposal[] | { error: string }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json([], { status: 401 });

  const { data, error } = await supabase
    .from("proposals")
    .select("id, share_id, title, project_type, status, client_name, client_email, client_company, budget_amount, budget_currency, deliverables, sent_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json<Proposal[]>((data as Proposal[]) ?? []);
}
