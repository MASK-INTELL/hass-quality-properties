import { NextResponse } from 'next/server';
import { getAllProperties } from '@/lib/repositories/properties';

export async function GET() {
  const properties = await getAllProperties();
  const stats = {
    totalProperties: properties.length,
    forSale: properties.filter(p => p.status === 'For Sale').length,
    forRent: properties.filter(p => p.status === 'For Rent').length,
    vehicles: properties.filter(p => p.category === 'Vehicles' || p.category === 'Motorcycles').length,
  };
  return NextResponse.json(stats);
}
