import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PostHogProvider } from "@/app/providers/posthog-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { businessSchema } from "@/lib/seo";
import { WhatsAppWidget } from "@/components/WhatsAppButton";

const ProductChatbot = dynamic(() => import("@/components/ProductChatbot"), { ssr: false });
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.com";

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    template: "%s | Proposar",
    default: "Proposar — AI Proposal Generator for Freelancers & Agencies",
  },
  description: "Create winning client proposals in 60 seconds with AI. Trusted by freelancers in USA, UK, Australia & Canada. Smart follow-ups, open tracking, and one-click accept. Free 14-day trial.",
  keywords: [
    "proposal generator",
    "AI proposal writer", 
    "freelance proposal software",
    "client proposal tool",
    "proposal maker",
    "business proposal generator",
    "proposal software for freelancers",
    "online proposal tool",
    "proposal tracking software",
    "AI proposal generator free",
    "best proposal software 2025",
    "proposal writing tool",
    "freelancer proposal app",
    "agency proposal software",
    "proposal follow up tool",
  ],
  authors: [{ name: "Proposar", url: APP_URL }],
  creator: "Proposar",
  publisher: "Proposar",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Proposar",
    title: "Proposar — AI Proposal Generator for Freelancers",
    description: "Stop spending hours writing proposals. Proposar AI writes them in 60 seconds. Smart follow-ups, open tracking, one-click accept.",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Proposar — AI Proposal Generator",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Proposar — AI Proposal Generator for Freelancers",
    description: "Write winning proposals in 60 seconds with AI.",
    site: "@ProposarHQ",
    creator: "@ProposarHQ",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: APP_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "hIRaA0SZL0vCOvWzVqYNhtNxwMYBnzShcihekS76wjc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Proposar",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web Browser",
        url: APP_URL,
        description: "AI-powered proposal generator for freelancers and agencies. Create winning proposals in 60 seconds.",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: "19",
          highPrice: "79",
          offerCount: "3",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "847",
          bestRating: "5",
        },
        featureList: [
          "AI proposal generation in 60 seconds",
          "Email and WhatsApp sending",
          "Proposal open tracking",
          "Smart follow-up sequences",
          "Client accept flow",
          "PDF export with branding",
          "Win rate analytics",
        ],
      },
      {
        "@type": "Organization",
        name: "Proposar",
        url: APP_URL,
        logo: `${APP_URL}/logo.png`,
        sameAs: [
          "https://twitter.com/proposar_io",
          "https://linkedin.com/company/proposar",
        ],
      },
      {
        "@type": "WebSite",
        url: APP_URL,
        name: "Proposar",
        potentialAction: {
          "@type": "SearchAction",
          target: `${APP_URL}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      businessSchema,
    ],
  };

  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <PostHogProvider>
          <LanguageProvider>
            {children}
            <ProductChatbot />
            <WhatsAppWidget />
            <Analytics />
          </LanguageProvider>
        </PostHogProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
