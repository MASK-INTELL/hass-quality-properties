import { NextResponse } from 'next/server';

export function validateCsrf(request: Request): NextResponse | null {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || '';

  if (!appUrl) {
    console.warn('CSRF validation skipped — APP_URL not configured');
    return null;
  }

  const allowed = new URL(appUrl).origin;

  if (origin && !origin.startsWith(allowed)) {
    return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 });
  }

  if (!origin && referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.origin !== allowed) {
        return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 });
    }
  }

  return null;
}
