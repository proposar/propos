import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import {
  sendContractFullySignedToClient,
  sendContractFullySignedToFreelancer,
} from "@/lib/resend";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const { shareId } = await params;
  const body = await request.json().catch(() => ({}));
  const clientName = body.clientName as string | undefined;
  if (!clientName?.trim()) return NextResponse.json({ error: "clientName required" }, { status: 400 });

  const ipHeader =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    null;
  const clientIp = ipHeader ? ipHeader.split(",")[0].trim().slice(0, 100) : null;
  const clientUserAgent = (request.headers.get("user-agent") ?? "").slice(0, 500) || null;

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  const { data: contract } = await admin
    .from("contracts")
    .select("id, user_id, title, share_id, client_name, client_email, status, freelancer_signature, client_signature")
    .eq("share_id", shareId)
    .single();

  if (!contract) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (contract.status === "signed") return NextResponse.json({ error: "Already signed" }, { status: 400 });
  if (contract.client_signature) return NextResponse.json({ error: "Client already signed" }, { status: 400 });

  const nextStatus = contract.freelancer_signature ? "signed" : "sent";

  const { error: updErr } = await admin
    .from("contracts")
    .update({
      client_signature: clientName.trim(),
      client_signed_at: new Date().toISOString(),
      client_signed_ip: clientIp,
      client_signed_user_agent: clientUserAgent,
      status: nextStatus,
    })
    .eq("id", contract.id);

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

  if (nextStatus === "signed") {
    const { data: profile } = await admin
      .from("profiles")
      .select("email, full_name")
      .eq("id", contract.user_id)
      .single();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.io";
    const contractLink = `${appUrl}/contract/${contract.share_id}`;
    const freelancerName = profile?.full_name ?? "Freelancer";

    if (profile?.email) {
      sendContractFullySignedToFreelancer(
        profile.email,
        freelancerName,
        contract.client_name,
        contract.title,
        contractLink,
      ).catch(console.error);
    }

    if (contract.client_email) {
      sendContractFullySignedToClient(
        contract.client_email,
        contract.client_name,
        freelancerName,
        contract.title,
        contractLink,
      ).catch(console.error);
    }
  }

  return NextResponse.json({ success: true, status: nextStatus, fullySigned: nextStatus === "signed" });
}
