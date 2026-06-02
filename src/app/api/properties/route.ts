import { NextRequest, NextResponse } from 'next/server';
import { getAllProperties } from '@/lib/repositories/properties';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const properties = await getAllProperties();

  let filtered = properties;
  if (category) {
    filtered = properties.filter(p => p.category === category);
  }

  return NextResponse.json(filtered, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  });
}
