import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/lib/require-admin';
import { validateCsrf } from '@/lib/csrf';
import { getPropertyById, updateProperty, deleteProperty } from '@/lib/repositories/properties';
import { propertySchema } from '@/lib/validation';
import { pingIndexNow } from '@/lib/indexnow';
import { getBaseUrl } from '@/lib/config';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(property);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = propertySchema.parse(body);
    const property = await updateProperty(id, parsed);
    if (!property) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    revalidatePath('/properties');
    revalidatePath(`/properties/${id}`);
    revalidatePath('/about');
    revalidatePath('/');
    pingIndexNow([`${getBaseUrl()}/properties`]);
    return NextResponse.json(property);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Error updating property:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    await deleteProperty(id);
    revalidatePath('/properties');
    revalidatePath(`/properties/${id}`);
    revalidatePath('/about');
    revalidatePath('/');
    pingIndexNow([`${getBaseUrl()}/properties`]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
