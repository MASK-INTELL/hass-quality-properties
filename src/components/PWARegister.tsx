'use client';

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Silently ignore — PWA caching is optional.
        // This fails in environments that block service workers (e.g., Googlebot WRS, incognito mode).
      });
    }
  }, []);

  return null;
}
