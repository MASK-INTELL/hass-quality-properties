import { MetadataRoute } from 'next';
import sql from '@/lib/db';

const BASE_URL = 'https://hass-quality-properties.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/properties`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/testimonials`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  let propertyPages: MetadataRoute.Sitemap = [];
  try {
    const rows = await sql`SELECT id, updated_at FROM properties ORDER BY created_at DESC LIMIT 500`;
    const properties = rows as unknown as { id: string; updated_at: string }[];
    propertyPages = properties.map((p) => ({
      url: `${BASE_URL}/properties/${p.id}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    // DB unavailable at build time — return only static pages
  }

  return [...staticPages, ...propertyPages];
}
