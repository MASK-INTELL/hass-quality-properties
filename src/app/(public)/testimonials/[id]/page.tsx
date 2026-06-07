import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ArrowLeft } from 'lucide-react';
import sql from '@/lib/db';
import { getTestimonialById } from '@/lib/repositories/testimonials';
import ShareButtons from '../_ShareButtons';
import Breadcrumbs from '@/components/Breadcrumbs';
import { notFound } from 'next/navigation';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

export async function generateStaticParams() {
  const rows = await sql`SELECT id FROM testimonials WHERE approved = true` as unknown as { id: string }[];
  return rows.map((row) => ({ id: row.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const testimonial = await getTestimonialById(id);
  if (!testimonial) return { title: 'Not Found' };

  const stars = '⭐'.repeat(testimonial.rating);
  return {
    title: `${testimonial.name} — ${stars} | Client Testimonial`,
    description: `"${testimonial.quote}" — ${testimonial.name}, ${testimonial.role}. Read more client success stories at Hass Quality Properties.`,
    openGraph: {
      title: `${testimonial.name} — ${stars} | Hass Quality Properties`,
      description: `"${testimonial.quote}" — ${testimonial.name}, ${testimonial.role}`,
      url: `/testimonials/${id}`,
    },
    twitter: {
      title: `${testimonial.name} — ${stars} | Hass Quality Properties`,
      description: `"${testimonial.quote}" — ${testimonial.name}, ${testimonial.role}`,
    },
    alternates: { canonical: `/testimonials/${id}` },
  };
}

export default async function TestimonialDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonial = await getTestimonialById(id);
  if (!testimonial || !testimonial.approved) notFound();

  const more = await sql`
    SELECT * FROM testimonials WHERE id != ${id} AND approved = true ORDER BY RANDOM() LIMIT 3
  ` as unknown as Testimonial[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Review',
            author: { '@type': 'Person', name: testimonial.name },
            itemReviewed: {
              '@type': 'Organization',
              name: 'Hass Quality Properties',
              image: '/logo.png',
            },
            reviewRating: {
              '@type': 'Rating',
              ratingValue: testimonial.rating,
              bestRating: 5,
            },
            reviewBody: testimonial.quote,
          }),
        }}
      />
      <div className="bg-gray-50 min-h-screen pb-20">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Testimonials', href: '/testimonials' },
          { label: testimonial.name },
        ]} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

          <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <Image
                src="/logo.png"
                alt={testimonial.name}
                width={64}
                height={64}
                className="rounded-full border-4 border-white shadow-md object-cover bg-gray-100"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{testimonial.name}</h1>
                <p className="text-emerald-600 font-medium">{testimonial.role}</p>
              </div>
            </div>
            <div className="flex gap-1 mb-6">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <blockquote className="text-gray-600 text-lg leading-relaxed italic mb-8">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
             <ShareButtons quote={testimonial.quote} name={testimonial.name} role={testimonial.role} id={testimonial.id} showCopy />
          </article>

          {more.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">More Success Stories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {more.map((t) => (
                  <Link key={t.id} href={`/testimonials/${t.id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group">
                    <div className="flex gap-1 mb-3">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm italic line-clamp-3 mb-4">&ldquo;{t.quote}&rdquo;</p>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-emerald-600 text-xs font-medium">{t.role}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
