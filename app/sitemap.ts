import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://proposar.com';
  const currentDate = new Date();

  // Static pages with priorities
  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${baseUrl}/pricing`, priority: 0.9, changeFrequency: 'monthly' },
    
    // SEO landing pages — HIGH PRIORITY
    { url: `${baseUrl}/ai-proposal-generator`, priority: 0.95 },
    { url: `${baseUrl}/proposal-generator-for-freelancers`, priority: 0.95 },
    { url: `${baseUrl}/free-proposal-template`, priority: 0.9 },
    { url: `${baseUrl}/business-proposal-generator`, priority: 0.9 },
    
    // Comparison pages
    { url: `${baseUrl}/vs/proposify`, priority: 0.85 },
    { url: `${baseUrl}/vs/pandadoc`, priority: 0.85 },
    { url: `${baseUrl}/vs/better-proposals`, priority: 0.85 },
    { url: `${baseUrl}/vs/qwilr`, priority: 0.85 },
    { url: `${baseUrl}/vs/honeybook`, priority: 0.85 },
    { url: `${baseUrl}/vs/bonsai`, priority: 0.8 },
    
    // Industry pages
    { url: `${baseUrl}/for/web-designers`, priority: 0.8 },
    { url: `${baseUrl}/for/developers`, priority: 0.8 },
    { url: `${baseUrl}/for/marketing-agencies`, priority: 0.8 },
    { url: `${baseUrl}/for/consultants`, priority: 0.8 },
    { url: `${baseUrl}/for/copywriters`, priority: 0.8 },
    { url: `${baseUrl}/for/seo-agencies`, priority: 0.8 },
    { url: `${baseUrl}/for/video-producers`, priority: 0.75 },
    { url: `${baseUrl}/for/photographers`, priority: 0.75 },
    
    // Location pages
    { url: `${baseUrl}/for/freelancers-usa`, priority: 0.8 },
    { url: `${baseUrl}/for/freelancers-uk`, priority: 0.8 },
    { url: `${baseUrl}/for/freelancers-australia`, priority: 0.8 },
    { url: `${baseUrl}/for/freelancers-canada`, priority: 0.8 },
    
    // Blog
    { url: `${baseUrl}/blog`, priority: 0.7, changeFrequency: 'weekly' as const },
    
    // Proposal tracking & tools
    { url: `${baseUrl}/proposal-tracking-software`, priority: 0.85 },
    { url: `${baseUrl}/tools/word-count`, priority: 0.75 },
    { url: `${baseUrl}/tools/win-rate`, priority: 0.75 },
    
    // Proposal templates (SEO landing pages)
    { url: `${baseUrl}/proposal-templates`, priority: 0.8 },
    { url: `${baseUrl}/proposal-templates/web-design`, priority: 0.75 },
    { url: `${baseUrl}/proposal-templates/marketing`, priority: 0.75 },
    { url: `${baseUrl}/proposal-templates/seo`, priority: 0.75 },
    { url: `${baseUrl}/proposal-templates/consulting`, priority: 0.75 },
    { url: `${baseUrl}/proposal-templates/developer`, priority: 0.75 },
    { url: `${baseUrl}/proposal-templates/social-media`, priority: 0.75 },
    { url: `${baseUrl}/proposal-templates/copywriting`, priority: 0.75 },
    { url: `${baseUrl}/proposal-templates/branding`, priority: 0.75 },
    { url: `${baseUrl}/proposal-templates/videography`, priority: 0.75 },
    { url: `${baseUrl}/proposal-templates/photography`, priority: 0.75 },
    
    // Static pages
    { url: `${baseUrl}/about`, priority: 0.5 },
    { url: `${baseUrl}/contact`, priority: 0.4 },
    { url: `${baseUrl}/privacy`, priority: 0.3 },
    { url: `${baseUrl}/terms`, priority: 0.3 },
  ];

  const blogPosts = await getAllBlogPosts();
  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages.map((page) => ({
      url: page.url,
      lastModified: currentDate,
      changeFrequency: (page.changeFrequency || 'monthly') as 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
      priority: page.priority,
    })),
    ...blogUrls,
  ];
}
