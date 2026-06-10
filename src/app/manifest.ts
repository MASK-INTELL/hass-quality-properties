import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HASS',
    short_name: 'Hass Properties',
    description: 'We specialize in connecting buyers with their dream properties and helping sellers get the best value for their investments.',
    start_url: '/',
    display: 'standalone',
    background_color: '#059669',
    theme_color: '#059669',
    orientation: 'portrait-primary',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
