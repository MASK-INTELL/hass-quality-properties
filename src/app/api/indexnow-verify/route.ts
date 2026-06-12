import { NextRequest, NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/config';

export async function GET(request: NextRequest) {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const url = new URL(request.url);
  const requestedKey = url.pathname.replace('.txt', '').replace('/', '');

  // The vercel.json rewrite /:key.txt catches robots.txt — serve it here
  if (requestedKey === 'robots') {
    const baseUrl = getBaseUrl();
    return new NextResponse(
      `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/admin/\n\nSitemap: ${baseUrl}/sitemap.xml`,
      { headers: { 'Content-Type': 'text/plain' } }
    );
  }

  if (requestedKey !== key) {
    return new NextResponse('Not Found', { status: 404 });
  }

  return new NextResponse(key, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}
