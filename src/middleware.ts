import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/properties(.*)',
  '/about',
  '/contact',
  '/testimonials',
  '/admin/login(.*)',
  '/api/webhooks(.*)',
  '/api/properties(.*)',
  '/api/inquiries(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isAdminApiRoute = createRouteMatcher(['/api/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Redirect authenticated users away from login page
  if (userId && req.nextUrl.pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Protect admin page routes — redirect to login
  if (isAdminRoute(req) && !isPublicRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // Protect admin API routes — return 401
  if (isAdminApiRoute(req)) {
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Catch-all for any other non-public route
  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/__clerk/(.*)',
    '/(api|trpc)(.*)',
  ],
};
