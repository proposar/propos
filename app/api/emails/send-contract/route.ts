import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { sendContractToClient } from "@/lib/resend";

const sendContractSchema = z.object({
  contractId: z.string().uuid(),
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
  const parsed = sendContractSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { sent: false, error: `Validation error: ${parsed.error.message}` },
      { status: 400 }
    );
  }

  const { contractId, to, message } = parsed.data;

  const { data: contract, error: contractError } = await supabase
    .from("contracts")
    .select("id, title, share_id, client_name, client_email, status")
    .eq("id", contractId)
    .eq("user_id", user.id)
    .single();

  if (contractError || !contract) {
    return NextResponse.json({ sent: false, error: "Contract not found" }, { status: 404 });
  }

  const recipient = (to ?? contract.client_email ?? "").trim();
  if (!recipient) {
    return NextResponse.json(
      { sent: false, error: "Client email is required to send contract" },
      { status: 400 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.io";
  const contractLink = `${appUrl}/contract/${contract.share_id}`;

  try {
    await sendContractToClient(
      recipient,
      contract.client_name,
      contract.title,
      message ?? "",
      contractLink,
      profile?.full_name ?? undefined,
    );

    await supabase
      .from("contracts")
      .update({
        status: contract.status === "draft" ? "sent" : contract.status,
        sent_at: new Date().toISOString(),
      })
      .eq("id", contract.id)
      .eq("user_id", user.id);

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("Send contract email error:", error);
    return NextResponse.json({ sent: false, error: "Failed to send contract email" }, { status: 500 });
  }
}
