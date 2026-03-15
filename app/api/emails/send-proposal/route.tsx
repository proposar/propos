import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { sendProposalToClient, sendProposalSentConfirmation } from "@/lib/resend";
import { pdf } from "@react-pdf/renderer";
import { ProposalPDFDocument, type ProposalPDFProps } from "@/components/pdf/ProposalPDFDocument";
import { sendProposalEmailSchema } from "@/lib/validators";
import type { SendProposalEmailResponse } from "@/types/email";

export async function POST(request: Request): Promise<NextResponse<SendProposalEmailResponse>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ sent: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Validate request body
  const validationResult = sendProposalEmailSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { sent: false, error: `Validation error: ${validationResult.error.message}` },
      { status: 400 }
    );
  }

  const { to, subject, message, proposalId } = validationResult.data;

  const { data: proposal } = await supabase
    .from("proposals")
    .select("id, title, share_id, client_name, client_company, generated_content, budget_amount, budget_currency, subtotal, discount_percent, tax_percent, grand_total, line_items_enabled, user_id")
    .eq("id", proposalId)
    .eq("user_id", user.id)
    .single();

  if (!proposal) {
    return NextResponse.json({ sent: false, error: "Proposal not found" }, { status: 404 });
  }

  let lineItems: ProposalPDFProps["lineItems"] = [];
  if (proposal.line_items_enabled) {
    const { data: items } = await supabase
      .from("proposal_line_items")
      .select("id, item_name, description, quantity, unit, rate, amount, is_optional")
      .eq("proposal_id", proposal.id)
      .order("sort_order");
    if (items) lineItems = items;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.io";
  const proposalLink = `${appUrl}/proposal/${proposal.share_id}`;

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("full_name, business_name, email, logo_url, brand_color, website, phone, address, city, country, signature_text, subscription_plan")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ sent: false, error: "Profile not found" }, { status: 404 });
  }

  const logoPublicUrl = profile.logo_url
    ? profile.logo_url.startsWith("http")
      ? profile.logo_url
      : adminClient.storage.from("logos").getPublicUrl(profile.logo_url).data.publicUrl
    : null;

  const docProps: ProposalPDFProps = {
    proposal: {
      id: proposal.id,
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

  let attachments: any[] = [];
  let pdfError = false;

  try {
    const doc = <ProposalPDFDocument {...docProps} />;
    const pdfOutput = await pdf(doc).toBuffer();
    const safeName = proposal.client_name.replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 50);
    const filename = `Proposal-${safeName}-${new Date().toISOString().slice(0, 10)}.pdf`;

    const pdfBuffer =
      Buffer.isBuffer(pdfOutput)
        ? pdfOutput
        : pdfOutput instanceof Uint8Array
          ? Buffer.from(pdfOutput)
          : null;

    if (pdfBuffer) {
      attachments = [{ filename, content: pdfBuffer }];
    } else {
      pdfError = true;
      console.error("[Email] PDF output format unsupported for attachment. Sending without attachment.");
    }
  } catch (err) {
    console.error("[Email] PDF Generation failed:", err);
    pdfError = true;
  }

  try {
    await sendProposalToClient(
      to,
      proposal.client_name,
      subject ?? proposal.title,
      message ?? "",
      proposalLink,
      profile.full_name ?? undefined,
      attachments,
      proposal.share_id ?? undefined
    );

    // Notify freelancer that proposal was sent, mentioning if PDF attachment failed
    const confirmationText = pdfError
      ? `Your proposal has been sent to ${proposal.client_name}, but the PDF attachment generation failed. They can still view the full proposal via the secure link.`
      : undefined;

    if (user.email) {
      await sendProposalSentConfirmation(user.email, proposal.client_name, proposalLink, confirmationText);
    }

    await supabase
      .from("proposals")
      .update({ sent_at: new Date().toISOString(), status: "sent" })
      .eq("id", proposalId);

    return NextResponse.json({ sent: true });
  } catch (e) {
    console.error("Send proposal email error:", e);
    return NextResponse.json({ sent: false, error: "Failed to send email" }, { status: 500 });
  }
}
