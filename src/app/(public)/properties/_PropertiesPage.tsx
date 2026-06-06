'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import { Heart, Home, Car, Bike, Building2, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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

const CATEGORIES = [
  { id: 'All', label: 'All Listings', icon: null },
  { id: 'Homes', label: 'Homes', icon: Home },
  { id: 'Lands', label: 'Lands', icon: MapPin },
  { id: 'Plots', label: 'Plots', icon: Building2 },
  { id: 'Rentals', label: 'Rentals', icon: Home },
  { id: 'Cars', label: 'Cars', icon: Car },
  { id: 'Motorcycles', label: 'Motorcycles', icon: Bike },
];

const CATEGORY_TYPES: Record<string, string[]> = {
  Homes: ['All', 'House', 'Apartment', 'Commercial'],
  Lands: ['All', 'Land'],
  Plots: ['All', 'Plot'],
  Rentals: ['All', 'House', 'Apartment', 'Land', 'Commercial', 'Plot'],
  Cars: ['All', 'Car', 'Truck', 'Bus', 'Van', 'Mini-bus', 'Pickup', 'Lorry'],
  Motorcycles: ['All', 'Motorcycle'],
};

export default function Properties({ initialProperties }: { initialProperties: Property[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeCategory = (searchParams.get('category') as string) || 'All';
  const searchTerm = searchParams.get('search') || '';
  const filterType = searchParams.get('type') || 'All';
  const sortBy = searchParams.get('sort') || 'newest';
  const [allProperties] = useState<Property[]>(initialProperties);

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
      let matchesCategory = true;

      if (activeCategory === 'All') {
        matchesCategory = true;
      } else if (activeCategory === 'Rentals') {
        matchesCategory = property.status === 'For Rent';
      } else {
        matchesCategory = property.category === activeCategory;
      }

      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || property.type === filterType;

      return matchesCategory && matchesSearch && matchesType;
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
  }, [allProperties, activeCategory, searchTerm, filterType, sortBy]);

  const getPropertyTypes = () => {
    if (activeCategory === 'All') return ['All'];
    return CATEGORY_TYPES[activeCategory] || ['All'];
  };

  const handleCategoryChange = (category: string) => {
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
            Explore our diverse portfolio of homes, lands, plots, and vehicles in Fort Portal and beyond.
          </p>
        </div>

        {/* Category Tabs */}
        {/* Mobile: select dropdown */}
        <div className="md:hidden mb-8">
          <select
            value={activeCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm text-sm font-semibold"
          >
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Desktop: category tabs — hidden on mobile */}
        <div className="hidden md:flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-xl shadow-sm p-1 border border-gray-100 overflow-x-auto max-w-full no-scrollbar">
            {CATEGORIES.map(c => {
              const Icon = c.icon;
              const isActive = activeCategory === c.id;
              const isAll = c.id === 'All';
              return (
                <button
                  key={c.id}
                  onClick={() => handleCategoryChange(c.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  } ${isAll ? 'hidden lg:flex' : ''}`}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  {isAll ? '' : c.label}
                  {isAll && 'All Listings'}
                </button>
              );
            })}
          </div>
        </div>

        {/* My Favorites Link */}
        <div className="flex justify-end mb-8">
          <Link
            href="/favorites"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all border bg-white border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
          >
            <Heart className="h-5 w-5" />
            My Favorites
            <ArrowRight className="h-4 w-4" />
          </Link>
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
