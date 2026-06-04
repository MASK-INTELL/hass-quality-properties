import { NextResponse } from 'next/server';
import { getAllProperties } from '@/lib/repositories/properties';

export async function GET() {
  const properties = await getAllProperties();
  return NextResponse.json(properties);
}
