import { HelpContent } from '@/components/HelpContent';

import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata(
  "Help Center & FAQ — Proposar Support",
  "Get answers to common questions about Proposar. Learn how to create proposals, track analytics, customize templates, and more.",
  [
    "proposar help",
    "proposal generator help",
    "how to use proposar",
    "proposar faq",
    "proposal software support",
    "proposar tutorial",
  ],
  "/help"
);

export default function HelpPage() {
  return <HelpContent />;
}
