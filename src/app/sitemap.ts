import { MetadataRoute } from 'next';
import sql from '@/lib/db';
import { getBaseUrl } from '@/lib/config';

const BASE_URL = getBaseUrl();

// Real dates for static pages — only update when content actually changes
const STATIC_DATES = {
  home:         new Date('2026-06-19'),
  properties:   new Date('2026-06-19'),
  about:        new Date('2026-06-19'),
  contact:      new Date('2026-06-19'),
  testimonials: new Date('2026-06-19'),
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                          lastModified: STATIC_DATES.home,         changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/properties`,          lastModified: STATIC_DATES.properties,   changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/about`,               lastModified: STATIC_DATES.about,        changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`,             lastModified: STATIC_DATES.contact,      changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/testimonials`,        lastModified: STATIC_DATES.testimonials, changeFrequency: 'monthly', priority: 0.6 },
    // /favorites intentionally excluded — client-only page with no crawlable content
  ];

  let propertyPages: MetadataRoute.Sitemap = [];
  let testimonialPages: MetadataRoute.Sitemap = [];

  try {
    const rows = await sql`SELECT id, updated_at FROM properties ORDER BY created_at DESC LIMIT 500`;
    const properties = rows as unknown as { id: string; updated_at: string }[];
    propertyPages = properties.map((p) => ({
      url: `${BASE_URL}/properties/${p.id}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const tRows = await sql`SELECT id, updated_at FROM testimonials WHERE approved = true ORDER BY updated_at DESC LIMIT 500`;
    const testimonials = tRows as unknown as { id: string; updated_at: string }[];
    testimonialPages = testimonials.map((t) => ({
      url: `${BASE_URL}/testimonials/${t.id}`,
      lastModified: new Date(t.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));
  } catch {
    // DB unavailable at build time — return only static pages
  }

  return [...staticPages, ...propertyPages, ...testimonialPages];
}
