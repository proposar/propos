import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";
import { StaticPageLayout } from "@/components/landing/StaticPageLayout";

export const metadata: Metadata = generateMetadata(
  "Changelog — Proposar Updates & Improvements",
  "Stay updated on the latest improvements, bug fixes, and new features released for Proposar.",
  [
    "proposar changelog",
    "product updates",
    "new features",
    "bug fixes",
    "version history",
    "proposar improvements",
  ],
  "/changelog"
);

export default function ChangelogPage() {
  return (
    <StaticPageLayout title="Changelog" description="Latest updates and improvements to Proposar.">
      <p className="text-[#888890]">We&apos;ll share product updates, new features, and improvements here. Check back soon.</p>
    </StaticPageLayout>
  );
}
