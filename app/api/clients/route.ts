import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { clientCreateSchema, clientSearchSchema } from "@/lib/validators";
import { PLAN_LIMITS } from "@/lib/config";
import type { Client } from "@/types";

const DEFAULT_SORT = "updated_at";
const SORTABLE_FIELDS = ["name", "created_at", "updated_at", "total_proposals", "total_value"];

export async function GET(request: Request): Promise<NextResponse<Client[] | { error: string }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const queryObj = {
    search: searchParams.get("search"),
    sort: searchParams.get("sort"),
    order: searchParams.get("order"),
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  };

  // Validate query parameters
  const validationResult = clientSearchSchema.safeParse(queryObj);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: `Invalid query: ${validationResult.error.message}` },
      { status: 400 }
    );
  }

  const { search, sort, order } = validationResult.data;
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100); // Max 100 items
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const offset = (page - 1) * limit;

  let query = supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id);

  if (search?.trim()) {
    query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%,email.ilike.%${search}%`);
  }

  // Only sort by allowed fields
  const sortField = SORTABLE_FIELDS.includes(sort) ? sort : DEFAULT_SORT;
  const { data: clients, error } = await query
    .order(sortField, { ascending: order === "asc" })
    .range(offset, offset + limit - 1); // Add pagination

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!clients?.length) return NextResponse.json<Client[]>([]);

  const clientIds = clients.map((c: { id: string }) => c.id);
  const { data: proposalRows } = await supabase
    .from("proposals")
    .select("client_id, status, budget_amount")
    .eq("user_id", user.id)
    .in("client_id", clientIds);

  const stats: Record<string, { total: number; won: number; value: number }> = {};
  clientIds.forEach((cid: string) => { stats[cid] = { total: 0, won: 0, value: 0 }; });
  proposalRows?.forEach((p: { client_id: string | null; status: string; budget_amount: number | null }) => {
    if (!p.client_id) return;
    if (!stats[p.client_id]) stats[p.client_id] = { total: 0, won: 0, value: 0 };
    stats[p.client_id].total += 1;
    if (p.status === "accepted") {
      stats[p.client_id].won += 1;
      stats[p.client_id].value += Number(p.budget_amount ?? 0);
    }
  });

  let enriched = clients.map((c: { id: string; [k: string]: unknown }) => ({
    ...c,
    total_proposals: stats[c.id]?.total ?? (c.total_proposals as number) ?? 0,
    won_proposals: stats[c.id]?.won ?? (c.won_proposals as number) ?? 0,
    total_value: stats[c.id]?.value ?? Number(c.total_value) ?? 0,
  }));

  if (sort === "total_proposals" || sort === "total_value") {
    enriched = enriched.sort((a, b) => {
      const aVal = a[sort] as number;
      const bVal = b[sort] as number;
      return order === "asc" ? aVal - bVal : bVal - aVal;
    });
  }

  return NextResponse.json<Client[]>(enriched as Client[]);
}

export async function POST(request: Request): Promise<NextResponse<Client | { error: string }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan")
    .eq("id", user.id)
    .single();

  const plan = (profile?.subscription_plan as keyof typeof PLAN_LIMITS) ?? "free";
  const clientLimit = PLAN_LIMITS[plan].clients;
  if (clientLimit >= 0) {
    const { count, error: countError } = await supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    if ((count ?? 0) >= clientLimit) {
      return NextResponse.json(
        {
          error: "Client limit reached for your current plan",
          upgradeUrl: "/dashboard/billing?plan=starter",
        },
        { status: 402 }
      );
    }
  }

  const body = await request.json();

  // Validate request body
  const validationResult = clientCreateSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: `Validation error: ${validationResult.error.message}` },
      { status: 400 }
    );
  }

  const { name, company, email, phone, website, industry, country, notes } = validationResult.data;

  const { data, error } = await supabase
    .from("clients")
    .insert({
      user_id: user.id,
      name: name.trim(),
      company: company?.trim() || null,
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      website: website?.trim() || null,
      industry: industry?.trim() || null,
      country: country?.trim() || null,
      notes: notes?.trim() || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json<Client>(data);
}
