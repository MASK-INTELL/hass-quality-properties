const CACHE = 'hass-quality-v1';

const ASSET_EXTENSIONS = /\.(css|js|woff2?|ttf|ico|png|jpg|jpeg|webp|gif|svg|avif)$/;

const ADMIN_PATHS = ['/admin', '/api/admin'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  const pathname = url.pathname;

  const isAdmin = ADMIN_PATHS.some((p) => pathname.startsWith(p));
  const isApi = pathname.startsWith('/api');
  const isAsset = ASSET_EXTENSIONS.test(pathname) || pathname.startsWith('/_next/');
  const isPage = !isAdmin && !isApi;

  if (isAsset) {
    event.respondWith(cacheFirst(request));
  } else if (isPage) {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok && request.method === 'GET') {
      const clone = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, clone));
    }
    return response;
  } catch {
    return caches.match('/');
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok && request.method === 'GET') {
      const clone = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, clone));
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || caches.match('/');
  }
}
