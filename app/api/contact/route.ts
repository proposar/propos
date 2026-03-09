import { NextResponse } from "next/server";
import { z } from "zod";
import { resend } from "@/lib/resend";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email required"),
  subject: z.string().min(1).max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

const FROM = process.env.RESEND_FROM_EMAIL ?? "Proposar <hello@proposar.com>";
const SUPPORT_EMAIL = process.env.CONTACT_EMAIL ?? "support@proposar.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { name, email, subject, message } = parsed.data;

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith("re_placeholder")) {
      return NextResponse.json(
        { error: "Contact form not configured. Email support@proposar.com directly." },
        { status: 503 }
      );
    }

    const { error } = await resend.emails.send({
      from: FROM,
      to: [SUPPORT_EMAIL],
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    if (error) throw error;
    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Try emailing directly." },
      { status: 500 }
    );
  }
}
