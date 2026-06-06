import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/properties(.*)',
  '/about',
  '/contact',
  '/testimonials(.*)',
  '/admin/login(.*)',
  '/api/webhooks(.*)',
  '/api/properties(.*)',
  '/api/inquiries(.*)',
  '/api/testimonials(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isAdminApiRoute = createRouteMatcher(['/api/admin(.*)']);

const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

async function isAdminUser(userId: string): Promise<boolean> {
  if (adminEmails.length === 0) return true;
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase();
    return !!email && adminEmails.includes(email);
  } catch {
    console.error('Clerk API error in isAdminUser — allowing access (fail-open)');
    return true;
  }
}

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  const response = NextResponse.next();

  response.headers.set('Content-Security-Policy', [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.com`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https://*.r2.dev https://images.unsplash.com https://img.clerk.com https://*.clerk.accounts.dev`,
    `font-src 'self' data:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `frame-src 'self' https://vercel.live https://*.clerk.accounts.dev https://*.clerk.com`,
    `frame-ancestors 'none'`,
    `connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com wss://*.clerk.com`,
    `manifest-src 'self'`,
    `worker-src 'self' blob:`,
  ].join('; '));
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // Redirect authenticated users away from login page
  if (userId && req.nextUrl.pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Protect admin page routes — redirect to login
  if (isAdminRoute(req) && !isPublicRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    if (adminEmails.length > 0 && !(await isAdminUser(userId))) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // Protect admin API routes — return 401/403
  if (isAdminApiRoute(req)) {
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (adminEmails.length > 0 && !(await isAdminUser(userId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // Catch-all for any other non-public route
  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return response;
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/__clerk/(.*)',
    '/(api|trpc)(.*)',
  ],
};
