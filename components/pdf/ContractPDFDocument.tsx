import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

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
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
    color: "#111827",
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
});

interface ContractPDFDocumentProps {
  contract: {
    title: string;
    content: string;
    client_name: string;
    client_email?: string | null;
    freelancer_signature?: string | null;
    freelancer_signed_at?: string | null;
    client_signature?: string | null;
    client_signed_at?: string | null;
  };
  profile: {
    full_name?: string | null;
    business_name?: string | null;
    email?: string | null;
    logo_url?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    country?: string | null;
  };
}

export function ContractPDFDocument({ contract, profile }: ContractPDFDocumentProps) {
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            {profile.logo_url && (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={profile.logo_url} style={styles.logoImage} />
            )}
            <Text style={styles.businessName}>
              {profile.business_name || profile.full_name || "Professional Services"}
            </Text>
            {profile.email && <Text style={styles.headerInfo}>{profile.email}</Text>}
            {profile.phone && <Text style={styles.headerInfo}>{profile.phone}</Text>}
            {profile.address && (
              <Text style={styles.headerInfo}>
                {profile.address}
                {profile.city && `, ${profile.city}`}
                {profile.country && `, ${profile.country}`}
              </Text>
            )}
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.contractLabel}>CONTRACT</Text>
            <Text style={styles.contractDate}>{today}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{contract.title}</Text>

        {/* Parties */}
        <View style={styles.parties}>
          <Text style={styles.partyText}>
            <Text style={{ fontWeight: "bold" }}>SERVICE PROVIDER:</Text> {profile.full_name || profile.business_name || "Service Provider"}
          </Text>
          <Text style={styles.partyText}>
            <Text style={{ fontWeight: "bold" }}>CLIENT:</Text> {contract.client_name}
            {contract.client_email && ` (${contract.client_email})`}
          </Text>
          <Text style={styles.partyText}>
            <Text style={{ fontWeight: "bold" }}>DATE:</Text> {today}
          </Text>
        </View>

        {/* Contract Content */}
        <View style={styles.sectionContent}>
          <Text>{contract.content}</Text>
        </View>

        {/* Standard Legal Terms */}
        <View style={styles.clause}>
          <Text style={styles.sectionTitle}>STANDARD TERMS & CONDITIONS</Text>

          <Text style={styles.clauseTitle}>1. Payment Terms</Text>
          <Text style={styles.clauseText}>
            50% deposit required before work begins. Remaining 50% due upon completion. Late payments incur 1.5% monthly interest.
          </Text>

          <Text style={styles.clauseTitle}>2. Scope of Work</Text>
          <Text style={styles.clauseText}>
            Services are limited to those outlined in the contract. Additional changes require written amendment and may incur additional fees.
          </Text>

          <Text style={styles.clauseTitle}>3. Intellectual Property</Text>
          <Text style={styles.clauseText}>
            Upon full payment, all work product ownership transfers to Client. Service Provider retains right to use work as portfolio reference.
          </Text>

          <Text style={styles.clauseTitle}>4. Timeline & Deadlines</Text>
          <Text style={styles.clauseText}>
            Delivery dates are estimates only. Service Provider will make reasonable efforts to meet deadlines but is not liable for delays due to Client&apos;s late input or revisions.
          </Text>

          <Text style={styles.clauseTitle}>5. Revisions</Text>
          <Text style={styles.clauseText}>
            Included in the quoted price: up to 3 rounds of revisions. Additional revisions charged at hourly rate.
          </Text>

          <Text style={styles.clauseTitle}>6. Confidentiality</Text>
          <Text style={styles.clauseText}>
            Both parties agree to keep all project details confidential and not disclose to third parties without written consent.
          </Text>

          <Text style={styles.clauseTitle}>7. Termination</Text>
          <Text style={styles.clauseText}>
            Either party may terminate with 7 days written notice. Client is responsible for payment for all work completed up to termination date.
          </Text>

          <Text style={styles.clauseTitle}>8. Liability</Text>
          <Text style={styles.clauseText}>
            Service Provider is not liable for indirect, incidental, or consequential damages. Total liability limited to contract value.
          </Text>

          <Text style={styles.clauseTitle}>9. Dispute Resolution</Text>
          <Text style={styles.clauseText}>
            Disputes will be resolved through written communication. If unresolved after 30 days, either party may pursue legal action.
          </Text>

          <Text style={styles.clauseTitle}>10. Governing Law</Text>
          <Text style={styles.clauseText}>
            This contract is governed by the laws of the jurisdiction where Service Provider operates.
          </Text>
        </View>

        {/* Signatures */}
        <View style={styles.signatures}>
          <View style={styles.signatureBox}>
            {contract.freelancer_signature ? (
              <>
                <View style={styles.initialsBox} />
                <Text style={styles.signatureName}>{profile.full_name || "Service Provider"}</Text>
                {freelancerSignedDate && (
                  <Text style={styles.signatureTitle}>Signed: {freelancerSignedDate}</Text>
                )}
              </>
            ) : (
              <>
                <View style={styles.initialsBox} />
                <Text style={styles.signatureName}>{profile.full_name || "Service Provider"}</Text>
                <Text style={styles.signatureTitle}>(Pending Signature)</Text>
              </>
            )}
          </View>

          <View style={styles.signatureBox}>
            {contract.client_signature ? (
              <>
                <View style={styles.initialsBox} />
                <Text style={styles.signatureName}>{contract.client_name}</Text>
                {clientSignedDate && (
                  <Text style={styles.signatureTitle}>Signed: {clientSignedDate}</Text>
                )}
              </>
            ) : (
              <>
                <View style={styles.initialsBox} />
                <Text style={styles.signatureName}>{contract.client_name}</Text>
                <Text style={styles.signatureTitle}>(Pending Signature)</Text>
              </>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            This contract was generated and signed electronically through Proposar.
            Electronic signatures are legally binding in most jurisdictions.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
