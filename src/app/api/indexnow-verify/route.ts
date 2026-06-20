import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const requestedKey = searchParams.get('key');

  if (requestedKey !== key) {
    return new NextResponse('Not Found', { status: 404 });
  }

  return new NextResponse(key, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}
