'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Maximize, ArrowLeft, Phone, Building2, ChevronLeft, ChevronRight, X, Share2, Heart, Video } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import PropertyCard from '@/components/PropertyCard';
import InquiryCard from '@/components/InquiryCard';
import { useFavorites } from '@/hooks/useFavorites';
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
  beds?: string | number | null;
  baths?: string | number | null;
  area?: string | null;
  make?: string | null;
  model?: string | null;
  year?: string | number | null;
  mileage?: string | null;
  transmission?: string | null;
  fuel_type?: string | null;
  video_url?: string | null;
  images?: string[] | null;
  image_metadata?: ImageMeta[] | null;
}

export default function PropertyDetails({
  property,
  similarProperties,
}: {
  property: Property | null;
  similarProperties: Property[];
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [backHref, setBackHref] = useState('/properties');

  useEffect(() => {
    const saved = sessionStorage.getItem('propertiesSearchParams');
    if (saved) {
      setBackHref(`/properties${saved}`);
    }
  }, []);

  useEffect(() => {
    if (property) {
      gtagEvent('view_property', {
        property_id: property.id,
        property_title: property.title,
        property_category: property.category,
        property_price: property.price,
      });
    }
  }, [property]);

  const whatsappUrl = useMemo(() => {
    const msg = [
      'I would like to request an inspection for this property:',
      '',
      `Title: ${property?.title || ''}`,
      `Location: ${property?.location || ''}`,
      `Price: ${property?.price || ''}`,
      `Type: ${property?.type || ''}`,
      `Category: ${property?.category || ''}`,
      '',
      'Please contact me to schedule. Thank you.',
    ].join('\n');
    return `https://wa.me/256791715573?text=${encodeURIComponent(msg)}`;
  }, [property]);

  const { isFavorite, toggleFavorite } = useFavorites();

  const images = property?.images?.length ? property.images : (property?.image_url ? [property.image_url] : []);

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = property?.title || '';
    const shareText = [
      `🏠 ${property?.title} — ${property?.price}`,
      `📍 ${property?.location}`,
      `Type: ${property?.type} · ${property?.category}`,
      property?.status ? `Status: ${property?.status}` : '',
    ].filter(Boolean).join('\n');

    const shareData: Record<string, any> = {
      title: shareTitle,
      text: shareText,
      url: shareUrl,
    };

    // Try to attach the first property image for native share
    try {
      if (images.length > 0) {
        const res = await fetch(images[0]);
        const blob = await res.blob();
        const file = new File([blob], `${property?.title || 'property'}.jpg`, { type: blob.type });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          shareData.files = [file];
        }
      }
    } catch { /* proceed without image */ }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as DOMException)?.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      const clipboardText = `${shareText}\n\n🔗 ${shareUrl}`;
      try {
        await navigator.clipboard.writeText(clipboardText);
      } catch {
        console.error('Clipboard write failed');
      }
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <Link href={backHref} className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center justify-center gap-2">
            <ArrowLeft className="h-5 w-5" /> Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <Link href={backHref} className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center justify-center gap-2">
            <ArrowLeft className="h-5 w-5" /> Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href={backHref} className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors mb-6">
            <ArrowLeft className="h-5 w-5" /> Back to Properties
          </Link>
          {/* Mobile layout (< lg) — unchanged */}
          <div className="lg:hidden">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <span className="inline-block px-3 py-1 bg-emerald-600 text-white rounded-full text-sm font-semibold mb-3 uppercase tracking-wide">
                  {property.status}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-gray-600 text-lg">
                  <MapPin className="h-5 w-5" />
                  {property.location}
                </div>
              </div>
              <div className="flex flex-col items-end gap-4">
                <div className="text-emerald-600">
                  <p className="text-3xl font-bold">{property.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors relative"
                  >
                    <Share2 className="h-5 w-5" /> Share
                    {showShareToast && (
                      <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-3 rounded shadow-lg whitespace-nowrap">
                        Property info copied!
                      </span>
                    )}
                  </button>
                  <button
                    onClick={(e) => toggleFavorite(property.id, e)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border ${
                      isFavorite(property.id)
                        ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite(property.id) ? 'fill-red-500' : ''}`} />
                    {isFavorite(property.id) ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[60vh]">
              <div
                className={`relative rounded-xl overflow-hidden cursor-pointer group ${images.length > 1 ? 'md:col-span-3' : 'md:col-span-4'}`}
                onClick={() => setIsLightboxOpen(true)}
              >
                <Image
                  fill
                  src={images[0]}
                  alt={property.image_metadata?.find(m => m.url === images[0])?.alt || property.title}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 75vw"
                  priority
                />
              </div>

              {images.length > 1 && (
                <div className="hidden md:grid grid-rows-3 gap-4 h-full">
                  {images.slice(1, 4).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden cursor-pointer group"
                      onClick={() => {
                        setCurrentImageIndex(idx + 1);
                        setIsLightboxOpen(true);
                      }}
                    >
                      <Image
                        fill
                        src={img}
                        alt={property.image_metadata?.find(m => m.url === img)?.alt || `${property.title} - Image ${idx + 2}`}
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="25vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop layout (lg+) — image left, details right */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <div>
                <div
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <Image
                    fill
                    src={images[0]}
                    alt={property.image_metadata?.find(m => m.url === images[0])?.alt || property.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>

                {images.length > 1 && (
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {images.slice(1, 4).map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => {
                          setCurrentImageIndex(idx + 1);
                          setIsLightboxOpen(true);
                        }}
                      >
                        <Image
                          fill
                          src={img}
                          alt={property.image_metadata?.find(m => m.url === img)?.alt || `${property.title} - Image ${idx + 2}`}
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="25vw"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <span className="inline-block px-3 py-1 bg-emerald-600 text-white rounded-full text-sm font-semibold uppercase tracking-wide">
                  {property.status}
                </span>
                <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                <p className="text-gray-600 leading-relaxed text-base">
                  {property.description}
                </p>
                <p className="text-3xl font-bold text-emerald-600">{property.price}</p>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  {property.location}
                </div>

                <div className="flex flex-wrap gap-6 pt-2">
                  {property.area && (
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-50 rounded-full text-emerald-600">
                        <Maximize className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Area</p>
                        <p className="font-bold text-gray-900 text-sm">{property.area}</p>
                      </div>
                    </div>
                  )}
                  {property.beds && (
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-50 rounded-full text-emerald-600">
                        <Bed className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bedrooms</p>
                        <p className="font-bold text-gray-900 text-sm">{property.beds}</p>
                      </div>
                    </div>
                  )}
                  {property.baths && (
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-50 rounded-full text-emerald-600">
                        <Bath className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bathrooms</p>
                        <p className="font-bold text-gray-900 text-sm">{property.baths}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 rounded-full text-emerald-600">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="font-bold text-gray-900 text-sm">{property.type}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors relative"
                  >
                    <Share2 className="h-5 w-5" /> Share
                    {showShareToast && (
                      <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-3 rounded shadow-lg whitespace-nowrap">
                        Property info copied!
                      </span>
                    )}
                  </button>
                  <button
                    onClick={(e) => toggleFavorite(property.id, e)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors border ${
                      isFavorite(property.id)
                        ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite(property.id) ? 'fill-red-500' : ''}`} />
                    {isFavorite(property.id) ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLightboxOpen && images.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
          >
            <X className="h-8 w-8" />
          </button>

          <div className="absolute top-6 left-6 text-white/70 font-medium z-50">
            {currentImageIndex + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-6 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
              >
                <ChevronLeft className="h-10 w-10" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-6 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50"
              >
                <ChevronRight className="h-10 w-10" />
              </button>
            </>
          )}

          <div className="w-full h-full flex items-center justify-center p-4 md:p-12" onClick={() => setIsLightboxOpen(false)}>
            <div className="relative w-full h-full max-w-7xl max-h-full">
              <Image
                      fill
                      src={images[currentImageIndex]}
                      alt={property.image_metadata?.find(m => m.url === images[currentImageIndex])?.alt || `${property.title} - Fullscreen`}
                      className="object-contain"
                      sizes="100vw"
                    />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="lg:hidden bg-white rounded-xl shadow-sm p-8 flex flex-wrap gap-8 justify-between border border-gray-100">
              {property.area && (
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                    <Maximize className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="font-bold text-gray-900">{property.area}</p>
                  </div>
                </div>
              )}

              {property.beds && (
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                    <Bed className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="font-bold text-gray-900">{property.beds}</p>
                  </div>
                </div>
              )}

              {property.baths && (
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                    <Bath className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="font-bold text-gray-900">{property.baths}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-bold text-gray-900">{property.type}</p>
                </div>
              </div>
            </div>

            <div className="lg:hidden bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {property.description}
              </p>
            </div>

            {property.video_url ? (
              <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Video className="h-6 w-6 text-emerald-600" /> Video Tour
                </h2>
                <div className="relative w-full overflow-hidden pt-[56.25%] rounded-lg bg-gray-100">
                  {/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//.test(property.video_url) ? (
                    <iframe
                      src={property.video_url}
                      title="Property Video Tour"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full border-0"
                    ></iframe>
                  ) : (
                    <video
                      controls
                      className="absolute top-0 left-0 w-full h-full border-0"
                    >
                      <source src={property.video_url} />
                    </video>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden lg:block">
<InquiryCard property={property} defaultExpanded />
            </div>
            )}
          </div>

          <div className="space-y-8 lg:sticky lg:top-24">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Interested in this property?</h3>

              <div className="space-y-3">
                <a
                  href="tel:+256791715573"
                  className="flex items-center justify-center gap-3 w-full py-3 bg-gray-50 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <Phone className="h-5 w-5" /> Call Agent
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-3 bg-green-50 text-green-700 rounded-lg font-semibold hover:bg-green-100 transition-colors border border-green-200"
                >
                  <WhatsAppIcon className="h-5 w-5" /> WhatsApp
                </a>
              </div>
            </div>

            <div className={property.video_url ? '' : 'lg:hidden'}>
              <InquiryCard property={property} />
            </div>
          </div>
        </div>
      </div>

      {similarProperties.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Similar Properties
              </h2>
              <p className="text-gray-600">You might also be interested in these listings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {similarProperties.map((similarProperty) => (
              <PropertyCard key={similarProperty.id} property={similarProperty} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
