import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { pdf } from "@react-pdf/renderer";
import { ProposalPDFDocument, type ProposalPDFProps } from "@/components/pdf/ProposalPDFDocument";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: proposal } = await supabase
    .from("proposals")
    .select(
      "id, title, client_name, client_company, generated_content, budget_amount, budget_currency, user_id, subtotal, discount_percent, tax_percent, grand_total, line_items_enabled",
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!proposal)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  let lineItems: ProposalPDFProps["lineItems"] = [];
  if (proposal.line_items_enabled) {
    const { data: items } = await supabase
      .from("proposal_line_items")
      .select(
        "id, item_name, description, quantity, unit, rate, amount, is_optional",
      )
      .eq("proposal_id", proposal.id)
      .order("sort_order");

    if (items) lineItems = items;
  }

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select(
      "full_name, business_name, email, logo_url, brand_color, website, phone, address, city, country, signature_text, subscription_plan",
    )
    .eq("id", user.id)
    .single();

  if (!profile)
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const logoPublicUrl = profile.logo_url
    ? profile.logo_url.startsWith("http")
      ? profile.logo_url
      : adminClient.storage.from("logos").getPublicUrl(profile.logo_url).data.publicUrl
    : null;

  const docProps: ProposalPDFProps = {
    proposal: {
      id: proposal.id,
      title: proposal.title ?? null,
      client_name: proposal.client_name,
      client_company: proposal.client_company,
      generated_content: proposal.generated_content,
      budget_amount: proposal.budget_amount,
      budget_currency: proposal.budget_currency,
      line_items_enabled: proposal.line_items_enabled,
      subtotal: proposal.subtotal,
      discount_percent: proposal.discount_percent,
      tax_percent: proposal.tax_percent,
      grand_total: proposal.grand_total,
    },
    lineItems,
    profile: {
      full_name: profile.full_name,
      business_name: profile.business_name,
      email: profile.email,
      logo_url: logoPublicUrl,
      brand_color: profile.brand_color,
      website: profile.website,
      phone: profile.phone,
      address: profile.address,
      city: profile.city,
      country: profile.country,
      signature_text: profile.signature_text,
      subscription_plan: profile.subscription_plan,
    },
  };

  const doc = <ProposalPDFDocument {...docProps} />;

  const buffer = await pdf(doc).toBuffer();
  const safeName = proposal.client_name
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .slice(0, 50);
  const filename = `Proposal-${safeName}-${new Date().toISOString().slice(0, 10)}.pdf`;

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
