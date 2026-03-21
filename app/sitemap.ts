import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://proposar.com';
  const currentDate = new Date();

  // Static pages with priorities
  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${baseUrl}/pricing`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${baseUrl}/features`, priority: 0.8, changeFrequency: 'monthly' },
    
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
    
    // Blog posts (add as you create them)
    { url: `${baseUrl}/blog`, priority: 0.7 },
    
    // Templates
    { url: `${baseUrl}/templates`, priority: 0.8 },
    { url: `${baseUrl}/templates/web-design-proposal`, priority: 0.75 },
    { url: `${baseUrl}/templates/marketing-proposal`, priority: 0.75 },
    { url: `${baseUrl}/templates/seo-proposal`, priority: 0.75 },
    { url: `${baseUrl}/templates/consulting-proposal`, priority: 0.75 },
    { url: `${baseUrl}/templates/development-proposal`, priority: 0.75 },
    
    // Static pages
    { url: `${baseUrl}/about`, priority: 0.5 },
    { url: `${baseUrl}/contact`, priority: 0.4 },
    { url: `${baseUrl}/privacy`, priority: 0.3 },
    { url: `${baseUrl}/terms`, priority: 0.3 },
  ];

  return staticPages.map(page => ({
    url: page.url,
    lastModified: currentDate,
    changeFrequency: (page.changeFrequency || 'monthly') as any,
    priority: page.priority,
  }));
}
