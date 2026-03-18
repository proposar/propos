import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { pdf, Document, Page, View, Text, Image as PDFImage, StyleSheet } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1F2937",
    lineHeight: 1.6,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
    paddingBottom: 20,
    borderBottom: "2 solid #E5E7EB",
  },
  logoSection: {
    flex: 1,
  },
  logoImage: {
    width: 120,
    height: "auto",
    marginBottom: 8,
  },
  businessName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 3,
  },
  headerInfo: {
    fontSize: 9,
    color: "#6B7280",
    marginBottom: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  contractLabel: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  contractDate: {
    fontSize: 10,
    color: "#6B7280",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
  },
  parties: {
    marginBottom: 25,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 4,
  },
  partyText: {
    fontSize: 10,
    marginBottom: 6,
    color: "#374151",
  },
  sectionContent: {
    marginBottom: 12,
    color: "#374151",
    fontSize: 9.5,
    lineHeight: 1.7,
  },
  clause: {
    marginBottom: 10,
    paddingLeft: 10,
  },
  clauseTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1F2937",
  },
  clauseText: {
    color: "#4B5563",
    fontSize: 9,
    lineHeight: 1.6,
  },
  signatures: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  signatureBox: {
    flex: 1,
    borderTop: "1 solid #000",
    paddingTop: 12,
    textAlign: "center",
  },
  signatureName: {
    fontSize: 9,
    marginTop: 8,
    fontWeight: "bold",
    color: "#111827",
  },
  signatureTitle: {
    fontSize: 8,
    color: "#6B7280",
  },
  initialsBox: {
    borderBottom: "1 solid #000",
    width: 40,
    height: 20,
    marginBottom: 8,
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: "1 solid #E5E7EB",
    fontSize: 7.5,
    color: "#9CA3AF",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
    color: "#111827",
  },
});

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
        "id, share_id, title, content, status, client_name, client_email, freelancer_signature, freelancer_signed_at, client_signature, client_signed_at, user_id"
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

    // Get profile info for PDF header
    const { data: profile } = await admin
      .from("profiles")
      .select(
        "full_name, business_name, email, logo_url, phone, address, city, country"
      )
      .eq("id", contract.user_id)
      .single();

    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const freelancerSignedDate = contract.freelancer_signed_at
      ? new Date(contract.freelancer_signed_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

    const clientSignedDate = contract.client_signed_at
      ? new Date(contract.client_signed_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

    // Generate PDF document
    const doc = React.createElement(
      Document,
      {},
      React.createElement(
        Page,
        { size: "A4", style: styles.page },
        
        // Header
        React.createElement(
          View,
          { style: styles.header },
          React.createElement(
            View,
            { style: styles.logoSection },
            profile?.logo_url && React.createElement(PDFImage, { src: profile.logo_url, style: styles.logoImage }),
            React.createElement(Text, { style: styles.businessName }, profile?.business_name || profile?.full_name || "Professional Services"),
            profile?.email && React.createElement(Text, { style: styles.headerInfo }, profile.email),
            profile?.phone && React.createElement(Text, { style: styles.headerInfo }, profile.phone),
            profile?.address && React.createElement(Text, { style: styles.headerInfo },
              `${profile.address}${profile.city ? `, ${profile.city}` : ""}${profile.country ? `, ${profile.country}` : ""}`
            )
          ),
          React.createElement(
            View,
            { style: styles.headerRight },
            React.createElement(Text, { style: styles.contractLabel }, "CONTRACT"),
            React.createElement(Text, { style: styles.contractDate }, today)
          )
        ),

        // Title
        React.createElement(Text, { style: styles.title }, contract.title),

        // Parties
        React.createElement(
          View,
          { style: styles.parties },
          React.createElement(Text, { style: styles.partyText },
            React.createElement(Text, { style: { fontWeight: "bold" } }, "SERVICE PROVIDER: "),
            profile?.full_name || profile?.business_name || "Service Provider"
          ),
          React.createElement(Text, { style: styles.partyText },
            React.createElement(Text, { style: { fontWeight: "bold" } }, "CLIENT: "),
            contract.client_name,
            contract.client_email && ` (${contract.client_email})`
          ),
          React.createElement(Text, { style: styles.partyText },
            React.createElement(Text, { style: { fontWeight: "bold" } }, "DATE: "),
            today
          )
        ),

        // Contract Content
        React.createElement(
          View,
          { style: styles.sectionContent },
          React.createElement(Text, {}, contract.content)
        ),

        // Standard Legal Terms
        React.createElement(
          View,
          { style: styles.clause },
          React.createElement(Text, { style: styles.sectionTitle }, "STANDARD TERMS & CONDITIONS"),

          React.createElement(Text, { style: styles.clauseTitle }, "1. Payment Terms"),
          React.createElement(Text, { style: styles.clauseText },
            "50% deposit required before work begins. Remaining 50% due upon completion. Late payments incur 1.5% monthly interest."
          ),

          React.createElement(Text, { style: styles.clauseTitle }, "2. Scope of Work"),
          React.createElement(Text, { style: styles.clauseText },
            "Services are limited to those outlined in the contract. Additional changes require written amendment and may incur additional fees."
          ),

          React.createElement(Text, { style: styles.clauseTitle }, "3. Intellectual Property"),
          React.createElement(Text, { style: styles.clauseText },
            "Upon full payment, all work product ownership transfers to Client. Service Provider retains right to use work as portfolio reference."
          ),

          React.createElement(Text, { style: styles.clauseTitle }, "4. Timeline & Deadlines"),
          React.createElement(Text, { style: styles.clauseText },
            "Delivery dates are estimates only. Service Provider will make reasonable efforts to meet deadlines but is not liable for delays due to Client&apos;s late input or revisions."
          ),

          React.createElement(Text, { style: styles.clauseTitle }, "5. Revisions"),
          React.createElement(Text, { style: styles.clauseText },
            "Included in the quoted price: up to 3 rounds of revisions. Additional revisions charged at hourly rate."
          ),

          React.createElement(Text, { style: styles.clauseTitle }, "6. Confidentiality"),
          React.createElement(Text, { style: styles.clauseText },
            "Both parties agree to keep all project details confidential and not disclose to third parties without written consent."
          ),

          React.createElement(Text, { style: styles.clauseTitle }, "7. Termination"),
          React.createElement(Text, { style: styles.clauseText },
            "Either party may terminate with 7 days written notice. Client is responsible for payment for all work completed up to termination date."
          ),

          React.createElement(Text, { style: styles.clauseTitle }, "8. Liability"),
          React.createElement(Text, { style: styles.clauseText },
            "Service Provider is not liable for indirect, incidental, or consequential damages. Total liability limited to contract value."
          ),

          React.createElement(Text, { style: styles.clauseTitle }, "9. Dispute Resolution"),
          React.createElement(Text, { style: styles.clauseText },
            "Disputes will be resolved through written communication. If unresolved after 30 days, either party may pursue legal action."
          ),

          React.createElement(Text, { style: styles.clauseTitle }, "10. Governing Law"),
          React.createElement(Text, { style: styles.clauseText },
            "This contract is governed by the laws of the jurisdiction where Service Provider operates."
          )
        ),

        // Signatures
        React.createElement(
          View,
          { style: styles.signatures },
          React.createElement(
            View,
            { style: styles.signatureBox },
            React.createElement(View, { style: styles.initialsBox }),
            React.createElement(Text, { style: styles.signatureName }, profile?.full_name || "Service Provider"),
            freelancerSignedDate && React.createElement(Text, { style: styles.signatureTitle }, `Signed: ${freelancerSignedDate}`)
          ),
          React.createElement(
            View,
            { style: styles.signatureBox },
            React.createElement(View, { style: styles.initialsBox }),
            React.createElement(Text, { style: styles.signatureName }, contract.client_name),
            clientSignedDate && React.createElement(Text, { style: styles.signatureTitle }, `Signed: ${clientSignedDate}`)
          )
        ),

        // Footer
        React.createElement(
          View,
          { style: styles.footer },
          React.createElement(Text, {},
            "Electronic signatures are legally binding. This contract is enforceable as per applicable laws. Generated by Proposar."
          )
        )
      )
    );

    // Generate PDF as blob
    const pdfBlob = await pdf(doc).toBlob();
    const fileName = `${contract.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-signed.pdf`;
    
    // Convert blob to buffer
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new NextResponse("Failed to generate PDF", { status: 500 });
  }
}
