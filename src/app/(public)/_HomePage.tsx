'use client';

import Image from 'next/image';
import { ArrowRight, Search, Star } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import PropertyCard from '@/components/PropertyCard';
import PropertyGallery from '@/components/PropertyGallery';
import type { Property } from '@/lib/repositories/properties';

interface HomePageProps {
  featuredProperties: Property[];
  galleryProperties: { id: string; title: string; price: string; status: string; image_url: string }[];
}

export default function Home({ featuredProperties, galleryProperties }: HomePageProps) {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    try {
      const res = await fetch('/api/testimonials');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollAmount = container.clientWidth;

        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Home in Uganda"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Find Your Dream Property in <br />
            <span className="text-emerald-400">Fort Portal Tourism City</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto font-light">
            We help you find the perfect home, land, car or commercial space in the Pearl of Africa.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties"
              className="px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Browse Properties <Search className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-white hover:bg-gray-100 text-emerald-900 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Contact Us
            </Link>
            <a
              href="https://wa.me/256791715573"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <WhatsAppIcon className="h-5 w-5" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-gray-600 text-lg">Handpicked selection of our best properties</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-700 text-white rounded-full font-bold text-lg hover:bg-emerald-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              View All Properties <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Property Gallery */}
      <PropertyGallery items={galleryProperties} />



      {/* Client Testimonials */}
      <section className="py-20 bg-emerald-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 text-lg">Don&apos;t just take our word for it</p>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {(testimonials.length > 0 ? testimonials : []).slice(0, 10).map((testimonial) => (
              <article
                key={testimonial.id}
                className="min-w-[100%] md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] snap-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative mt-6"
              >
                <div className="absolute -top-6 left-8">
                  <Image
                    src="/logo.png"
                    alt={testimonial.name}
                    width={56}
                    height={56}
                    className="rounded-full border-4 border-white shadow-md object-cover bg-gray-100"
                  />
                </div>
                <div className="mt-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-6 line-clamp-4">&quot;{testimonial.quote}&quot;</p>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-emerald-600 text-sm font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/testimonials"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-700 border-2 border-emerald-600 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all shadow-sm hover:shadow-md w-full sm:w-auto"
            >
              Read More Success Stories <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/testimonials"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-700 text-white rounded-full font-bold text-lg hover:bg-emerald-800 transition-all shadow-sm hover:shadow-md w-full sm:w-auto"
            >
              Share Your Story
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Perfect Property?</h2>
          <p className="text-emerald-100 text-xl mb-10 max-w-2xl mx-auto">
            Contact us today to schedule a viewing or discuss your real estate needs with our expert team.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-emerald-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
