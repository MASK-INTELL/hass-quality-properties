import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const publicRoutes = [
  '/',
  '/favorites',
  '/properties',
  '/about',
  '/contact',
  '/testimonials',
  '/admin/login',
  '/api/webhooks',
  '/api/properties',
  '/api/inquiries',
  '/api/testimonials',
];

const adminRoutes = ['/admin', '/api/admin'];

const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    route => pathname === route || pathname.startsWith(route + '/')
  );
}

function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some(
    route => pathname === route || pathname.startsWith(route + '/')
  );
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Update session and get authenticated user
  const { response, user } = await updateSession(request);
  const hasAuth = !!user;

  // Set security headers
  response.headers.set('Content-Security-Policy', [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://www.googletagmanager.com`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https://*.r2.dev https://images.unsplash.com https://*.supabase.co`,
    `font-src 'self' data:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `frame-src 'self' https://vercel.live https://*.supabase.co https://*.r2.dev`,
    `media-src 'self' https://*.r2.dev`,
    `frame-ancestors 'none'`,
    `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.r2.cloudflarestorage.com https://www.google-analytics.com`,
    `manifest-src 'self'`,
    `worker-src 'self' blob:`,
  ].join('; '));
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // Redirect authenticated users away from login
  if (hasAuth && pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Protect admin routes - redirect to login if not authenticated
  if (isAdminRoute(pathname) && !isPublicRoute(pathname)) {
    if (!hasAuth) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect non-public routes
  if (!isPublicRoute(pathname) && !hasAuth) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt|xml)).*)',
    '/(api|trpc)(.*)',
  ],
};
