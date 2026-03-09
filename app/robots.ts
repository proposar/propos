import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/dashboard", "/dashboard/*", "/proposals", "/proposals/*", "/clients", "/clients/*", "/templates", "/templates/*", "/settings", "/onboarding", "/api/"] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
