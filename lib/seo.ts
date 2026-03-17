export const seoConfig = {
  siteName: "Proposar",
  siteUrl: "https://proposar.io",
  description: "AI-powered proposal generator for freelancers and agencies. Create winning proposals in 60 seconds. Track opens, close faster, earn more.",
  twitterHandle: "@proposar_io",
};

export const generateMetadata = (
  title: string,
  description: string,
  keywords: string[],
  path: string = "",
  ogImage?: string
) => {
  const fullUrl = `${seoConfig.siteUrl}${path}`;
  
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: seoConfig.siteName,
      type: "website" as const,
      images: [
        {
          url: ogImage || "/opengraph-image",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      creator: seoConfig.twitterHandle,
    },
    alternates: {
      canonical: fullUrl,
    },
  };
};

export const businessSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Proposar",
  url: seoConfig.siteUrl,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: seoConfig.description,
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "0",
    highPrice: "79",
    offerCount: "4",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "1200",
    bestRating: "5",
    worstRating: "1",
  },
  featureList: [
    "AI Proposal Generation",
    "Smart Contracts",
    "WhatsApp Sharing",
    "Open Tracking",
    "Automated Invoicing",
    "Anti-Ghosting Protection"
  ],
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does it take to create a proposal with Proposar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can generate a complete, winning proposal in just 60 seconds using our AI-powered platform.",
      },
    },
    {
      "@type": "Question",
      name: "Can I customize proposals with my branding?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Add your logo, brand colors, and customize every section to match your brand identity.",
      },
    },
    {
      "@type": "Question",
      name: "Is Proposar suitable for freelancers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! Proposar is designed specifically for freelancers and agencies to create professional proposals quickly.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track when clients view my proposals?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you get real-time analytics showing when clients open and interact with your proposals.",
      },
    },
  ],
};

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${seoConfig.siteUrl}${item.url}`,
  })),
});
