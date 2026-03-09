import { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.io";

const staticPages = [
  "changelog", "roadmap", "blog", "help", "video-tutorials", "api-docs", "affiliate",
  "about", "careers", "privacy", "terms", "contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/signup`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    ...staticPages.map((path) => ({
      url: `${baseUrl}/${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  // Add blog posts to sitemap
  try {
    const posts = await getAllBlogPosts();
    const blogEntries = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
    entries.push(...blogEntries);
  } catch (error) {
    console.error("Error fetching blog posts for sitemap:", error);
  }

  return entries;
}
