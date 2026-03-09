import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { clientUpdateSchema } from "@/lib/validators";
import type { Client } from "@/types";

interface ClientWithStats extends Client {
  total_proposals: number;
  won_proposals: number;
  total_value: number;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ClientWithStats | { error: string }>> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !client) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: proposalRows } = await supabase
    .from("proposals")
    .select("status, budget_amount")
    .eq("user_id", user.id)
    .eq("client_id", id);
  
  let totalProposals = 0;
  let wonProposals = 0;
  let totalValue = 0;
  proposalRows?.forEach((p: { status: string; budget_amount: number | null }) => {
    totalProposals += 1;
    if (p.status === "accepted") {
      wonProposals += 1;
      totalValue += Number(p.budget_amount ?? 0);
    }
  });
  
  return NextResponse.json<ClientWithStats>({
    ...client,
    total_proposals: totalProposals,
    won_proposals: wonProposals,
    total_value: totalValue,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<Client | { error: string }>> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // Validate request body
  const validationResult = clientUpdateSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: `Validation error: ${validationResult.error.message}` },
      { status: 400 }
    );
  }

  const allowed = ["name", "company", "email", "phone", "website", "industry", "country", "notes"];
  const updates: Record<string, unknown> = {};
  const validated = validationResult.data;

  for (const k of allowed) {
    if (k in validated) {
      const value = validated[k as keyof typeof validated];
      updates[k] = value === "" ? null : value;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid updates provided" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("clients")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json<Client>(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ deleted: boolean } | { error: string }>> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
