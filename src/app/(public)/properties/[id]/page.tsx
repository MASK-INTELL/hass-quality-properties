import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import sql from '@/lib/db';
import { getPropertyById, getSimilarProperties } from '@/lib/repositories/properties';
import Breadcrumbs from '@/components/Breadcrumbs';
import PropertyDetailClient from './_PropertyDetailClient';

export const revalidate = 3600;

const BASE_URL = 'https://hass-quality-properties.vercel.app';

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

  const title = `${property.title} - ${property.price}`;
  const description = property.description.slice(0, 160);
  const imageUrl = property.images?.[0] || property.image_url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/properties/${id}`,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: property.title }] : undefined,
    },
    twitter: {
      title,
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

  const similarProperties = await getSimilarProperties(property.category, id, 3);

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
