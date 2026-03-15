import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { sendInvoiceToClient } from "@/lib/resend";

const sendInvoiceSchema = z.object({
  invoiceId: z.string().uuid(),
  to: z.string().email().optional(),
  message: z.string().max(1200).optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ sent: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = sendInvoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { sent: false, error: `Validation error: ${parsed.error.message}` },
      { status: 400 }
    );
  }

  const { invoiceId, to, message } = parsed.data;

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("id, title, share_id, client_name, client_email, status")
    .eq("id", invoiceId)
    .eq("user_id", user.id)
    .single();

  if (invoiceError || !invoice) {
    return NextResponse.json({ sent: false, error: "Invoice not found" }, { status: 404 });
  }

  const recipient = (to ?? invoice.client_email ?? "").trim();
  if (!recipient) {
    return NextResponse.json(
      { sent: false, error: "Client email is required to send invoice" },
      { status: 400 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.io";
  const invoiceLink = `${appUrl}/invoice/${invoice.share_id}`;

  try {
    await sendInvoiceToClient(
      recipient,
      invoice.client_name,
      invoice.title,
      message ?? "",
      invoiceLink,
      profile?.full_name ?? undefined,
    );

    await supabase
      .from("invoices")
      .update({
        status: invoice.status === "draft" ? "sent" : invoice.status,
      })
      .eq("id", invoice.id)
      .eq("user_id", user.id);

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("Send invoice email error:", error);
    return NextResponse.json({ sent: false, error: "Failed to send invoice email" }, { status: 500 });
  }
}
