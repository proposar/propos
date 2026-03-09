import { StaticPageLayout } from "@/components/landing/StaticPageLayout";

export const metadata = { title: "Video Tutorials", description: "Learn Proposar with video guides." };

export default function VideoTutorialsPage() {
  return (
    <StaticPageLayout title="Video Tutorials" description="Step-by-step video guides to get the most out of Proposar.">
      <p className="text-[#888890]">Short videos on creating proposals, sharing with clients, and tracking results. Coming soon.</p>
    </StaticPageLayout>
  );
}
