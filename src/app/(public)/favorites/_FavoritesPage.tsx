'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import { useFavorites } from '@/hooks/useFavorites';
import { Heart, ArrowLeft } from 'lucide-react';

interface ImageMeta {
  url: string;
  alt: string;
  filename: string;
}

interface Property {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  category: string;
  type: string;
  status: string;
  image_url: string;
  beds?: number | null;
  baths?: number | null;
  area?: string | null;
  image_metadata?: ImageMeta[] | null;
}

export default function FavoritesPage({ initialProperties }: { initialProperties: Property[] }) {
  const { favorites } = useFavorites();

  const favoriteProperties = useMemo(
    () => initialProperties.filter(p => favorites.includes(p.id)),
    [initialProperties, favorites]
  );

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" /> Back to Properties
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">My Favorites</h1>
          <p className="text-lg text-gray-600 mt-2">
            {favoriteProperties.length === 0
              ? 'You haven\'t saved any favorites yet.'
              : `${favoriteProperties.length} saved ${favoriteProperties.length === 1 ? 'property' : 'properties'}`}
          </p>
        </div>

        {favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start browsing our listings and tap the heart icon to save your favorite properties.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition-colors shadow-sm"
            >
              Browse Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
