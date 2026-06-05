import type { Metadata } from 'next';
import Image from 'next/image';
import { Star, Mail } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import sql from '@/lib/db';

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
  description: 'Read what our clients say about Hass Quality Properties. Over 11 years of trusted real estate service in Fort Portal, Uganda.',
  openGraph: {
    title: 'Client Success Stories | Hass Quality Properties',
    description: 'Read what our clients say about their experience with Hass Quality Properties in Fort Portal, Uganda.',
    url: '/testimonials',
  },
  twitter: {
    title: 'Client Success Stories | Hass Quality Properties',
    description: 'Read what our clients say about their experience with us.',
  },
  alternates: { canonical: '/testimonials' },
};

export default async function Testimonials() {
  const testimonials = await sql`SELECT * FROM testimonials ORDER BY created_at DESC` as unknown as Testimonial[];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Hass Quality Properties',
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
      <div className="bg-emerald-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Client Success Stories</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Read what our clients have to say about their experience working with Hass Quality Properties.
            With over 11 years of experience, we&apos;ve built a legacy of trust.
          </p>
        </div>
      </div>

      {/* Share Your Story CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Have you worked with us?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We value your feedback! Share your experience with Hass Quality Properties and let others know how we helped you find your perfect property or vehicle.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://wa.me/256791715573?text=Hello!%20I%20would%20like%20to%20share%20my%20testimonial%20about%20my%20experience%20with%20Hass%20Quality%20Properties."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-colors shadow-sm"
            >
              <WhatsAppIcon className="h-5 w-5" /> Send via WhatsApp
            </a>
            <a
              href="mailto:hassqualityproperties@gmail.com?subject=My%20Testimonial&body=Hello%20Hass%20Quality%20Properties%20team,%0A%0AHere%20is%20my%20testimonial:%0A%0A[Write your testimony here]%0A%0A[Your Name]%0A[Your Role/Property Type]"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Mail className="h-5 w-5" /> Send via Email
            </a>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative mt-6"
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
                <p className="text-gray-600 italic mb-6 leading-relaxed">&quot;{testimonial.quote}&quot;</p>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-emerald-600 text-sm font-medium">{testimonial.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
