import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { lineItemSchema } from "@/lib/validators";
import type { ProposalLineItem } from "@/types";

interface LineItemsResponse {
  lineItems: ProposalLineItem[];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<LineItemsResponse | { error: string }>> {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const { data: proposal } = await supabase
    .from("proposals")
    .select("id, user_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  const { data: lineItems, error } = await supabase
    .from("proposal_line_items")
    .select("*")
    .eq("proposal_id", id)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching line items:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lineItems: lineItems ?? [] });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ProposalLineItem | { error: string }>> {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const { data: proposal } = await supabase
    .from("proposals")
    .select("id, user_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  const body = await request.json();

  // Validate request body
  const validationResult = lineItemSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: `Validation error: ${validationResult.error.message}` },
      { status: 400 }
    );
  }

  const {
    item_name,
    description,
    quantity,
    unit,
    rate,
    sort_order,
    is_optional,
  } = validationResult.data;

  const { data: lineItem, error } = await supabase
    .from("proposal_line_items")
    .insert({
      proposal_id: id,
      item_name,
      description: description || null,
      quantity,
      unit: unit || "unit",
      rate,
      sort_order: sort_order ?? 0,
      is_optional: is_optional ?? false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating line item:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json<ProposalLineItem>(lineItem, { status: 201 });
}
