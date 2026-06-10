import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllProperties } from '@/lib/repositories/properties';
import FavoritesPage from './_FavoritesPage';

export const metadata: Metadata = {
  title: 'My Favorites',
  description: 'View your saved favorite properties in Fort Portal. Browse homes, lands, plots, cars and motorcycles you have bookmarked for quick access.',
  robots: { index: false },
  alternates: { canonical: '/favorites' },
};

export default async function Page() {
  const properties = await getAllProperties();

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 py-12"><div className="max-w-7xl mx-auto px-4 text-center text-gray-500">Loading favorites...</div></div>}>
      <FavoritesPage initialProperties={properties} />
    </Suspense>
  );
}
