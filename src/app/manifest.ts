import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hass Quality Properties - Homes, Lands, Plots, Cars & Rentals',
    short_name: 'Hass Properties',
    description: 'Find your perfect property, rental, or vehicle in Fort Portal, Uganda.',
    start_url: '/',
    display: 'standalone',
    background_color: '#059669',
    theme_color: '#059669',
    orientation: 'portrait-primary',
    icons: [
      { src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
