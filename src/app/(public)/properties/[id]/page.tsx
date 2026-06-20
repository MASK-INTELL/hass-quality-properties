import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import sql from '@/lib/db';
import { getPropertyById, getSimilarProperties } from '@/lib/repositories/properties';
import Breadcrumbs from '@/components/Breadcrumbs';
import PropertyDetailClient from './_PropertyDetailClient';
import { getBaseUrl } from '@/lib/config';

export const revalidate = 3600;

const BASE_URL = getBaseUrl();

// Keep SEO title under 50 chars so "| Hass Properties" keeps total under 70
function seoTitle(str: string, max = 50): string {
  if (str.length <= max) return str;
  return str.slice(0, max).trimEnd() + '…';
}

export async function generateStaticParams() {
  const rows = await sql`SELECT id FROM properties ORDER BY created_at DESC LIMIT 500`;
  const properties = rows as unknown as { id: string }[];
  return properties.map(p => ({ id: p.id }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return { title: 'Property Not Found' };
  }

  const title = seoTitle(`${property.title} — ${property.location}`);
  const description = property.description.slice(0, 155).trimEnd() + (property.description.length > 155 ? '…' : '');
  const imageUrl = property.images?.[0] || property.image_url;

  return {
    title,
    description,
    openGraph: {
      title: `${property.title} — ${property.price}`,
      description,
      url: `/properties/${id}`,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: property.title }] : undefined,
    },
    twitter: {
      title: `${property.title} — ${property.price}`,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: { canonical: `/properties/${id}` },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  const similarProperties = await getSimilarProperties(property.category, property.location, id);

  const images = property.images?.length ? property.images : (property.image_url ? [property.image_url] : []);
  const mainImage = images[0] || '/logo.png';

  const jsonLd = ['Homes', 'Lands', 'Plots', 'Rentals'].includes(property.category)
    ? {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        name: property.title,
        description: property.description,
        url: `${BASE_URL}/properties/${id}`,
        image: images.length > 0 ? images : [mainImage],
        offers: {
          '@type': 'Offer',
          price: property.price.replace(/[^0-9.]/g, ''),
          priceCurrency: 'UGX',
          availability: 'https://schema.org/InStock',
        },
        location: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: property.location, addressCountry: 'UG' } },
        ...(property.beds ? { numberOfBedrooms: property.beds } : {}),
        ...(property.baths ? { numberOfBathrooms: property.baths } : {}),
        ...(property.area ? { floorSize: { '@type': 'QuantitativeValue', value: property.area } } : {}),
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: property.title,
        description: property.description,
        image: images.length > 0 ? images : [mainImage],
        offers: {
          '@type': 'Offer',
          price: property.price.replace(/[^0-9.]/g, ''),
          priceCurrency: 'UGX',
          availability: 'https://schema.org/InStock',
        },
        ...(property.make || property.model ? { brand: { '@type': 'Brand', name: `${property.make || ''} ${property.model || ''}`.trim() } } : {}),
      };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Properties', href: '/properties' },
          { label: property.title },
        ]}
      />
      <PropertyDetailClient property={property as any} similarProperties={similarProperties as any} />
    </>
  );
}
