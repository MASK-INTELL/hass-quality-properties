import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/Toast';

const siteName = 'Hass Quality Properties';
const siteDescription = 'Find your perfect property, rental, or vehicle in Fort Portal, Uganda. Browse houses, apartments, land, commercial properties, cars, and motorcycles.';

export const metadata: Metadata = {
  metadataBase: new URL('https://hass-quality-properties.vercel.app'),
  title: {
    default: `${siteName} - Real Estate, Rentals & Vehicles`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName,
    title: `${siteName} - Real Estate, Rentals & Vehicles`,
    description: siteDescription,
    url: '/',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: siteName }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - Real Estate, Rentals & Vehicles`,
    description: siteDescription,
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
