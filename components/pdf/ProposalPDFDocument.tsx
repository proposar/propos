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
    padding: 60,
    fontFamily: "Helvetica",
    fontSize: 10.5,
    color: "#1F2937",
    lineHeight: 1.6,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 35,
    paddingBottom: 25,
  },
  logoSection: {
    flex: 1,
  },
  logoImage: {
    width: 140,
    height: "auto",
    objectFit: "contain",
    marginBottom: 8,
  },
  logoPill: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  logoPillText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  proposalLabel: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerText: {
    fontSize: 10,
    color: "#666",
    marginBottom: 3,
  },
  divider: {
    height: 1.5,
    width: "100%",
    marginBottom: 40,
  },
  topContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50,
  },
  clientSection: {
    flex: 1,
  },
  preparedFor: {
    fontSize: 9,
    color: "#999",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "bold",
  },
  clientName: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  clientCompany: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
  },
  freelancerSection: {
    flex: 1,
    alignItems: "flex-end",
  },
  freelancerName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  freelancerDetail: {
    fontSize: 10,
    color: "#666",
    marginBottom: 3,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 16,
    paddingTop: 8,
  },
  sectionHeaderAccent: {
    width: 5,
    height: 22,
    marginRight: 12,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1a1a1a",
    letterSpacing: 0.3,
  },
  bodyText: {
    fontSize: 11,
    marginBottom: 10,
    lineHeight: 1.7,
    color: "#2c2c2c",
  },
  investmentBox: {
    borderWidth: 1,
    padding: 24,
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 6,
  },
  investmentLabel: {
    fontSize: 9,
    color: "#888",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: "bold",
  },
  investmentAmount: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    letterSpacing: -1,
  },

  // Premium Table Styles
  pricingTable: {
    marginTop: 28,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    padding: 14,
  },
  tableColHeader1: { width: "40%" },
  tableColHeader2: { width: "15%", textAlign: "center" },
  tableColHeader3: { width: "22%", textAlign: "right" },
  tableColHeader4: { width: "23%", textAlign: "right" },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    padding: 14,
    alignItems: "center",
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableCol1: { width: "40%", paddingRight: 10 },
  tableCol2: { width: "15%", textAlign: "center" },
  tableCol3: { width: "22%", textAlign: "right" },
  tableCol4: { width: "23%", textAlign: "right" },

  itemName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 9,
    color: "#777",
    marginTop: 2,
  },
  tdText: {
    fontSize: 11,
    color: "#2c2c2c",
  },
  tdTextBold: {
    fontSize: 11,
    color: "#1a1a1a",
    fontWeight: "bold",
  },

  tableFooter: {
    padding: 16,
    borderTopWidth: 2,
    alignItems: "flex-end",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 6,
    width: "50%",
  },
  footerLabel: {
    width: "55%",
    textAlign: "right",
    paddingRight: 14,
    fontSize: 10,
    color: "#666",
  },
  footerValue: {
    width: "45%",
    textAlign: "right",
    fontSize: 11,
    color: "#2c2c2c",
  },
  footerTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    width: "50%",
  },
  footerTotalLabel: {
    width: "55%",
    textAlign: "right",
    paddingRight: 14,
    fontSize: 11,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  footerTotalValue: {
    width: "45%",
    textAlign: "right",
    fontSize: 15,
    fontWeight: "bold",
  },

  signatureSection: {
    marginTop: 45,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
  },
  signatureText: {
    fontSize: 10,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 1.6,
  },
  footer: {
    position: "absolute",
    bottom: 35,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    paddingTop: 12,
  },
  footerText: {
    fontSize: 9,
    color: "#999",
    fontWeight: "500",
  },
});

export interface ProposalPDFProps {
  proposal: {
    id: string;
    title?: string | null;
    client_name: string;
    client_company: string | null;
    generated_content: string | null;
    budget_amount: number | null;
    budget_currency: string;
    line_items_enabled?: boolean;
    subtotal?: number | null;
    discount_percent?: number | null;
    tax_percent?: number | null;
    grand_total?: number | null;
  };
  lineItems?: Array<{
    item_name: string;
    description: string | null;
    quantity: number;
    unit: string;
    rate: number;
    amount: number;
  }>;
  profile: {
    full_name: string | null;
    business_name: string | null;
    email?: string | null;
    logo_url: string | null;
    brand_color: string | null;
    website: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    signature_text: string | null;
    subscription_plan?: string;
  };
}

function parseContent(content: string) {
  if (!content?.trim()) return [];
  const blocks: Array<{ type: "h1" | "h2" | "h3" | "ul" | "p"; text?: string; items?: string[] }> = [];
  const lines = content.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("# ") && !line.startsWith("## ")) {
      blocks.push({ type: "h1", text: line.replace(/^#\s+/, "").trim() });
      i++;
    } else if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.replace(/^##\s+/, "").trim() });
      i++;
    } else if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.replace(/^###\s+/, "").trim() });
      i++;
    } else if (line.match(/^[-*]\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*]\s+/)) {
        items.push(lines[i].replace(/^[-*]\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "ul", items });
    } else if (line.trim()) {
      const para: string[] = [line.trim()];
      i++;
      while (i < lines.length && lines[i].trim() && !lines[i].startsWith("#") && !lines[i].match(/^[-*]\s+/)) {
        para.push(lines[i].trim());
        i++;
      }
      blocks.push({ type: "p", text: para.join(" ") });
    } else {
      i++;
    }
  }
  return blocks;
}

export function ProposalPDFDocument({
  proposal,
  profile,
  lineItems = [],
}: ProposalPDFProps) {
  const blocks = parseContent(proposal.generated_content || "");
  const brandColor = profile.brand_color || "#c9a84c";
  const showWatermark = profile.subscription_plan !== "agency";
  const proposalIdShort = proposal.id.substring(0, 8);
  const dateFormatted = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getCurrencySymbol = (curr: string) => {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      AUD: "A$",
      CAD: "C$",
      INR: "₹",
      SGD: "S$",
    };
    return symbols[curr] || curr;
  };
  const cSym = getCurrencySymbol(proposal.budget_currency);

  const formatMoney = (val: number | null | undefined) => {
    if (val == null) return "0.00";
    return val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.logoSection}>
            {profile.logo_url ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={profile.logo_url} style={styles.logoImage} />
            ) : (
              <View style={[styles.logoPill, { backgroundColor: brandColor }]}>
                <Text style={styles.logoPillText}>
                  {profile.business_name || profile.full_name || "PROPOSAR"}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.headerRight}>
            <Text style={[styles.proposalLabel, { color: brandColor }]}>
              PROPOSAL
            </Text>
            <Text style={styles.headerText}>{dateFormatted}</Text>
            <Text style={styles.headerText}>ID: {proposalIdShort}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: brandColor }]} />

        <View style={styles.topContent}>
          <View style={styles.clientSection}>
            <Text style={styles.preparedFor}>Prepared for</Text>
            <Text style={styles.clientName}>{proposal.client_name}</Text>
            {proposal.client_company && (
              <Text style={styles.clientCompany}>
                {proposal.client_company}
              </Text>
            )}
            {proposal.title && (
              <Text style={[styles.clientCompany, { marginTop: 8, fontWeight: "bold", color: "#1a1a1a" }]}>
                {proposal.title}
              </Text>
            )}
          </View>

          <View style={styles.freelancerSection}>
            <Text style={styles.freelancerName}>
              {profile.business_name || profile.full_name}
            </Text>
            {profile.email && (
              <Text style={styles.freelancerDetail}>{profile.email}</Text>
            )}
            {profile.phone && (
              <Text style={styles.freelancerDetail}>{profile.phone}</Text>
            )}
            {profile.website && (
              <Text style={styles.freelancerDetail}>{profile.website}</Text>
            )}
          </View>
        </View>

        {blocks.map((block, i) => {
          if (block.type === "h1" && block.text) {
            return (
              <Text key={i} style={[styles.clientName, { fontSize: 18, marginTop: 20, marginBottom: 16 }]}>
                {block.text}
              </Text>
            );
          }
          if ((block.type === "h2" || block.type === "h3") && block.text) {
            return (
              <View key={i} style={styles.sectionHeaderContainer}>
                <View style={[styles.sectionHeaderAccent, { backgroundColor: brandColor }]} />
                <Text
                  style={
                    block.type === "h3"
                      ? [styles.sectionTitle, { fontSize: 13 }]
                      : styles.sectionTitle
                  }
                >
                  {block.text}
                </Text>
              </View>
            );
          }
          if (block.type === "ul" && block.items?.length) {
            return (
              <View key={i} style={{ marginBottom: 10, paddingLeft: 12 }}>
                {block.items.map((item, j) => (
                  <View key={j} style={{ flexDirection: "row", marginBottom: 4 }}>
                    <Text style={[styles.bodyText, { marginBottom: 0, marginRight: 6 }]}>•</Text>
                    <Text style={styles.bodyText}>{item}</Text>
                  </View>
                ))}
              </View>
            );
          }
          if (block.type === "p" && block.text) {
            return (
              <Text key={i} style={styles.bodyText}>
                {block.text}
              </Text>
            );
          }
          return null;
        })}

        {proposal.line_items_enabled && lineItems.length > 0 ? (
          <View style={styles.pricingTable}>
            <View style={[styles.tableHeader, { backgroundColor: brandColor + "08", borderBottomColor: brandColor }]}>
              <View style={styles.tableColHeader1}>
                <Text style={[styles.tableHeaderCell, { color: brandColor }]}>Item / Service</Text>
              </View>
              <View style={styles.tableColHeader2}>
                <Text style={[styles.tableHeaderCell, { color: brandColor }]}>Qty</Text>
              </View>
              <View style={styles.tableColHeader3}>
                <Text style={[styles.tableHeaderCell, { color: brandColor }]}>Rate</Text>
              </View>
              <View style={styles.tableColHeader4}>
                <Text style={[styles.tableHeaderCell, { color: brandColor }]}>Amount</Text>
              </View>
            </View>

            {lineItems.map((item, index) => (
              <View
                key={index}
                style={
                  index === lineItems.length - 1
                    ? [styles.tableRow, styles.tableRowLast]
                    : styles.tableRow
                }
              >
                <View style={styles.tableCol1}>
                  <Text style={styles.itemName}>{item.item_name}</Text>
                  {item.description && (
                    <Text style={styles.itemDesc}>{item.description}</Text>
                  )}
                </View>
                <View style={styles.tableCol2}>
                  <Text style={styles.tdText}>{item.quantity}</Text>
                  {item.unit !== "unit" && (
                    <Text style={{ fontSize: 8, color: "#999", marginTop: 2 }}>
                      {item.unit}
                    </Text>
                  )}
                </View>
                <View style={styles.tableCol3}>
                  <Text style={styles.tdText}>
                    {cSym}
                    {formatMoney(item.rate)}
                  </Text>
                </View>
                <View style={styles.tableCol4}>
                  <Text style={styles.tdTextBold}>
                    {cSym}
                    {formatMoney(item.amount)}
                  </Text>
                </View>
              </View>
            ))}

            <View style={[styles.tableFooter, { backgroundColor: brandColor + "04", borderTopColor: brandColor }]}>
              <View style={styles.footerRow}>
                <Text style={styles.footerLabel}>Subtotal:</Text>
                <Text style={styles.footerValue}>
                  {cSym}
                  {formatMoney(proposal.subtotal)}
                </Text>
              </View>

              {!!proposal.discount_percent && proposal.discount_percent > 0 && (
                <View style={styles.footerRow}>
                  <Text style={styles.footerLabel}>
                    Discount ({proposal.discount_percent}%):
                  </Text>
                  <Text style={[styles.footerValue, { color: "#d32f2f" }]}>
                    -{cSym}
                    {formatMoney(
                      (proposal.subtotal || 0) *
                        (proposal.discount_percent / 100),
                    )}
                  </Text>
                </View>
              )}

              {!!proposal.tax_percent && proposal.tax_percent > 0 && (
                <View style={styles.footerRow}>
                  <Text style={styles.footerLabel}>
                    Tax ({proposal.tax_percent}%):
                  </Text>
                  <Text style={styles.footerValue}>
                    +{cSym}
                    {formatMoney(
                      ((proposal.subtotal || 0) -
                        (proposal.subtotal || 0) *
                          ((proposal.discount_percent || 0) / 100)) *
                        (proposal.tax_percent / 100),
                    )}
                  </Text>
                </View>
              )}

              <View style={[styles.footerTotalRow, { borderTopColor: brandColor }]}>
                <Text style={styles.footerTotalLabel}>Total Investment:</Text>
                <Text style={[styles.footerTotalValue, { color: brandColor }]}>
                  {cSym}
                  {formatMoney(proposal.grand_total)}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          proposal.budget_amount != null && (
            <View
              style={[
                styles.investmentBox,
                { borderColor: brandColor, backgroundColor: brandColor + "08" },
              ]}
            >
              <Text style={styles.investmentLabel}>Total Investment</Text>
              <Text style={[styles.investmentAmount, { color: brandColor }]}>
                {cSym} {proposal.budget_amount.toLocaleString()}
              </Text>
            </View>
          )
        )}

        {/* PRO-LEVEL: Guarantee Section */}
        <View style={styles.sectionHeaderContainer}>
          <View
            style={[
              styles.sectionHeaderAccent,
              { backgroundColor: brandColor },
            ]}
          />
          <Text style={styles.sectionTitle}>Our Commitment to You</Text>
        </View>
        <View style={[styles.investmentBox, { borderColor: brandColor + "40", backgroundColor: brandColor + "08" }]}>
          <Text style={[styles.bodyText, { fontWeight: "bold", color: brandColor }]}>
            ✓ Quality Guarantee: We deliver to the highest standards or your money back.
          </Text>
          <Text style={styles.bodyText}>
            ✓ On-time Delivery: Project completed by the agreed deadline.
          </Text>
          <Text style={styles.bodyText}>
            ✓ Clear Communication: You&apos;ll know exactly what&apos;s happening at every stage.
          </Text>
          <Text style={styles.bodyText}>
            ✓ Dedicated Support: Direct contact with your project lead throughout.
          </Text>
        </View>

        {/* PRO-LEVEL: Why Choose Us */}
        <View style={styles.sectionHeaderContainer}>
          <View
            style={[
              styles.sectionHeaderAccent,
              { backgroundColor: brandColor },
            ]}
          />
          <Text style={styles.sectionTitle}>Why Partner With Us</Text>
        </View>
        <Text style={[styles.bodyText, { marginBottom: 4 }]}>
          <Text style={{ fontWeight: "bold" }}>Proven Track Record:</Text> {profile.business_name || "Our agency"} has successfully delivered {profile.subscription_plan === "agency" ? "50+" : "20+"} projects, generating measurable results for our clients.
        </Text>
        <Text style={[styles.bodyText, { marginBottom: 4 }]}>
          <Text style={{ fontWeight: "bold" }}>Personalized Approach:</Text> We take time to understand your business, goals, and challenges. One-size-fits-all solutions don&apos;t work&mdash;custom strategies do.
        </Text>
        <Text style={[styles.bodyText, { marginBottom: 4 }]}>
          <Text style={{ fontWeight: "bold" }}>Results-Focused:</Text> We don&apos;t just deliver&mdash;we measure, optimize, and ensure you see ROI on every dollar invested.
        </Text>
        <Text style={styles.bodyText}>
          <Text style={{ fontWeight: "bold" }}>Long-term Partnership:</Text> Your success is our success. We&apos;re invested in growing your business beyond the initial project.
        </Text>

        {/* PRO-LEVEL: Next Steps */}
        <View style={styles.sectionHeaderContainer}>
          <View
            style={[
              styles.sectionHeaderAccent,
              { backgroundColor: brandColor },
            ]}
          />
          <Text style={styles.sectionTitle}>Let&apos;s Get Started</Text>
        </View>
        <Text style={styles.bodyText}>
          Ready to move forward? Here&apos;s what happens next:
        </Text>
        <Text style={[styles.bodyText, { marginBottom: 4 }]}>
          <Text style={{ fontWeight: "bold" }}>1. Approval:</Text> Review this proposal and let us know if you&apos;d like any adjustments.
        </Text>
        <Text style={[styles.bodyText, { marginBottom: 4 }]}>
          <Text style={{ fontWeight: "bold" }}>2. Contract:</Text> We&apos;ll send a formal agreement outlining all terms and deliverables.
        </Text>
        <Text style={[styles.bodyText, { marginBottom: 4 }]}>
          <Text style={{ fontWeight: "bold" }}>3. Kickoff:</Text> Schedule a kickoff meeting to finalize details and start work immediately.
        </Text>
        <Text style={styles.bodyText}>
          <Text style={{ fontWeight: "bold" }}>4. Execution:</Text> Regular updates and communication throughout the project timeline.
        </Text>

        {/* PRO-LEVEL: Terms Note */}
        <View style={[styles.investmentBox, { borderColor: "#E8E8E8", backgroundColor: "#F9F9F9" }]}>
          <Text style={[styles.investmentLabel, { color: "#666" }]}>Valid Through:</Text>
          <Text style={[styles.bodyText, { marginBottom: 8 }]}>
            This proposal is valid for 30 days from the date above. After that, market conditions and pricing may change, and we&apos;ll need to update the proposal.
          </Text>
          <Text style={[styles.investmentLabel, { color: "#666" }]}>Payment Schedule:</Text>
          <Text style={styles.bodyText}>
            50% upon approval to secure your spot and begin work. 50% upon completion and delivery.
          </Text>
        </View>

        {profile.signature_text && (
          <View style={styles.signatureSection}>
            <Text style={styles.signatureText}>{profile.signature_text}</Text>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {profile.business_name || profile.full_name}{" "}
            {profile.website ? `• ${profile.website}` : ""}
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
          <Text style={[styles.footerText, { color: brandColor, fontWeight: "bold" }]}>
            {showWatermark ? "Proposar" : ""}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
