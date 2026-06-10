import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllProperties } from '@/lib/repositories/properties';
import PropertiesPage from './_PropertiesPage';

export const metadata: Metadata = {
  title: 'Browse Properties',
  description: 'Explore our portfolio of houses, apartments, land, commercial properties, vehicles and motorcycles for sale or rent in Fort Portal, Uganda.',
  openGraph: {
    title: 'Properties for Sale & Rent | Hass Properties',
    description: 'Browse our complete listings of homes, lands, plots, cars and motorcycles in Fort Portal.',
    url: '/properties',
  },
  twitter: {
    title: 'Properties for Sale & Rent | Hass Properties',
    description: 'Browse our complete listings of homes, lands, plots, cars and motorcycles in Fort Portal.',
  },
  alternates: { canonical: '/properties' },
};

export default async function Page() {
  const properties = await getAllProperties();

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 py-12"><div className="max-w-7xl mx-auto px-4 text-center text-gray-500">Loading properties...</div></div>}>
      <PropertiesPage initialProperties={properties} />
    </Suspense>
  );
}
