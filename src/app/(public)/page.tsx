import type { Metadata } from 'next';
import HomePage from './_HomePage';
import { getFeaturedProperties, getPropertiesGallery } from '@/lib/repositories/properties';
import { getBaseUrl } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Hass Quality Properties - Homes, Lands, Plots, Cars & Rentals in Fort Portal',
  description: 'Find your dream property in Fort Portal Tourism City. Browse houses, land, apartments, commercial properties, cars and motorcycles for sale and rent.',
  openGraph: {
    title: 'Hass Quality Properties - Fort Portal Properties',
    description: 'Find your dream property in Fort Portal Tourism City. Browse houses, land, apartments, commercial properties, cars and motorcycles.',
    url: '/',
  },
  twitter: {
    title: 'Hass Quality Properties - Fort Portal Properties',
    description: 'Find your dream property in Fort Portal Tourism City.',
  },
  alternates: { canonical: '/' },
};

export const revalidate = 3600;

const baseUrl = getBaseUrl();
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Hass Quality Properties',
  image: `${baseUrl}/logo.png`,
  url: baseUrl,
  telephone: '+256791715573',
  email: 'hassqualityproperties@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Fort Portal Tourism City',
    addressCountry: 'UG',
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '18:00' },
  ],
  areaServed: 'Fort Portal, Uganda',
  description: 'Premier property company in Fort Portal Tourism City, Uganda specializing in homes, lands, plots, cars, and motorcycles.',
};

export default async function Page() {
  const [featured, gallery] = await Promise.all([
    getFeaturedProperties(),
    getPropertiesGallery(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <HomePage featuredProperties={featured} galleryProperties={gallery} />
    </>
  );
}
