"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UpgradeModal } from "@/components/UpgradeModal";
import {
  PROJECT_TYPES,
  CURRENCIES,
  TIMELINE_OPTIONS,
  TONE_OPTIONS,
  PROPOSAL_SECTIONS,
  INDUSTRIES,
  INDUSTRY_SUGGESTIONS,
  BUDGET_TYPES,
  PAYMENT_TERMS,
} from "@/lib/constants";
import { trackProposalGenerated } from "@/lib/analytics";

const DEFAULT_SECTIONS = PROPOSAL_SECTIONS.slice(0, 8).map((s) => s);
const OPTIONAL_SECTIONS = PROPOSAL_SECTIONS.slice(8);

const progressMessages = [
  "Crafting your opening...",
  "Writing deliverables...",
  "Adding timeline & pricing...",
  "Almost there...",
];

export interface LineItem {
  id: string;
  item_name: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
}

export interface CustomService {
  id: string;
  name: string;
  description: string;
}

interface ExistingClient {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  industry: string | null;
}

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

interface ProfileDefaults {
  business_name?: string | null;
  website?: string | null;
  bio?: string | null;
  currency?: string | null;
  default_payment_terms?: string | null;
  default_tone?: string | null;
  default_sections?: string[] | null;
  default_expiry_days?: number | null;
}

export function ProposalForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasUserInteractedRef = useRef(false);
  const clientsFetchedRef = useRef(false);
  const searchClientIdRef = useRef<string | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [useExistingClient, setUseExistingClient] = useState(false);
  const [existingClients, setExistingClients] = useState<ExistingClient[]>([]);
  const [existingClientsLoading, setExistingClientsLoading] = useState(false);
  const [existingClientsError, setExistingClientsError] = useState("");
  const [selectedExistingClientId, setSelectedExistingClientId] = useState("");
  const [industry, setIndustry] = useState<(typeof INDUSTRIES)[number]>(
    INDUSTRIES[0],
  );

  const [projectTitle, setProjectTitle] = useState("");
  const [projectType, setProjectType] = useState<
    (typeof PROJECT_TYPES)[number]
  >(PROJECT_TYPES[0]);
  const [scope, setScope] = useState("");

  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetType, setBudgetType] = useState<(typeof BUDGET_TYPES)[number]>(
    BUDGET_TYPES[0],
  );
  const [currency, setCurrency] = useState<(typeof CURRENCIES)[number]>("USD");
  const [timeline, setTimeline] = useState<(typeof TIMELINE_OPTIONS)[number]>(
    TIMELINE_OPTIONS[0],
  );
  const [startDate, setStartDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState<
    (typeof PAYMENT_TERMS)[number]
  >(PAYMENT_TERMS[0]);

  const [lineItemsEnabled, setLineItemsEnabled] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: crypto.randomUUID(),
      item_name: "",
      description: "",
      quantity: 1,
      unit: "unit",
      rate: 0,
    },
  ]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [showDiscount, setShowDiscount] = useState(false);
  const [showTax, setShowTax] = useState(false);

  const [tone, setTone] =
    useState<(typeof TONE_OPTIONS)[number]["value"]>("professional");
  const [sections, setSections] = useState<string[]>(
    DEFAULT_SECTIONS as unknown as string[],
  );
  const [additionalContext, setAdditionalContext] = useState("");
  const [customServiceDescription, setCustomServiceDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [customServices, setCustomServices] = useState<CustomService[]>([]);

  const [proposalsRemaining, setProposalsRemaining] = useState<number | null>(
    10,
  );
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [onboardingDefaultsApplied, setOnboardingDefaultsApplied] =
    useState(false);

  useEffect(() => {
    const cId = searchParams.get("clientId");
    const cName = searchParams.get("clientName");
    const template = searchParams.get("template");
    const templateId = searchParams.get("templateId");
    const projectType = searchParams.get("projectType");
    if (cId) setClientId(cId);
    searchClientIdRef.current = cId;
    if (cName) setClientName(decodeURIComponent(cName));
    if (projectType)
      setProjectType(
        decodeURIComponent(projectType) as (typeof PROJECT_TYPES)[number],
      );
    if (template && !templateId && projectType)
      setProjectType(
        decodeURIComponent(projectType) as (typeof PROJECT_TYPES)[number],
      );
    if (templateId) {
      fetch(`/api/templates/${templateId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((t) => {
          if (t?.project_type) setProjectType(t.project_type);
          if (t?.name) setProjectTitle(t.name);
        })
        .catch(() => {});
    }
    if (cId) {
      fetch(`/api/clients/${cId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((c) => {
          if (c?.company) setClientCompany(c.company);
          if (c?.email) setClientEmail(c.email);
        })
        .catch(() => {});
    }
  }, [searchParams]);

  useEffect(() => {
    if (!useExistingClient || clientsFetchedRef.current) return;

    clientsFetchedRef.current = true;
    setExistingClientsLoading(true);
    setExistingClientsError("");

    fetch("/api/clients?limit=100")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load clients"))))
      .then(async (data: unknown) => {
        const clients = Array.isArray(data) ? (data as ExistingClient[]) : [];
        if (clients.length > 0) {
          setExistingClients(clients);
          return;
        }

        const proposalResponse = await fetch("/api/proposals");
        if (!proposalResponse.ok) {
          setExistingClients([]);
          return;
        }

        const proposals = (await proposalResponse.json()) as Array<{
          client_name?: string | null;
          client_company?: string | null;
          client_email?: string | null;
        }>;

        const seen = new Set<string>();
        const legacyClients: ExistingClient[] = [];

        for (const proposal of proposals ?? []) {
          const name = proposal.client_name?.trim();
          if (!name) continue;

          const company = proposal.client_company?.trim() || null;
          const email = proposal.client_email?.trim() || null;
          const key = `${name.toLowerCase()}|${(email ?? "").toLowerCase()}|${
            (company ?? "").toLowerCase()
          }`;

          if (seen.has(key)) continue;
          seen.add(key);

          legacyClients.push({
            id: `legacy-${legacyClients.length + 1}`,
            name,
            company,
            email,
            industry: null,
          });
        }

        setExistingClients(legacyClients);
      })
      .catch(() => {
        clientsFetchedRef.current = false; // allow retry on error
        setExistingClientsError("Could not load clients. Please try again.");
      })
      .finally(() => {
        setExistingClientsLoading(false);
      });
  }, [useExistingClient]);

  useEffect(() => {
    if (!useExistingClient) {
      setSelectedExistingClientId("");
      if (!searchClientIdRef.current) {
        setClientId(null);
      }
      return;
    }

    if (!selectedExistingClientId) return;

    const selected = existingClients.find((c) => c.id === selectedExistingClientId);
    if (!selected) return;

    setClientId(isUuid(selected.id) ? selected.id : null);
    setClientName(selected.name ?? "");
    setClientCompany(selected.company ?? "");
    setClientEmail(selected.email ?? "");
    if (
      selected.industry &&
      INDUSTRIES.includes(selected.industry as (typeof INDUSTRIES)[number])
    ) {
      setIndustry(selected.industry as (typeof INDUSTRIES)[number]);
    }
  }, [useExistingClient, selectedExistingClientId, existingClients]);

  useEffect(() => {
    if (onboardingDefaultsApplied) return;

    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((profile: ProfileDefaults | null) => {
        if (!profile || hasUserInteractedRef.current) {
          setOnboardingDefaultsApplied(true);
          return;
        }

        if (
          profile.currency &&
          CURRENCIES.includes(profile.currency as (typeof CURRENCIES)[number])
        ) {
          setCurrency(profile.currency as (typeof CURRENCIES)[number]);
        }

        if (
          profile.default_payment_terms &&
          PAYMENT_TERMS.includes(
            profile.default_payment_terms as (typeof PAYMENT_TERMS)[number],
          )
        ) {
          setPaymentTerms(
            profile.default_payment_terms as (typeof PAYMENT_TERMS)[number],
          );
        }

        if (
          profile.default_tone &&
          TONE_OPTIONS.some((t) => t.value === profile.default_tone)
        ) {
          setTone(profile.default_tone as (typeof TONE_OPTIONS)[number]["value"]);
        }

        const validSections = (profile.default_sections ?? []).filter((s) =>
          PROPOSAL_SECTIONS.includes(s as (typeof PROPOSAL_SECTIONS)[number]),
        );
        if (validSections.length > 0) {
          setSections(validSections);
        }

        if (
          typeof profile.default_expiry_days === "number" &&
          profile.default_expiry_days > 0
        ) {
          const d = new Date();
          d.setDate(d.getDate() + profile.default_expiry_days);
          setExpiryDate(d.toISOString().split("T")[0]);
        }

        if (!additionalContext.trim()) {
          const contextParts = [
            profile.business_name
              ? `Business name: ${profile.business_name}`
              : null,
            profile.website ? `Website: ${profile.website}` : null,
            profile.bio ? `Business bio: ${profile.bio}` : null,
          ].filter(Boolean);

          if (contextParts.length > 0) {
            setAdditionalContext(
              `Use this business context while writing:\n${contextParts.join("\n")}`,
            );
          }
        }

        setOnboardingDefaultsApplied(true);
      })
      .catch(() => {
        setOnboardingDefaultsApplied(true);
      });
  }, [additionalContext, onboardingDefaultsApplied]);

  const toggleSection = (s: string) => {
    setSections((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  const addCustomService = () => {
    setCustomServices((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        description: "",
      },
    ]);
  };

  const removeCustomService = (id: string) => {
    setCustomServices((prev) => prev.filter((x) => x.id !== id));
  };

  const updateCustomService = (
    id: string,
    field: "name" | "description",
    value: string
  ) => {
    setCustomServices((prev) =>
      prev.map((x) => (x.id === id ? { ...x, [field]: value } : x))
    );
  };

  const sectionsCount = sections.length;

  const validLineItems = lineItems.filter((li) => li.item_name.trim());

  const subtotal = validLineItems.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0,
  );
  const discountAmount = subtotal * (discountPercent / 100);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = afterDiscount * (taxPercent / 100);
  const grandTotal = afterDiscount + taxAmount;

  // Auto-update budget when line items change
  useEffect(() => {
    if (lineItemsEnabled) {
      setBudgetAmount(grandTotal > 0 ? grandTotal.toString() : "");
    }
  }, [lineItemsEnabled, grandTotal]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: crypto.randomUUID(),
        item_name: "",
        description: "",
        quantity: 1,
        unit: "unit",
        rate: 0,
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
    if (lineItems.length === 1) {
      // Need at least one row
      setLineItems([
        {
          id: crypto.randomUUID(),
          item_name: "",
          description: "",
          quantity: 1,
          unit: "unit",
          rate: 0,
        },
      ]);
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!clientName.trim()) e.clientName = "Required";
    if (!projectTitle.trim()) e.projectTitle = "Required";
    if (!scope.trim()) {
      e.scope = "Required";
    } else if (scope.trim().length < 10) {
      e.scope = "Project scope must be at least 10 characters";
    }
    if (!lineItemsEnabled) {
      if (!budgetAmount.trim() || isNaN(Number(budgetAmount)))
        e.budgetAmount = "Enter a valid amount";
    } else {
      if (validLineItems.length === 0)
        e.lineItems = "Add at least one line item";
    }
    if (Object.keys(e).length > 0) {
      e.submit = "Please fill in all required fields highlighted above.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setProgressMsg(progressMessages[0]);
    const interval = setInterval(() => {
      setProgressMsg((m) => {
        const i = progressMessages.indexOf(m) + 1;
        return progressMessages[i < progressMessages.length ? i : 0];
      });
    }, 2000);
    try {
      const payload = {
        clientId: clientId || undefined,
        clientName,
        clientCompany: clientCompany || undefined,
        clientEmail: clientEmail || undefined,
        industry,
        projectTitle,
        projectType,
        projectScope: scope,
        budgetAmount: lineItemsEnabled ? grandTotal : Number(budgetAmount),
        budgetType,
        currency,
        timeline,
        startDate: startDate || undefined,
        paymentTerms,
        tone,
        sections,
        additionalContext: additionalContext || undefined,
        customServiceDescription: projectType === "Other" && customServiceDescription.trim() ? customServiceDescription.trim() : undefined,
        customServices: customServices.filter((s) => s.name.trim()),
        expiryDate: expiryDate || undefined,
        lineItemsEnabled,
        lineItems: lineItemsEnabled ? validLineItems : undefined,
        subtotal: lineItemsEnabled ? subtotal : undefined,
        discountPercent: lineItemsEnabled ? discountPercent : undefined,
        taxPercent: lineItemsEnabled ? taxPercent : undefined,
        grandTotal: lineItemsEnabled ? grandTotal : undefined,
      };

      console.log("[ProposalForm] Submitting payload:", JSON.stringify(payload, null, 2));
      
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      clearInterval(interval);
      const data = await res.json();
      
      console.log("[ProposalForm] Response status:", res.status);
      console.log("[ProposalForm] Response data:", data);
      
      if (res.status === 400 && data?.details?.fieldErrors) {
        const fieldErrors: Record<string, string> = {};
        Object.entries(data.details.fieldErrors as Record<string, string[] | undefined>).forEach(
          ([key, messages]) => {
            const first = messages && messages[0];
            if (first) {
              fieldErrors[key] = first;
            }
          },
        );
        console.log("[ProposalForm] Field validation errors:", fieldErrors);
        setErrors(fieldErrors);
        setLoading(false);
        return;
      }
      if (res.status === 402) {
        console.log("[ProposalForm] User upgrade required");
        setUpgradeOpen(true);
        setErrors({});
        setLoading(false);
        return;
      }
      if (data.id) {
        console.log("[ProposalForm] ✅ Proposal generated successfully:", data.id);
        trackProposalGenerated();
        router.push(`/proposals/${data.id}`);
      } else {
        const errorMsg = data.error || data.details || JSON.stringify(data) || "Generation failed";
        console.error("[ProposalForm] Generation failed:", errorMsg);
        setErrors({ submit: errorMsg });
      }
    } catch (error) {
      clearInterval(interval);
      const errorMsg = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      console.error("[ProposalForm] Request error:", errorMsg);
      setErrors({ submit: errorMsg });
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-[#1e1e2e] bg-[#12121e] px-4 py-3 text-[#faf8f4] focus:outline-none focus:ring-2 focus:ring-gold/50";
  const labelClass = "block text-sm font-medium text-[#faf8f4] mb-2";
  const smallInputClass =
    "w-full rounded-lg border border-[#1e1e2e] bg-[#12121e] px-3 py-2 text-sm text-[#faf8f4] focus:outline-none focus:ring-2 focus:ring-gold/50";

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
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <form
        onSubmit={handleSubmit}
        onChangeCapture={() => {
          hasUserInteractedRef.current = true;
        }}
        className="lg:col-span-3 space-y-8"
      >
        <div className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-[#f2d67f]">
          Using onboarding defaults for tone, sections, currency, payment terms, and expiry date. You can edit everything below for this proposal.
        </div>
        {/* Section 1: About the Client */}
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6">
          <h2 className="font-semibold text-[#faf8f4] mb-4">
            About the Client
          </h2>
          <label className="flex items-center gap-2 text-sm text-[#888890] mb-4">
            <input
              type="checkbox"
              checked={useExistingClient}
              onChange={(e) => setUseExistingClient(e.target.checked)}
            />
            Select existing client
          </label>
          {useExistingClient && (
            <div className="mb-4">
              <label className={labelClass}>Choose Client</label>
              <select
                aria-label="Choose Client"
                value={selectedExistingClientId}
                onChange={(e) => setSelectedExistingClientId(e.target.value)}
                className={inputClass}
                disabled={existingClientsLoading}
              >
                <option value="">
                  {existingClientsLoading
                    ? "Loading clients..."
                    : "Select a client"}
                </option>
                {existingClients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.company ? ` - ${c.company}` : ""}
                    {c.email ? ` (${c.email})` : ""}
                  </option>
                ))}
              </select>
              {existingClientsError && (
                <p className="text-red-400 text-xs mt-1">{existingClientsError}</p>
              )}
              {!existingClientsLoading && existingClients.length === 0 && !existingClientsError && (
                <p className="text-xs text-[#888890] mt-1">
                  No clients found yet. Add clients first from the Clients page.
                </p>
              )}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Client Name *</label>
              <input
                type="text"
                aria-label="Client Name"
                placeholder="e.g. John Smith"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className={inputClass}
                required
              />
              {errors.clientName && (
                <p className="text-red-400 text-xs mt-1">{errors.clientName}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Client Company</label>
              <input
                type="text"
                aria-label="Client Company"
                placeholder="e.g. Acme Corp"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Client Email</label>
              <input
                type="email"
                aria-label="Client Email"
                placeholder="client@example.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Industry</label>
              <select
                aria-label="Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value as typeof industry)}
                className={inputClass}
              >
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: About the Project */}
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6">
          <h2 className="font-semibold text-[#faf8f4] mb-4">
            About the Project
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Project Title *</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder={INDUSTRY_SUGGESTIONS[industry].projectTitlePlaceholder}
                className={inputClass}
                required
              />
              {errors.projectTitle && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.projectTitle}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Project Type * <span className="text-[#888890] font-normal">(what you do)</span></label>
              <select
                aria-label="Project Type"
                value={projectType}
                onChange={(e) =>
                  setProjectType(e.target.value as typeof projectType)
                }
                className={inputClass}
              >
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#888890] mt-2 mb-1">Suggested for {industry}:</p>
              <div className="flex flex-wrap gap-2">
                {INDUSTRY_SUGGESTIONS[industry].suggestedProjectTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setProjectType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      projectType === t
                        ? "bg-gold text-[#0a0a14]"
                        : "bg-[#1e1e2e] text-[#c4c4cc] hover:bg-[#2a2a3e] hover:text-[#faf8f4]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {projectType === "Other" && (
              <div>
                <label className={labelClass}>
                  What do you do? <span className="text-[#888890] font-normal">(so we can tailor the proposal)</span>
                </label>
                <textarea
                  value={customServiceDescription}
                  onChange={(e) => setCustomServiceDescription(e.target.value)}
                  placeholder="e.g. Meta & Google ads, conversion funnels, lead gen campaigns"
                  maxLength={500}
                  rows={2}
                  className={inputClass}
                />
                <p className="text-xs text-[#888890] mt-1">
                  {customServiceDescription.length}/500 — Short description of your service
                </p>
              </div>
            )}
            <div>
              <label className={labelClass}>Project Scope *</label>
              <textarea
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                rows={5}
                placeholder="Design and develop a 5-page website with homepage, about, services, portfolio, and contact. Includes mobile responsive design, basic SEO, 2 rounds of revisions."
                className={inputClass}
                required
              />
              <p className="text-xs text-[#888890] mt-1">
                {scope.length} characters
              </p>
              {errors.scope && (
                <p className="text-red-400 text-xs mt-1">{errors.scope}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Pricing & Timeline */}
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6">
          <h2 className="font-semibold text-[#faf8f4] mb-4">
            Pricing & Timeline
          </h2>
          <div className="space-y-4">
            {!lineItemsEnabled && (
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className={labelClass}>Budget Amount *</label>
                  <input
                    type="number"
                    aria-label="Budget Amount"
                    placeholder="5000"
                    min={0}
                    step={0.01}
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className={inputClass}
                    required={!lineItemsEnabled}
                  />
                  {errors.budgetAmount && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.budgetAmount}
                    </p>
                  )}
                </div>
                <div className="w-24">
                  <label className={labelClass}>Currency</label>
                  <select
                    aria-label="Currency"
                    value={currency}
                    onChange={(e) =>
                      setCurrency(e.target.value as typeof currency)
                    }
                    className={inputClass}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {lineItemsEnabled && (
              <div className="mb-4">
                <label className={labelClass}>Currency</label>
                <select
                  aria-label="Currency"
                  value={currency}
                  onChange={(e) =>
                    setCurrency(e.target.value as typeof currency)
                  }
                  className={inputClass}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className={labelClass}>Budget Type</label>
              <select
                aria-label="Budget Type"
                value={budgetType}
                onChange={(e) =>
                  setBudgetType(e.target.value as typeof budgetType)
                }
                className={inputClass}
              >
                {BUDGET_TYPES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Project Timeline *</label>
              <select
                aria-label="Project Timeline"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value as typeof timeline)}
                className={inputClass}
              >
                {TIMELINE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Start Date</label>
              <input
                type="date"
                aria-label="Project Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Payment Terms</label>
              <select
                aria-label="Payment Terms"
                value={paymentTerms}
                onChange={(e) =>
                  setPaymentTerms(e.target.value as typeof paymentTerms)
                }
                className={inputClass}
              >
                {PAYMENT_TERMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3.5: Pricing Breakdown (Line Items) */}
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-semibold text-[#faf8f4]">
                Pricing Breakdown
              </h2>
              <p className="text-xs text-[#888890] mt-1">
                Break down your quote into line items for a more professional,
                detailed proposal
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                aria-label="Enable line items pricing breakdown"
                className="sr-only peer"
                checked={lineItemsEnabled}
                onChange={(e) => setLineItemsEnabled(e.target.checked)}
              />
              <div className="w-11 h-6 bg-[#1e1e2e] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
            </label>
          </div>

          {lineItemsEnabled && (
            <div className="mt-6 space-y-4">
              <div className="hidden md:grid grid-cols-12 gap-2 text-xs font-semibold text-[#888890] uppercase tracking-wider mb-2 px-1">
                <div className="col-span-5">Item / Service</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2">Unit</div>
                <div className="col-span-2 text-right">
                  Rate ({currencySymbol})
                </div>
                <div className="col-span-1"></div>
              </div>

              {lineItems.map((item, index) => (
                <div
                  key={item.id}
                  className="relative group bg-[#161622] rounded-lg p-3 border border-[#262638] md:bg-transparent md:border-transparent md:p-1"
                >
                  <div className="md:hidden text-xs text-[#888890] font-semibold uppercase tracking-wider mb-2">
                    Item {index + 1}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    <div className="md:col-span-5 space-y-2">
                      <input
                        type="text"
                        value={item.item_name}
                        onChange={(e) =>
                          updateLineItem(item.id, "item_name", e.target.value)
                        }
                        placeholder="Item name"
                        className={smallInputClass}
                        required={lineItemsEnabled}
                      />
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateLineItem(item.id, "description", e.target.value)
                        }
                        placeholder="Description (optional)"
                        className={`${smallInputClass} text-xs text-[#888890]`}
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 col-span-1 md:col-span-6 gap-2">
                      <div className="md:col-span-2 text-center">
                        <label className="md:hidden text-xs text-[#888890] mb-1 block">
                          Qty
                        </label>
                        <input
                          type="number"
                          aria-label="Quantity"
                          min="0.01"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) =>
                            updateLineItem(
                              item.id,
                              "quantity",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className={smallInputClass}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="md:hidden text-xs text-[#888890] mb-1 block">
                          Unit
                        </label>
                        <select
                          aria-label="Unit"
                          value={item.unit}
                          onChange={(e) =>
                            updateLineItem(item.id, "unit", e.target.value)
                          }
                          className={smallInputClass}
                        >
                          <option value="unit">unit</option>
                          <option value="hour">hour</option>
                          <option value="day">day</option>
                          <option value="week">week</option>
                          <option value="month">month</option>
                          <option value="page">page</option>
                          <option value="item">item</option>
                          <option value="license">license</option>
                        </select>
                      </div>

                      <div className="col-span-2 text-right mt-2 md:mt-0">
                        <label className="md:hidden text-xs text-[#888890] mb-1 block text-left">
                          Rate ({currencySymbol})
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate || ""}
                          onChange={(e) =>
                            updateLineItem(
                              item.id,
                              "rate",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          placeholder="0.00"
                          className={`${smallInputClass} text-right`}
                        />
                      </div>
                    </div>

                    <div className="absolute top-2 right-2 md:relative md:top-auto md:right-auto md:col-span-1 flex justify-end items-center h-full">
                      <button
                        type="button"
                        onClick={() => removeLineItem(item.id)}
                        className="text-[#888890] hover:text-red-400 p-1 rounded transition-colors"
                        title="Remove item"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-right text-sm text-[#faf8f4] font-medium pr-12 md:pr-0">
                    <span className="md:hidden text-[#888890] text-xs uppercase tracking-wider mr-2">
                      Amount:
                    </span>
                    {currencySymbol}
                    {(item.quantity * item.rate || 0).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addLineItem}
                className="text-gold hover:text-[#e8c76a] text-sm font-medium flex items-center gap-1 mt-4 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                Add Item
              </button>

              {errors.lineItems && (
                <p className="text-red-400 text-xs mt-1">{errors.lineItems}</p>
              )}

              <div className="mt-8 border-t border-[#1e1e2e] pt-6 pb-2">
                <div className="flex flex-col items-end space-y-3 w-full sm:w-1/2 ml-auto">
                  <div className="flex justify-between w-full text-[#888890] text-sm">
                    <span>Subtotal</span>
                    <span>
                      {currencySymbol}
                      {subtotal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {showDiscount ? (
                    <div className="flex justify-between w-full items-center">
                      <span className="text-sm text-[#888890]">
                        Discount (%)
                      </span>
                      <input
                        type="number"
                        aria-label="Discount percentage"
                        placeholder="0"
                        min="0"
                        max="100"
                        value={discountPercent || ""}
                        onChange={(e) =>
                          setDiscountPercent(parseFloat(e.target.value) || 0)
                        }
                        className="w-20 rounded bg-[#161622] border border-[#262638] px-2 py-1 text-right text-sm text-white focus:border-gold outline-none"
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowDiscount(true)}
                      className="text-xs text-[#888890] hover:text-white underline self-start mb-1"
                    >
                      Add discount
                    </button>
                  )}

                  {showTax ? (
                    <div className="flex justify-between w-full items-center pt-1">
                      <span className="text-sm text-[#888890]">Tax (%)</span>
                      <input
                        type="number"
                        aria-label="Tax percentage"
                        placeholder="0"
                        min="0"
                        max="100"
                        value={taxPercent || ""}
                        onChange={(e) =>
                          setTaxPercent(parseFloat(e.target.value) || 0)
                        }
                        className="w-20 rounded bg-[#161622] border border-[#262638] px-2 py-1 text-right text-sm text-white focus:border-gold outline-none"
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowTax(true)}
                      className="text-xs text-[#888890] hover:text-white underline self-start"
                    >
                      Add tax
                    </button>
                  )}

                  <div className="flex justify-between w-full pt-4 border-t border-[#262638] items-center">
                    <span className="font-semibold text-white">Total</span>
                    <span className="text-xl font-bold text-gold">
                      {currencySymbol}
                      {grandTotal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Proposal Settings */}
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6">
          <h2 className="font-semibold text-[#faf8f4] mb-4">
            Proposal Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Tone</label>
              <div className="grid grid-cols-2 gap-2">
                {TONE_OPTIONS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTone(t.value)}
                    className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                      tone === t.value
                        ? "border-gold bg-gold/20 text-gold"
                        : "border-[#1e1e2e] text-[#888890] hover:border-gold/30"
                    }`}
                  >
                    <span className="block">
                      {t.emoji} {t.label}
                    </span>
                    <span className="text-xs opacity-80">{t.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Services Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Custom Services / Skills</label>
                <button
                  type="button"
                  onClick={addCustomService}
                  className="text-gold hover:text-[#e8c76a] text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                  Add Service
                </button>
              </div>
              <p className="text-xs text-[#888890] mb-3">
                Add your custom services (e.g., AI Agents, Custom Development). Describe what you build or deliver.
              </p>

              <div className="space-y-3">
                {customServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-[#161622] rounded-lg p-4 border border-[#262638]"
                  >
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) =>
                            updateCustomService(service.id, "name", e.target.value)
                          }
                          placeholder="Service name (e.g., AI Agents, Voice Agents, Custom Development)"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <textarea
                          value={service.description}
                          onChange={(e) =>
                            updateCustomService(service.id, "description", e.target.value)
                          }
                          placeholder="What do you do with this service? Describe what you build, deliver, or achieve for clients..."
                          rows={2}
                          className={inputClass}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCustomService(service.id)}
                        className="text-[#888890] hover:text-red-400 text-xs font-medium transition-colors"
                      >
                        Remove Service
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Include Sections</label>
              <div className="space-y-2">
                {PROPOSAL_SECTIONS.map((s) => (
                  <label
                    key={s}
                    className="flex items-center gap-2 text-sm text-[#888890]"
                  >
                    <input
                      type="checkbox"
                      checked={sections.includes(s)}
                      onChange={() => toggleSection(s)}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Additional Context</label>
              <textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                rows={2}
                placeholder="Special requirements, language to use or avoid..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Expiry Date</label>
              <input
                type="date"
                aria-label="Proposal Expiry Date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className={inputClass}
              />
              {errors.expiryDate && (
                <p className="text-red-400 text-xs mt-1">{errors.expiryDate}</p>
              )}
            </div>
          </div>
        </div>

        {errors.submit && (
          <p className="text-red-400 text-sm">{errors.submit}</p>
        )}
        <UpgradeModal
          open={upgradeOpen}
          onClose={() => setUpgradeOpen(false)}
          message="You've reached your proposal limit for this month."
        />

        <div>
          {proposalsRemaining != null && (
            <p className="text-sm text-[#888890] mb-2">
              {proposalsRemaining} proposals remaining this month
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold py-4 font-medium text-[#0a0a14] hover:bg-[#e8c76a] disabled:opacity-50"
          >
            {loading ? `✨ ${progressMsg}` : "✨ Generate My Proposal"}
          </button>
        </div>
      </form>

      {/* Live Preview */}
      <div className="lg:col-span-2">
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 sticky top-24">
          <h3 className="font-semibold text-[#faf8f4] mb-4">Preview</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-[#888890]">Client:</span>{" "}
              {clientName || "—"}
            </p>
            <p>
              <span className="text-[#888890]">Project:</span>{" "}
              {projectTitle || "—"}
            </p>
            <p>
              <span className="text-[#888890]">Type:</span> {projectType}
            </p>
            <p>
              <span className="text-[#888890]">Budget:</span> {currencySymbol}{" "}
              {lineItemsEnabled
                ? grandTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : budgetAmount
                  ? Number(budgetAmount).toLocaleString()
                  : "—"}{" "}
              ({budgetType})
            </p>
            {lineItemsEnabled && validLineItems.length > 0 && (
              <p>
                <span className="text-[#888890]">Items:</span>{" "}
                {validLineItems.length}
              </p>
            )}
            <p>
              <span className="text-[#888890]">Timeline:</span> {timeline}
            </p>
          </div>
          <p className="text-xs text-[#888890] mt-4">
            Your proposal will include {sectionsCount} section
            {sectionsCount !== 1 ? "s" : ""}.
          </p>
          <p className="text-xs text-[#888890] mt-1">
            Tone: {TONE_OPTIONS.find((t) => t.value === tone)?.label ?? tone}
          </p>
        </div>
      </div>
    </div>
  );
}
