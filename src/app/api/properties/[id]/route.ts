import { NextRequest, NextResponse } from 'next/server';
import { getPropertyById, getSimilarProperties } from '@/lib/repositories/properties';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const property = await getPropertyById(id);
  if (!property) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const similar = await getSimilarProperties(property.category, property.location, id);

  return NextResponse.json({ property, similar }, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  });
}
