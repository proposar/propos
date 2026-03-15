import { createClient, createAdminClient } from "@/lib/supabase/server";
import {
  PublicProposalView,
  LineItem,
} from "@/components/proposal/PublicProposalView";
import { notFound } from "next/navigation";

export default async function PublicProposalPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const supabase = await createClient();

  const { data: proposal, error } = await supabase
    .from("proposals")
    .select(
      "id, share_id, title, project_type, status, client_name, client_company, generated_content, budget_amount, budget_currency, subtotal, discount_percent, tax_percent, grand_total, line_items_enabled, expires_at, created_at, sent_at, user_id",
    )
    .eq("share_id", shareId)
    .single();

  if (error || !proposal) notFound();

  let lineItems: LineItem[] = [];
  if (proposal.line_items_enabled) {
    const { data: items } = await supabase
      .from("proposal_line_items")
      .select(
        "id, item_name, description, quantity, unit, rate, amount, is_optional",
      )
      .eq("proposal_id", proposal.id)
      .order("sort_order");

    if (items) lineItems = items as LineItem[];
  }

  let profile: {
    full_name?: string;
    business_name?: string;
    signature_text?: string;
    logo_url?: string;
    brand_color?: string;
    gdpr_compliant_mode?: boolean;
  } | null = null;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("profiles")
      .select("full_name, business_name, signature_text, logo_url, brand_color, gdpr_compliant_mode")
      .eq("id", (proposal as { user_id: string }).user_id)
      .single();
    profile = data;
  } catch {
    // no service role key or error
  }

  const payload = {
    id: proposal.id,
    status: proposal.status,
    title: proposal.title,
    client_name: proposal.client_name,
    client_company: proposal.client_company,
    generated_content: proposal.generated_content,
    budget_amount: proposal.budget_amount,
    budget_currency: proposal.budget_currency ?? "USD",
    subtotal: proposal.subtotal,
    discount_percent: proposal.discount_percent,
    tax_percent: proposal.tax_percent,
    grand_total: proposal.grand_total,
    line_items_enabled: proposal.line_items_enabled,
    expires_at: proposal.expires_at,
    sent_at: proposal.sent_at,
    freelancerName: profile?.full_name ?? "Freelancer",
    businessName: profile?.business_name ?? "",
    signature: profile?.signature_text ?? "",
    logoUrl: profile?.logo_url ?? "",
    brandColor: profile?.brand_color ?? "#D4AF37",
    gdprCompliantMode: profile?.gdpr_compliant_mode ?? false,
  } as const;

  return (
    <PublicProposalView
      shareId={shareId}
      proposal={payload}
      lineItems={lineItems}
    />
  );
}
