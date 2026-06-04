import { NextResponse } from 'next/server';
import { getFeaturedProperties } from '@/lib/repositories/properties';

export async function GET() {
  const properties = await getFeaturedProperties(3);
  return NextResponse.json(properties);
}
