import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import ProductChatbot from "@/components/ProductChatbot";
import NPSSurvey from "@/components/NPSSurvey";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.io";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Proposar — AI Proposal Generator for Freelancers & Agencies",
    template: "%s | Proposar",
  },
  description:
    "Generate winning client proposals in 60 seconds with AI. Trusted by 2,000+ freelancers. Track opens, close faster, earn more.",
  keywords: ["proposal generator", "freelance proposal software", "AI proposal writer", "client proposal tool"],
  authors: [{ name: "Proposar" }],
  icons: {
    icon: "/proposar-favicon.svg",
    apple: "/proposar-logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Proposar",
    title: "Proposar — AI Proposal Generator for Freelancers & Agencies",
    description: "Generate winning client proposals in 60 seconds with AI. Trusted by 2,000+ freelancers. Track opens, close faster, earn more.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Proposar" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Proposar — AI Proposal Generator for Freelancers & Agencies",
    description: "Generate winning client proposals in 60 seconds with AI. Trusted by 2,000+ freelancers.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: APP_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Proposar",
    applicationCategory: "BusinessApplication",
    description: "AI-powered proposal generator for freelancers and agencies. Create winning proposals in 60 seconds.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <ProductChatbot />
        <NPSSurvey />
        <Analytics />
      </body>
    </html>
  );
}
