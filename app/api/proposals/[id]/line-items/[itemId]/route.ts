import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { lineItemUpdateSchema } from "@/lib/validators";
import type { ProposalLineItem } from "@/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> },
): Promise<NextResponse<ProposalLineItem | { error: string }>> {
  const { id, itemId } = await params;
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
  const validationResult = lineItemUpdateSchema.safeParse(body);
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

  const updates: Record<string, unknown> = {};
  if (item_name !== undefined) updates.item_name = item_name;
  if (description !== undefined) updates.description = description;
  if (quantity !== undefined) updates.quantity = quantity;
  if (unit !== undefined) updates.unit = unit;
  if (rate !== undefined) updates.rate = rate;
  if (sort_order !== undefined) updates.sort_order = sort_order;
  if (is_optional !== undefined) updates.is_optional = is_optional;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid updates provided" }, { status: 400 });
  }

  const { data: lineItem, error } = await supabase
    .from("proposal_line_items")
    .update(updates)
    .eq("id", itemId)
    .eq("proposal_id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating line item:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json<ProposalLineItem>(lineItem);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> },
): Promise<NextResponse<{ deleted: boolean } | { error: string }>> {
  const { id, itemId } = await params;
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

  const { error } = await supabase
    .from("proposal_line_items")
    .delete()
    .eq("id", itemId)
    .eq("proposal_id", id);

  if (error) {
    console.error("Error deleting line item:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}
