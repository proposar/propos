export type SubscriptionPlan = "free" | "starter" | "pro" | "agency";
export type SubscriptionStatus = "free" | "active" | "canceled" | "past_due";
export type ProposalStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "accepted"
  | "declined"
  | "expired";

/** Custom section shape used in proposal.custom_sections */
export interface ProposalSection {
  id: string;
  title: string;
  content: string;
  order?: number;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  business_name: string | null;
  business_type: string | null;
  avatar_url: string | null;
  website: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  currency: string;
  timezone: string;
  bio: string | null;
  signature_text: string | null;
  logo_url: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: SubscriptionStatus;
  subscription_plan: SubscriptionPlan;
  subscription_period_end: string | null;
  proposals_used_this_month: number;
  proposals_reset_date: string | null;
  onboarding_completed: boolean;
  /** Email tracking — prevents duplicate welcome emails (Migration 012) */
  welcome_email_sent: boolean;
  /** Branding & Defaults (Migration 002) */
  brand_color: string;
  default_payment_terms: string | null;
  default_tone: string;
  default_expiry_days: number;
  default_sections: string[] | null;
  auto_follow_up_enabled: boolean;
  auto_follow_up_days: number;
  /** Notification Preferences (Migration 002) */
  notify_proposal_viewed: boolean;
  notify_proposal_accepted: boolean;
  notify_proposal_declined: boolean;
  notify_proposal_expired: boolean;
  notify_weekly_summary: boolean;
  notify_product_updates: boolean;
  /** Referral Program (Migration 012) */
  referral_code: string | null;
  referral_earnings: number;
  referral_count: number;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  industry: string | null;
  country: string | null;
  notes: string | null;
  tags: string[] | null;
  total_proposals: number;
  won_proposals: number;
  total_value: number;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  user_id: string;
  client_id: string | null;
  share_id: string | null;
  title: string;
  project_type: string;
  status: ProposalStatus;
  client_name: string;
  client_email: string | null;
  client_company: string | null;
  project_scope: string;
  budget_amount: number | null;
  budget_currency: string;
  timeline: string | null;
  deliverables: string[] | null;
  additional_notes: string | null;
  generated_content: string | null;
  executive_summary: string | null;
  tone: string;
  template_id: string | null;
  /** Structured additional sections added to a proposal */
  custom_sections: ProposalSection[] | null;
  sent_at: string | null;
  viewed_at: string | null;
  view_count: number;
  last_viewed_at: string | null;
  viewer_ip: string | null;
  accepted_at: string | null;
  declined_at: string | null;
  expires_at: string | null;
  follow_up_sent: boolean;
  follow_up_at: string | null;
  is_template: boolean;
  template_name: string | null;
  generation_model: string | null;
  generation_tokens: number | null;
  subtotal: number | null;
  discount_percent: number | null;
  tax_percent: number | null;
  grand_total: number | null;
  line_items_enabled: boolean;
  expiry_reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProposalLineItem {
  id: string;
  proposal_id: string;
  sort_order: number;
  item_name: string;
  description: string | null;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  is_optional: boolean;
  created_at: string;
}

export interface ProposalView {
  id: string;
  proposal_id: string;
  viewed_at: string;
  ip_address: string | null;
  user_agent: string | null;
  country: string | null;
  city: string | null;
  duration_seconds: number | null;
  scrolled_to_percent: number | null;
}

export interface Template {
  id: string;
  user_id: string | null;
  name: string;
  description: string | null;
  project_type: string | null;
  content: string;
  is_public: boolean;
  is_premium: boolean;
  use_count: number;
  thumbnail_url: string | null;
  tags: string[] | null;
  created_at: string;
}

/** Activity types for audit trail */
export type ActivityEventType =
  | "proposal_created"
  | "proposal_sent"
  | "proposal_viewed"
  | "proposal_accepted"
  | "proposal_declined"
  | "proposal_expired"
  | "template_created"
  | "client_created"
  | "subscription_updated"
  | "profile_updated";

export interface ActivityLog {
  id: string;
  user_id: string | null;
  proposal_id: string | null;
  event_type: ActivityEventType | string;
  metadata: Record<string, unknown>;
  created_at: string;
}

/** Referral system (for growth loop) */
export interface Referral {
  id: string;
  referrer_id: string;
  referral_code: string;
  referee_email: string;
  referee_id: string | null;
  referred_at: string;
  completed_signup_at: string | null;
  completed_upgrade_at: string | null;
  commission_amount: number | null;
  reward_claimed: boolean;
  created_at: string;
  updated_at: string;
}

/** Component-level types */
export interface ProposalFormData {
  clientId?: string;
  clientName: string;
  clientCompany?: string;
  clientEmail?: string;
  industry?: string;
  projectTitle: string;
  projectType: string;
  projectScope: string;
  budgetAmount?: string;
  budgetType?: string;
  currency?: string;
  timeline?: string;
  startDate?: string;
  paymentTerms?: string;
  tone?: string;
  sections?: string[];
  additionalContext?: string;
  expiryDate?: string;
  lineItemsEnabled?: boolean;
  lineItems?: LineItem[];
  subtotal?: number;
  discountPercent?: number;
  taxPercent?: number;
}

export interface LineItem {
  id?: string;
  item_name: string;
  description?: string | null;
  quantity: number;
  unit: string;
  rate: number;
  amount?: number;
  is_optional?: boolean;
}

/** Generic API Response envelope */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
