'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import { Heart, Home, Car } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

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
  beds?: string;
  baths?: string;
  area?: string;
  image_metadata?: ImageMeta[] | null;
}

export default function Properties() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeCategory = (searchParams.get('category') as 'Real Estate' | 'Vehicles' | 'Rentals' | 'Motorcycles') || 'Real Estate';
  const searchTerm = searchParams.get('search') || '';
  const filterType = searchParams.get('type') || 'All';
  const sortBy = searchParams.get('sort') || 'newest';
  const showFavoritesOnly = searchParams.get('fav') === '1';

  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite } = useFavorites();

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch('/api/properties');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setAllProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const updateParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'All' && value !== 'newest') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const qs = params.toString();
    router.replace(`${pathname}${qs ? '?' + qs : ''}`, { scroll: false });
  }, [searchParams, router, pathname]);

  const parsePrice = (priceStr: string) => {
    const numericStr = priceStr.replace(/[^0-9]/g, '');
    return parseInt(numericStr, 10) || 0;
  };

  const filteredAndSortedProperties = useMemo(() => {
    let result = allProperties.filter(property => {
      let matchesCategory = false;

      if (activeCategory === 'Real Estate') {
        matchesCategory = property.category === 'Real Estate' && property.status === 'For Sale';
      } else if (activeCategory === 'Rentals') {
        matchesCategory = property.status === 'For Rent';
      } else if (activeCategory === 'Vehicles') {
        matchesCategory = property.category === 'Vehicles' && property.type !== 'Motorcycle';
      } else if (activeCategory === 'Motorcycles') {
        matchesCategory = property.type === 'Motorcycle';
      }

      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || property.type === filterType;
      const matchesFavorites = !showFavoritesOnly || isFavorite(property.id);

      return matchesCategory && matchesSearch && matchesType && matchesFavorites;
    });

    result.sort((a, b) => {
      if (sortBy === 'price-low') {
        return parsePrice(a.price) - parsePrice(b.price);
      } else if (sortBy === 'price-high') {
        return parsePrice(b.price) - parsePrice(a.price);
      }
      return 0;
    });

    return result;
  }, [allProperties, activeCategory, searchTerm, filterType, sortBy, showFavoritesOnly, isFavorite]);

  const getPropertyTypes = () => {
    switch (activeCategory) {
      case 'Real Estate':
        return ['All', 'House', 'Land', 'Apartment', 'Commercial'];
      case 'Rentals':
        return ['All', 'House', 'Apartment', 'Commercial'];
      case 'Vehicles':
        return ['All', 'Car', 'Truck'];
      case 'Motorcycles':
        return ['All', 'Motorcycle'];
      default:
        return ['All'];
    }
  };

  const handleCategoryChange = (category: 'Real Estate' | 'Vehicles' | 'Rentals' | 'Motorcycles') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', category);
    params.delete('type');
    const qs = params.toString();
    router.replace(`${pathname}${qs ? '?' + qs : ''}`, { scroll: false });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Listings</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our diverse portfolio of real estate and vehicles in Fort Portal and beyond.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-xl shadow-sm p-1 border border-gray-100 overflow-x-auto max-w-full no-scrollbar">
            <button
              onClick={() => handleCategoryChange('Real Estate')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeCategory === 'Real Estate'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <Home className="h-5 w-5" /> Real Estate
            </button>
            <button
              onClick={() => handleCategoryChange('Rentals')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeCategory === 'Rentals'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <Home className="h-5 w-5" /> Rentals
            </button>
            <button
              onClick={() => handleCategoryChange('Vehicles')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeCategory === 'Vehicles'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <Car className="h-5 w-5" /> Vehicles
            </button>
            <button
              onClick={() => handleCategoryChange('Motorcycles')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeCategory === 'Motorcycles'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <Car className="h-5 w-5" /> Motorcycles
            </button>
          </div>
        </div>

        {/* Favorites Filter */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => updateParam('fav', showFavoritesOnly ? '' : '1')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all border ${
              showFavoritesOnly
                ? 'bg-red-50 border-red-200 text-red-500 shadow-sm'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Heart className={`h-5 w-5 ${showFavoritesOnly ? 'fill-red-500' : ''}`} />
            {showFavoritesOnly ? 'Showing Favorites' : 'Show Favorites Only'}
          </button>
        </div>

        {/* Results */}
        {filteredAndSortedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
