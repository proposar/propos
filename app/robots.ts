import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/dashboard/*", "/proposals/*", "/clients/*", "/templates/*", "/settings", "/onboarding", "/api/"],
        crawlDelay: 0,
      },
      {
        userAgent: "*",
        allow: ["/", "/blog/", "/api-docs/", "/help/"],
        disallow: ["/dashboard/*", "/proposals/*", "/clients/*", "/templates/*", "/settings", "/onboarding", "/api/"],
        crawlDelay: 1,
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
    ],
  };
}
