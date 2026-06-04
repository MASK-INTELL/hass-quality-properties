import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPropertiesPaginated, createProperty } from '@/lib/repositories/properties';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const search = searchParams.get('search') || undefined;
  const category = searchParams.get('category') || undefined;
  const status = searchParams.get('status') || undefined;

  const result = await getPropertiesPaginated(page, pageSize, {
    search,
    category,
    status,
  });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const property = await createProperty(body);
    revalidatePath('/api/properties');
    revalidatePath('/api/properties/featured');
    revalidatePath('/api/properties/gallery');
    revalidatePath('/about');
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
