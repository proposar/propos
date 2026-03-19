import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendInvoicePaymentReminderEmail } from "@/lib/resend";

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://proposar.io";
  const now = new Date();
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  try {
    const { data: invoices, error } = await supabase
      .from("invoices")
      .select(`
        id,
        user_id,
        share_id,
        title,
        client_name,
        client_email,
        due_date,
        total,
        amount_paid,
        payment_status,
        status,
        payment_reminder_enabled,
        first_payment_reminder_sent_at,
        second_payment_reminder_sent_at,
        final_payment_reminder_sent_at
      `)
      .neq("payment_status", "fully_paid")
      .eq("payment_reminder_enabled", true)
      .not("client_email", "is", null)
      .not("due_date", "is", null)
      .lte("due_date", todayUtc.toISOString().slice(0, 10));

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!invoices?.length) {
      return NextResponse.json({ message: "No invoice reminders to send", count: 0 });
    }

    const userIds = Array.from(new Set(invoices.map((i) => i.user_id).filter(Boolean)));
    const { data: profiles } = userIds.length
      ? await supabase
          .from("profiles")
          .select("id, full_name, business_name")
          .in("id", userIds)
      : { data: [] as Array<{ id: string; full_name: string | null; business_name: string | null }> };
    const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

    let sent = 0;
    const errors: Array<{ invoiceId: string; error: string }> = [];

    for (const invoice of invoices) {
      if (!invoice.client_email || !invoice.due_date || !invoice.share_id) continue;

      const dueDate = new Date(`${invoice.due_date}T00:00:00.000Z`);
      const daysOverdue = Math.max(0, Math.floor((todayUtc.getTime() - dueDate.getTime()) / DAY_MS));

      let reminderStage: "first" | "second" | "final" | null = null;
      if (daysOverdue >= 14 && !invoice.final_payment_reminder_sent_at) {
        reminderStage = "final";
      } else if (daysOverdue >= 7 && !invoice.second_payment_reminder_sent_at) {
        reminderStage = "second";
      } else if (daysOverdue >= 1 && !invoice.first_payment_reminder_sent_at) {
        reminderStage = "first";
      }

      if (!reminderStage) continue;

      try {
        const total = Number(invoice.total ?? 0);
        const amountPaid = Number(invoice.amount_paid ?? 0);
        const remaining = Math.max(0, total - amountPaid);
        const freelancer = profileMap.get(invoice.user_id);
        const invoiceLink = `${appUrl}/invoice/${invoice.share_id}`;

        await sendInvoicePaymentReminderEmail(
          invoice.client_email,
          invoice.client_name,
          invoice.title,
          invoiceLink,
          `$${remaining.toLocaleString()}`,
          daysOverdue,
          freelancer?.full_name ?? freelancer?.business_name ?? undefined,
        );

        const updatePayload: Record<string, string> = {};
        if (reminderStage === "first") updatePayload.first_payment_reminder_sent_at = now.toISOString();
        if (reminderStage === "second") updatePayload.second_payment_reminder_sent_at = now.toISOString();
        if (reminderStage === "final") updatePayload.final_payment_reminder_sent_at = now.toISOString();
        if (invoice.status !== "paid") updatePayload.status = "overdue";

        await supabase
          .from("invoices")
          .update(updatePayload)
          .eq("id", invoice.id);

        sent++;
      } catch (err: any) {
        errors.push({ invoiceId: invoice.id, error: err?.message ?? "Unknown error" });
      }
    }

    return NextResponse.json({
      message: `Sent ${sent} invoice payment reminders`,
      count: sent,
      errors: errors.length ? errors : undefined,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Internal error" }, { status: 500 });
  }
}
