import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllStats } from '@/lib/repositories/stats';
import { getAllAgents } from '@/lib/repositories/agents';
import { Building2, Users, Target, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import CompanyLogo from '@/components/CompanyLogo';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Hass Quality Properties — your trusted real estate partner in Fort Portal Tourism City, Uganda with over 11 years of experience.',
  openGraph: {
    title: 'About Hass Quality Properties',
    description: 'Your trusted real estate partner in Fort Portal Tourism City, Uganda.',
    url: '/about',
  },
  twitter: {
    title: 'About Hass Quality Properties',
    description: 'Your trusted real estate partner in Fort Portal Tourism City, Uganda.',
  },
  alternates: { canonical: '/about' },
};

export default async function About() {
  const stats = await getAllStats();
  const agents = await getAllAgents();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Hass Quality Properties',
            url: 'https://hass-quality-properties.vercel.app',
            logo: 'https://hass-quality-properties.vercel.app/logo.png',
            description: 'Premier real estate company in Fort Portal Tourism City, Uganda specializing in homes, lands, plots, cars, and motorcycles.',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Fort Portal Tourism City',
              addressCountry: 'UG',
            },
            telephone: '+256791715573',
            email: 'hassqualityproperties@gmail.com',
            sameAs: [
              'https://wa.me/256791715573',
            ],
            knowsAbout: [
              'Real estate in Fort Portal Uganda',
              'Houses for sale and rent',
              'Land and plots for sale',
              'Cars and motorcycles for sale',
              'Commercial properties',
            ],
          }),
        }}
      />
      <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4 flex justify-center">
        <CompanyLogo className="h-32 w-auto object-contain cursor-pointer" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />

        <div className="mb-20 max-w-3xl mt-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Hass Quality Properties is a premier real estate company based in Fort Portal Tourism City, Uganda. We specialize in connecting buyers with their dream properties and helping sellers get the best value for their investments.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              With years of experience in the local market, our team understands the unique landscape of Fort Portal and the surrounding regions. Whether you are looking for a residential home, commercial land, or an agricultural investment, we have the expertise to guide you every step of the way.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-emerald-100 rounded-full -z-10" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-emerald-50 rounded-full -z-10" />
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Real Estate Agent"
              width={800}
              height={500}
              className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Hass Quality Properties?</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              We are more than just a real estate agency. We are your partners in finding the perfect place to call home or the ideal investment opportunity in Fort Portal.
            </p>
            <div className="space-y-6">
              {[
                { title: 'Local Expertise', desc: 'Deep knowledge of Fort Portal and surrounding areas.' },
                { title: 'Trusted Service', desc: 'Transparent dealings and verified property titles.' },
                { title: 'Wide Selection', desc: 'From budget plots to luxury homes and commercial estates.' },
                { title: 'Client Focused', desc: 'We prioritize your needs and budget above all else.' }
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                    <p className="text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-6">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600">
              To provide professional, transparent, and efficient real estate services that exceed our clients&apos; expectations and contribute to the development of Fort Portal.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-6">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Professionals</h3>
            <p className="text-gray-600">
              A dedicated team of real estate professionals with deep local knowledge and a passion for helping people find their perfect property match.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-6">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Promise</h3>
            <p className="text-gray-600">
              We promise integrity in all our dealings, verified property titles, and a hassle-free process from viewing to ownership transfer.
            </p>
          </div>
        </div>

        {/* Team Gallery */}
        {agents.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                Get to know the dedicated professionals behind Hass Quality Properties.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {agents.map((agent) => (
                <div key={agent.id} className="group text-center">
                  <div className="relative w-48 h-48 mx-auto mb-5 rounded-full overflow-hidden bg-gray-100 ring-4 ring-gray-50 shadow-lg">
                    <Image
                      src={agent.photo_url}
                      alt={agent.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="192px"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{agent.name}</h3>
                  <p className="text-emerald-600 font-medium text-sm mt-1">{agent.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mb-20 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto text-lg">
            Whether you&apos;re buying, selling, or renting, we&apos;re here to help you every step of the way.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
            >
              Browse Properties <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="bg-emerald-900 rounded-3xl p-12 text-white text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-emerald-200 text-sm uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
