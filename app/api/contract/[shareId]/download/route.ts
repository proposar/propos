import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params;
    const admin = createAdminClient();

    const { data: contract, error } = await admin
      .from("contracts")
      .select(
        "id, share_id, title, content, status, client_name, client_email, freelancer_signature, freelancer_signed_at, client_signature, client_signed_at"
      )
      .eq("share_id", shareId)
      .single();

    if (error || !contract) {
      return new NextResponse("Contract not found", { status: 404 });
    }

    // Only allow download if fully signed
    if (contract.status !== "signed" || !contract.freelancer_signature || !contract.client_signature) {
      return new NextResponse("Contract not yet signed by both parties", { status: 403 });
    }

    const proofText = [
      "═══════════════════════════════════",
      "  PROPOSAR - SIGNED CONTRACT",
      "═══════════════════════════════════",
      "",
      `Generated: ${new Date().toLocaleString()}`,
      `Contract ID: ${contract.id}`,
      `Status: FULLY SIGNED ✓`,
      "",
      "CONTRACT TITLE",
      "───────────────",
      contract.title,
      "",
      "PARTIES",
      "───────",
      `Freelancer/Agency: ${contract.client_name || "N/A"} [SIGNED ${contract.freelancer_signed_at ? new Date(contract.freelancer_signed_at).toLocaleString() : ""}]`,
      `Client: ${contract.client_name || "N/A"} [SIGNED ${contract.client_signed_at ? new Date(contract.client_signed_at).toLocaleString() : ""}]`,
      `Client Email: ${contract.client_email || "N/A"}`,
      "",
      "SIGNATORIES",
      "───────────",
      `Freelancer Signature: ${contract.freelancer_signature}`,
      `Client Signature: ${contract.client_signature}`,
      "",
      "╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌",
      "CONTRACT TERMS",
      "╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌",
      "",
      contract.content || "",
      "",
      "═══════════════════════════════════",
      "Electronic signatures are legally binding.",
      "This contract is enforceable as per applicable laws.",
      "═══════════════════════════════════",
      "",
    ].join("\n");

    const fileName = `${contract.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-signed.txt`;

    // Convert to buffer
    const buffer = Buffer.from(proofText, "utf-8");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return new NextResponse("Failed to generate download", { status: 500 });
  }
}
