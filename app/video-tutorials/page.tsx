import { StaticPageLayout } from "@/components/landing/StaticPageLayout";

import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata(
  "Video Tutorials — Learn Proposar",
  "Master Proposar with our step-by-step video guides. Learn how to create, customize, and track proposals.",
  [
    "proposar video tutorials",
    "video guides",
    "how to videos",
    "proposar tutorial",
    "proposar training",
    "proposar documentation",
  ],
  "/video-tutorials"
);

export default function VideoTutorialsPage() {
  return (
    <StaticPageLayout title="Video Tutorials" description="Step-by-step video guides to get the most out of Proposar.">
      <p className="text-[#888890]">Short videos on creating proposals, sharing with clients, and tracking results. Coming soon.</p>
    </StaticPageLayout>
  );
}
