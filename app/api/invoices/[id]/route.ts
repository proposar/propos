import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const allowed = ["title", "client_name", "client_email", "line_items", "subtotal", "discount_percent", "tax_percent", "total", "currency", "due_date", "payment_link", "notes", "status", "paid_at", "amount_paid", "deposit_percent"];
  const updates: Record<string, unknown> = {};
  for (const k of allowed) {
    if (k in body) updates[k] = body[k];
  }

  // If amount_paid is being updated, calculate payment_status automatically
  if ("amount_paid" in updates) {
    const amountPaid = Number(updates.amount_paid) || 0;
    
    // Get current invoice total to calculate percentages
    const { data: currentInvoice } = await supabase
      .from("invoices")
      .select("total, deposit_percent")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (currentInvoice) {
      const total = Number(currentInvoice.total) || 0;
      const depositPercent = Number(currentInvoice.deposit_percent) || 50;
      const depositAmount = (total * depositPercent) / 100;

      // Auto-calculate payment_status
      if (amountPaid <= 0) {
        updates.payment_status = "unpaid";
        updates.status = "sent"; // Reset status to sent when payment is removed
      } else if (amountPaid >= total) {
        updates.payment_status = "fully_paid";
        updates.status = "paid";
        if (!updates.paid_at) updates.paid_at = new Date().toISOString();
      } else if (amountPaid >= depositAmount) {
        updates.payment_status = "deposit_paid";
      } else {
        updates.payment_status = "partially_paid";
      }
    }
  }

  // Handle legacy "paid" status update
  if (updates.status === "paid" && !updates.paid_at) {
    updates.paid_at = new Date().toISOString();
  }

  if (Object.keys(updates).length === 0) return NextResponse.json({ error: "No valid updates" }, { status: 400 });

  const { data, error } = await supabase
    .from("invoices")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
