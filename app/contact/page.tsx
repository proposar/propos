import { StaticPageLayout } from "@/components/landing/StaticPageLayout";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = { title: "Contact", description: "Get in touch with Proposar." };

export default function ContactPage() {
  return (
    <StaticPageLayout title="Contact" description="We'd love to hear from you.">
      <div className="space-y-8">
        <div className="text-[#888890]">
          <p className="mb-4">For support, partnerships, or general inquiries:</p>
          <p className="mb-2"><strong className="text-[#faf8f4]">Email:</strong> hello@proposar.com</p>
          <p>We typically respond within 24–48 hours.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#faf8f4] mb-3">Send us a message</h2>
          <ContactForm />
        </div>
      </div>
    </StaticPageLayout>
  );
}
