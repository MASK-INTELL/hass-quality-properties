import { NextResponse } from 'next/server';
import { getFeaturedProperties } from '@/lib/repositories/properties';

export const dynamic = 'force-dynamic';

export async function GET() {
  const properties = await getFeaturedProperties(3);
  return NextResponse.json(properties, {
    headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' },
  });
}
