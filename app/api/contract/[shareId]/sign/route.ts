import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

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
    .select("id, status")
    .eq("share_id", shareId)
    .single();

  if (!contract) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (contract.status === "signed") return NextResponse.json({ error: "Already signed" }, { status: 400 });

  const { error: updErr } = await admin
    .from("contracts")
    .update({
      client_signature: clientName.trim(),
      client_signed_at: new Date().toISOString(),
      client_signed_ip: clientIp,
      client_signed_user_agent: clientUserAgent,
      status: "signed",
    })
    .eq("id", contract.id);

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
