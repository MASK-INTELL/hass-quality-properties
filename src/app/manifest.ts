import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HASS - Homes, Lands, Plots, Cars & Rentals',
    short_name: 'Hass quality Properties',
    description: 'We specialize in connecting buyers with their dream properties and helping sellers get the best value for their investments.',
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
