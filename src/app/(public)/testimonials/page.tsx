import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import sql from '@/lib/db';
import TestimonialForm from './_TestimonialForm';
import ShareButtons from './_ShareButtons';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export const metadata: Metadata = {
  title: 'Client Testimonials',
  description: 'Read real success stories from clients who bought and sold homes, land, plots, cars and motorcycles with Hass Properties. Over a decade of trusted service in Fort Portal, Uganda.',
  openGraph: {
    title: 'Client Success Stories | Hass Properties',
    description: 'Hear from our happy clients in Fort Portal. Genuine reviews from buyers and sellers who found their perfect property with Hass Properties.',
    url: '/testimonials',
  },
  twitter: {
    title: 'Client Success Stories | Hass Properties',
    description: 'Real testimonials from Fort Portal clients. See why Hass Properties is the trusted choice for homes, land, cars and more in Uganda.',
  },
  alternates: { canonical: '/testimonials' },
};

export default async function Testimonials() {
  const testimonials = await sql`SELECT * FROM testimonials WHERE approved = true ORDER BY created_at DESC` as unknown as Testimonial[];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Hass Properties',
            review: testimonials.slice(0, 10).map((t) => ({
              '@type': 'Review',
              author: { '@type': 'Person', name: t.name },
              reviewRating: { '@type': 'Rating', ratingValue: t.rating, bestRating: 5 },
              reviewBody: t.quote,
            })),
          }),
        }}
      />
      <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Client Success Stories</h1>
      </div>

      {/* Share Your Experience Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <TestimonialForm />
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Link
              key={testimonial.id}
              href={`/testimonials/${testimonial.id}`}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative mt-6 group block"
            >
              <div className="absolute -top-6 left-8">
                <Image
                  src="/logo.png"
                  alt="Hass Properties"
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
                <p className="text-gray-600 italic mb-6 leading-relaxed line-clamp-4">&quot;{testimonial.quote}&quot;</p>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">{testimonial.name}</h2>
                  <p className="text-emerald-600 text-sm font-medium">{testimonial.role}</p>
                </div>
                <ShareButtons quote={testimonial.quote} name={testimonial.name} role={testimonial.role} id={testimonial.id} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
