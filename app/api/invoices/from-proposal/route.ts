import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const proposalId = searchParams.get("proposalId");
  if (!proposalId) return NextResponse.json({ error: "proposalId required" }, { status: 400 });

  const { data: proposal } = await supabase
    .from("proposals")
    .select("id, title, client_name, client_email, budget_amount, budget_currency, subtotal, discount_percent, tax_percent, grand_total, line_items_enabled")
    .eq("id", proposalId)
    .eq("user_id", user.id)
    .single();

  if (!proposal) return NextResponse.json({ error: "Proposal not found" }, { status: 404 });

  let lineItems: Array<{ item_name: string; description: string | null; quantity: number; unit: string; rate: number; amount: number }> = [];
  if (proposal.line_items_enabled) {
    const { data: items } = await supabase
      .from("proposal_line_items")
      .select("item_name, description, quantity, unit, rate, amount")
      .eq("proposal_id", proposal.id)
      .order("sort_order");
    if (items) lineItems = items as typeof lineItems;
  }
  if (lineItems.length === 0 && proposal.budget_amount != null) {
    lineItems = [{
      item_name: proposal.title || "Project",
      description: null,
      quantity: 1,
      unit: "project",
      rate: Number(proposal.budget_amount),
      amount: Number(proposal.budget_amount),
    }];
  }

  const subtotal = proposal.subtotal ?? (proposal.line_items_enabled ? lineItems.reduce((s, i) => s + (i.amount ?? 0), 0) : Number(proposal.budget_amount ?? 0));
  const discount = proposal.discount_percent ?? 0;
  const tax = proposal.tax_percent ?? 0;
  const total = proposal.grand_total ?? (subtotal * (1 - discount / 100) * (1 + tax / 100));

  return NextResponse.json({
    title: proposal.title,
    clientName: proposal.client_name,
    clientEmail: proposal.client_email,
    lineItems,
    subtotal,
    discountPercent: discount,
    taxPercent: tax,
    total,
    currency: proposal.budget_currency ?? "USD",
  });
}
