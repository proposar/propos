import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const { shareId } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("proposals")
    .select("id, share_id, user_id, title, project_type, status, client_name, client_company, generated_content, budget_amount, budget_currency, expires_at, created_at, sent_at")
    .eq("share_id", shareId)
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const proposal = data as { user_id?: string };
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, business_name, email, signature_text, logo_url")
    .eq("id", proposal.user_id)
    .single();

  return NextResponse.json({
    ...proposal,
    freelancerName: profile?.full_name ?? "Freelancer",
    businessName: profile?.business_name ?? "",
    freelancerEmail: profile?.email ?? "",
    signature: profile?.signature_text ?? "",
    logoUrl: profile?.logo_url ?? null,
  });
}
