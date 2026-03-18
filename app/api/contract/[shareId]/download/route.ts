import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const { shareId } = await params;
  const admin = createAdminClient();

  const { data: contract, error } = await admin
    .from("contracts")
    .select(
      "id, share_id, title, content, status, client_name, client_email, freelancer_name, freelancer_signature, freelancer_signed_at, client_signature, client_signed_at, client_signed_ip, sent_at, created_at, updated_at, user_id"
    )
    .eq("share_id", shareId)
    .single();

  if (error || !contract) {
    return NextResponse.json({ error: "Contract not found" }, { status: 404 });
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, business_name, email")
    .eq("id", contract.user_id)
    .single();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.io";
  const publicLink = `${appUrl}/contract/${contract.share_id}`;

  const proofFingerprint = createHash("sha256")
    .update(
      JSON.stringify({
        id: contract.id,
        share_id: contract.share_id,
        title: contract.title,
        content: contract.content,
        status: contract.status,
        freelancer_signature: contract.freelancer_signature,
        freelancer_signed_at: contract.freelancer_signed_at,
        client_signature: contract.client_signature,
        client_signed_at: contract.client_signed_at,
        client_signed_ip: contract.client_signed_ip,
      })
    )
    .digest("hex");

  const proofText = [
    "PROPOSAR - SIGNED CONTRACT",
    "============================",
    "",
    `Generated At (UTC): ${new Date().toISOString()}`,
    `Proof Fingerprint (SHA-256): ${proofFingerprint}`,
    "",
    "CONTRACT DETAILS",
    "----------------",
    `Contract ID: ${contract.id}`,
    `Title: ${contract.title}`,
    `Status: ${contract.status}`,
    `Created: ${contract.created_at ?? "N/A"}`,
    `Updated: ${contract.updated_at ?? "N/A"}`,
    "",
    "FREELANCER / AGENCY",
    "-------------------",
    `Name: ${profile?.full_name ?? "N/A"}`,
    `Business: ${profile?.business_name ?? "N/A"}`,
    `Email: ${profile?.email ?? "N/A"}`,
    "",
    "CLIENT",
    "------",
    `Name: ${contract.client_name ?? "N/A"}`,
    `Email: ${contract.client_email ?? "N/A"}`,
    "",
    "SIGNATURES",
    "----------",
    `Freelancer: ${contract.freelancer_signature ?? "Not Signed"}`,
    `Signed At: ${contract.freelancer_signed_at ?? "N/A"}`,
    "",
    `Client: ${contract.client_signature ?? "Not Signed"}`,
    `Signed At: ${contract.client_signed_at ?? "N/A"}`,
    `Signed IP: ${contract.client_signed_ip ?? "N/A"}`,
    "",
    "CONTRACT BODY",
    "-------------",
    contract.content ?? "",
    "",
    "---",
    "This is an electronically signed contract generated and recorded by Proposar.",
    "Electronic signatures have full legal validity under applicable laws.",
    "",
  ].join("\n");

  const fileName = `${contract.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-signed.txt`;

  return new NextResponse(proofText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
