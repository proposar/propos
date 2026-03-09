/**
 * Email system types
 * Shared between API routes and client components
 */

/** Basic email attachment structure (Resend format) */
export interface EmailAttachment {
  filename: string;
  content: Buffer | Uint8Array;
  contentType?: string;
}

/** Generic email send request */
export interface SendEmailRequest {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
}

/** Generic email send response */
export interface SendEmailResponse {
  id: string | null;
  error?: Error;
}

/** Send proposal to client request */
export interface SendProposalEmailRequest {
  to: string;
  subject?: string;
  message?: string;
  proposalId: string;
}

/** Send proposal to client response */
export interface SendProposalEmailResponse {
  sent: boolean;
  error?: string;
}

/** Follow-up reminder email request */
export interface SendFollowUpEmailRequest {
  proposalId: string;
  clientEmail: string;
  clientName: string;
  daysUnopened: number;
}

/** Email template types */
export type EmailTemplateType =
  | "welcome"
  | "proposal_sent"
  | "proposal_sent_confirmation"
  | "proposal_accepted"
  | "proposal_declined"
  | "follow_up"
  | "expiry_reminder"
  | "weekly_summary";

/** Email event for analytics */
export interface EmailEvent {
  type: EmailTemplateType;
  recipientId?: string;
  recipientEmail: string;
  proposalId?: string;
  sentAt: string;
  status: "sent" | "failed" | "bounced" | "opened" | "clicked";
}

/** Transactional email payload (internal) */
export interface EmailPayload {
  messageId: string;
  from: string;
  to: string[];
  subject: string;
  html: string;
  text?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: EmailAttachment[];
  headers?: Record<string, string>;
  createdAt: Date;
}
