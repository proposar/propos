import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { pdf } from "@react-pdf/renderer";
import { InvoicePDFDocument } from "@/components/pdf/InvoicePDFDocument";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select(
      "id, invoice_number, title, client_name, client_email, currency, subtotal, discount_percent, tax_percent, total, due_date, status, user_id"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (invoiceError || !invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  // Fetch line items
  let lineItems: any[] = [];
  const { data: items } = await supabase
    .from("invoice_line_items")
    .select("item_name, description, quantity, unit, rate, amount")
    .eq("invoice_id", invoice.id)
    .order("sort_order");

  if (items) {
    lineItems = items;
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, business_name, email, logo_url, brand_color, website, phone, address, city, country"
    )
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json(
      { error: "Profile not found" },
      { status: 404 }
    );
  }

  try {
    // Generate PDF
    const doc = (
      <InvoicePDFDocument
        invoice={{
          id: invoice.id,
          invoice_number: invoice.invoice_number,
          title: invoice.title,
          client_name: invoice.client_name,
          client_email: invoice.client_email,
          currency: invoice.currency,
          subtotal: invoice.subtotal,
          discount_percent: invoice.discount_percent,
          tax_percent: invoice.tax_percent,
          total: invoice.total,
          due_date: invoice.due_date,
          status: invoice.status,
        }}
        lineItems={lineItems}
        profile={{
          full_name: profile.full_name,
          business_name: profile.business_name,
          email: profile.email,
          logo_url: profile.logo_url,
          brand_color: profile.brand_color,
          website: profile.website,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          country: profile.country,
        }}
      />
    );

    const buffer = await pdf(doc).toBuffer();

    // Return as PDF file
    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Invoice-${invoice.invoice_number}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
