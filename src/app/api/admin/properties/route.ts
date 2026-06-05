import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/lib/require-admin';
import { validateCsrf } from '@/lib/csrf';
import { getPropertiesPaginated, createProperty } from '@/lib/repositories/properties';
import { propertySchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

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
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  try {
    const body = await request.json();
    const parsed = propertySchema.parse(body);
    const property = await createProperty(parsed);
    revalidatePath('/api/properties');
    revalidatePath('/api/properties/featured');
    revalidatePath('/api/properties/gallery');
    revalidatePath('/about');
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
