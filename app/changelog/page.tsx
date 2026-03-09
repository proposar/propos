import { StaticPageLayout } from "@/components/landing/StaticPageLayout";

export const metadata = { title: "Changelog", description: "What&apos;s new in Proposar." };

export default function ChangelogPage() {
  return (
    <StaticPageLayout title="Changelog" description="Latest updates and improvements to Proposar.">
      <p className="text-[#888890]">We&apos;ll share product updates, new features, and improvements here. Check back soon.</p>
    </StaticPageLayout>
  );
}
