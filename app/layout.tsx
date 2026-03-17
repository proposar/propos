import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PostHogProvider } from "@/app/providers/posthog-provider";
import { businessSchema } from "@/lib/seo";

const ProductChatbot = dynamic(() => import("@/components/ProductChatbot"), { ssr: false });
const NPSSurvey = dynamic(() => import("@/components/NPSSurvey"), { ssr: false });
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

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Proposar — AI Proposal Generator for Freelancers & Agencies",
    template: "%s | Proposar",
  },
  description:
    "Generate winning client proposals in 60 seconds with AI. Trusted by 2,000+ freelancers. Increase close rates, track opens, get paid faster.",
  keywords: [
    "proposal generator",
    "AI proposal generator",
    "freelance proposal software",
    "proposal writing tool",
    "client proposal template",
    "proposal automation",
    "freelancer tools",
    "agency proposal software",
  ],
  authors: [{ name: "Proposar" }],
  creator: "Proposar",
  publisher: "Proposar",
  icons: {
    icon: "/landscape.svg",
    apple: "/landscape.svg",
  },
  verification: {
    google: "0rLRsbPbVjLe39eSl-S93gbNe69cLmMKLDiwHG1lJsM",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Proposar",
    title: "Proposar — AI Proposal Generator for Freelancers & Agencies",
    description: "Generate winning client proposals in 60 seconds with AI. Trusted by 2,000+ freelancers.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Proposar AI Proposal Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Proposar — AI Proposal Generator",
    description: "Generate winning proposals in 60 seconds with AI. Track opens, close faster.",
    creator: "@proposar_io",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large" as any,
    "max-snippet": -1 as any,
    "max-video-preview": -1 as any,
  },
  alternates: {
    canonical: APP_URL,
    languages: {
      "en-US": APP_URL,
    },
  },
  category: "Business",
  classification: "Business Software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Proposar",
      url: "https://proposar.io",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://proposar.io/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    businessSchema,
  ];

  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        {jsonLd.map((schema, idx) => (
          <script
            key={idx}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <PostHogProvider>
          {children}
          <ProductChatbot />
          <NPSSurvey />
          <Analytics />
        </PostHogProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
