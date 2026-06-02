import { NextResponse } from 'next/server';
import { getPropertiesGallery } from '@/lib/repositories/properties';

export async function GET() {
  const properties = await getPropertiesGallery(10);
  return NextResponse.json(properties);
}
