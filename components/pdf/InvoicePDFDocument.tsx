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
    fontSize: 11,
    color: "#2c2c2c",
    lineHeight: 1.6,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  invoiceLabel: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 8,
  },
  invoiceNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  headerText: {
    fontSize: 10,
    color: "#666",
    marginBottom: 3,
  },
  divider: {
    height: 1,
    width: "100%",
    marginBottom: 35,
    backgroundColor: "#E8E8E8",
  },
  section: {
    marginBottom: 30,
  },
  sectionLabel: {
    fontSize: 9,
    color: "#999",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "bold",
  },
  clientName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 11,
    color: "#666",
    marginBottom: 2,
  },
  twoCols: {
    flexDirection: "row",
    gap: 40,
    marginBottom: 35,
  },
  col: {
    flex: 1,
  },
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
  paymentSection: {
    marginTop: 35,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
  },
  paymentLabel: {
    fontSize: 9,
    color: "#999",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: "bold",
  },
  paymentText: {
    fontSize: 10,
    color: "#666",
    lineHeight: 1.6,
    marginBottom: 8,
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

export interface InvoicePDFProps {
  invoice: {
    id: string;
    invoice_number: string;
    title: string;
    client_name: string;
    client_email?: string;
    currency: string;
    subtotal?: number;
    discount_percent?: number;
    tax_percent?: number;
    total: number;
    due_date?: string | null;
    status?: string;
  };
  lineItems: Array<{
    item_name: string;
    description?: string | null;
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
  };
}

export function InvoicePDFDocument({
  invoice,
  lineItems = [],
  profile,
}: InvoicePDFProps) {
  const brandColor = profile.brand_color || "#c9a84c";
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
  const cSym = getCurrencySymbol(invoice.currency);

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
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.logoSection}>
            {profile.logo_url ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={profile.logo_url} style={styles.logoImage} />
            ) : (
              <View style={[styles.logoPill, { backgroundColor: brandColor }]}>
                <Text style={styles.logoPillText}>
                  {profile.business_name || profile.full_name || "INVOICED"}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.headerRight}>
            <Text style={[styles.invoiceLabel, { color: brandColor }]}>
              INVOICE
            </Text>
            <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
            <Text style={styles.headerText}>{dateFormatted}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Bill To & From */}
        <View style={styles.twoCols}>
          <View style={styles.col}>
            <Text style={styles.sectionLabel}>Bill To:</Text>
            <Text style={styles.clientName}>{invoice.client_name}</Text>
            {invoice.client_email && (
              <Text style={styles.detailText}>{invoice.client_email}</Text>
            )}
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionLabel}>From:</Text>
            <Text style={styles.clientName}>
              {profile.business_name || profile.full_name}
            </Text>
            {profile.email && (
              <Text style={styles.detailText}>{profile.email}</Text>
            )}
            {profile.phone && (
              <Text style={styles.detailText}>{profile.phone}</Text>
            )}
            {profile.website && (
              <Text style={styles.detailText}>{profile.website}</Text>
            )}
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.pricingTable}>
          <View
            style={[
              styles.tableHeader,
              { backgroundColor: brandColor + "08", borderBottomColor: brandColor },
            ]}
          >
            <View style={styles.tableColHeader1}>
              <Text style={[styles.tableHeaderCell, { color: brandColor }]}>
                Description
              </Text>
            </View>
            <View style={styles.tableColHeader2}>
              <Text style={[styles.tableHeaderCell, { color: brandColor }]}>
                Qty
              </Text>
            </View>
            <View style={styles.tableColHeader3}>
              <Text style={[styles.tableHeaderCell, { color: brandColor }]}>
                Unit Price
              </Text>
            </View>
            <View style={styles.tableColHeader4}>
              <Text style={[styles.tableHeaderCell, { color: brandColor }]}>
                Amount
              </Text>
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
                  <Text
                    style={{ fontSize: 8, color: "#999", marginTop: 2 }}
                  >
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

          <View
            style={[
              styles.tableFooter,
              { backgroundColor: brandColor + "04", borderTopColor: brandColor },
            ]}
          >
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Subtotal:</Text>
              <Text style={styles.footerValue}>
                {cSym}
                {formatMoney(invoice.subtotal)}
              </Text>
            </View>

            {!!invoice.discount_percent && invoice.discount_percent > 0 && (
              <View style={styles.footerRow}>
                <Text style={styles.footerLabel}>
                  Discount ({invoice.discount_percent}%):
                </Text>
                <Text style={[styles.footerValue, { color: "#d32f2f" }]}>
                  -{cSym}
                  {formatMoney(
                    (invoice.subtotal || 0) *
                      (invoice.discount_percent / 100)
                  )}
                </Text>
              </View>
            )}

            {!!invoice.tax_percent && invoice.tax_percent > 0 && (
              <View style={styles.footerRow}>
                <Text style={styles.footerLabel}>
                  Tax ({invoice.tax_percent}%):
                </Text>
                <Text style={styles.footerValue}>
                  +{cSym}
                  {formatMoney(
                    ((invoice.subtotal || 0) -
                      (invoice.subtotal || 0) *
                        ((invoice.discount_percent || 0) / 100)) *
                      (invoice.tax_percent / 100)
                  )}
                </Text>
              </View>
            )}

            <View
              style={[
                styles.footerTotalRow,
                { borderTopColor: brandColor },
              ]}
            >
              <Text style={styles.footerTotalLabel}>Due:</Text>
              <Text style={[styles.footerTotalValue, { color: brandColor }]}>
                {cSym}
                {formatMoney(invoice.total)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Terms */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentLabel}>Payment Terms</Text>
          {invoice.due_date && (
            <Text style={styles.paymentText}>
              <Text style={{ fontWeight: "bold" }}>Due Date:</Text>{" "}
              {new Date(invoice.due_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          )}
          <Text style={styles.paymentText}>
            Thank you for your business. Please remit payment by the due date to
            the account details below.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {profile.business_name || profile.full_name}
            {profile.website ? ` • ${profile.website}` : ""}
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
