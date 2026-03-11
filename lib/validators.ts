/**
 * Validation schemas using Zod
 * Server-side runtime validation for all API inputs
 */

import { z } from "zod";

/** Profile update validation */
export const profileUpdateSchema = z.object({
  full_name: z.string().max(255).optional(),
  business_name: z.string().max(255).optional(),
  email: z.string().email().optional(),
  avatar_url: z.string().nullable().optional(),
  logo_url: z.string().nullable().optional(),
  brand_color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  website: z.preprocess((v) => (v === "" ? null : v), z.union([z.string().url(), z.null()]).optional()),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  signature_text: z.string().nullable().optional(),
  default_payment_terms: z.string().nullable().optional(),
  default_tone: z.string().optional(),
  default_expiry_days: z.number().min(1).max(365).optional(),
  default_sections: z.array(z.string()).nullable().optional(),
  auto_follow_up_enabled: z.boolean().optional(),
  auto_follow_up_days: z.number().min(1).max(30).optional(),
  notify_proposal_viewed: z.boolean().optional(),
  notify_proposal_accepted: z.boolean().optional(),
  notify_proposal_declined: z.boolean().optional(),
  notify_proposal_expired: z.boolean().optional(),
  notify_weekly_summary: z.boolean().optional(),
  notify_product_updates: z.boolean().optional(),
});

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;

/** Proposal creation validation */
export const proposalCreateSchema = z.object({
  clientId: z.string().uuid().optional(),
  clientName: z.string().min(1).max(255),
  clientCompany: z.string().max(255).nullable().optional(),
  clientEmail: z.string().email().optional(),
  projectTitle: z.string().min(1).max(500),
  projectType: z.string().min(1),
  projectScope: z.string().min(10),
  budgetAmount: z.number().positive().optional(),
  budgetType: z.enum(["fixed", "hourly"]).optional(),
  currency: z.string().length(3).default("USD"),
  timeline: z.string().optional(),
  startDate: z.string().datetime().optional(),
  paymentTerms: z.string().optional(),
  // Keep in sync with TONE_OPTIONS values
  tone: z.enum(["professional", "friendly", "formal", "casual", "bold"]).optional(),
  sections: z.array(z.string()).optional(),
  additionalContext: z.string().optional(),
  expiryDate: z.string().datetime().optional(),
  lineItemsEnabled: z.boolean().default(false),
  lineItems: z.array(z.object({
    item_name: z.string().min(1),
    description: z.string().nullable(),
    quantity: z.number().positive(),
    unit: z.string().min(1),
    rate: z.number().positive(),
    is_optional: z.boolean().default(false),
  })).optional(),
});

export type ProposalCreate = z.infer<typeof proposalCreateSchema>;

/** Proposal update validation (all fields optional) */
export const proposalUpdateSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  generated_content: z.string().optional(),
  status: z.enum(["draft", "sent", "accepted", "declined", "expired"]).optional(),
  expires_at: z.string().datetime().optional(),
  sent_at: z.string().datetime().optional(),
});

export type ProposalUpdate = z.infer<typeof proposalUpdateSchema>;

/** Line item validation */
export const lineItemSchema = z.object({
  item_name: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  quantity: z.number().positive(),
  unit: z.string().min(1).max(50),
  rate: z.number().positive(),
  sort_order: z.number().int().optional(),
  is_optional: z.boolean().default(false),
});

export type LineItemInput = z.infer<typeof lineItemSchema>;

/** Line item update validation (all fields optional) */
export const lineItemUpdateSchema = lineItemSchema.partial();

export type LineItemUpdate = z.infer<typeof lineItemUpdateSchema>;

/** Send proposal email validation */
export const sendProposalEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(255).optional(),
  message: z.string().max(2000).optional(),
  proposalId: z.string().uuid(),
});

export type SendProposalEmail = z.infer<typeof sendProposalEmailSchema>;

/** Client creation validation */
export const clientCreateSchema = z.object({
  name: z.string().min(1).max(255),
  company: z.string().max(255).nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  website: z.string().url().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type ClientCreate = z.infer<typeof clientCreateSchema>;

/** Client update validation (all fields optional) */
export const clientUpdateSchema = clientCreateSchema.partial();

export type ClientUpdate = z.infer<typeof clientUpdateSchema>;

/** Client search/filter validation */
export const clientSearchSchema = z.object({
  search: z.preprocess((v) => (v === null || v === "" ? undefined : v), z.string().max(255).optional()),
  sort: z.preprocess((v) => (v === null || v === "" ? "updated_at" : v), z.enum(["name", "created_at", "updated_at", "total_proposals", "total_value"])),
  order: z.preprocess((v) => (v === null || v === "" ? "desc" : v), z.enum(["asc", "desc"])),
  page: z.preprocess((v) => (v === null || v === "" || v === undefined ? 1 : Number(v)), z.number().int().min(1)),
  limit: z.preprocess((v) => (v === null || v === "" || v === undefined ? 10 : Number(v)), z.number().int().min(1).max(100)),
});

export type ClientSearch = z.infer<typeof clientSearchSchema>;

/** Template creation validation */
export const templateCreateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  content: z.string().min(10),
  project_type: z.string().max(100).optional(),
  category: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export type TemplateCreate = z.infer<typeof templateCreateSchema>;

/** Template update validation (all fields optional) */
export const templateUpdateSchema = templateCreateSchema.partial().extend({
  project_type: z.string().optional(),
});

export type TemplateUpdate = z.infer<typeof templateUpdateSchema>;

/** Template search/filter validation */
export const templateSearchSchema = z.object({
  search: z.string().max(255).optional().nullable(),
  sort: z.preprocess(
    (v) => (v === null || v === undefined || v === "" ? "created_at" : v),
    z.enum(["name", "created_at", "use_count"])
  ),
  order: z.preprocess(
    (v) => (v === null || v === undefined || v === "" ? "desc" : v),
    z.enum(["asc", "desc"])
  ),
});

export type TemplateSearch = z.infer<typeof templateSearchSchema>;

/** Referral creation validation */
export const referralCreateSchema = z.object({
  referee_email: z.string().email(),
  referral_code: z.string().min(4).max(20).regex(/^[a-zA-Z0-9-]+$/, "Can only contain letters, numbers, and hyphens"),
});

export type ReferralCreate = z.infer<typeof referralCreateSchema>;

/** Email validation schemas */

export const sendFollowUpEmailSchema = z.object({
  authorization: z.string().optional(), // CRON_SECRET in header
});

/** Generic pagination query validation */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type Pagination = z.infer<typeof paginationSchema>;

/** Generic search validation */
export const searchSchema = z.object({
  q: z.string().max(255).optional(),
  status: z.string().optional(),
  sort: z.enum(["created_at", "updated_at", "-created_at", "-updated_at"]).default("-created_at"),
});

export type Search = z.infer<typeof searchSchema>;

/** Proposal tracking/view event validation */
export const proposalTrackingSchema = z.object({
  scrolled_to_percent: z.number().int().min(0).max(100).default(0),
  duration_seconds: z.number().int().min(0).default(0),
});

export type ProposalTracking = z.infer<typeof proposalTrackingSchema>;

/** Proposal generation validation */
export const proposalGenerateSchema = z.object({
  clientId: z.string().uuid().optional(),
  clientName: z.string().min(1).max(255),
  clientCompany: z.string().max(255).nullable().optional(),
  clientEmail: z.string().email().nullable().optional(),
  industry: z.string().max(100).nullable().optional(),
  projectTitle: z.string().min(1).max(500),
  projectType: z.string().min(1).max(100),
  customServiceDescription: z.string().max(500).nullable().optional(),
  customServices: z.array(z.object({
    name: z.string().min(1).max(255),
    description: z.string().min(1).max(1000),
  })).optional(),
  projectScope: z.string().min(10).max(5000),
  budgetAmount: z.number().positive().nullable().optional(),
  // UI sends values like "Fixed Price" / "Hourly" – we only use this for wording,
  // so accept any short string instead of a strict enum.
  budgetType: z.string().max(50).nullable().optional(),
  currency: z.string().length(3).default("USD"),
  timeline: z.string().max(255).nullable().optional(),
  // Accept simple dates like "dd-mm-yyyy" or "yyyy-mm-dd" from the UI;
  // we convert to ISO in the API route.
  startDate: z.string().max(50).nullable().optional(),
  paymentTerms: z.string().max(255).nullable().optional(),
  tone: z.enum(["professional", "friendly", "formal", "casual"]).optional(),
  sections: z.array(z.string()).optional(),
  additionalContext: z.string().max(5000).nullable().optional(),
  // Same as startDate: allow simple date strings, convert server-side.
  expiryDate: z.string().max(50).nullable().optional(),
  lineItemsEnabled: z.boolean().default(false),
  lineItems: z.array(z.object({
    item_name: z.string().min(1).max(255),
    description: z.string().max(1000).nullable().optional(),
    quantity: z.number().positive(),
    unit: z.string().min(1).max(50),
    rate: z.number().min(0),
    is_optional: z.boolean().default(false),
  })).optional(),
  subtotal: z.number().min(0).optional(),
  discountPercent: z.number().min(0).max(100).optional(),
  taxPercent: z.number().min(0).max(100).optional(),
  grandTotal: z.number().min(0).optional(),
}).refine(
  (data) => {
    // If lineItemsEnabled is false, budgetAmount is required
    if (!data.lineItemsEnabled && !data.budgetAmount) {
      return false;
    }
    return true;
  },
  {
    message: "Budget amount is required when line items are disabled",
    path: ["budgetAmount"],
  }
);

export type ProposalGenerate = z.infer<typeof proposalGenerateSchema>;
