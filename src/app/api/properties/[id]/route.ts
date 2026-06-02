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

  const similar = await getSimilarProperties(property.category, id, 3);

  return NextResponse.json({ property, similar });
}
