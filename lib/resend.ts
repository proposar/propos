import { Resend } from "resend";

function createResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.startsWith("re_placeholder") || key.length < 10) {
    console.error("[Resend] API key not configured. Emails will fail.");
    // Return real Resend instance but it will fail with invalid key
    return new Resend("re_default_invalid_key");
  }
  return new Resend(key);
}
export const resend = createResend();

const FROM = process.env.RESEND_FROM_EMAIL ?? "Proposar <hello@proposar.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.io";
const UNSUBSCRIBE_URL = `${APP_URL}/settings?tab=notifications`;

function baseLayout(html: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proposar</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',system-ui,sans-serif;background:#0a0a14;color:#faf8f4;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-family:Georgia,serif;font-size:24px;font-weight:bold;color:#D4AF37;">Proposar</span>
    </div>
    <div style="background:#12121e;border:1px solid #1e1e2e;border-radius:12px;padding:32px;">
      ${html}
    </div>
    <p style="text-align:center;font-size:11px;color:#888890;margin-top:24px;">
      <a href="${UNSUBSCRIBE_URL}" style="color:#888890;">Manage notification preferences</a>
    </p>
  </div>
</body>
</html>`;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: any[];
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.startsWith("re_placeholder") || key.length < 10) {
    throw new Error("[Resend] API key not configured. Check .env.local for RESEND_API_KEY.");
  }
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject,
    html,
    text: text ?? undefined,
    attachments,
  });
  if (error) {
    console.error("[Resend] Send error:", error);
    throw new Error(`Email send failed: ${JSON.stringify(error)}`);
  }
  return data;
}

// 1. Welcome email (on signup)
export async function sendWelcomeEmail(to: string, name?: string) {
  const firstName = name?.split(" ")[0] ?? "there";
  const html = baseLayout(`
    <h1 style="font-size:22px;margin:0 0 16px;color:#faf8f4;">Welcome to Proposar — let's win your first deal 🚀</h1>
    <p style="margin:0 0 24px;line-height:1.6;color:#c4c4cc;">Hi ${firstName},</p>
    <p style="margin:0 0 24px;line-height:1.6;color:#c4c4cc;">You're in. Here's how to get started in 3 steps:</p>
    <ol style="margin:0 0 24px;padding-left:20px;color:#c4c4cc;line-height:1.8;">
      <li><strong>Complete your profile</strong> — Add your business name and branding so proposals look professional.</li>
      <li><strong>Create your first proposal</strong> — Our AI will draft it in under 60 seconds.</li>
      <li><strong>Share & track</strong> — Send the link to your client and see when they open it.</li>
    </ol>
    <a href="${APP_URL}/dashboard" style="display:inline-block;background:#D4AF37;color:#0a0a14;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Go to Dashboard →</a>
    <p style="margin:32px 0 0;padding-top:24px;border-top:1px solid #1e1e2e;font-size:14px;color:#888890;">— The Proposar team</p>
  `);
  return sendEmail({ to, subject: "Welcome to Proposar — let's win your first deal 🚀", html });
}

// 2. Proposal sent confirmation (to freelancer)
export async function sendProposalSentConfirmation(to: string, clientName: string, proposalLink: string) {
  const html = baseLayout(`
    <h1 style="font-size:22px;margin:0 0 16px;color:#faf8f4;">Proposal sent to ${clientName} ✓</h1>
    <p style="margin:0 0 24px;line-height:1.6;color:#c4c4cc;">Your proposal has been sent. We'll notify you when they open it.</p>
    <p style="margin:0 0 24px;line-height:1.6;color:#c4c4cc;"><a href="${proposalLink}" style="color:#D4AF37;">View proposal</a></p>
  `);
  return sendEmail({ to, subject: `Proposal sent to ${clientName} ✓`, html });
}

// 3. Proposal viewed alert (to freelancer)
export async function sendProposalViewedAlert(
  to: string,
  clientName: string,
  proposalTitle: string,
  viewTime: string,
  proposalLink: string
) {
  const html = baseLayout(`
    <h1 style="font-size:22px;margin:0 0 16px;color:#faf8f4;">🔔 ${clientName} just opened your proposal</h1>
    <p style="margin:0 0 24px;line-height:1.6;color:#c4c4cc;">They viewed <strong>${proposalTitle}</strong>${viewTime ? ` and spent about ${viewTime} reading it.` : "."}</p>
    <a href="${proposalLink}" style="display:inline-block;background:#D4AF37;color:#0a0a14;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Follow up now →</a>
  `);
  return sendEmail({ to, subject: `🔔 ${clientName} just opened your proposal`, html });
}

// 4. Proposal accepted (to freelancer)
export async function sendProposalAcceptedEmail(
  to: string,
  clientName: string,
  amount: string,
  proposalTitle: string,
  proposalLink: string
) {
  const proposalId = proposalLink.split("/").pop() ?? "";
  const contractsLink = `${APP_URL}/contracts/new?proposalId=${proposalId}`;
  const invoicesLink = `${APP_URL}/invoices/new?proposalId=${proposalId}`;
  const html = baseLayout(`
    <h1 style="font-size:22px;margin:0 0 16px;color:#faf8f4;">🎉 ${clientName} accepted your proposal! ${amount}</h1>
    <p style="margin:0 0 24px;line-height:1.6;color:#c4c4cc;">Congratulations! <strong>${proposalTitle}</strong> has been accepted.</p>
    <p style="margin:0 0 16px;line-height:1.6;color:#c4c4cc;">What would you like to do next?</p>
    <div style="margin:0 0 24px;display:flex;flex-direction:column;gap:12px;">
      <a href="${contractsLink}" style="display:inline-block;background:#D4AF37;color:#0a0a14;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Send Contract →</a>
      <a href="${invoicesLink}" style="display:inline-block;border:1px solid #D4AF37;color:#D4AF37;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Send Invoice →</a>
      <a href="${proposalLink}" style="display:inline-block;text-decoration:none;color:#888890;font-size:14px;">View in Dashboard →</a>
    </div>
  `);
  return sendEmail({ to, subject: `🎉 ${clientName} accepted your proposal! ${amount}`, html });
}

// 5. Proposal declined (to freelancer)
export async function sendProposalDeclinedEmail(
  to: string,
  clientName: string,
  proposalTitle: string,
  reason?: string,
  newProposalLink?: string
) {
  const html = baseLayout(`
    <h1 style="font-size:22px;margin:0 0 16px;color:#faf8f4;">${clientName} declined your proposal</h1>
    <p style="margin:0 0 24px;line-height:1.6;color:#c4c4cc;">Unfortunately, <strong>${proposalTitle}</strong> was not accepted.${reason ? ` Reason: ${reason}` : ""}</p>
    <p style="margin:0 0 24px;line-height:1.6;color:#c4c4cc;">Every "no" gets you closer to a "yes." Ready to create your next proposal?</p>
    ${newProposalLink ? `<a href="${newProposalLink}" style="display:inline-block;background:#D4AF37;color:#0a0a14;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Create a new proposal →</a>` : ""}
  `);
  return sendEmail({ to, subject: `${clientName} declined your proposal`, html });
}

// WhatsApp follow-up templates by day
function getWhatsAppFollowUpTemplate(
  clientName: string,
  proposalLink: string,
  daysSinceSent: number
): { text: string; label: string } {
  const name = clientName || "there";
  if (daysSinceSent <= 5) {
    return {
      label: "Day 3 template",
      text: `Hi ${name}, just checking you had a chance to look at the proposal I sent? Happy to answer any questions 🙂\n${proposalLink}`,
    };
  }
  if (daysSinceSent <= 10) {
    return {
      label: "Day 7 template",
      text: `Hey ${name}, I wanted to follow up on the proposal. Is this still something you'd like to move forward with?\n${proposalLink}`,
    };
  }
  return {
    label: "Day 14 template",
    text: `Hi ${name}, the proposal expires in 48 hours. Let me know if you'd like to proceed or if the timing doesn't work right now.\n${proposalLink}`,
  };
}

// 6. Follow-up reminder (to freelancer)
export async function sendFollowUpReminder(
  to: string,
  clientName: string,
  proposalTitle: string,
  daysSinceSent: number,
  proposalLink: string
) {
  const wa = getWhatsAppFollowUpTemplate(clientName, proposalLink, daysSinceSent);
  const waUrl = `https://wa.me/?text=${encodeURIComponent(wa.text)}`;

  const html = baseLayout(`
    <h1 style="font-size:22px;margin:0 0 16px;color:#faf8f4;">⏰ Time to follow up with ${clientName}</h1>
    <p style="margin:0 0 24px;line-height:1.6;color:#c4c4cc;">It's been ${daysSinceSent} day${daysSinceSent !== 1 ? "s" : ""} since you sent <strong>${proposalTitle}</strong>.</p>
    <p style="margin:0 0 24px;line-height:1.6;color:#c4c4cc;">Quick tip: A friendly follow-up often moves deals forward. Reference something specific from your proposal.</p>
    <a href="${proposalLink}" style="display:inline-block;background:#D4AF37;color:#0a0a14;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View proposal →</a>

    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #1e1e2e;">
      <p style="font-size:16px;font-weight:600;color:#faf8f4;margin:0 0 12px;">📱 Send a WhatsApp nudge:</p>
      <p style="margin:0 0 12px;font-size:14px;color:#c4c4cc;white-space:pre-wrap;">${wa.text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
      <a href="${waUrl}" style="display:inline-block;background:#25d366;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Copy for WhatsApp</a>
    </div>
  `);
  return sendEmail({ to, subject: `⏰ Time to follow up with ${clientName}`, html });
}

export function renderProposalEmailHtml(
  clientName: string,
  projectTitle: string,
  personalMessage: string,
  proposalLink: string,
  freelancerName?: string,
  shareId?: string
) {
  const signOff = freelancerName ?? "Your freelancer";
  return baseLayout(`
    <h1 style="font-size:22px;margin:0 0 16px;color:#faf8f4;">Business Proposal: ${projectTitle}</h1>
    <p style="margin:0 0 16px;line-height:1.6;color:#c4c4cc;">Hi ${clientName},</p>
    ${personalMessage ? `<p style="margin:0 0 24px;line-height:1.6;color:#c4c4cc;white-space:pre-wrap;">${personalMessage}</p>` : ""}
    <div style="background:#0a0a14;border:1px solid #1e1e2e;border-radius:8px;padding:20px;margin:24px 0;">
      <p style="margin:0 0 8px;font-weight:600;color:#faf8f4;">${projectTitle}</p>
      <p style="margin:0;font-size:14px;color:#888890;">Your personalized proposal is ready to view.</p>
    </div>
    <a href="${proposalLink}" style="display:inline-block;background:#D4AF37;color:#0a0a14;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View Full Proposal →</a>
    <p style="margin:24px 0 0;font-size:14px;color:#888890;">Best,<br/>${signOff}</p>
    ${shareId ? `<img src="${APP_URL}/api/track/open?proposal=${encodeURIComponent(shareId)}" width="1" height="1" alt="" style="display:block;border:0;" />` : ""}
  `);
}

// 7. Proposal email to client (from freelancer) — includes 1x1 tracking pixel for email-open detection
export async function sendProposalToClient(
  to: string,
  clientName: string,
  projectTitle: string,
  personalMessage: string,
  proposalLink: string,
  freelancerName?: string,
  attachments?: any[],
  shareId?: string
) {
  const html = renderProposalEmailHtml(clientName, projectTitle, personalMessage, proposalLink, freelancerName, shareId);
  return sendEmail({ to, subject: `Business Proposal: ${projectTitle}`, html, attachments });
}

// 7.5 Proposal expiry reminder (to client)
export async function sendExpiryReminderEmail(
  to: string,
  clientName: string,
  projectTitle: string,
  proposalLink: string,
  freelancerName?: string
) {
  const signOff = freelancerName ?? "Your freelancer";
  const html = baseLayout(`
    <h1 style="font-size:22px;margin:0 0 16px;color:#faf8f4;">Action Needed: ${projectTitle}</h1>
    <p style="margin:0 0 16px;line-height:1.6;color:#c4c4cc;">Hi ${clientName},</p>
    <p style="margin:0 0 24px;line-height:1.6;color:#c4c4cc;">This is a quick reminder that your proposal for <strong>${projectTitle}</strong> will expire in less than 48 hours.</p>
    <div style="background:#0a0a14;border:1px solid #1e1e2e;border-radius:8px;padding:20px;margin:24px 0;">
      <p style="margin:0 0 8px;font-weight:600;color:#faf8f4;">Action Required</p>
      <p style="margin:0;font-size:14px;color:#888890;">Please review and accept the proposal to lock in your rates and timeline.</p>
    </div>
    <a href="${proposalLink}" style="display:inline-block;background:#D4AF37;color:#0a0a14;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Review Proposal →</a>
    <p style="margin:24px 0 0;font-size:14px;color:#888890;">Best,<br/>${signOff}</p>
  `);
  return sendEmail({ to, subject: `Reminder: Proposal for ${projectTitle} is expiring soon`, html });
}

// 8. Automated follow-up email (to client)
export async function sendFollowUpEmail(
  to: string,
  clientName: string,
  projectTitle: string,
  proposalLink: string,
  freelancerName?: string,
  replyToEmail?: string
) {
  const signOff = freelancerName ?? "Your freelancer";
  const html = baseLayout(`
    <h1 style="font-size:22px;margin:0 0 16px;color:#faf8f4;">Following up on: ${projectTitle}</h1>
    <p style="margin:0 0 16px;line-height:1.6;color:#c4c4cc;">Hi ${clientName},</p>
    <p style="margin:0 0 24px;line-height:1.6;color:#c4c4cc;">I wanted to check in on the proposal I shared with you. Have you had a chance to review it? I'm here to answer any questions or discuss next steps.</p>
    <div style="background:#0a0a14;border:1px solid #1e1e2e;border-radius:8px;padding:20px;margin:24px 0;">
      <p style="margin:0 0 8px;font-weight:600;color:#faf8f4;font-size:16px;">📑 ${projectTitle}</p>
      <p style="margin:0;font-size:14px;color:#888890;">Proposal is ready to review and discuss.</p>
    </div>
    <a href="${proposalLink}" style="display:inline-block;background:#D4AF37;color:#0a0a14;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Review Proposal →</a>
    <p style="margin:24px 0 0;font-size:14px;color:#888890;">Looking forward to working together,<br/>${signOff}</p>
  `);
  const payload: Parameters<typeof resend.emails.send>[0] = {
    from: FROM,
    to: [to],
    subject: `Following up: ${projectTitle}`,
    html,
    ...(replyToEmail && { replyTo: replyToEmail }),
  };
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set, skipping follow-up email:", projectTitle);
    return { id: null };
  }
  const { data, error } = await resend.emails.send(payload);
  if (error) throw error;
  return data;
}

// Sequence step email (plain, personal-looking — no Proposar branding)
export async function sendSequenceStepEmail({
  to,
  subject,
  body,
  replyTo,
  proposalLink,
}: {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
  proposalLink: string;
}) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;font-family:Georgia,serif;font-size:16px;line-height:1.6;color:#333;background:#fff;">
  <div style="max-width:560px;margin:0 auto;">
    ${body.split(/\n\n+/).map((p) => `<p style="margin:0 0 16px;">${p.replace(/\n/g, "<br/>")}</p>`).join("")}
    <p style="margin:24px 0 0;"><a href="${proposalLink}" style="color:#666;">View proposal</a></p>
    <p style="margin:32px 0 0;font-size:11px;color:#999;">
      <a href="${UNSUBSCRIBE_URL}" style="color:#999;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`;
  const payload: Parameters<typeof resend.emails.send>[0] = {
    from: FROM,
    to: [to],
    subject,
    html,
    replyTo: replyTo ?? undefined,
  };
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set, skipping sequence email:", subject);
    return { id: null };
  }
  const { data, error } = await resend.emails.send(payload);
  if (error) throw error;
  return data;
}

// 8. Payment failed (to user)
export async function sendPaymentFailedEmail(to: string, portalUrl?: string) {
  const html = baseLayout(`
    <h1 style="font-size:22px;margin:0 0 16px;color:#faf8f4;">Action needed — payment failed for Proposar</h1>
    <p style="margin:0 0 24px;line-height:1.6;color:#c4c4cc;">We couldn't process your last payment. This can happen if your card expired, was declined, or has insufficient funds.</p>
    <p style="margin:0 0 24px;line-height:1.6;color:#c4c4cc;">Please update your billing information to avoid any interruption to your service.</p>
    ${portalUrl ? `<a href="${portalUrl}" style="display:inline-block;background:#D4AF37;color:#0a0a14;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Update billing →</a>` : `<a href="${APP_URL}/settings?tab=billing" style="display:inline-block;background:#D4AF37;color:#0a0a14;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Update billing →</a>`}
  `);
  return sendEmail({ to, subject: "Action needed — payment failed for Proposar", html });
}
