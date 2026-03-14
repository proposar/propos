import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 200, 500);

  const { data, error } = await supabase
    .from("invoices")
    .select("id, share_id, invoice_number, title, status, client_name, total, currency, due_date, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(0, limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const { proposalId, title, clientName, clientEmail, lineItems, subtotal, discountPercent, taxPercent, total, currency, dueDate, paymentLink, notes } = body;
  if (!title?.trim() || !clientName?.trim())
    return NextResponse.json({ error: "title and clientName required" }, { status: 400 });

  const { count } = await supabase.from("invoices").select("id", { count: "exact", head: true }).eq("user_id", user.id);
  const invoiceNumber = `INV-${String((count ?? 0) + 1).padStart(3, "0")}`;

  const due = dueDate ? new Date(dueDate).toISOString().slice(0, 10) : null;

  const { data, error } = await supabase
    .from("invoices")
    .insert({
      proposal_id: proposalId || null,
      user_id: user.id,
      invoice_number: invoiceNumber,
      title: title.trim(),
      client_name: clientName.trim(),
      client_email: clientEmail || null,
      status: "draft",
      line_items: lineItems ?? [],
      subtotal: subtotal ?? null,
      discount_percent: discountPercent ?? 0,
      tax_percent: taxPercent ?? 0,
      total: total ?? null,
      currency: currency ?? "USD",
      due_date: due,
      payment_link: paymentLink || null,
      notes: notes || null,
    })
    .select("id, share_id, invoice_number")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
