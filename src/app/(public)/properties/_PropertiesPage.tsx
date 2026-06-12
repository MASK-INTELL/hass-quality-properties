'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import { Heart, Home, Car, Bike, Building2, MapPin, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { gtagEvent } from '@/lib/analytics';

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

const PAGE_SIZE = 12;

export default function Properties({ initialProperties }: { initialProperties: Property[] }) {
  const searchParams = useSearchParams();
  const initialRender = useRef(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [activeCategory, setActiveCategory] = useState(
    (searchParams.get('category') as string) || 'All'
  );
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const filterType = searchParams.get('type') || 'All';
  const sortBy = searchParams.get('sort') || 'newest';
  const [allProperties] = useState<Property[]>(initialProperties);

  const pageInitialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    setCurrentPage(1);
    const params = new URLSearchParams(window.location.search);
    if (activeCategory !== 'All') params.set('category', activeCategory);
    else params.delete('category');
    params.delete('type');
    params.delete('search');
    params.delete('page');
    const qs = params.toString();
    const newUrl = `${window.location.pathname}${qs ? '?' + qs : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, [activeCategory]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setCurrentPage(1);
      const params = new URLSearchParams(window.location.search);
      if (searchInput) params.set('search', searchInput);
      else params.delete('search');
      params.delete('page');
      const qs = params.toString();
      const newUrl = `${window.location.pathname}${qs ? '?' + qs : ''}`;
      window.history.replaceState(null, '', newUrl);
      if (searchInput.trim()) {
        gtagEvent('search', { search_term: searchInput.trim() });
      }
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchInput]);

  useEffect(() => {
    if (pageInitialRender.current) {
      pageInitialRender.current = false;
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (currentPage > 1) params.set('page', String(currentPage));
    else params.delete('page');
    const qs = params.toString();
    const newUrl = `${window.location.pathname}${qs ? '?' + qs : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, [currentPage]);

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

      const query = searchInput.toLowerCase();
      const matchesSearch = !query ||
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query);
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
  }, [allProperties, activeCategory, searchInput, filterType, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProperties.length / PAGE_SIZE);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedProperties.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedProperties, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Browse Properties</h1>
          <p className="text-gray-500 mt-1">Explore our portfolio of homes, lands, plots, vehicles and rentals in Fort Portal, Uganda.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center mb-10">
          {/* Search + My Favorites */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title, location, or description..."
                className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 bg-white shadow-sm max-sm:text-base sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <Link
              href="/favorites"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border bg-white border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200 shrink-0"
            >
              <Heart className="h-5 w-5" />
              <span>My Favorites</span>
            </Link>
          </div>

          {/* Category Tabs — Mobile */}
          <div className="md:hidden w-full max-w-2xl">
            <select
              value={activeCategory}
              onChange={(e) => {
                setActiveCategory(e.target.value);
                if (e.target.value !== 'All') {
                  gtagEvent('filter_category', { category: e.target.value });
                }
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm max-sm:text-base sm:text-sm font-semibold text-gray-900"
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Category Tabs — Desktop */}
          <div className="hidden md:flex justify-center">
            <div className="inline-flex bg-white rounded-xl shadow-sm p-1 border border-gray-100 overflow-x-auto max-w-full no-scrollbar">
              {CATEGORIES.map(c => {
                const Icon = c.icon;
                const isActive = activeCategory === c.id;
                const isAll = c.id === 'All';
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCategory(c.id);
                      if (c.id !== 'All') {
                        gtagEvent('filter_category', { category: c.id });
                      }
                    }}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-md'
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

          {/* Results count */}
          <p className="text-sm text-gray-500 mt-4">
            {filteredAndSortedProperties.length} {filteredAndSortedProperties.length === 1 ? 'property' : 'properties'} found
            {totalPages > 1 && ` — Page ${currentPage} of ${totalPages}`}
          </p>
        </div>

        {/* Results */}
        {paginatedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => {
                if (totalPages <= 7) return true;
                if (p === 1 || p === totalPages) return true;
                if (Math.abs(p - currentPage) <= 1) return true;
                return false;
              })
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-2 text-gray-400">...</span>
                  )}
                  <button
                    onClick={() => goToPage(p)}
                    className={`min-w-[40px] h-10 rounded-lg text-sm font-semibold transition-all ${
                      p === currentPage
                        ? 'bg-emerald-700 text-white shadow-md'
                        : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
