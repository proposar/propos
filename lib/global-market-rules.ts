export type MarketRules = {
  marketKey: string;
  displayCountry: string;
  contract: {
    governingLaw: string;
    mediationDays: number;
    lateFeeClause: string;
    eSignatureClause: string;
    cautionNote: string;
  };
  invoice: {
    taxLabel: string;
    paymentTermsDefault: string;
    legalNote: string;
  };
};

const DEFAULT_RULES: MarketRules = {
  marketKey: "global",
  displayCountry: "Global",
  contract: {
    governingLaw: "the freelancer's primary business jurisdiction",
    mediationDays: 14,
    lateFeeClause: "Late payments may incur commercially reasonable penalties allowed by applicable local law.",
    eSignatureClause:
      "Electronic signatures executed through Proposar are intended to be legally binding where permitted by applicable law.",
    cautionNote:
      "This template is a starting point and should be reviewed by qualified counsel for high-value or complex deals.",
  },
  invoice: {
    taxLabel: "Tax",
    paymentTermsDefault: "Payment due within 7 calendar days unless otherwise agreed in writing.",
    legalNote:
      "This invoice is issued for services rendered and should be processed per local tax and accounting laws.",
  },
};

const MARKET_RULES: Record<string, MarketRules> = {
  india: {
    marketKey: "india",
    displayCountry: "India",
    contract: {
      governingLaw: "India (including applicable provisions of the Information Technology Act, 2000)",
      mediationDays: 14,
      lateFeeClause: "Late payments may attract a 5% monthly late fee, subject to applicable Indian law.",
      eSignatureClause:
        "Electronic signatures are intended to be enforceable under applicable Indian law, including the Information Technology Act, 2000.",
      cautionNote:
        "For enterprise, cross-border, or regulated engagements, obtain advice from an India-qualified legal professional.",
    },
    invoice: {
      taxLabel: "GST",
      paymentTermsDefault: "Payment due within 7 calendar days. GST treatment should follow applicable Indian GST law.",
      legalNote:
        "Ensure GST applicability, place-of-supply rules, and invoice disclosures are compliant with Indian GST regulations.",
    },
  },
  us: {
    marketKey: "us",
    displayCountry: "United States",
    contract: {
      governingLaw: "the governing state of the freelancer's principal place of business in the United States",
      mediationDays: 14,
      lateFeeClause: "Late payments may incur interest up to the maximum amount permitted by applicable state law.",
      eSignatureClause:
        "Electronic signatures are intended to be enforceable under the U.S. E-SIGN Act and applicable state UETA statutes.",
      cautionNote:
        "For large engagements, confirm state-specific legal requirements with U.S. counsel.",
    },
    invoice: {
      taxLabel: "Sales Tax",
      paymentTermsDefault: "Payment due within 7 calendar days unless otherwise agreed in writing.",
      legalNote:
        "Sales tax applicability varies by state and nexus; verify local compliance.",
    },
  },
  uk: {
    marketKey: "uk",
    displayCountry: "United Kingdom",
    contract: {
      governingLaw: "England and Wales (unless otherwise specified in writing)",
      mediationDays: 14,
      lateFeeClause:
        "Late payments may be subject to statutory or contractual interest to the extent permitted by UK law.",
      eSignatureClause:
        "Electronic signatures are intended to be legally binding under applicable UK law.",
      cautionNote:
        "For material-value engagements, consider review by a UK-qualified solicitor.",
    },
    invoice: {
      taxLabel: "VAT",
      paymentTermsDefault: "Payment due within 7 calendar days unless agreed otherwise.",
      legalNote:
        "VAT registration thresholds and reverse-charge treatment may apply depending on services and counterparties.",
    },
  },
  eu: {
    marketKey: "eu",
    displayCountry: "European Union",
    contract: {
      governingLaw: "the freelancer's EU member-state law unless otherwise agreed",
      mediationDays: 14,
      lateFeeClause:
        "Late payment terms should align with applicable EU member-state implementation of late payment directives.",
      eSignatureClause:
        "Electronic signatures are intended to be enforceable under applicable EU and member-state law, including eIDAS where relevant.",
      cautionNote:
        "Cross-border B2B contracts should be reviewed for VAT, data protection, and conflict-of-law implications.",
    },
    invoice: {
      taxLabel: "VAT",
      paymentTermsDefault: "Payment due within 7 calendar days unless otherwise agreed in the contract.",
      legalNote:
        "Confirm VAT treatment (domestic, intra-EU B2B reverse charge, or export) before issuing final invoice.",
    },
  },
  uae: {
    marketKey: "uae",
    displayCountry: "United Arab Emirates",
    contract: {
      governingLaw: "United Arab Emirates law (unless otherwise agreed)",
      mediationDays: 14,
      lateFeeClause:
        "Late fees should be commercially reasonable and compliant with UAE law and contract terms.",
      eSignatureClause:
        "Electronic signatures are intended to be enforceable under applicable UAE e-transactions framework.",
      cautionNote:
        "For mainland vs free-zone considerations, obtain local legal review.",
    },
    invoice: {
      taxLabel: "VAT",
      paymentTermsDefault: "Payment due within 7 calendar days unless otherwise agreed.",
      legalNote:
        "Ensure UAE VAT registration and invoicing fields are handled correctly where applicable.",
    },
  },
};

const EU_COUNTRIES = new Set([
  "germany",
  "france",
  "spain",
  "italy",
  "portugal",
  "netherlands",
  "belgium",
  "ireland",
  "austria",
  "sweden",
  "norway",
  "denmark",
  "finland",
  "poland",
  "czech republic",
  "romania",
  "hungary",
  "greece",
  "croatia",
  "bulgaria",
  "slovakia",
  "slovenia",
  "lithuania",
  "latvia",
  "estonia",
  "luxembourg",
  "malta",
  "cyprus",
]);

function normalizeCountry(input?: string | null) {
  return (input ?? "").trim().toLowerCase();
}

export function getMarketRules(country?: string | null): MarketRules {
  const normalized = normalizeCountry(country);
  if (!normalized) return DEFAULT_RULES;

  if (normalized === "india") return MARKET_RULES.india;
  if (normalized === "united states" || normalized === "usa" || normalized === "us") return MARKET_RULES.us;
  if (normalized === "united kingdom" || normalized === "uk") return MARKET_RULES.uk;
  if (normalized === "united arab emirates" || normalized === "uae") return MARKET_RULES.uae;
  if (EU_COUNTRIES.has(normalized)) return MARKET_RULES.eu;

  return DEFAULT_RULES;
}
