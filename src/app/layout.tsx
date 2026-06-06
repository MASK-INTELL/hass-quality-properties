import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/Toast';
import { FavoritesProvider } from '@/hooks/useFavorites';
import PWARegister from '@/components/PWARegister';

const siteName = 'Hass Quality Properties';
const siteDescription = 'Find your perfect property, rental, or vehicle in Fort Portal, Uganda. Browse houses, apartments, land, commercial properties, cars, and motorcycles.';

export const metadata: Metadata = {
  metadataBase: new URL('https://hass-quality-properties.vercel.app'),
  title: {
    default: `${siteName} - Homes, Lands, Plots, Cars & Rentals`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName,
    title: `${siteName} - Homes, Lands, Plots, Cars & Rentals`,
    description: siteDescription,
    url: '/',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: siteName }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - Homes, Lands, Plots, Cars & Rentals`,
    description: siteDescription,
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#059669" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={siteName} />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className="antialiased">
        <ToastProvider>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </ToastProvider>
        <PWARegister />
      </body>
    </html>
  );
}
